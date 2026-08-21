import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api/response";
import { requireRadioMember } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRadioMember(request);
    if (!user || !user.radio) {
      return apiUnauthorized();
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    // Calculate date range
    let dateFrom: Date;
    const dateTo = endDate ? new Date(endDate) : new Date();

    switch (period) {
      case "today":
        dateFrom = new Date();
        dateFrom.setHours(0, 0, 0, 0);
        break;
      case "7d":
        dateFrom = new Date(dateTo);
        dateFrom.setDate(dateFrom.getDate() - 7);
        break;
      case "30d":
        dateFrom = new Date(dateTo);
        dateFrom.setDate(dateFrom.getDate() - 30);
        break;
      case "90d":
        dateFrom = new Date(dateTo);
        dateFrom.setDate(dateFrom.getDate() - 90);
        break;
      case "custom":
        dateFrom = startDate ? new Date(startDate) : new Date(dateTo);
        dateFrom.setDate(dateFrom.getDate() - 7);
        break;
      default:
        dateFrom = new Date(dateTo);
        dateFrom.setDate(dateFrom.getDate() - 7);
    }

    // Get analytics data
    const { data: analytics, error } = await supabase
      .from("analytics")
      .select("*")
      .eq("radio_id", user.radio.id)
      .gte("recorded_at", dateFrom.toISOString())
      .lte("recorded_at", dateTo.toISOString())
      .order("recorded_at", { ascending: true });

    if (error) {
      return apiError("Erreur lors de la récupération des analytics", 500);
    }

    // Calculate summary stats
    const totalListeners = analytics?.filter((a) => a.event_type === "listen_start").length || 0;
    const totalDuration = analytics?.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) || 0;
    const avgDuration = totalListeners > 0 ? Math.round(totalDuration / totalListeners) : 0;

    // Group by day for chart
    const dailyData: Record<string, { listeners: number; duration: number }> = {};
    analytics?.forEach((a) => {
      const day = new Date(a.recorded_at).toISOString().split("T")[0];
      if (!dailyData[day]) {
        dailyData[day] = { listeners: 0, duration: 0 };
      }
      if (a.event_type === "listen_start") {
        dailyData[day].listeners += 1;
      }
      dailyData[day].duration += a.duration_seconds || 0;
    });

    // Group by country
    const countryData: Record<string, number> = {};
    analytics?.forEach((a) => {
      if (a.country) {
        countryData[a.country] = (countryData[a.country] || 0) + 1;
      }
    });

    // Group by device
    const deviceData: Record<string, number> = {};
    analytics?.forEach((a) => {
      if (a.device) {
        deviceData[a.device] = (deviceData[a.device] || 0) + 1;
      }
    });

    return apiSuccess({
      period,
      dateRange: {
        from: dateFrom.toISOString(),
        to: dateTo.toISOString(),
      },
      summary: {
        totalListeners,
        totalDuration,
        avgDuration,
        uniqueCountries: Object.keys(countryData).length,
      },
      daily: Object.entries(dailyData).map(([date, data]) => ({
        date,
        ...data,
      })),
      byCountry: Object.entries(countryData)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      byDevice: Object.entries(deviceData)
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count),
    });
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
