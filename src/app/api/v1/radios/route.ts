import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiUnauthorized, apiForbidden } from "@/lib/api/response";
import { validateRequest, radioSchema, paginationSchema } from "@/lib/api/validation";
import { getApiUser, requireAuth } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("q");
    const country = searchParams.get("country");

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
      .from("radios")
      .select("*", { count: "exact" })
      .eq("status", "active");

    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    if (country) {
      query = query.eq("country", country);
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return apiError("Erreur lors de la récupération des radios", 500);
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
    const user = await requireAuth(request);
    if (!user) {
      return apiUnauthorized();
    }

    const body = await request.json();
    const validation = validateRequest(radioSchema, body);

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

    // Check if slug is unique
    const { data: existingRadio } = await supabase
      .from("radios")
      .select("id")
      .eq("slug", validation.data.slug)
      .single();

    if (existingRadio) {
      return apiError("Ce slug est déjà utilisé", 409);
    }

    // Create radio
    const { data: radio, error } = await supabase
      .from("radios")
      .insert({
        ...validation.data,
        owner_id: user.auth.id,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return apiError("Erreur lors de la création de la radio", 500);
    }

    // Add user as owner
    await supabase.from("radio_members").insert({
      radio_id: radio.id,
      user_id: user.auth.id,
      role: "owner",
    });

    return apiSuccess(radio, 201);
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
