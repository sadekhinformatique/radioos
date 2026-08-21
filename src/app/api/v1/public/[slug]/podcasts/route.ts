import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api/response";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

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

    // Get radio by slug
    const { data: radio, error: radioError } = await supabase
      .from("radios")
      .select("id, name, slug, logo_url")
      .eq("slug", slug)
      .single();

    if (radioError || !radio) {
      return apiNotFound("Radio");
    }

    // Get published podcasts
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from("podcasts")
      .select("id, title, description, audio_url, duration_seconds, category, created_at", {
        count: "exact",
      })
      .eq("radio_id", radio.id)
      .eq("status", "published")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return apiError("Erreur lors de la récupération des podcasts", 500);
    }

    return apiSuccess(
      {
        radio: {
          id: radio.id,
          name: radio.name,
          slug: radio.slug,
          logoUrl: radio.logo_url,
        },
        podcasts: data,
      },
      200,
      {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    );
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
