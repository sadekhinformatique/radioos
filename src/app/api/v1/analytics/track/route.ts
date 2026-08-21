import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

const trackEventSchema = z.object({
  radioId: z.string().uuid(),
  streamId: z.string().uuid().optional(),
  eventType: z.enum([
    "listen_start",
    "listen_end",
    "podcast_play",
    "podcast_pause",
    "podcast_complete",
    "page_view",
    "share",
    "download",
  ]),
  eventData: z.record(z.string(), z.unknown()).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  device: z.string().optional(),
  os: z.string().optional(),
  browser: z.string().optional(),
  quality: z.string().optional(),
  durationSeconds: z.number().optional(),
  listenerSessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = trackEventSchema.safeParse(body);

    if (!validation.success) {
      return apiError("Données invalides", 400);
    }

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

    const { error } = await supabase.from("analytics").insert({
      radio_id: validation.data.radioId,
      stream_id: validation.data.streamId || null,
      event_type: validation.data.eventType,
      event_data: validation.data.eventData || {},
      country: validation.data.country || null,
      city: validation.data.city || null,
      device: validation.data.device || null,
      os: validation.data.os || null,
      browser: validation.data.browser || null,
      quality: validation.data.quality || null,
      duration_seconds: validation.data.durationSeconds || null,
      listener_session_id: validation.data.listenerSessionId || null,
      recorded_at: new Date().toISOString(),
    });

    if (error) {
      return apiError("Erreur lors de l'enregistrement de l'événement", 500);
    }

    return apiSuccess({ message: "Événement enregistré" }, 201);
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
