import { NextResponse } from "next/server";

function parseISO8601Duration(duration: string) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  const secsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  if (hours > 0) {
    const minsStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${minsStr}:${secsStr}`;
  }
  return `${minutes}:${secsStr}`;
}

function formatViews(viewsStr: string) {
  const views = parseInt(viewsStr || "0");
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
  return `${views} views`;
}

export async function GET() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const apiKey = process.env.YOUTUBE_API;

  if (!channelId || !apiKey) {
    return NextResponse.json({ error: "YouTube API credentials not configured in .env.local" }, { status: 500 });
  }

  try {
    const [channelRes, searchRes] = await Promise.all([
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`,
        { next: { revalidate: 1800 } }
      ),
      fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6&type=video`,
        { next: { revalidate: 1800 } }
      ),
    ]);

    const channelData = await channelRes.json();
    const searchData = await searchRes.json();

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json({ error: "YouTube Channel not found." }, { status: 404 });
    }

    const item = channelData.items[0];
    const snippet = item.snippet || {};
    const stats = item.statistics || {};

    const rawVideoIds = (searchData.items || [])
      .map((v: any) => v.id?.videoId)
      .filter(Boolean)
      .join(",");

    let recentVideos: any[] = [];

    if (rawVideoIds) {
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${rawVideoIds}`,
        { next: { revalidate: 1800 } }
      );
      const detailsData = await detailsRes.json();

      recentVideos = (detailsData.items || []).map((v: any) => ({
        id: v.id,
        title: v.snippet?.title || "",
        description: v.snippet?.description || "",
        publishedAt: v.snippet?.publishedAt || "",
        thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url || "",
        duration: parseISO8601Duration(v.contentDetails?.duration || ""),
        views: formatViews(v.statistics?.viewCount || "0"),
        url: `https://www.youtube.com/watch?v=${v.id}`,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
      }));
    }

    return NextResponse.json({
      success: true,
      title: snippet.title || "Sierra Fish & Pets",
      customUrl: snippet.customUrl || "@sierrafishpetsrenton",
      thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "",
      subscriberCount: parseInt(stats.subscriberCount || "0"),
      viewCount: parseInt(stats.viewCount || "0"),
      videoCount: parseInt(stats.videoCount || "0"),
      recentVideos,
    });
  } catch (error: any) {
    console.error("❌ YouTube API Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
