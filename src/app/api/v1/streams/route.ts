import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api/response";
import { validateRequest, streamSchema } from "@/lib/api/validation";
import { requireAuth, requireRadioMember } from "@/lib/api/auth";

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
      .from("streams")
      .select("*")
      .eq("radio_id", user.radio.id)
      .order("created_at", { ascending: false });

    if (error) {
      return apiError("Erreur lors de la récupération des flux", 500);
    }

    return apiSuccess(data);
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
    const validation = validateRequest(streamSchema, body);

    if (!validation.success) {
      return apiError("Données invalides", 400, validation.errors.map((e) => e.message).join(", "));
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
      .from("streams")
      .insert({
        ...validation.data,
        radio_id: user.radio.id,
        status: "offline",
      })
      .select()
      .single();

    if (error) {
      return apiError("Erreur lors de la création du flux", 500);
    }

    return apiSuccess(data, 201);
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
