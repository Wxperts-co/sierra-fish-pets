import { transporter } from "@/lib/mail";
import { IOrder } from "@/models/Order";
import path from "path";
import fs from "fs";

const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const LOGO_URL = `${APP_URL.replace(/\/$/, "")}/images/logo/logo.png`;

/**
 * Format price as USD
 */
function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Send an Order Confirmation Email
 */
export async function sendOrderConfirmationEmail(order: IOrder) {
  const customerName = order.shippingAddress.fullName;
  const invoiceDownloadUrl = `${APP_URL}/api/orders/${order._id.toString()}/invoice`;
  const placedDate = new Date(order.placedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
        <img src="${item.productImage}" alt="${item.productName}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 8px; border: 1px solid #edf2f7; padding: 4px;" />
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
        <div style="font-weight: bold; color: #2d3748; font-size: 14px;">${item.productName}</div>
        <div style="color: #718096; font-size: 12px;">SKU: ${item.sku || "N/A"}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: center; color: #2d3748; font-size: 14px; vertical-align: middle;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: bold; color: #2d3748; font-size: 14px; vertical-align: middle;">
        ${formatPrice(item.unitPrice)}
      </td>
    </tr>
  `
    )
    .join("");

  const emailHtml = `
    <div style="margin: 0; padding: 40px 0; background-color: #f7fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <!-- Brand Header -->
              <tr>
                <td style="background-color: #003B73; padding: 32px; text-align: center;">
                  <img src="${LOGO_URL}" alt="Sierra Fish & Pets" style="max-height: 65px; max-width: 260px; margin-bottom: 4px; display: inline-block; object-fit: contain;" />
                  <p style="margin: 10px 0 0; color: #93c5fd; font-size: 15px; font-weight: 600;">
                    Your Order Has Been Confirmed! 🎉
                  </p>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 32px;">
                  <h2 style="margin: 0 0 16px; color: #1a202c; font-size: 20px; font-weight: 700;">
                    Hello ${customerName},
                  </h2>
                  <p style="margin: 0 0 24px; color: #4a5568; font-size: 15px; line-height: 1.6;">
                    Thank you for shopping with us! We have received your order and are currently processing it. Below are your order summary and delivery details.
                  </p>

                  <!-- Order Meta Box -->
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #4a5568;">
                      <tr>
                        <td style="padding-bottom: 8px;"><strong>Order Number:</strong></td>
                        <td style="padding-bottom: 8px; text-align: right; color: #1a202c; font-weight: bold;">#${order.orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px;"><strong>Order Date:</strong></td>
                        <td style="padding-bottom: 8px; text-align: right;">${placedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px;"><strong>Payment Method:</strong></td>
                        <td style="padding-bottom: 8px; text-align: right; text-transform: uppercase;">${order.paymentMethod.replace(/_/g, " ")}</td>
                      </tr>
                      <tr>
                        <td><strong>Shipping Destination:</strong></td>
                        <td style="text-align: right; color: #1a202c;">
                          <strong>${order.shippingAddress.fullName}</strong><br />
                          ${order.shippingAddress.addressLine1}<br />
                          ${order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}<br />` : ""}
                          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Product Table Header -->
                  <h3 style="margin: 0 0 12px; color: #1a202c; font-size: 16px; font-weight: 700;">
                    Items Ordered
                  </h3>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
                    <thead>
                      <tr style="background-color: #f8fafc;">
                        <th style="padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #718096; border-bottom: 2px solid #e2e8f0;">Image</th>
                        <th style="padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #718096; border-bottom: 2px solid #e2e8f0;">Product</th>
                        <th style="padding: 10px 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #718096; border-bottom: 2px solid #e2e8f0;">Qty</th>
                        <th style="padding: 10px 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #718096; border-bottom: 2px solid #e2e8f0;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Totals Summary Table -->
                  <table width="280" align="right" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #4a5568; margin-bottom: 32px;">
                    <tr>
                      <td style="padding: 6px 0;">Subtotal:</td>
                      <td style="padding: 6px 0; text-align: right; color: #1a202c;">${formatPrice(order.subtotal)}</td>
                    </tr>
                    ${order.discount > 0
      ? `
                    <tr>
                      <td style="padding: 6px 0; color: #10b981;">Discount (${order.couponCode || "Promo"}):</td>
                      <td style="padding: 6px 0; text-align: right; color: #10b981;">-${formatPrice(order.discount)}</td>
                    </tr>
                    `
      : ""
    }
                    <tr>
                      <td style="padding: 6px 0;">Shipping Charges:</td>
                      <td style="padding: 6px 0; text-align: right; color: #1a202c;">${order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0;">Tax (0%):</td>
                      <td style="padding: 6px 0; text-align: right; color: #1a202c;">$0.00</td>
                    </tr>
                    <tr style="font-weight: bold; font-size: 16px; color: #003B73;">
                      <td style="padding: 12px 0 0; border-top: 1px solid #e2e8f0;">Grand Total:</td>
                      <td style="padding: 12px 0 0; text-align: right; border-top: 1px solid #e2e8f0;">${formatPrice(order.total)}</td>
                    </tr>
                  </table>
                  
                  <div style="clear: both;"></div>

                 

                </td>
              </tr>

              <!-- Footer Section -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 8px; color: #718096; font-size: 13px;">
                    Questions about your order? Email us at <a href="mailto:contact@sierrafishpets.com" style="color: #005AA9; text-decoration: none;">contact@sierrafishpets.com</a>
                  </p>
                  <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} Sierra Fish & Pets. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  // Path to the invoice PDF file on disk
  const filename = `invoice-${order._id.toString()}.pdf`;
  const filePath = path.join(process.cwd(), "public", "invoices", filename);

  const fs = require("fs");
  if (!fs.existsSync(filePath)) {
    try {
      const { generateInvoicePDF } = require("./invoiceService");
      await generateInvoicePDF(order);
    } catch (e) {
      console.error("Error generating invoice PDF in confirmation email:", e);
    }
  }

  const attachments: any[] = [];
  if (fs.existsSync(filePath)) {
    attachments.push({
      filename: `invoice-${order.orderNumber}.pdf`,
      path: filePath,
    });
  }


  // Send customer confirmation email
  try {
    await transporter.sendMail({
      from: `"Sierra Fish & Pets" <${process.env.SMTP_USER}>`,
      to: order.guestEmail,
      subject: `🛒 Order Confirmation #${order.orderNumber} - Sierra Fish & Pets`,
      html: emailHtml,
      attachments,
    });
  } catch (customerMailError) {
    console.error("Failed to send customer order confirmation email:", customerMailError);
  }

  // Also notify the admin using the exact same rich template and invoice attachment to bypass spam filters
  try {
    const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      await transporter.sendMail({
        from: `"Sierra Fish & Pets" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `🔔 New Order Received #${order.orderNumber} - Sierra Fish & Pets`,
        html: emailHtml,
        attachments,
      });
    }
  } catch (adminMailError) {
    console.error("Failed to send admin order confirmation email copy:", adminMailError);
  }
}

