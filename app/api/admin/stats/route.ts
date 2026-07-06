import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import ProductModel from "@/models/Product";
import UserModel from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "weekly"; // "weekly", "monthly", "yearly"

    // 1. Calculate Total Revenue (completed/active paid or pending orders - excluding cancelled/refunded)
    const revenueResult = await OrderModel.aggregate([
      {
        $match: {
          status: { $nin: ["cancelled", "refunded"] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // 2. Count Active Orders (any order not delivered, cancelled, or refunded)
    const activeOrdersCount = await OrderModel.countDocuments({
      status: { $in: ["pending", "confirmed", "processing", "shipped"] }
    });

    // 2b. Count Total valid orders for AOV calculation (all except cancelled/refunded)
    const totalOrdersCount = await OrderModel.countDocuments({
      status: { $nin: ["cancelled", "refunded"] }
    });

    // 3. Count Total Products
    const totalProductsCount = await ProductModel.countDocuments({});
    const productsWithImagesCount = await ProductModel.countDocuments({ images: { $exists: true, $not: { $size: 0 } } });
    const pendingEnrichmentCount = await ProductModel.countDocuments({ imageStatus: "pending" });
    const failedEnrichmentCount = await ProductModel.countDocuments({ imageStatus: "failed" });

    // 4. Count Registered Customers
    const registeredCustomersCount = await UserModel.countDocuments({
      role: "user",
      deletedAt: null
    });

    // 5. Fetch 5 Recent Orders
    const recentOrders = await OrderModel.find({})
      .sort({ placedAt: -1 })
      .limit(5)
      .lean();

    // 6. Generate Sales Chart Data based on range
    const now = new Date();
    let startDate = new Date();

    if (range === "yearly") {
      // Start from 11 months ago
      startDate.setMonth(now.getMonth() - 11);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "monthly") {
      // Start from 29 days ago
      startDate.setDate(now.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Default: "weekly" (start from 6 days ago)
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    }

    const ordersForChart = await OrderModel.find({
      placedAt: { $gte: startDate },
      status: { $nin: ["cancelled", "refunded"] }
    }).lean();

    const chartData = [];

    if (range === "yearly") {
      // Group by Month for 12 Months
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        const year = d.getFullYear();
        const month = d.getMonth();
        
        const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        
        const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
        
        const monthlyOrders = ordersForChart.filter(o => {
          const pDate = new Date(o.placedAt);
          return pDate >= startOfMonth && pDate <= endOfMonth;
        });
        
        const revenue = monthlyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        chartData.push({
          date: `${year}-${String(month + 1).padStart(2, '0')}`,
          label,
          revenue: Number(revenue.toFixed(2)),
          orders: monthlyOrders.length
        });
      }
    } else {
      // Group by Day (7 or 30 Days)
      const numDays = range === "monthly" ? 30 : 7;
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateString = d.toISOString().split("T")[0];
        
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        
        const startOfDay = new Date(new Date(d).setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(d).setHours(23, 59, 59, 999));
        
        const dailyOrders = ordersForChart.filter(o => {
          const pDate = new Date(o.placedAt);
          return pDate >= startOfDay && pDate <= endOfDay;
        });
        
        const revenue = dailyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        chartData.push({
          date: dateString,
          label,
          revenue: Number(revenue.toFixed(2)),
          orders: dailyOrders.length
        });
      }
    }

    // 7. Order Status Distribution (for a Pie chart)
    const statusCounts = await OrderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    const statusDistribution = statusCounts.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        activeOrders: activeOrdersCount,
        totalOrders: totalOrdersCount,
        totalProducts: totalProductsCount,
        registeredCustomers: registeredCustomersCount,
        productsWithImages: productsWithImagesCount,
        pendingImageEnrichment: pendingEnrichmentCount,
        failedImageEnrichment: failedEnrichmentCount,
      },
      recentOrders,
      chartData,
      statusDistribution
    });
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch dashboard stats." },
      { status: 500 }
    );
  }
}
