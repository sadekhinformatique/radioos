import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from "@/lib/api/response";
import { validateRequest, radioSchema } from "@/lib/api/validation";
import { getApiUser, requireAuth } from "@/lib/api/auth";

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

    const { data, error } = await supabase
      .from("radios")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return apiNotFound("Radio");
    }

    return apiSuccess(data);
  } catch {
    return apiError("Erreur serveur", 500);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const user = await requireAuth(request);
    if (!user) {
      return apiUnauthorized();
    }

    const body = await request.json();
    const validation = validateRequest(radioSchema.partial(), body);

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

    // Check ownership
    const { data: radio } = await supabase
      .from("radios")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!radio) {
      return apiNotFound("Radio");
    }

    if (radio.owner_id !== user.auth.id && user.profile?.role !== "super_admin") {
      return apiUnauthorized("Vous n'êtes pas propriétaire de cette radio");
    }

    const { data, error } = await supabase
      .from("radios")
      .update({ ...validation.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return apiError("Erreur lors de la mise à jour", 500);
    }

    return apiSuccess(data);
  } catch {
    return apiError("Erreur serveur", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const user = await requireAuth(request);
    if (!user) {
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

    // Check ownership
    const { data: radio } = await supabase
      .from("radios")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!radio) {
      return apiNotFound("Radio");
    }

    if (radio.owner_id !== user.auth.id && user.profile?.role !== "super_admin") {
      return apiUnauthorized("Vous n'êtes pas propriétaire de cette radio");
    }

    // Soft delete - set status to deleted
    const { error } = await supabase
      .from("radios")
      .update({ status: "deleted", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return apiError("Erreur lors de la suppression", 500);
    }

    return apiSuccess({ message: "Radio supprimée avec succès" });
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
