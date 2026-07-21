import { analyticsDataClient, GA4_PROPERTY_ID, formatGADate } from "@/lib/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (!GA4_PROPERTY_ID) {
    return NextResponse.json({ error: "GA4 Property ID is not configured." }, { status: 500 });
  }

  const cleanPropertyId = GA4_PROPERTY_ID.replace(/^properties\//, "");

  const { searchParams } = req.nextUrl;
  const timeframe = searchParams.get("timeframe") || "30days";

  let startDate = "30daysAgo";
  if (timeframe === "7days") startDate = "7daysAgo";
  if (timeframe === "1year") startDate = "365daysAgo";

  try {
    const [
      [overviewReport],
      [trafficSourcesReport],
      [dailyTrendReport],
      [topPagesReport],
      [devicesReport],
      [regionsReport],
    ] = await Promise.all([
      // 1. Overview KPIs
      analyticsDataClient.runReport({
        property: `properties/${cleanPropertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "sessions" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
          { name: "newUsers" },
        ],
      }),

      // 2. Traffic Sources
      analyticsDataClient.runReport({
        property: `properties/${cleanPropertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      }),

      // 3. Growth Trend for Charts
      analyticsDataClient.runReport({
        property: `properties/${cleanPropertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "sessions" },
          { name: "newUsers" },
        ],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),

      // 4. Top Pages
      analyticsDataClient.runReport({
        property: `properties/${cleanPropertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        limit: 10,
      }),

      // 5. Devices Breakdown
      analyticsDataClient.runReport({
        property: `properties/${cleanPropertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
      }),

      // 6. Region Breakdown (Location)
      analyticsDataClient.runReport({
        property: `properties/${cleanPropertyId}`,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "region" }],
        metrics: [{ name: "activeUsers" }],
        limit: 5,
      }),
    ]);

    // Format trend dates using formatGADate helper
    const formattedTrend = (dailyTrendReport.rows || []).map((row) => ({
      date: formatGADate(row.dimensionValues?.[0]?.value || ""),
      activeUsers: parseInt(row.metricValues?.[0]?.value || "0"),
      pageViews: parseInt(row.metricValues?.[1]?.value || "0"),
      sessions: parseInt(row.metricValues?.[2]?.value || "0"),
      newUsers: parseInt(row.metricValues?.[3]?.value || "0"),
    }));

    // Format top pages
    const formattedPages = (topPagesReport.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || "/",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0"),
    }));

    // Format devices
    const formattedDevices = (devicesReport.rows || []).map((row) => ({
      device: row.dimensionValues?.[0]?.value || "desktop",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
    }));

    // Format traffic sources
    const formattedSources = (trafficSourcesReport.rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || "(direct)",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0"),
    }));

    // Format regions (Location)
    const formattedRegions = (regionsReport.rows || []).map((row) => ({
      region: row.dimensionValues?.[0]?.value || "Other",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
    }));

    // Fetch real Customer LTV from MongoDB orders
    let customerLTV = 0;
    try {
      const { connectDB } = await import("@/lib/mongodb");
      const OrderModel = (await import("@/models/Order")).default;
      await connectDB();
      const orders = await OrderModel.find({ paymentStatus: "paid" });
      if (orders.length > 0) {
        const totalRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const uniqueCustomers = new Set(orders.map((o) => o.guestEmail || o.userId).filter(Boolean)).size || 1;
        customerLTV = parseFloat((totalRev / uniqueCustomers).toFixed(2));
      }
    } catch (err) {
      console.error("Failed to calculate DB Customer LTV:", err);
    }

    return NextResponse.json({
      overview: {
        activeUsers: parseInt(overviewReport.rows?.[0]?.metricValues?.[0]?.value || "0"),
        pageViews: parseInt(overviewReport.rows?.[0]?.metricValues?.[1]?.value || "0"),
        sessions: parseInt(overviewReport.rows?.[0]?.metricValues?.[2]?.value || "0"),
        bounceRate: parseFloat(overviewReport.rows?.[0]?.metricValues?.[3]?.value || "0"),
        avgSessionDuration: parseFloat(overviewReport.rows?.[0]?.metricValues?.[4]?.value || "0"),
        newUsers: parseInt(overviewReport.rows?.[0]?.metricValues?.[5]?.value || "0"),
        customerLTV: customerLTV || 0,
      },
      sources: formattedSources,
      trend: formattedTrend,
      pages: formattedPages,
      devices: formattedDevices,
      regions: formattedRegions,
    });
  } catch (error: any) {
    console.error("❌ GA4 API Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

