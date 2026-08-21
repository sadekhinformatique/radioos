"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Radio,
  Music,
  Podcast,
  MessageSquare,
  Heart,
  BarChart3,
  Megaphone,
  Users,
  CreditCard,
  Settings,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Headphones,
  List,
  Code,
  Mail,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Streaming", href: "/dashboard/streaming", icon: Radio },
  { name: "Programmes", href: "/dashboard/programs", icon: List },
  { name: "Émissions", href: "/dashboard/shows", icon: Headphones },
  { name: "Podcasts", href: "/dashboard/podcasts", icon: Podcast },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Dédicaces", href: "/dashboard/dedications", icon: Heart },
  { name: "Sondages", href: "/dashboard/polls", icon: BarChart3 },
  { name: "Publicités", href: "/dashboard/advertising", icon: Megaphone },
  { name: "Utilisateurs", href: "/dashboard/users", icon: Users },
  { name: "Facturation", href: "/dashboard/billing", icon: CreditCard },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
  { name: "API Docs", href: "/dashboard/api-docs", icon: Code },
  { name: "Emails", href: "/dashboard/email-preview", icon: Mail },
];

const secondaryNavigation = [
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-950",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              R
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              RadioOS
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm mx-auto">
            R
          </div>
        )}
      </div>

      <nav className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto py-4 px-3">
        <div className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 dark:border-gray-800">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
          <button
            onClick={() => onCollapse?.(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
}
