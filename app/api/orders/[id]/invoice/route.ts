import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const orderId = typeof id === "string" ? id.trim() : "";

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Invalid Order ID." },
        { status: 400 }
      );
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const filename = `invoice-${order._id.toString()}.pdf`;
    const filePath = path.join(process.cwd(), "public", "invoices", filename);

    // Always generate/overwrite the invoice PDF to ensure layout fixes and current order data are served
    const { generateInvoicePDF } = await import("@/lib/services/invoiceService");
    try {
      await generateInvoicePDF(order);
    } catch (genErr: any) {
      console.error("Failed to generate invoice PDF:", genErr);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { success: false, message: "Invoice PDF file not found and could not be generated." },
          { status: 404 }
        );
      }
    }

    // Stream/return the file for download
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.orderNumber}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("GET /api/orders/[id]/invoice error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to download invoice." },
      { status: 500 }
    );
  }
}
