"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ToastProvider } from "@/components/ui/toast";
import { OnboardingBanner } from "@/components/dashboard/onboarding-banner";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
  radio: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export function DashboardShell({ children, user, radio }: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const showOnboarding = !radio && pathname !== "/dashboard/onboarding";

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar
            radioName={radio?.name}
            user={{
              email: user.email,
              profile: {
                full_name: user.full_name,
                avatar_url: user.avatar_url,
              },
            }}
          />
          <main className="flex-1 overflow-y-auto p-6">
            {showOnboarding && <OnboardingBanner />}
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
