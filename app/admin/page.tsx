"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ShoppingBag,
  ClipboardList,
  Users,
  DollarSign,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Layers
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { showErrorToast } from "@/lib/toast";

interface ChartItem {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

interface StatusItem {
  name: string;
  value: number;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId?: string | null;
  placedAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
}

const COLORS = ["#005AA9", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    registeredCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusItem[]>([]);
  const [chartTab, setChartTab] = useState<"revenue" | "orders">("revenue");
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">("weekly");

  const fetchDashboardData = async (rangeVal = timeframe) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/stats?range=${rangeVal}`);
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
        setChartData(res.data.chartData || []);
        setStatusDistribution(res.data.statusDistribution || []);
      }
    } catch (error: any) {
      console.error("Failed to load dashboard statistics:", error);
      showErrorToast("Could not retrieve dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(timeframe);
  }, [timeframe]);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

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

  // Columns definition for DataGrid mapping
  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "#",
      width: 60,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "orderNumber",
      headerName: "Order Number",
      flex: 1.2,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-extrabold text-[#005AA9] hover:underline cursor-pointer" onClick={() => router.push(`/admin/orders`)}>
              #{row.orderNumber}
            </span>
            {row.userId ? (
              <span className="text-[9px] text-indigo-500 font-extrabold uppercase tracking-wider block mt-0.5">
                Member Checkout
              </span>
            ) : (
              <span className="text-[9px] text-orange-500 font-extrabold uppercase tracking-wider block mt-0.5">
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
            <span className="font-semibold text-slate-800">{dateStr}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
              {new Date(row.placedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
        );
      },
    },
    {
      field: "customer",
      headerName: "Customer Details",
      flex: 1.2,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-bold text-slate-700">{row.shippingAddress?.fullName || "N/A"}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">{row.shippingAddress?.phone || "N/A"}</span>
          </div>
        );
      },
    },
    {
      field: "items",
      headerName: "Items",
      flex: 0.7,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        const itemsCount = row.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        return (
          <div className="flex items-center h-full font-bold text-slate-700">
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
      headerName: "Status",
      flex: 0.9,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full w-full">
            <span
              className={`inline-flex items-center leading-none border text-[10px] font-black uppercase tracking-wider px-2 py-px rounded-full ${getStatusBadgeClass(
                row.status
              )}`}
            >
              {row.status}
            </span>
          </div>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      flex: 0.9,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full w-full">
            <span
              className={`inline-flex items-center leading-none border text-[10px] font-black uppercase tracking-wider px-2 py-px rounded-full ${getPaymentBadgeClass(
                row.paymentStatus
              )}`}
            >
              {row.paymentStatus}
            </span>
          </div>
        );
      },
    },
  ];

  const rows = useMemo(() => {
    return recentOrders.map((order, index) => ({
      ...order,
      id: order._id,
      serial: index + 1,
    }));
  }, [recentOrders]);

  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      indicator: "Total sales (excl. cancelled)",
      borderColor: "hover:border-emerald-100"
    },
    {
      label: "Active Orders",
      value: stats.activeOrders,
      icon: ClipboardList,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      indicator: "Processing / shipped orders",
      borderColor: "hover:border-blue-100"
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: ShoppingBag,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      indicator: "Items in catalog database",
      borderColor: "hover:border-amber-100"
    },
    {
      label: "Registered Customers",
      value: stats.registeredCustomers,
      icon: Users,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      indicator: "Unique verified members",
      borderColor: "hover:border-purple-100"
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Welcome back! Here is a summary of your store&apos;s activity.</p>
        </div>
        <button
          onClick={() => fetchDashboardData()}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-800 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Stats
        </button>
      </div>

      {/* Stats cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-pulse">
              <div className="space-y-3">
                <div className="h-3 w-24 bg-slate-100 rounded" />
                <div className="h-6 w-16 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
              <div className="h-12 w-12 bg-slate-100 rounded-xl" />
            </div>
          ))
        ) : (
          cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md ${card.borderColor}`}
              >
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{card.label}</span>
                  <p className="text-2xl font-black text-slate-800 tracking-tight">{card.value}</p>
                  <span className="text-[11px] text-slate-400 font-medium block">{card.indicator}</span>
                </div>
                <div className={`p-3.5 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Graphical section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#005AA9]" />
                Store Analytics
              </h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {timeframe === "weekly" ? "Weekly" : timeframe === "monthly" ? "Monthly (30 Days)" : "Yearly (12 Months)"} Revenue and Orders count
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Timeframe Switcher */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-150">
                <button
                  onClick={() => setTimeframe("weekly")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeframe === "weekly"
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200/40"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe("monthly")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeframe === "monthly"
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200/40"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeframe("yearly")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeframe === "yearly"
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200/40"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Yearly
                </button>
              </div>

              {/* Metric Switcher */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-150">
                <button
                  onClick={() => setChartTab("revenue")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${chartTab === "revenue"
                      ? "bg-[#005AA9] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setChartTab("orders")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${chartTab === "orders"
                      ? "bg-[#005AA9] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Orders
                </button>
              </div>
            </div>
          </div>

          <div className="h-[320px] w-full pt-2">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <RefreshCw className="h-6 w-6 text-[#005AA9] animate-spin" />
                <span className="text-xs text-slate-500 font-bold mt-2">Loading chart data...</span>
              </div>
            ) : chartData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="h-8 w-8 text-slate-300" />
                <span className="text-xs text-slate-400 font-bold mt-2">No {timeframe} analytics data available</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartTab === "revenue" ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005AA9" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#005AA9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      formatter={(value: any) => [formatPrice(value), "Revenue"]}
                      contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#005AA9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      formatter={(value: any) => [value, "Orders"]}
                      contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
                    />
                    <Bar dataKey="orders" fill="#005AA9" radius={[4, 4, 0, 0]} maxBarSize={45}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? "#005AA9" : "#3b82f6"} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Order Status Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#005AA9]" />
              Order Statuses
            </h3>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Breakdown of orders in system</p>
          </div>

          <div className="h-[260px] w-full flex items-center justify-center relative">
            {loading ? (
              <RefreshCw className="h-6 w-6 text-[#005AA9] animate-spin" />
            ) : statusDistribution.length === 0 ? (
              <span className="text-xs text-slate-400 font-bold">No order status breakdown</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-2">
            {!loading && statusDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-semibold text-slate-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table using standard DataGrid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-800">Recent Orders</h3>
            <p className="text-slate-500 text-xs font-medium mt-1">Review the five most recently placed customer orders.</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-50 border border-slate-150 px-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-100 active:scale-95"
          >
            Manage All Orders
            <ArrowRight className="h-4 w-4 text-[#005AA9]" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            autoHeight
            rowHeight={68}
            hideFooter
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f8fafc",
                color: "#475569",
                fontWeight: 900,
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid #f1f5f9"
              },
              "& .MuiDataGrid-row": {
                borderBottom: "1px solid #f8fafc",
                "&:hover": {
                  backgroundColor: "#f8fafc/50"
                }
              },
              "& .MuiDataGrid-cell": {
                outline: "none !important"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
