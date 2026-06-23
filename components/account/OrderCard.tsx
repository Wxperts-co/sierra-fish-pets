"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  MapPin,
  FileText,
  Download,
} from "lucide-react";
import { Order } from "@/types";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const itemQuantity = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const placedDate = new Date(order.placedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "debit_card":
        return "Debit Card";
      case "paypal":
        return "PayPal / UPI";
      case "cash_on_delivery":
        return "Cash on Delivery";
      default:
        return method.replace(/_/g, " ").toUpperCase();
    }
  };

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const handleDownloadInvoice = () => {
    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice #${order.orderNumber}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #333;
      margin: 40px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo-container h1 {
      color: #003B73;
      margin: 0;
      font-size: 28px;
      font-weight: 800;
    }
    .logo-container p {
      margin: 2px 0 0 0;
      color: #718096;
      font-size: 14px;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h2 {
      margin: 0;
      font-size: 24px;
      color: #2d3748;
      font-weight: 700;
    }
    .invoice-title p {
      margin: 5px 0 0 0;
      font-size: 14px;
      color: #4a5568;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .details-block h3 {
      margin: 0 0 10px 0;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #a0aec0;
      border-bottom: 1px solid #edf2f7;
      padding-bottom: 5px;
    }
    .details-block p {
      margin: 0 0 5px 0;
      font-size: 14px;
      color: #2d3748;
    }
    .details-block strong {
      color: #000;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background-color: #f7fafc;
      border-bottom: 2px solid #edf2f7;
      color: #4a5568;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #edf2f7;
      font-size: 14px;
      color: #2d3748;
    }
    .text-right {
      text-align: right;
    }
    .totals-table {
      width: 300px;
      margin-left: auto;
      margin-top: 20px;
    }
    .totals-table td {
      border: none;
      padding: 6px 12px;
    }
    .totals-table tr.grand-total td {
      border-top: 1px solid #e2e8f0;
      font-size: 16px;
      font-weight: 800;
      color: #000;
      padding-top: 12px;
    }
    .footer {
      margin-top: 60px;
      text-align: center;
      font-size: 12px;
      color: #a0aec0;
      border-top: 1px solid #edf2f7;
      padding-top: 20px;
    }
    @media print {
      body { margin: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">
      <h1>Sierra Fish & Pets</h1>
      <p>Your local pet & aquarium specialists</p>
    </div>
    <div class="invoice-title">
      <h2>INVOICE</h2>
      <p><strong>Order:</strong> #${order.orderNumber}</p>
      <p><strong>Date:</strong> ${placedDate}</p>
    </div>
  </div>

  <div class="details-grid">
    <div class="details-block">
      <h3>Seller Details</h3>
      <p><strong>Sierra Fish & Pets</strong></p>
      <p>601 S Grady Way</p>
      <p>Renton, WA 98057</p>
      <p>Phone: 425-226-3215</p>
      <p>Email: contact@sierrafishpets.com</p>
    </div>
    <div class="details-block">
      <h3>Ship To</h3>
      <p><strong>${order.shippingAddress.fullName}</strong></p>
      <p>${order.shippingAddress.addressLine1}</p>
      ${order.shippingAddress.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ""}
      <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
      <p>Payment: ${getPaymentMethodLabel(order.paymentMethod)} (${order.paymentStatus})</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>SKU</th>
        <th class="text-right">Price</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item: any) => `
        <tr>
          <td>${item.productName}</td>
          <td>${item.sku || "N/A"}</td>
          <td class="text-right">${formatPrice(item.unitPrice)}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${formatPrice(item.unitPrice * item.quantity)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <table class="totals-table">
    <tr>
      <td>Subtotal:</td>
      <td class="text-right">${formatPrice(order.subtotal)}</td>
    </tr>
    ${order.discount > 0 ? `
    <tr>
      <td style="color: #2f855a;">Discount (${order.couponCode || "Promo"}):</td>
      <td class="text-right" style="color: #2f855a;">-${formatPrice(order.discount)}</td>
    </tr>
    ` : ""}
    <tr>
      <td>Shipping:</td>
      <td class="text-right">${order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}</td>
    </tr>
    <tr class="grand-total">
      <td>Total Paid:</td>
      <td class="text-right">${formatPrice(order.total)}</td>
    </tr>
  </table>

  <div class="footer">
    <p>Thank you for your business! If you have any questions regarding this invoice, please reach out to us.</p>
    <p>&copy; ${new Date().getFullYear()} Sierra Fish & Pets. All rights reserved.</p>
  </div>

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "shipped":
        return "bg-cyan-50 text-cyan-600 border-cyan-100";
      case "processing":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "pending":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "cancelled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div
      className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
        isExpanded ? "border-primary/30 shadow-md" : "border-slate-100 shadow-sm"
      }`}
    >
      {/* Summary Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-slate-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              Order Number
            </p>
            <p className="font-extrabold text-slate-800">#{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Date Placed
            </p>
            <p className="font-bold text-slate-700 text-sm">{placedDate}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Total
            </p>
            <p className="font-black text-slate-800">${order.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              Status
            </p>
            <span
              className={`inline-block border text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusBadgeClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadInvoice();
            }}
            className="text-sm font-bold text-[#005AA9] hover:text-[#004b8d] flex items-center gap-1.5 cursor-pointer bg-blue-50/50 hover:bg-blue-50 px-3.5 py-2 rounded-xl transition"
          >
            <Download className="h-4 w-4" />
            <span>Invoice</span>
          </button>
          <button className="text-sm font-bold text-primary flex items-center gap-1 cursor-pointer">
            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details Panel */}
      {isExpanded && (
        <div className="p-6 border-t border-slate-100 bg-white space-y-6">
          {/* Items List */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
              <Package className="h-4.5 w-4.5 text-slate-400" />
              <span>Items Ordered ({itemQuantity})</span>
            </h4>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="py-4 flex items-start gap-4 first:pt-0 last:pb-0"
                >
                  <div className="relative h-16 w-16 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-slate-800 text-sm truncate hover:text-primary transition-colors">
                      {item.productName}
                    </h5>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">
                      SKU: {item.sku}
                    </p>
                    <p className="text-slate-500 text-xs font-bold mt-1">
                      Qty: {item.quantity} • ${item.unitPrice.toFixed(2)} each
                    </p>
                  </div>
                  <div className="text-right font-black text-slate-800 text-sm">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
            {/* Shipping & Delivery Info */}
            <div className="space-y-4">
              {/* Delivery Address */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>Shipping Destination</span>
                </h4>
                <p className="text-slate-600 text-sm font-semibold leading-relaxed pl-6">
                  <span className="block font-extrabold text-slate-800">
                    {order.shippingAddress.fullName}
                  </span>
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                  <span className="block">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </span>
                  <span className="block text-xs text-slate-400">{order.shippingAddress.country}</span>
                </p>
              </div>

              {/* Tracking details */}
              {order.trackingNumber && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                    <Truck className="h-4 w-4 text-slate-400" />
                    <span>Tracking Details</span>
                  </h4>
                  <p className="text-slate-600 text-sm font-semibold pl-6">
                    Tracking No: <span className="font-black text-slate-800 select-all">{order.trackingNumber}</span>
                    {order.estimatedDelivery && (
                      <span className="block mt-1 text-xs text-slate-400">
                        Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric"
                        })}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Payment & Calculations summary */}
            <div className="space-y-4">
              <h4 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span>Receipt Summary</span>
              </h4>
              <div className="space-y-2 text-sm font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-slate-800">
                    {order.shippingCost === 0 ? "FREE" : `$${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 font-black text-base text-slate-800">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="pt-2 text-xs text-slate-400 text-right">
                  Paid via {order.paymentMethod.replace("_", " ").toUpperCase()} • Status: {order.paymentStatus.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
