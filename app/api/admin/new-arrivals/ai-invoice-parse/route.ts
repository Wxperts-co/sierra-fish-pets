import { NextRequest, NextResponse } from "next/server";
import { parseInvoiceTextToItems, resolveSpeciesImage } from "@/lib/invoiceSpeciesService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let invoiceText = "";
    let arrivalDate = new Date().toISOString().split("T")[0];

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const textFromForm = formData.get("text") as string | null;
      const dateFromForm = formData.get("arrivalDate") as string | null;
      const file = formData.get("file") as File | null;

      if (dateFromForm) arrivalDate = dateFromForm;

      if (textFromForm && textFromForm.trim()) {
        invoiceText = textFromForm;
      } else if (file) {
        // Read file contents (if text/csv or parse buffer)
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const decoded = buffer.toString("utf-8");
          // Check if plain readable text
          if (decoded && !/[\x00-\x08\x0E-\x1F]/.test(decoded.slice(0, 100))) {
            invoiceText = decoded;
          } else {
            // Binary or PDF content: extract strings
            const extractedStrings = decoded.match(/[a-zA-Z0-9\s\(\)\$\.\,\-\/]{4,}/g);
            if (extractedStrings) {
              invoiceText = extractedStrings.join("\n");
            }
          }
        } catch (err) {
          console.error("Error reading uploaded invoice file:", err);
        }
      }
    } else {
      const body = await request.json();
      invoiceText = body.text || "";
      if (body.arrivalDate) arrivalDate = body.arrivalDate;
    }

    if (!invoiceText || invoiceText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No invoice text or readable file provided. Please paste invoice lines or upload a valid file.",
        },
        { status: 400 }
      );
    }

    const items = await parseInvoiceTextToItems(invoiceText, arrivalDate);

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fish/pet line-items could be extracted. Please check the invoice text format.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: items.length,
        items,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("AI Invoice Parse Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process invoice." },
      { status: 500 }
    );
  }
}
