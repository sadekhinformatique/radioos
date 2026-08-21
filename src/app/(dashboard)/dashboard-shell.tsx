"use client";

import * as React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/supabase/actions";

interface DashboardShellProps {
  children: React.ReactNode;
  user?: {
    email?: string;
    profile?: {
      full_name?: string;
      avatar_url?: string;
    } | null;
  } | null;
  radio?: {
    id?: string;
    name?: string;
    slug?: string;
  } | null;
}

export function DashboardShell({
  children,
  user,
  radio,
}: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 lg:hidden">
            <Sidebar
              collapsed={false}
              onCollapse={() => setMobileMenuOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
        )}
      >
        <Topbar
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          radioName={radio?.name}
          user={user}
          onSignOut={signOut}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
