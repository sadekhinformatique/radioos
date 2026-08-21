import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function getApiUser(request: NextRequest) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // API routes can't set cookies from server components
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return { auth: user, profile };
}

export async function requireAuth(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) {
    return null;
  }
  return user;
}

export async function requireRadioMember(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return null;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  // Get user's radio membership
  const { data: membership } = await supabase
    .from("radio_members")
    .select("*, radio:radios(*)")
    .eq("user_id", user.auth.id)
    .single();

  if (!membership) {
    return { ...user, radio: null, membership: null };
  }

  return { ...user, radio: membership.radio, membership };
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireRadioMember(request);
  if (!user) return null;

  const adminRoles = ["owner", "admin", "super_admin"];
  if (!adminRoles.includes(user.profile?.role) && user.profile?.role !== "super_admin") {
    return null;
  }

  return user;
}
