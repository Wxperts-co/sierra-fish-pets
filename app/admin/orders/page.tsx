"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ClipboardList,
  Search,
  X,
  Check,
  Edit2,
  Trash2,
  Calendar,
  Truck,
  MapPin,
  CreditCard,
  ShoppingBag,
  Clock,
  MessageSquare,
  Eye,
} from "lucide-react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { showErrorToast } from "@/lib/toast";

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  _id: string;
  userId?: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery";
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  notes?: string;
  placedAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  // Modal States
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Edit status form inputs
  const [editStatus, setEditStatus] = useState<Order["status"]>("pending");
  const [editPaymentStatus, setEditPaymentStatus] = useState<Order["paymentStatus"]>("pending");
  const [editTrackingNumber, setEditTrackingNumber] = useState("");
  const [editEstimatedDelivery, setEditEstimatedDelivery] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch orders from database
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await axios.get(`/api/admin/orders?${params.toString()}`);
      if (response.data?.success) {
        setOrders(response.data.orders || []);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      showErrorToast("Failed to retrieve orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Debounced search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Handle opening Detail View
  const handleOpenDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Handle opening Edit View
  const handleOpenEditModal = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
    setEditTrackingNumber(order.trackingNumber || "");
    setEditEstimatedDelivery(order.estimatedDelivery || "");
    setIsEditModalOpen(true);
  };

  // Submit edit form
  const handleSaveOrderChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setSaving(true);
    try {
      const response = await axios.patch(`/api/admin/orders/${selectedOrder._id}`, {
        status: editStatus,
        paymentStatus: editPaymentStatus,
        trackingNumber: editTrackingNumber,
        estimatedDelivery: editEstimatedDelivery,
      });

      if (response.data?.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === selectedOrder._id ? response.data.order : o))
        );
        
        // Re-calculate statistics locally or re-fetch
        fetchOrders();
        setIsEditModalOpen(false);
      } else {
        showErrorToast(response.data.message || "Failed to update order.");
      }
    } catch (err: any) {
      console.error(err);
      showErrorToast(err.response?.data?.message || "Failed to save order updates.");
    } finally {
      setSaving(false);
    }
  };

  // Handle deleting order
  const handleDeleteOrder = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this order? This cannot be undone.");
    if (!confirmed) return;

    try {
      const response = await axios.delete(`/api/admin/orders/${id}`);
      if (response.data?.success) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
      showErrorToast("Failed to delete order record.");
    }
  };

  // Format helper for price
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  // Class helper for status badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "pending":
        return "bg-sky-50 text-sky-700 border-sky-100";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getPaymentBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  // Mapped Rows for DataGrid
  const rows = useMemo(() => {
    return orders.map((order, index) => ({
      ...order,
      id: order._id,
      serial: index + 1,
    }));
  }, [orders]);

  // Columns Definition for DataGrid
  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "#",
      width: 70,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "orderNumber",
      headerName: "Order Details",
      flex: 1.2,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-black text-[#005AA9] text-sm">#{row.orderNumber}</span>
            {row.userId ? (
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wide block mt-0.5">
                Member Checkout
              </span>
            ) : (
              <span className="text-[10px] text-orange-500 uppercase font-black tracking-wide block mt-0.5">
                Guest Checkout
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: "placedAt",
      headerName: "Date Placed",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        const dateStr = new Date(row.placedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-semibold text-slate-900">{dateStr}</span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              {new Date(row.placedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
        );
      },
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1.2,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-bold text-slate-800">{row.shippingAddress.fullName}</span>
            <span className="text-xs text-slate-500 mt-0.5">{row.shippingAddress.phone}</span>
          </div>
        );
      },
    },
    {
      field: "items",
      headerName: "Items Count",
      flex: 0.8,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        const itemsCount = row.items.reduce((sum, item) => sum + item.quantity, 0);
        return (
          <div className="flex items-center h-full font-extrabold text-slate-800">
            {itemsCount} {itemsCount === 1 ? "item" : "items"}
          </div>
        );
      },
    },
    {
      field: "total",
      headerName: "Total Amount",
      flex: 0.9,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full font-mono font-bold text-slate-900">
            {formatPrice(row.total)}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Order Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full">
            <span className={`inline-block border text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusBadgeClass(row.status)}`}>
              {row.status}
            </span>
          </div>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full">
            <span className={`inline-block border text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${getPaymentBadgeClass(row.paymentStatus)}`}>
              {row.paymentStatus}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex items-center justify-end gap-2 w-full pr-2 h-full">
            <button
              onClick={() => handleOpenDetailModal(row)}
              className="p-2 border border-slate-100 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
              title="View Receipts"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenEditModal(row)}
              className="p-2 border border-slate-100 hover:border-blue-200 rounded-xl bg-white hover:bg-blue-50 text-slate-500 hover:text-[#005AA9] transition active:scale-95 cursor-pointer"
              title="Edit Status / Tracking"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteOrder(row._id)}
              className="p-2 border border-slate-100 hover:border-red-200 rounded-xl bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 transition active:scale-95 cursor-pointer"
              title="Delete Order"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 font-lato">
      
      {/* ── Title block ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Orders Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium font-lato">
            Track customer orders, confirm dispatch, input shipment tracking carrier details, and manage payment settlements.
          </p>
        </div>
      </div>

      {/* ── Stats Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{loading && stats.total === 0 ? "..." : stats.total}</h3>
          </div>
          <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Processing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processing</p>
            <h3 className="text-2xl font-black text-amber-600 mt-2">{loading && stats.processing === 0 ? "..." : stats.processing}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Shipped */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipped</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-2">{loading && stats.shipped === 0 ? "..." : stats.shipped}</h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">{loading && stats.delivered === 0 ? "..." : stats.delivered}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
            <Check className="w-6 h-6 stroke-[3px]" />
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cancelled</p>
            <h3 className="text-2xl font-black text-rose-500 mt-2">{loading && stats.cancelled === 0 ? "..." : stats.cancelled}</h3>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
            <X className="w-6 h-6 stroke-[3px]" />
          </div>
        </div>

      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search orders by number or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* ── Orders Table Grid ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden" style={{ width: "100%" }}>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pagination
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            loading={loading}
            autoHeight
          />
        </div>
      </div>

      {/* ── DETAIL RECEIPT MODAL ── */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden text-slate-700">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4.5 text-white flex items-center justify-between shrink-0">
              <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-sky-300" />
                <span>Receipt Summary - #{selectedOrder.orderNumber}</span>
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Receipt Body */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* Product items list */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Ordered Items</h4>
                <div className="divide-y divide-slate-50 border border-slate-100 rounded-2xl px-4 py-1.5 bg-slate-50/20">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center gap-3.5">
                      <div className="relative w-11 h-11 bg-white border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={item.productImage || "/images/placeholder.png"}
                          alt={item.productName}
                          className="object-contain p-1 w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-xs text-slate-800 truncate">{item.productName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">SKU: {item.sku || "N/A"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-slate-800 font-mono">
                          {item.quantity} × {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Destination */}
                <div className="space-y-2 bg-slate-50/60 p-4.5 rounded-2xl border border-slate-100">
                  <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Shipping Address
                  </h5>
                  <div className="text-xs font-semibold text-slate-600 leading-relaxed space-y-0.5">
                    <p className="font-extrabold text-slate-800">{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    <p className="text-slate-400">{selectedOrder.shippingAddress.country}</p>
                    <p className="font-bold text-slate-800 pt-1.5">Phone: {selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Logistics */}
                <div className="space-y-2 bg-slate-50/60 p-4.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> Shipping Logistics
                    </h5>
                    <div className="text-xs font-semibold text-slate-600 space-y-1">
                      <p>
                        Carrier Tracking:{" "}
                        <span className="font-bold text-slate-800">
                          {selectedOrder.trackingNumber || "Not Shipped Yet"}
                        </span>
                      </p>
                      <p>
                        Est. Delivery:{" "}
                        <span className="font-bold text-slate-800">
                          {selectedOrder.estimatedDelivery
                            ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs font-semibold text-slate-600">
                    Payment Method: <span className="font-extrabold text-slate-800 uppercase">{selectedOrder.paymentMethod.replace(/_/g, " ")}</span>
                  </div>
                </div>

              </div>

              {/* Delivery Notes */}
              {selectedOrder.notes && (
                <div className="space-y-1.5 bg-blue-50/20 border border-blue-100/50 p-4 rounded-2xl">
                  <h5 className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Customer Order Notes
                  </h5>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
                    &ldquo;{selectedOrder.notes}&rdquo;
                  </p>
                </div>
              )}

              {/* Price Calculations breakdown */}
              <div className="border-t border-slate-100 pt-5 max-w-xs ml-auto space-y-2 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-mono">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ""}</span>
                    <span className="font-mono">-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="text-slate-800 font-mono">
                    {selectedOrder.shippingCost === 0 ? "FREE" : formatPrice(selectedOrder.shippingCost)}
                  </span>
                </div>
                <div className="border-t border-slate-100 mt-2.5 pt-2.5 flex justify-between font-black text-slate-800 text-sm">
                  <span>Total Settlement</span>
                  <span className="text-slate-900 font-mono text-base">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold transition hover:bg-slate-100 text-xs cursor-pointer"
              >
                Close Receipt
              </button>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenEditModal(selectedOrder);
                }}
                className="px-6 py-2.5 bg-[#005AA9] hover:bg-blue-700 text-white rounded-xl font-bold transition text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/15"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Status / Logistics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT STATUS / LOGISTICS MODAL ── */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-700 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4.5 text-white flex items-center justify-between shrink-0">
              <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Edit2 className="w-4.5 h-4.5 text-sky-300" />
                <span>Logistics Editor - #{selectedOrder.orderNumber}</span>
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveOrderChanges} className="p-6 space-y-4">
              
              {/* Order Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Order Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Order["status"])}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Payment Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Payment Status</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value as Order["paymentStatus"])}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Carrier Tracking Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Carrier Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. 1Z999AA10123456784"
                  value={editTrackingNumber}
                  onChange={(e) => setEditTrackingNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                />
              </div>

              {/* Estimated Delivery Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Estimated Delivery Date</label>
                <input
                  type="date"
                  value={editEstimatedDelivery}
                  onChange={(e) => setEditEstimatedDelivery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800 cursor-pointer text-slate-600"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-50 mt-5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold transition hover:bg-slate-50 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/15 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3px]" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
