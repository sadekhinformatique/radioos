import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api/response";
import { requireRadioMember } from "@/lib/api/auth";
import { z } from "zod";

const webhookSchema = z.object({
  url: z.string().url("URL invalide"),
  events: z.array(z.string()).min(1, "Au moins un événement requis"),
  secret: z.string().optional(),
});

const availableEvents = [
  "stream.online",
  "stream.offline",
  "message.received",
  "dedication.created",
  "dedication.approved",
  "poll.created",
  "poll.voted",
  "podcast.published",
  "campaign.started",
  "campaign.ended",
  "listener.milestone",
];

export async function GET(request: NextRequest) {
  try {
    const user = await requireRadioMember(request);
    if (!user || !user.radio) {
      return apiUnauthorized();
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

    const { data, error } = await supabase
      .from("webhooks")
      .select("*")
      .eq("radio_id", user.radio.id)
      .order("created_at", { ascending: false });

    if (error) {
      return apiError("Erreur lors de la récupération des webhooks", 500);
    }

    return apiSuccess({
      webhooks: data,
      availableEvents,
    });
  } catch {
    return apiError("Erreur serveur", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRadioMember(request);
    if (!user || !user.radio) {
      return apiUnauthorized();
    }

    const adminRoles = ["owner", "admin"];
    if (!adminRoles.includes(user.membership?.role)) {
      return apiUnauthorized("Permissions insuffisantes");
    }

    const body = await request.json();
    const validation = webhookSchema.safeParse(body);

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

    // Generate secret if not provided
    const secret = validation.data.secret || `whsec_${Math.random().toString(36).substring(2)}`;

    const { data, error } = await supabase
      .from("webhooks")
      .insert({
        url: validation.data.url,
        events: validation.data.events,
        secret,
        radio_id: user.radio.id,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return apiError("Erreur lors de la création du webhook", 500);
    }

    return apiSuccess(data, 201);
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
