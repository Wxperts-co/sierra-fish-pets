import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import axios from "axios";
import { IOrder } from "@/models/Order";

/**
 * Clean branding color constants
 */
const COLORS = {
  primary: "#003B73",
  secondary: "#0EA5E9",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  background: "#F8FAFC",
  border: "#E2E8F0",
  text: "#1F2937",
  muted: "#64748B",
  white: "#FFFFFF",
};

class InvoiceGenerator {
  private doc: InstanceType<typeof PDFDocument>;
  private order: IOrder;
  public currentY: number;

  constructor(doc: InstanceType<typeof PDFDocument>, order: IOrder) {
    this.doc = doc;
    this.order = order;
    this.currentY = 50;
  }

  /**
   * Draw status badge in top right header corner
   */
  private drawStatusBadge(x: number, y: number, status: string) {
    const s = status.toLowerCase();
    let badgeColor = COLORS.muted;
    let textColor = COLORS.white;

    if (s === "processing" || s === "pending") {
      badgeColor = COLORS.warning;
    } else if (s === "confirmed") {
      badgeColor = COLORS.primary;
    } else if (s === "shipped") {
      badgeColor = "#8B5CF6"; // Purple
    } else if (s === "delivered") {
      badgeColor = COLORS.success;
    } else if (s === "cancelled" || s === "refunded") {
      badgeColor = COLORS.danger;
    }

    const width = 85;
    const height = 18;
    const text = status.toUpperCase();

    this.doc
      .roundedRect(x - width, y, width, height, 4)
      .fill(badgeColor);

    this.doc
      .fillColor(textColor)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(text, x - width, y + 5, { width, align: "center" })
      .font("Helvetica");
  }

  /**
   * Draw header section
   */
  public drawHeader() {
    // Top-left: Company details
    this.doc
      .fillColor(COLORS.primary)
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Sierra Fish & Pets", 50, 50)
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.secondary)
      .text("Your Local Pet & Aquarium Specialists", 50, 75);

