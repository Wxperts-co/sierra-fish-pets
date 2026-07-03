import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import ProductModel from "@/models/Product";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = typeof id === "string" ? id.trim() : "";

    if (!normalizedId) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const allowedFields = [
      "status",
      "paymentStatus",
      "trackingNumber",
      "estimatedDelivery",
    ];

    const updateData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        updateData[key] = body[key];
      }
    }

    const order = await OrderModel.findById(normalizedId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const oldStatus = order.status;
    const newStatus = updateData.status;

    // Stock management logic on status transition
    if (newStatus && newStatus !== oldStatus) {
      const wasCancelledOrRefunded = ["cancelled", "refunded"].includes(oldStatus);
      const isActiveNow = !["cancelled", "refunded"].includes(newStatus);
      const wasActive = !["cancelled", "refunded"].includes(oldStatus);
      const isCancelledOrRefunded = ["cancelled", "refunded"].includes(newStatus);

      if (wasCancelledOrRefunded && isActiveNow) {
        // Moving from cancelled/refunded back to active -> deduct stock
        const productsToUpdate = [];
        for (const item of order.items) {
          if (item.productId) {
            const product = await ProductModel.findById(item.productId);
            if (!product) {
              return NextResponse.json(
                { success: false, message: `Product "${item.productName}" not found.` },
                { status: 400 }
              );
            }
            if (product.stockCount < item.quantity) {
              return NextResponse.json(
                {
                  success: false,
                  message: `Insufficient stock to re-activate order. Product "${product.name}" only has ${product.stockCount} units available.`,
                },
                { status: 400 }
              );
            }
            productsToUpdate.push({ product, quantity: item.quantity });
          }
        }

        // Apply stock deduction
        for (const { product, quantity } of productsToUpdate) {
          product.stockCount -= quantity;
          await product.save();
        }
      } else if (wasActive && isCancelledOrRefunded) {
        // Moving from active to cancelled/refunded -> restore stock
        for (const item of order.items) {
          if (item.productId) {
            const product = await ProductModel.findById(item.productId);
            if (product) {
              product.stockCount += item.quantity;
              await product.save();
            }
          }
        }
      }
    }

    Object.assign(order, updateData);
    await order.save();

    // Trigger emails and invoice generation on status change
    if (newStatus && newStatus !== oldStatus) {
      if (newStatus === "processing" || newStatus === "confirmed") {
        // Ensure invoice is generated
        if (!order.invoiceUrl) {
          try {
            const { generateInvoicePDF } = await import("@/lib/services/invoiceService");
            const relativeInvoiceUrl = await generateInvoicePDF(order);
            order.invoiceUrl = relativeInvoiceUrl;
            order.invoiceGeneratedAt = new Date();
            await order.save();
          } catch (pdfErr) {
            console.error("Failed to generate invoice on status change to processing/confirmed:", pdfErr);
          }
        }

        // Send confirmation email
        try {
          const { sendOrderConfirmationEmail } = await import("@/lib/services/emailService");
          await sendOrderConfirmationEmail(order);
        } catch (mailErr) {
          console.error("Failed to send order confirmation email:", mailErr);
        }
      } else if (newStatus === "delivered") {
        // Ensure invoice is generated
        if (!order.invoiceUrl) {
          try {
            const { generateInvoicePDF } = await import("@/lib/services/invoiceService");
            const relativeInvoiceUrl = await generateInvoicePDF(order);
            order.invoiceUrl = relativeInvoiceUrl;
            order.invoiceGeneratedAt = new Date();
            await order.save();
          } catch (pdfErr) {
            console.error("Failed to generate invoice on status change to delivered:", pdfErr);
          }
        }

        // Send delivery email (with invoice attached)
        try {
          const { sendOrderDeliveredEmail } = await import("@/lib/services/emailService");
          await sendOrderDeliveredEmail(order);
        } catch (mailErr) {
          console.error("Failed to send order delivered email:", mailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = typeof id === "string" ? id.trim() : "";

    if (!normalizedId) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await OrderModel.findById(normalizedId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // If deleting an active order (not cancelled/refunded), restore stock
    if (!["cancelled", "refunded"].includes(order.status)) {
      for (const item of order.items) {
        if (item.productId) {
          const product = await ProductModel.findById(item.productId);
          if (product) {
            product.stockCount += item.quantity;
            await product.save();
          }
        }
      }
    }

    await order.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete order." },
      { status: 500 }
    );
  }
}
