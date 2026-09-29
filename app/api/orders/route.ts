import { NextRequest, NextResponse, after } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import ProductModel from "@/models/Product";
import GiftCardModel from "@/models/GiftCard";
import GiftCardInstanceModel from "@/models/GiftCardInstance";
import { linkGuestOrders } from "@/lib/auth/linking";
import Stripe from "stripe";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "your-fallback-jwt-secret";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.LIVE_SECRET_KEY || "", {
  apiVersion: "2026-06-24.dahlia" as any,
  typescript: true,
});


// GET: Retrieve all orders for the authenticated user or a specific order by ID
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const sessionId = searchParams.get("session_id");

    if (id) {
      let order: any = await OrderModel.findById(id);
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found." },
          { status: 404 }
        );
      }

      // If order payment is pending on Stripe, verify with Stripe and fulfill if paid
      if (order.paymentStatus === "pending" && order.paymentMethod !== "cash_on_delivery") {
        try {
          const targetSessionId = sessionId || order.stripeSessionId;
          let isPaid = false;
          if (targetSessionId) {
            const session = await stripe.checkout.sessions.retrieve(targetSessionId);
            if (session.payment_status === "paid" || session.status === "complete") {
              isPaid = true;
            }
          }

          if (isPaid) {
            const { fulfillOrder } = await import("@/lib/services/orderFulfillmentService");
            const fulfilled: any = await fulfillOrder(order);
            if (fulfilled) {
              order = fulfilled;
            }
          }
        } catch (verifyErr) {
          console.error("Error auto-verifying Stripe payment on GET /api/orders:", verifyErr);
        }
      }

      return NextResponse.json({
        success: true,
        order,
      });
    }

    // Get all orders for the user
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required to fetch order history." },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Session expired, please log in again." },
        { status: 401 }
      );
    }

    // Auto-link guest orders for user's email if any exist
    const userObj = await UserModel.findById(decoded.id).select("email").lean();
    if (userObj && userObj.email) {
      try {
        await linkGuestOrders(userObj.email, decoded.id);
      } catch (linkErr) {
        console.error("Auto-linking guest orders error on GET /api/orders:", linkErr);
      }
    }

    const cleanEmail = userObj?.email ? userObj.email.toLowerCase().trim() : "";
    const filter = cleanEmail
      ? { $or: [{ userId: decoded.id }, { guestEmail: cleanEmail }] }
      : { userId: decoded.id };

    const orders = await OrderModel.find(filter)
      .sort({ placedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order history." },
      { status: 500 }
    );
  }
}