    // Top-right: Invoice Metadata
    this.doc
      .fillColor(COLORS.text)
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("INVOICE", 400, 50, { align: "right" })
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(`Invoice No: #${this.order.orderNumber}`, 400, 75, { align: "right" })
      .text(`Order No: #${this.order.orderNumber}`, 400, 88, { align: "right" })
      .text(
        `Invoice Date: ${new Date(this.order.placedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        400,
        101,
        { align: "right" }
      );

    // Order status badge
    this.drawStatusBadge(545, 117, this.order.status);

    // Header divider line
    this.doc
      .strokeColor(COLORS.border)
      .lineWidth(1)
      .moveTo(50, 142)
      .lineTo(545, 142)
      .stroke();

    this.currentY = 160;
  }

  /**
   * Draw equal-height info cards for seller and customer
   */
  public drawInformationCards() {
    const cardY = this.currentY;
    const cardHeight = 120;
    const cardWidth = 237.5;
    const leftCardX = 50;
    const rightCardX = 307.5;

    // Seller Details Card
    this.doc
      .roundedRect(leftCardX, cardY, cardWidth, cardHeight, 8)
      .fillAndStroke(COLORS.background, COLORS.border);

    this.doc
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Seller Details", leftCardX + 15, cardY + 15)
      .font("Helvetica")
      .fillColor(COLORS.text)
      .fontSize(9)
      .text("Sierra Fish & Pets", leftCardX + 15, cardY + 35)
      .text("601 S Grady Way", leftCardX + 15, cardY + 50)
      .text("Renton, WA 98057", leftCardX + 15, cardY + 65)
      .text("Phone: 425-226-3215", leftCardX + 15, cardY + 80)
      .text("Email: contact@sierrafishpets.com", leftCardX + 15, cardY + 95);

    // Customer Details Card
    this.doc
      .roundedRect(rightCardX, cardY, cardWidth, cardHeight, 8)
      .fillAndStroke(COLORS.background, COLORS.border);

    this.doc
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Ship To", rightCardX + 15, cardY + 15)
      .font("Helvetica")
      .fillColor(COLORS.text)
      .fontSize(9)
      .text(this.order.shippingAddress.fullName, rightCardX + 15, cardY + 35)
      .text(this.order.shippingAddress.addressLine1, rightCardX + 15, cardY + 50);

    let custY = cardY + 65;
    if (this.order.shippingAddress.addressLine2) {
      this.doc.text(this.order.shippingAddress.addressLine2, rightCardX + 15, custY);
      custY += 15;
    }
    this.doc.text(
      `${this.order.shippingAddress.city}, ${this.order.shippingAddress.state} ${this.order.shippingAddress.zipCode}`,
      rightCardX + 15,
      custY
    );
    custY += 15;
    this.doc.text(this.order.shippingAddress.country, rightCardX + 15, custY);
    custY += 15;
    this.doc.text(`Phone: ${this.order.shippingAddress.phone}`, rightCardX + 15, custY);

    this.currentY = cardY + cardHeight + 20;
  }

  /**
   * Draw the product table headers
   */
  private drawTableHeader(y: number) {
    this.doc
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("Product", 100, y)
      .text("SKU", 280, y)
      .text("Unit Price", 370, y, { width: 60, align: "right" })
      .text("Qty", 440, y, { width: 40, align: "right" })
      .text("Total", 490, y, { width: 55, align: "right" })
      .font("Helvetica");

    this.doc
      .strokeColor(COLORS.primary)
      .lineWidth(1)
      .moveTo(50, y + 15)
      .lineTo(545, y + 15)
      .stroke();
  }

  /**
   * Helper to draw a gray placeholder box if image fetching fails
   */
  private drawPlaceholderBox(x: number, y: number) {
    this.doc
      .roundedRect(x, y, 40, 40, 4)
      .fillAndStroke("#F1F5F9", COLORS.border);
    this.doc
      .fillColor(COLORS.muted)
      .fontSize(7)
      .text("No Image", x, y + 16, { width: 40, align: "center" });
  }

  /**
   * Draw the dynamic products items list
   */
  public async drawProductTable() {
    this.drawTableHeader(this.currentY);
    let itemY = this.currentY + 20;

    for (let index = 0; index < this.order.items.length; index++) {
      const item = this.order.items[index];

      // Calculate string wrapping heights
      const nameWidth = 170;
      const textHeight = this.doc.heightOfString(item.productName, { width: nameWidth });
      const rowHeight = Math.max(textHeight + 20, 52); // Keep height large enough to fit 40x40 thumbnail

      // Check page bounds before drawing row
      if (itemY + rowHeight > 660) {
        // Draw bottom boundary for previous page table
        this.doc
          .strokeColor(COLORS.border)
          .lineWidth(1)
          .moveTo(50, itemY)
          .lineTo(545, itemY)
          .stroke();

        this.doc.addPage();
        itemY = 60;
        this.drawTableHeader(itemY);
        itemY += 20;
      }

      // Alternate row backgrounds
      if (index % 2 === 1) {
        this.doc
          .fillColor(COLORS.background)
          .rect(50, itemY, 495, rowHeight)
          .fill();
      }

      // Draw light horizontal separator
      this.doc
        .strokeColor(COLORS.border)
        .lineWidth(0.5)
        .moveTo(50, itemY + rowHeight)
        .lineTo(545, itemY + rowHeight)
        .stroke();

      // Download product image
      const thumbX = 50;
      const thumbY = itemY + (rowHeight - 40) / 2;
      let imgBuffer: Buffer | null = null;

      if (item.productImage) {
        try {
          if (item.productImage.startsWith("http")) {
            const res = await axios.get(item.productImage, {
              responseType: "arraybuffer",
              timeout: 3000,
            });
            imgBuffer = Buffer.from(res.data);
          } else {
            const filePath = path.join(process.cwd(), "public", item.productImage);
            if (fs.existsSync(filePath)) {
              imgBuffer = fs.readFileSync(filePath);
            }
          }
        } catch (e) {
          console.warn(`Failed to fetch product image thumbnail: ${item.productImage}`);
        }
      }

      // Render image thumbnail or fallback placeholder
      if (imgBuffer) {
        try {
          this.doc.image(imgBuffer, thumbX, thumbY, { fit: [40, 40] });
        } catch (imgErr) {
          this.drawPlaceholderBox(thumbX, thumbY);
        }
      } else {
        this.drawPlaceholderBox(thumbX, thumbY);
      }

      // Write column items (aligned vertically center inside row)
      this.doc
        .fillColor(COLORS.text)
        .fontSize(9)
        .text(item.productName, 100, itemY + (rowHeight - textHeight) / 2, { width: nameWidth })
        .text(item.sku || "N/A", 280, itemY + (rowHeight - 9) / 2)
        .text(`$${item.unitPrice.toFixed(2)}`, 370, itemY + (rowHeight - 9) / 2, { width: 60, align: "right" })
        .text(item.quantity.toString(), 440, itemY + (rowHeight - 9) / 2, { width: 40, align: "right" })
        .text(`$${item.totalPrice.toFixed(2)}`, 490, itemY + (rowHeight - 9) / 2, { width: 55, align: "right" });

      itemY += rowHeight;
    }

    // Draw final table bottom line boundary
    this.doc
      .strokeColor(COLORS.border)
      .lineWidth(1)
      .moveTo(50, itemY)
      .lineTo(545, itemY)
      .stroke();

    this.currentY = itemY + 20;
  }

  /**
   * Draw payment details and summary cards side-by-side
   */
  public drawSummaryAndPayment() {
    const minNeededSpace = 140;

    // Check if both summaries fit on current page, add new page if not
    if (this.currentY + minNeededSpace > 660) {
      this.doc.addPage();
      this.currentY = 60;
    }

    const cardY = this.currentY;
    const cardWidth = 220;

    // Draw Payment Information details (Left Side)
    const leftX = 50;
    this.doc
      .roundedRect(leftX, cardY, cardWidth, 130, 8)
      .fillAndStroke(COLORS.background, COLORS.border);

    this.doc
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Payment Information", leftX + 15, cardY + 15)
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.text)
      .text("Payment Method:", leftX + 15, cardY + 40)
      .text("Payment Status:", leftX + 15, cardY + 65)
      .text("Transaction ID:", leftX + 15, cardY + 90);

    this.doc
      .font("Helvetica-Bold")
      .text(this.order.paymentMethod.replace(/_/g, " ").toUpperCase(), leftX + 110, cardY + 40)
      .fillColor(this.order.paymentStatus === "paid" ? COLORS.success : COLORS.warning)
      .text(this.order.paymentStatus.toUpperCase(), leftX + 110, cardY + 65)
      .fillColor(COLORS.text)
      .font("Helvetica")
      .text(this.order._id.toString().substring(0, 10).toUpperCase(), leftX + 110, cardY + 90);

    // Draw Calculations Summary details (Right Side)
    const rightX = 325;
    this.doc
      .roundedRect(rightX, cardY, cardWidth, 130, 8)
      .fillAndStroke(COLORS.background, COLORS.border);

    const valWidth = 85;
    const valAlignX = rightX + 120;
    let sumY = cardY + 15;

    // Subtotal
    this.doc
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text("Subtotal:", rightX + 15, sumY)
      .fillColor(COLORS.text)
      .text(`$${this.order.subtotal.toFixed(2)}`, valAlignX, sumY, { width: valWidth, align: "right" });

    sumY += 18;

    // Discount if discount is applied
    if (this.order.discount > 0) {
      this.doc
        .fillColor(COLORS.success)
        .text(`Discount (${this.order.couponCode || "Promo"}):`, rightX + 15, sumY)
        .text(`-$${this.order.discount.toFixed(2)}`, valAlignX, sumY, { width: valWidth, align: "right" });
      sumY += 18;
    }

    // Shipping Cost
    this.doc
      .fillColor(COLORS.muted)
      .text("Shipping:", rightX + 15, sumY)
      .fillColor(COLORS.text)
      .text(
        this.order.shippingCost === 0 ? "FREE" : `$${this.order.shippingCost.toFixed(2)}`,
        valAlignX,
        sumY,
        { width: valWidth, align: "right" }
      );

    sumY += 18;

    // Tax
    this.doc
      .fillColor(COLORS.muted)
      .text("Tax (0%):", rightX + 15, sumY)
      .fillColor(COLORS.text)
      .text("$0.00", valAlignX, sumY, { width: valWidth, align: "right" });

    sumY += 18;

    // Highlighted background for Grand Total
    this.doc
      .fillColor(COLORS.primary)
      .rect(rightX + 5, sumY - 4, cardWidth - 10, 24)
      .fill();

    // Grand Total Text
    this.doc
      .fillColor(COLORS.white)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Grand Total:", rightX + 15, sumY + 3)
      .text(`$${this.order.total.toFixed(2)}`, valAlignX, sumY + 3, { width: valWidth, align: "right" })
      .font("Helvetica");

    this.currentY = cardY + 140;
  }

  /**
   * Draw footer details (used inside loop at bottom of each page)
   */
  public drawFooterForPage(pageNumber: number, totalPages: number) {
    const footerY = 740;

    // Temporarily set bottom margin to 0 to prevent auto page break on footer text
    const oldBottomMargin = this.doc.page.margins.bottom;
    this.doc.page.margins.bottom = 0;

    // Horizontal divider
    this.doc
      .strokeColor(COLORS.border)
      .lineWidth(1)
      .moveTo(50, footerY)
      .lineTo(545, footerY)
      .stroke();

    // Thank you message
    this.doc
      .fillColor(COLORS.muted)
      .fontSize(8.5)
      .text("Thank you for shopping with Sierra Fish & Pets.", 50, footerY + 15, {
        align: "center",
        width: 495,
      });

    // Contact details row
    this.doc
      .fillColor(COLORS.primary)
      .fontSize(8)
      .text("contact@sierrafishpets.com", 50, footerY + 30, { align: "left", width: 150 })
      .text("425-226-3215", 220, footerY + 30, { align: "center", width: 150 })
      .text("www.sierrafishpets.com", 395, footerY + 30, { align: "right", width: 150 });

    // Page numbering
    this.doc
      .fillColor(COLORS.muted)
      .fontSize(8)
      .text(`Page ${pageNumber} of ${totalPages}`, 50, footerY + 45, { align: "right", width: 495 });

    // Restore bottom margin
    this.doc.page.margins.bottom = oldBottomMargin;
  }
}

/**
 * Generate a dynamic PDF invoice for an order using pdfkit.
 * Saves the file in public/invoices/invoice-<orderId>.pdf
 * Returns the relative URL path to the generated PDF.
 */
export async function generateInvoicePDF(order: IOrder): Promise<string> {
  const invoicesDir = path.join(process.cwd(), "public", "invoices");

  // Ensure output directory exists
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const filename = `invoice-${order._id.toString()}.pdf`;
  const filePath = path.join(invoicesDir, filename);

  const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
  const writeStream = fs.createWriteStream(filePath);

  doc.pipe(writeStream);

  const generator = new InvoiceGenerator(doc, order);

  // 1. Draw Page Structure
  generator.drawHeader();
  generator.drawInformationCards();
  await generator.drawProductTable();
  generator.drawSummaryAndPayment();

  // 2. Loop through buffered pages at the end to add page numbers and footer
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    generator.drawFooterForPage(i + 1, range.count);
  }

  doc.end();

  return new Promise<string>((resolve, reject) => {
    writeStream.on("finish", () => {
      resolve(`/invoices/${filename}`);
    });
    writeStream.on("error", (err) => {
      reject(err);
    });
  });
}
