import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";

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

    const order = await OrderModel.findByIdAndDelete(normalizedId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

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
