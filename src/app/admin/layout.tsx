import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/actions";
import { AdminShell } from "./admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // In production, check if user has SUPER_ADMIN role
  // For now, allow all authenticated users to view admin (demo mode)

  return (
    <AdminShell
      user={{
        email: user.email,
        profile: user.profile,
      }}
    >
      {children}
    </AdminShell>
  );
}