/**
 * Send a notification email to the admin for a new order (Option B)
 */
export async function sendAdminNewOrderEmail(order: IOrder) {
  const adminEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  const emailHtml = `
    <div style="margin: 0; padding: 40px 0; background-color: #f7fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <!-- Brand Header -->
              <tr>
                <td style="background-color: #003B73; padding: 32px; text-align: center;">
                  <img src="${LOGO_URL}" alt="Sierra Fish & Pets" style="max-height: 65px; max-width: 260px; margin-bottom: 4px; display: inline-block; object-fit: contain;" />
                  <p style="margin: 10px 0 0; color: #93c5fd; font-size: 15px; font-weight: 600;">
                    New Order Placed! 🎉
                  </p>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 32px;">
                  <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #2d3748;">
                    Hello Admin,
                  </p>
                  <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">
                    A new order has been successfully placed on Sierra Fish & Pets. Here are the details:
                  </p>
                  
                  <table width="100%" style="font-size: 14px; border-collapse: collapse; margin: 20px 0; color: #4a5568;">
                    <tr style="border-bottom: 1px solid #edf2f7;">
                      <td style="padding: 10px 0; font-weight: bold; width: 140px;">Order Number:</td>
                      <td style="padding: 10px 0; color: #1a202c; font-weight: bold;">#${order.orderNumber}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #edf2f7;">
                      <td style="padding: 10px 0; font-weight: bold;">Customer Name:</td>
                      <td style="padding: 10px 0; color: #2d3748;">${order.shippingAddress.fullName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #edf2f7;">
                      <td style="padding: 10px 0; font-weight: bold;">Customer Email:</td>
                      <td style="padding: 10px 0;"><a href="mailto:${order.guestEmail}" style="color: #005AA9; text-decoration: none;">${order.guestEmail}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #edf2f7;">
                      <td style="padding: 10px 0; font-weight: bold;">Total Amount:</td>
                      <td style="padding: 10px 0; font-weight: bold; color: #10b981;">${formatPrice(order.total)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #edf2f7;">
                      <td style="padding: 10px 0; font-weight: bold;">Payment Method:</td>
                      <td style="padding: 10px 0; text-transform: uppercase;">${order.paymentMethod.replace(/_/g, " ")}</td>
                    </tr>
                  </table>
                  
                  <div style="margin-top: 30px; text-align: center;">
                    <a href="${APP_URL}/admin/orders" style="background-color: #003B73; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      Manage Order in Admin Panel
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer Section -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} Sierra Fish & Pets. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  const attachments: any[] = [];

  await transporter.sendMail({
    from: `"Sierra Fish & Pets" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `🔔 New Order Received #${order.orderNumber} - Sierra Fish & Pets`,
    html: emailHtml,
     headers: {
      "X-Entity-Ref-ID": order.orderNumber,
      "X-Priority": "1", // High priority
    },
    attachments,
  });
}

