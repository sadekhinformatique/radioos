"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Sign in with email and password
 */
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Translate common Supabase errors to French
    const message = error.message.includes("Invalid login credentials")
      ? "Email ou mot de passe incorrect."
      : error.message.includes("Email not confirmed")
      ? "Veuillez confirmer votre email avant de vous connecter."
      : error.message.includes("Too many requests")
      ? "Trop de tentatives. Veuillez réessayer dans quelques minutes."
      : error.message;

    return { error: message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Register a new user
 */
export async function signUp(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!fullName || !email || !password) {
    return { error: "Tous les champs sont requis." };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    const message = error.message.includes("already registered")
      ? "Un compte existe déjà avec cet email."
      : error.message;

    return { error: message };
  }

  // If user was created successfully, create their profile in public.users
  if (data.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email: email,
      full_name: fullName,
    });

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      // Don't return error to user - the auth account is created,
      // profile can be created later or via database trigger
    }
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    redirect("/login?verified=true");
  }

  redirect("/dashboard");
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email requis." };
  }

  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Update password (after reset)
 */
export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Tous les champs sont requis." };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

/**
 * Sign out
 */
export async function signOut() {
  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Fetch user profile from public.users
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    ...user,
    profile: profile || null,
  };
}

interface RadioMembership {
  id: string;
  role: string;
  is_active: boolean;
  radio: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    is_active: boolean;
  } | null;
}

/**
 * Get current user's radio memberships
 */
export async function getUserRadios(): Promise<RadioMembership[]> {
  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: memberships } = await supabase
    .from("radio_members")
    .select(`
      id,
      role,
      is_active,
      radio:radios (
        id,
        name,
        slug,
        logo_url,
        is_active
      )
    `)
    .eq("user_id", user.id)
    .eq("is_active", true);

  return (memberships as unknown as RadioMembership[]) || [];
}

/**
 * Create a new radio station
 */
export async function createRadio(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const country = formData.get("country") as string;
  const city = formData.get("city") as string;

  if (!name || !slug) {
    return { error: "Le nom et le slug sont requis." };
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets." };
  }

  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  // Check if slug is already taken
  const { data: existingRadio } = await supabase
    .from("radios")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existingRadio) {
    return { error: "Ce slug est déjà utilisé." };
  }

  // Create the radio
  const { data: radio, error: radioError } = await supabase
    .from("radios")
    .insert({
      name,
      slug,
      description,
      country,
      city,
      owner_id: user.id,
    })
    .select()
    .single();

  if (radioError) {
    console.error("Error creating radio:", radioError);
    return { error: "Erreur lors de la création de la radio." };
  }

  // Add user as owner
  const { error: memberError } = await supabase.from("radio_members").insert({
    user_id: user.id,
    radio_id: radio.id,
    role: "owner",
  });

  if (memberError) {
    console.error("Error adding member:", memberError);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/**
 * Update radio settings
 */
export async function updateRadio(radioId: string, formData: FormData) {
  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  // Check if user is authenticated and has permission
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  // Check permission
  const { data: membership } = await supabase
    .from("radio_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("radio_id", radioId)
    .single();

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return { error: "Vous n'avez pas les droits nécessaires." };
  }

  // Update radio
  const updates: Record<string, string> = {};
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const country = formData.get("country") as string;
  const city = formData.get("city") as string;

  if (name) updates.name = name;
  if (description) updates.description = description;
  if (country) updates.country = country;
  if (city) updates.city = city;

  const { error } = await supabase
    .from("radios")
    .update(updates)
    .eq("id", radioId);

  if (error) {
    return { error: "Erreur lors de la mise à jour." };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

/**
 * Send a support ticket
 */
export async function createSupportTicket(formData: FormData) {
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const priority = formData.get("priority") as string;

  if (!subject || !description || !category) {
    return { error: "Tous les champs sont requis." };
  }

  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { error } = await supabase.from("support_tickets").insert({
    user_id: user.id,
    subject,
    description,
    category,
    priority: priority || "normal",
    status: "open",
  });

  if (error) {
    return { error: "Erreur lors de la création du ticket." };
  }

  revalidatePath("/dashboard/support");
  return { success: true };
}

/**
 * Create a new poll
 */
export async function createPoll(formData: FormData) {
  const question = formData.get("question") as string;
  const options = formData.getAll("options") as string[];
  const radioId = formData.get("radioId") as string;

  if (!question || options.length < 2) {
    return { error: "La question et au moins 2 options sont requises." };
  }

  const cookieStore = await import("next/headers").then((m) => m.cookies());
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  // Create poll
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert({
      radio_id: radioId,
      question,
      status: "active",
      created_by: user.id,
    })
    .select()
    .single();

  if (pollError) {
    return { error: "Erreur lors de la création du sondage." };
  }

  // Create options
  const pollOptions = options
    .filter((opt) => opt.trim())
    .map((text, index) => ({
      poll_id: poll.id,
      text,
      position: index,
    }));

  const { error: optionsError } = await supabase
    .from("poll_options")
    .insert(pollOptions);

  if (optionsError) {
    return { error: "Erreur lors de la création des options." };
  }

  revalidatePath("/dashboard/polls");
  return { success: true, pollId: poll.id };
}
