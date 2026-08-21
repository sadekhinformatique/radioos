import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError } from "@/lib/api/response";
import { validateRequest, registerSchema } from "@/lib/api/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateRequest(registerSchema, body);

    if (!validation.success) {
      return apiError("Données invalides", 400, validation.errors.map((e) => e.message).join(", "));
    }

    const { email, password, fullName, radioName } = validation.data;

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

    // Register user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return apiError("Erreur lors de l'inscription", 400, error.message);
    }

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "owner",
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      // If radio name provided, create radio
      if (radioName) {
        const slug = radioName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const { data: radio, error: radioError } = await supabase
          .from("radios")
          .insert({
            name: radioName,
            slug,
            owner_id: data.user.id,
          })
          .select()
          .single();

        if (!radioError && radio) {
          // Add user as owner of the radio
          await supabase.from("radio_members").insert({
            radio_id: radio.id,
            user_id: data.user.id,
            role: "owner",
          });
        }
      }
    }

    return apiSuccess(
      {
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email,
            }
          : null,
        message: "Compte créé avec succès. Vérifiez votre email pour confirmer votre inscription.",
      },
      201
    );
  } catch {
    return apiError("Erreur lors de l'inscription", 500);
  }
}
