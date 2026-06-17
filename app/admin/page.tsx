import { ShoppingBag, ClipboardList, Users, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  // Replace these mocked variables with actual queries to Mongoose / DB
  const stats = [
    { label: "Total Revenue", value: "$12,450.00", icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
    { label: "Active Orders", value: "32", icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
    { label: "Total Products", value: "148", icon: ShoppingBag, color: "bg-amber-50 text-amber-600" },
    { label: "Registered Customers", value: "542", icon: Users, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here is a summary of your store's activity.</p>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-xl ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Graphs or list of recent activity (e.g. Recent Orders list) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Orders</h2>
        <div className="text-sm text-slate-500 text-center py-8">
          Integrate a table fetching the most recent orders from database here.
        </div>
      </div>
    </div>
  );
}