/**
 * Send an Order Delivered Email (attaches the invoice PDF and provides download link)
 */
export async function sendOrderDeliveredEmail(order: IOrder) {
  const customerName = order.shippingAddress.fullName;
  const orderUrl = `${APP_URL}/account/orders`;
  const deliveredDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const invoiceDownloadUrl = `${APP_URL}/api/orders/${order._id.toString()}/invoice`;

  const itemsListHtml = order.items
    .map(
      (item) => `
    <li style="margin-bottom: 8px; color: #4a5568;">
      <strong>${item.productName}</strong> x ${item.quantity} - ${formatPrice(item.totalPrice)}
    </li>
  `
    )
    .join("");

  const emailHtml = `
    <div style="margin: 0; padding: 40px 0; background-color: #f7fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <!-- Brand Header -->
              <tr>
                <td style="background-color: #10b981; padding: 32px; text-align: center;">
                  <img src="${LOGO_URL}" alt="Sierra Fish & Pets" style="max-height: 65px; max-width: 260px; margin-bottom: 4px; display: inline-block; object-fit: contain;" />
                  <p style="margin: 10px 0 0; color: #d1fae5; font-size: 15px; font-weight: 600;">
                    Your Order Has Been Delivered! 📦🚚
                  </p>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 32px;">
                  <h2 style="margin: 0 0 16px; color: #1a202c; font-size: 20px; font-weight: 700;">
                    Hello ${customerName},
                  </h2>
                  <p style="margin: 0 0 24px; color: #4a5568; font-size: 15px; line-height: 1.6;">
                    Good news! Your order has been successfully delivered. We hope you and your pets enjoy your purchase!
                  </p>

                  <!-- Delivery Details Box -->
                  <div style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #065f46;">
                      <tr>
                        <td style="padding-bottom: 8px;"><strong>Order Number:</strong></td>
                        <td style="padding-bottom: 8px; text-align: right; font-weight: bold;">#${order.orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px;"><strong>Delivery Date:</strong></td>
                        <td style="padding-bottom: 8px; text-align: right;">${deliveredDate}</td>
                      </tr>
                      <tr>
                        <td><strong>Items Delivered:</strong></td>
                        <td style="text-align: right;">
                          <ul style="margin: 0; padding: 0; list-style: none; text-align: right;">
                            ${itemsListHtml}
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <p style="margin: 0 0 24px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                    We have attached the official PDF invoice to this email for your records. You can also download it at any time using the button below:
                  </p>

                 

                </td>
              </tr>

              <!-- Footer Section -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 8px; color: #718096; font-size: 13px;">
                    Need support? Contact us at <a href="mailto:contact@sierrafishpets.com" style="color: #005AA9; text-decoration: none;">contact@sierrafishpets.com</a>
                  </p>
                  <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} Sierra Fish & Pets. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  // Path to the invoice PDF file on disk
  const filename = `invoice-${order._id.toString()}.pdf`;
  const filePath = path.join(process.cwd(), "public", "invoices", filename);

  const fs = require("fs");
  if (!fs.existsSync(filePath)) {
    try {
      const { generateInvoicePDF } = require("./invoiceService");
      await generateInvoicePDF(order);
    } catch (e) {
      console.error("Error generating invoice PDF in delivered email:", e);
    }
  }

  const attachments: any[] = [];
  if (fs.existsSync(filePath)) {
    attachments.push({
      filename: `invoice-${order.orderNumber}.pdf`,
      path: filePath,
    });
  }


  await transporter.sendMail({
    from: `"Sierra Fish & Pets" <${process.env.SMTP_USER}>`,
    to: order.guestEmail,
    subject: `📦 Delivered: Order #${order.orderNumber} - Sierra Fish & Pets`,
    html: emailHtml,
    attachments,
  });
}
