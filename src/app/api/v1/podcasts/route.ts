import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api/response";
import { validateRequest, podcastSchema, paginationSchema } from "@/lib/api/validation";
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
    const category = searchParams.get("category");
    const search = searchParams.get("q");

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
      .from("podcasts")
      .select("*", { count: "exact" })
      .eq("radio_id", user.radio.id);

    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return apiError("Erreur lors de la récupération des podcasts", 500);
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
    const validation = validateRequest(podcastSchema, body);

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
      .from("podcasts")
      .insert({
        ...validation.data,
        radio_id: user.radio.id,
        status: "published",
      })
      .select()
      .single();

    if (error) {
      return apiError("Erreur lors de la création du podcast", 500);
    }

    return apiSuccess(data, 201);
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
