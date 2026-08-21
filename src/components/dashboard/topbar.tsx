"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { GlobalSearch } from "./global-search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface TopbarProps {
  onMenuToggle?: () => void;
  radioName?: string;
  user?: {
    email?: string;
    profile?: {
      full_name?: string;
      avatar_url?: string;
    } | null;
  } | null;
  onSignOut?: () => Promise<void>;
}

export function Topbar({
  onMenuToggle,
  radioName,
  user,
  onSignOut,
}: TopbarProps) {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  const displayName =
    user?.profile?.full_name || user?.email?.split("@")[0] || "Utilisateur";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    if (!onSignOut) return;
    setSigningOut(true);
    try {
      await onSignOut();
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-sm px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-text-tertiary hover:bg-background hover:text-text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {radioName && (
            <div className="hidden sm:block">
              <span className="text-sm text-text-secondary">
                Radio
              </span>
              <span className="ml-1 text-sm font-medium text-text-primary">
                {radioName}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block">
          <GlobalSearch />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className="relative rounded-lg p-2 text-text-tertiary hover:bg-background hover:text-text-primary"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-medium text-text-inverse">
            3
          </span>
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-background"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-text-inverse">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-text-primary leading-tight">
                {displayName}
              </p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-text-tertiary sm:block" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-surface py-1 shadow-lg">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-medium text-text-primary">
                    {displayName}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {displayEmail}
                  </p>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-background"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Mon profil
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-background"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
                <div className="border-t border-border" />
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger-light"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? "Déconnexion..." : "Déconnexion"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
