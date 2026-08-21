import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

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

    // Get stream details
    const { data: stream, error: streamError } = await supabase
      .from("streams")
      .select("*, radio:radios(id, name, slug)")
      .eq("id", id)
      .single();

    if (streamError || !stream) {
      return apiNotFound("Flux");
    }

    // Get live listener count
    const { count: listenerCount } = await supabase
      .from("analytics")
      .select("*", { count: "exact", head: true })
      .eq("stream_id", id)
      .eq("event_type", "listen_start")
      .gt("recorded_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // Get recent analytics
    const { data: recentAnalytics } = await supabase
      .from("analytics")
      .select("event_type, recorded_at")
      .eq("stream_id", id)
      .order("recorded_at", { ascending: false })
      .limit(100);

    const listeners = listenerCount || 0;

    return apiSuccess({
      stream: {
        id: stream.id,
        url: stream.stream_url,
        type: stream.stream_type,
        bitrate: stream.bitrate,
        codec: stream.codec,
        status: stream.status,
      },
      radio: stream.radio,
      listeners,
      isLive: stream.status === "online",
      lastEvent: recentAnalytics?.[0]?.recorded_at || null,
    });
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
