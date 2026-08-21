import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api/response";
import { validateRequest, messageSchema, paginationSchema } from "@/lib/api/validation";
import { requireRadioMember } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRadioMember(request);
    if (!user || !user.radio) {
      return apiUnauthorized();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const source = searchParams.get("source");

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

    let query = supabase
      .from("messages")
      .select("*", { count: "exact" })
      .eq("radio_id", user.radio.id);

    if (status) {
      query = query.eq("status", status);
    }

    if (source) {
      query = query.eq("source", source);
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return apiError("Erreur lors de la récupération des messages", 500);
    }

    return apiSuccess(data, 200, {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
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

    const body = await request.json();
    const validation = validateRequest(messageSchema, body);

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
      .from("messages")
      .insert({
        ...validation.data,
        radio_id: user.radio.id,
        status: "unread",
      })
      .select()
      .single();

    if (error) {
      return apiError("Erreur lors de l'envoi du message", 500);
    }

    return apiSuccess(data, 201);
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
