import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import ProductModel from "@/models/Product";
import GiftCardModel from "@/models/GiftCard";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "your-fallback-jwt-secret";

// GET: Retrieve all orders for the authenticated user or a specific order by ID
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const order = await OrderModel.findById(id).lean();
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found." },
          { status: 404 }
        );
      }

      // Security check: if order belongs to a user, enforce verification
      if (order.userId) {
        const token = req.cookies.get("token")?.value;
        if (!token) {
          return NextResponse.json(
            { success: false, message: "Authentication required." },
            { status: 401 }
          );
        }
        try {
          const decoded: any = jwt.verify(token, JWT_SECRET);
          if (order.userId !== decoded.id) {
            return NextResponse.json(
              { success: false, message: "Access denied." },
              { status: 403 }
            );
          }
        } catch (err) {
          return NextResponse.json(
            { success: false, message: "Invalid session." },
            { status: 401 }
          );
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

    const orders = await OrderModel.find({ userId: decoded.id })
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
      total,
      couponCode,
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
    const token = req.cookies.get("token")?.value;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;

        // Populate user details for orders mapping
        const userObj = await UserModel.findById(userId).lean();
        if (userObj) {
          if (!finalGuestEmail) finalGuestEmail = userObj.email;
          if (!finalGuestPhone) finalGuestPhone = userObj.phone;
        }
      } catch (err) {
        // Log error but proceed as guest checkout if token validation fails
        console.warn("Invalid JWT on order placement - placing as guest.");
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
      productId: item.product.id || item.product._id,
      productName: item.product.name,
      productImage: item.product.images?.[0] || "/images/placeholder.png",
      sku: item.product.sku || "N/A",
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity,
    }));

    const paymentStatus = paymentMethod === "cash_on_delivery" ? "pending" : "paid";
    
    // Calculate estimated delivery: 3-5 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const estimatedDelivery = deliveryDate.toISOString().split("T")[0];

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
      status: "processing" as const, // default status for placed orders
      paymentStatus: paymentStatus as "pending" | "paid" | "failed" | "refunded",
      paymentMethod: paymentMethod as "credit_card" | "debit_card" | "paypal" | "cash_on_delivery",
      subtotal,
      discount,
      shippingCost,
      total,
      couponCode: couponCode || undefined,
      notes: notes || undefined,
      estimatedDelivery,
    };

    // Verify and deduct stock
    const productsToUpdate = [];
    for (const item of items) {
      const productId = item.product._id || item.product.id;
      let cleanId = productId;
      if (productId.includes("-")) {
        const parts = productId.split("-");
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

      if (!product) {
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
          { success: false, message: `Product "${item.product.name}" not found.` },
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

    // Generate Invoice PDF
    try {
      const { generateInvoicePDF } = await import("@/lib/services/invoiceService");
      const relativeInvoiceUrl = await generateInvoicePDF(newOrder);

      newOrder.invoiceUrl = relativeInvoiceUrl;
      newOrder.invoiceGeneratedAt = new Date();
      await newOrder.save();
    } catch (pdfError) {
      console.error("Failed to generate invoice during order placement:", pdfError);
    }

    // Send Confirmation Email
    try {
      const { sendOrderConfirmationEmail } = await import("@/lib/services/emailService");
      await sendOrderConfirmationEmail(newOrder);
    } catch (mailError) {
      console.error("Failed to send order confirmation email during placement:", mailError);
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

    // Security: Check if order belongs to the authenticated user
    if (order.userId !== decoded.id) {
      return NextResponse.json(
        { success: false, message: "Access denied. You cannot cancel this order." },
        { status: 403 }
      );
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

    // Restore product stock
    for (const item of order.items) {
      if (item.productId) {
        let cleanId = item.productId;
        if (item.productId.includes("-")) {
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