// POST: Create a new order
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      shippingCost,
      tax,
      fulfillmentMethod,
      total,
      couponCode,
      giftCardCode,
      notes,
      guestEmail,
      guestPhone,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Shipping address is required." },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method is required." },
        { status: 400 }
      );
    }

    let finalGuestEmail = guestEmail;
    let finalGuestPhone = guestPhone;

    // Determine authenticated user (allow guest checkout if no token exists)
    let userId: string | null = null;
    let userObj: any = null;
    const token = req.cookies.get("token")?.value;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
        userObj = await UserModel.findById(userId);
      } catch (err) {
        console.warn("Invalid JWT on order placement - falling back to email search.", err);
      }
    }

    // Fallback: lookup by email if not logged in or token failed
    if (!userObj && finalGuestEmail) {
      try {
        userObj = await UserModel.findOne({ email: finalGuestEmail.toLowerCase().trim(), deletedAt: null });
        if (userObj) {
          userId = userObj._id.toString();
        }
      } catch (err) {
        console.error("Error looking up user by email on order placement:", err);
      }
    }

    if (userObj) {
      try {
        if (!finalGuestEmail) finalGuestEmail = userObj.email;
        if (!finalGuestPhone) finalGuestPhone = userObj.phone;

        // Check if this shipping address is already saved in user's addresses
        if (!userObj.addresses) {
          userObj.addresses = [];
        }

        const clean = (val: any) => (val || "").toString().toLowerCase().trim().replace(/[\s,.-]+/g, "");
        const addressExists = userObj.addresses.some((addr: any) => {
          return (
            clean(addr.fullName) === clean(shippingAddress.fullName) &&
            clean(addr.phone) === clean(shippingAddress.phone) &&
            clean(addr.address) === clean(shippingAddress.addressLine1 || shippingAddress.address) &&
            clean(addr.city) === clean(shippingAddress.city) &&
            clean(addr.state) === clean(shippingAddress.state) &&
            clean(addr.zipCode) === clean(shippingAddress.zipCode || shippingAddress.pincode) &&
            clean(addr.country) === clean(shippingAddress.country)
          );
        });

        const hasRealStreetAddress = Boolean(
          shippingAddress.addressLine1 &&
          shippingAddress.addressLine1 !== "Digital Delivery" &&
          shippingAddress.city &&
          shippingAddress.city !== "Digital"
        );

        if (!addressExists && hasRealStreetAddress) {
          const isDefault = userObj.addresses.length === 0;
          const newAddr = {
            id: new mongoose.Types.ObjectId().toString(),
            fullName: shippingAddress.fullName.trim(),
            phone: (shippingAddress.phone || userObj.phone || "").trim(),
            address: (shippingAddress.addressLine1 || shippingAddress.address).trim(),
            city: shippingAddress.city.trim(),
            state: shippingAddress.state.trim(),
            zipCode: (shippingAddress.zipCode || shippingAddress.pincode).trim(),
            country: (shippingAddress.country || "United States").trim(),
            isDefault,
            label: "Home"
          };
          userObj.addresses.push(newAddr);

          if (isDefault) {
            userObj.address = newAddr.address;
            userObj.city = newAddr.city;
            userObj.state = newAddr.state;
            userObj.zipCode = newAddr.zipCode;
            userObj.country = newAddr.country;
          }

          userObj.markModified("addresses");
          await userObj.save();
        }
      } catch (err) {
        console.error("Error saving checkout shipping address to user profile:", err);
      }
    }

    if (!finalGuestEmail || !/^\S+@\S+\.\S+$/.test(finalGuestEmail)) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required to place an order." },
        { status: 400 }
      );
    }

    // Generate unique order number (e.g., SFP-2026-1049)
    let orderNumber = "";
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      const year = new Date().getFullYear();
      const rand = Math.floor(1000 + Math.random() * 9000);
      orderNumber = `SFP-${year}-${rand}`;

      const existing = await OrderModel.findOne({ orderNumber });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!orderNumber) {
      throw new Error("Failed to generate a unique order number.");
    }

    // Map cart items format to OrderItem schema format
    const orderItems = items.map((item: any) => ({
      productId: item.product?.id || item.product?._id || item.productId || item._id,
      productName: item.product?.name || item.productName || item.name || "Product",
      productImage: item.product?.images?.[0] || item.productImage || item.image || "/images/placeholder.png",
      sku: item.product?.sku || item.sku || "N/A",
      quantity: item.quantity,
      unitPrice: item.product?.price ?? item.unitPrice ?? item.price ?? 0,
      totalPrice: (item.product?.price ?? item.unitPrice ?? item.price ?? 0) * item.quantity,
      giftCardDetails: item.product?.giftCardDetails || item.giftCardDetails || undefined,
    }));

    const paymentStatus = paymentMethod === "cash_on_delivery" ? "pending" : "pending";

    // Calculate estimated delivery: 3-5 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const estimatedDelivery = deliveryDate.toISOString().split("T")[0];

    let appliedGiftCardCode: string | undefined = undefined;
    let appliedGiftCardAmount = 0;

    if (giftCardCode) {
      const cleanCode = giftCardCode.trim().toUpperCase();
      const giftCardInst = await GiftCardInstanceModel.findOne({ code: cleanCode });
      if (giftCardInst && giftCardInst.isActive && giftCardInst.currentBalance > 0) {
        if (!giftCardInst.expiryDate || new Date(giftCardInst.expiryDate) >= new Date()) {
          appliedGiftCardCode = cleanCode;
          const remainingAmountToPay = Math.max(0, subtotal - discount + shippingCost + (tax || 0));
          appliedGiftCardAmount = Math.min(giftCardInst.currentBalance, remainingAmountToPay);
        }
      }
    }

    const calculatedTotal = Math.max(0, subtotal - (discount || 0) - appliedGiftCardAmount + shippingCost + (tax || 0));

    const orderData = {
      userId,
      guestEmail: finalGuestEmail.toLowerCase().trim(),
      guestPhone: finalGuestPhone || undefined,
      orderNumber,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1 || shippingAddress.address, // handle both input fields variations
        addressLine2: shippingAddress.addressLine2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode || shippingAddress.pincode, // handle pincode / zipCode
        country: shippingAddress.country || "United States",
      },
      status: (paymentMethod === "cash_on_delivery" ? "confirmed" : "processing") as any,
      paymentStatus: paymentStatus as "pending" | "paid" | "failed" | "refunded",
      paymentMethod: paymentMethod as "credit_card" | "debit_card" | "paypal" | "cash_on_delivery",
      subtotal,
      discount: discount || 0,
      shippingCost,
      tax: tax || 0,
      fulfillmentMethod: fulfillmentMethod || "shipping",
      total: calculatedTotal,
      couponCode: couponCode || undefined,
      giftCardCode: appliedGiftCardCode,
      giftCardAmount: appliedGiftCardAmount,
      notes: notes || undefined,
      estimatedDelivery,
    };

    // Verify and deduct stock
    const productsToUpdate = [];
    for (const item of items) {
      const productId = item.product?._id || item.product?.id || item.productId || item._id;
      if (!productId) continue;
      let cleanId = productId;
      if (productId.startsWith("giftcard-")) {
        const parts = productId.split("-");
        cleanId = `${parts[0]}-${parts[1]}`;
      } else if (productId.includes("-")) {
        const parts = productId.split("-");
        while (parts.length > 0) {
          const lastPart = parts[parts.length - 1];
          if (!isNaN(Number(lastPart)) || lastPart === "unique" || /^\d+$/.test(lastPart)) {
            parts.pop();
          } else {
            break;
          }
        }
        cleanId = parts.join("-");
      }

      let product = null;
      if (mongoose.Types.ObjectId.isValid(cleanId)) {
        try {
          product = await ProductModel.findById(cleanId);
        } catch (err) {
          // Ignore cast error
        }
      }

      if (!product) {
        // If it's a gift card, skip stock checks/deductions
        if (
          cleanId.startsWith("giftcard-") ||
          cleanId.startsWith("gift-card") ||
          item.giftCardDetails ||
          item.product?.giftCardDetails
        ) {
          continue;
        }

        // Check if it exists in GiftCardModel (as gift cards do not use physical stock)
        let giftCard = null;
        if (mongoose.Types.ObjectId.isValid(cleanId)) {
          giftCard = await GiftCardModel.findById(cleanId);
        }
        if (!giftCard) {
          giftCard = await GiftCardModel.findOne({ id: cleanId });
        }

        if (giftCard) {
          // It's a gift card, skip stock checks/deductions
          continue;
        }

        return NextResponse.json(
          { success: false, message: `Product "${item.product?.name || item.productName || item.name || "Unknown"}" not found.` },
          { status: 404 }
        );
      }

      if (product.stockCount < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Product "${product.name}" has insufficient stock. Only ${product.stockCount} units available.`,
          },
          { status: 400 }
        );
      }
      productsToUpdate.push({ product, quantity: item.quantity });
    }

    // All products have sufficient stock, apply deduction
    for (const { product, quantity } of productsToUpdate) {
      product.stockCount -= quantity;
      await product.save();
    }

    const newOrder = await OrderModel.create(orderData);

    if (paymentMethod === "credit_card") {
      try {
        // Map items to Stripe's format
        const lineItems = orderItems.map((item: any) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.productName,
              images: [
                item.productImage.startsWith("http")
                  ? item.productImage
                  : `${req.nextUrl.origin}${item.productImage.startsWith('/') ? '' : '/'}${item.productImage}` // Abs URL required
              ],
            },
            unit_amount: Math.round(item.unitPrice * 100), // Stripe expects amounts in cents
          },
          quantity: item.quantity,
        }));

        // Add shipping cost if applicable
        if (shippingCost > 0) {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: "Shipping Cost",
              },
              unit_amount: Math.round(shippingCost * 100),
            },
            quantity: 1,
          });
        }

        // Add sales tax if applicable
        if (tax && tax > 0) {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: "Sales Tax",
              },
              unit_amount: Math.round(tax * 100),
            },
            quantity: 1,
          });
        }

        const sessionPayload: Stripe.Checkout.SessionCreateParams = {
          line_items: lineItems,
          mode: "payment",
          customer_email: finalGuestEmail.toLowerCase().trim(),
          success_url: `${process.env.NEXTAUTH_URL?.replace(/\/$/, "")}/order-success?id=${newOrder._id.toString()}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXTAUTH_URL?.replace(/\/$/, "")}/api/orders/cancel?orderId=${newOrder._id.toString()}&session_id={CHECKOUT_SESSION_ID}`,
          expires_at: Math.floor(Date.now() / 1000) + 31 * 60, // Expire in 31 minutes
          metadata: {
            orderId: newOrder._id.toString(),
            orderNumber: newOrder.orderNumber,
          },
        }

        // Apply Coupon + Gift Card combined discount if exists
        const totalDiscountForStripe = (discount || 0) + (appliedGiftCardAmount || 0);
        if (totalDiscountForStripe > 0) {
          const coupon = await stripe.coupons.create({
            amount_off: Math.round(totalDiscountForStripe * 100),
            currency: "usd",
            duration: "once",
          });
          sessionPayload.discounts = [{ coupon: coupon.id }];
        }

        const session = await stripe.checkout.sessions.create(sessionPayload);

        // Save Stripe session ID to order for verification upon redirect
        newOrder.stripeSessionId = session.id;
        await newOrder.save();

        return NextResponse.json({
          success: true,
          message: "Order placed. Redirecting to payment...",
          order: {
            id: newOrder._id.toString(),
            orderNumber: newOrder.orderNumber,
          },
          checkoutUrl: session.url,  //return checkouturl to redirect to frontend
        });
      } catch (stripeError: any) {
        console.error("Stripe session creation error:", stripeError);
        return NextResponse.json({
          success: false,
          message: "Order created but payment initiation failed. Please try again."
        }, { status: 500 })
      };
    }


    // For Cash on Delivery (immediate processing tasks):
    if (paymentMethod === "cash_on_delivery") {
      after(async () => {
        try {
          const { fulfillOrder } = await import("@/lib/services/orderFulfillmentService");
          await fulfillOrder(newOrder);
        } catch (fulfillErr) {
          console.error("Failed to fulfill COD order:", fulfillErr);
        }
      });
    }
    return NextResponse.json({
      success: true,
      message: "Order placed successfully.",
      order: {
        id: newOrder._id.toString(),
        orderNumber: newOrder.orderNumber,
        total: newOrder.total,
        placedAt: newOrder.placedAt,
        estimatedDelivery: newOrder.estimatedDelivery,
      },
    });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to place order." },
      { status: 500 }
    );
  }
}

// PUT: Cancel an order
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required to cancel an order." },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Session expired, please log in again." },
        { status: 401 }
      );
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Security: Check if order belongs to the authenticated user (by userId, matching guestEmail, or admin role)
    const userObj = await UserModel.findById(decoded.id).select("email role").lean();
    const userEmail = userObj?.email ? userObj.email.toLowerCase().trim() : "";
    const orderEmail = order.guestEmail ? order.guestEmail.toLowerCase().trim() : "";
    const isOwner =
      order.userId === decoded.id ||
      (orderEmail && userEmail && orderEmail === userEmail) ||
      userObj?.role === "admin";

    if (!isOwner) {
      return NextResponse.json(
        { success: false, message: "Access denied. You cannot cancel this order." },
        { status: 403 }
      );
    }

    // Auto-link order to user if not linked yet
    if (!order.userId && decoded.id) {
      order.userId = decoded.id;
    }

    // Check if the order status allows cancellation
    const nonCancellableStatuses = ["shipped", "delivered", "cancelled", "refunded"];
    if (nonCancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { success: false, message: `This order is already ${order.status} and cannot be cancelled.` },
        { status: 400 }
      );
    }

    // Update status to cancelled
    order.status = "cancelled";
    order.updatedAt = new Date();
    await order.save();

    // Refund applied gift card balance if any
    if (order.giftCardCode && order.giftCardAmount && order.giftCardAmount > 0) {
      try {
        const giftCardInst = await GiftCardInstanceModel.findOne({ code: order.giftCardCode });
        if (giftCardInst) {
          giftCardInst.currentBalance += order.giftCardAmount;
          giftCardInst.isActive = true;
          await giftCardInst.save();
          console.log(`[Order Cancelled] Refunded $${order.giftCardAmount} to Gift Card ${order.giftCardCode}`);
        }
      } catch (err) {
        console.error("Failed to refund gift card balance on cancellation:", err);
      }
    }

    // Restore product stock
    for (const item of order.items) {
      if (item.productId) {
        let cleanId = item.productId;
        if (item.productId.startsWith("giftcard-")) {
          const parts = item.productId.split("-");
          cleanId = `${parts[0]}-${parts[1]}`;
        } else if (item.productId.includes("-")) {
          const parts = item.productId.split("-");
          const lastPart = parts[parts.length - 1];
          if (!isNaN(Number(lastPart))) {
            parts.pop();
            cleanId = parts.join("-");
          }
        }

        let product = null;
        if (mongoose.Types.ObjectId.isValid(cleanId)) {
          try {
            product = await ProductModel.findById(cleanId);
          } catch (err) {
            // Ignore cast error
          }
        }
        if (product) {
          product.stockCount += item.quantity;
          await product.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error: any) {
    console.error("PUT /api/orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to cancel order." },
      { status: 500 }
    );
  }
}
