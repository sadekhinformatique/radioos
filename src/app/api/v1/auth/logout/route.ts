import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
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

    const { error } = await supabase.auth.signOut();

    if (error) {
      return apiError("Erreur lors de la déconnexion", 500);
    }

    return apiSuccess({ message: "Déconnexion réussie" });
  } catch {
    return apiError("Erreur lors de la déconnexion", 500);
  }
}
