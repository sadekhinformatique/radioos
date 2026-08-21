import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api/response";
import { validateRequest, campaignSchema, paginationSchema } from "@/lib/api/validation";
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
      .from("ad_campaigns")
      .select("*, advertiser:advertisers(name, company)", { count: "exact" })
      .eq("radio_id", user.radio.id);

    if (status) {
      query = query.eq("status", status);
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return apiError("Erreur lors de la récupération des campagnes", 500);
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

    const adminRoles = ["owner", "admin"];
    if (!adminRoles.includes(user.membership?.role)) {
      return apiUnauthorized("Permissions insuffisantes");
    }

    const body = await request.json();
    const validation = validateRequest(campaignSchema, body);

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
      .from("ad_campaigns")
      .insert({
        ...validation.data,
        radio_id: user.radio.id,
        status: "draft",
        impressions: 0,
        clicks: 0,
      })
      .select()
      .single();

    if (error) {
      return apiError("Erreur lors de la création de la campagne", 500);
    }

    return apiSuccess(data, 201);
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
