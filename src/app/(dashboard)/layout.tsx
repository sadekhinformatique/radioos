import { redirect } from "next/navigation";
import { getCurrentUser, getUserRadios } from "@/lib/supabase/actions";
import { DashboardShell } from "./dashboard-shell";

interface RadioData {
  id?: string;
  name?: string;
  slug?: string;
  logo_url?: string;
  is_active?: boolean;
}

interface Membership {
  id?: string;
  role?: string;
  is_active?: boolean;
  radio?: RadioData;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const memberships = (await getUserRadios()) as Membership[];
  const firstMembership = memberships.length > 0 ? memberships[0] : null;
  const activeRadio: { id: string; name: string; slug: string } | null =
    firstMembership?.radio
      ? {
          id: String(firstMembership.radio.id || ""),
          name: String(firstMembership.radio.name || ""),
          slug: String(firstMembership.radio.slug || ""),
        }
      : null;

  return (
    <DashboardShell
      user={{
        id: user.id || "",
        email: user.email || "",
        full_name: user.profile?.full_name || user.user_metadata?.full_name,
        avatar_url: user.profile?.avatar_url || user.user_metadata?.avatar_url,
        role: user.profile?.role || user.role,
      }}
      radio={activeRadio}
    >
      {children}
    </DashboardShell>
  );
}
