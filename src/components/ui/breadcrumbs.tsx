'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Fil d'ariane"
      className={cn('flex items-center gap-1 text-body-sm', className)}
    >
      {/* Home link */}
      <Link
        href="/dashboard"
        className="text-text-tertiary hover:text-text-primary transition-colors p-1"
        aria-label="Retour au tableau de bord"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-text-tertiary" />
          
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                item.current
                  ? 'text-text-primary font-medium'
                  : 'text-text-secondary'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Pre-configured breadcrumbs for common pages
export const BreadcrumbPresets = {
  Dashboard: () => (
    <Breadcrumbs items={[]} />
  ),

  Streaming: () => (
    <Breadcrumbs items={[{ label: 'Streaming', current: true }]} />
  ),

  Podcasts: () => (
    <Breadcrumbs items={[{ label: 'Podcasts', current: true }]} />
  ),

  PodcastEdit: ({ name }: { name: string }) => (
    <Breadcrumbs
      items={[
        { label: 'Podcasts', href: '/dashboard/podcasts' },
        { label: name, current: true },
      ]}
    />
  ),

  Messages: () => (
    <Breadcrumbs items={[{ label: 'Messages', current: true }]} />
  ),

  MessageDetail: ({ id }: { id: string }) => (
    <Breadcrumbs
      items={[
        { label: 'Messages', href: '/dashboard/messages' },
        { label: `Message ${id}`, current: true },
      ]}
    />
  ),

  Dedications: () => (
    <Breadcrumbs items={[{ label: 'Dédicaces', current: true }]} />
  ),

  Shows: () => (
    <Breadcrumbs items={[{ label: 'Émissions', current: true }]} />
  ),

  ShowEdit: ({ name }: { name: string }) => (
    <Breadcrumbs
      items={[
        { label: 'Émissions', href: '/dashboard/shows' },
        { label: name, current: true },
      ]}
    />
  ),

  Programs: () => (
    <Breadcrumbs items={[{ label: 'Programmes', current: true }]} />
  ),

  Analytics: () => (
    <Breadcrumbs items={[{ label: 'Statistiques', current: true }]} />
  ),

  Advertising: () => (
    <Breadcrumbs items={[{ label: 'Publicité', current: true }]} />
  ),

  CampaignEdit: ({ name }: { name: string }) => (
    <Breadcrumbs
      items={[
        { label: 'Publicité', href: '/dashboard/advertising' },
        { label: name, current: true },
      ]}
    />
  ),

  Users: () => (
    <Breadcrumbs items={[{ label: 'Équipe', current: true }]} />
  ),

  Settings: () => (
    <Breadcrumbs items={[{ label: 'Paramètres', current: true }]} />
  ),

  SettingsSection: ({ section }: { section: string }) => (
    <Breadcrumbs
      items={[
        { label: 'Paramètres', href: '/dashboard/settings' },
        { label: section, current: true },
      ]}
    />
  ),

  Billing: () => (
    <Breadcrumbs items={[{ label: 'Facturation', current: true }]} />
  ),

  Notifications: () => (
    <Breadcrumbs items={[{ label: 'Notifications', current: true }]} />
  ),

  Support: () => (
    <Breadcrumbs items={[{ label: 'Support', current: true }]} />
  ),

  SupportTicket: ({ id }: { id: string }) => (
    <Breadcrumbs
      items={[
        { label: 'Support', href: '/dashboard/support' },
        { label: `Ticket ${id}`, current: true },
      ]}
    />
  ),

  Activity: () => (
    <Breadcrumbs items={[{ label: 'Activité', current: true }]} />
  ),

  ApiKeys: () => (
    <Breadcrumbs items={[{ label: 'Clés API', current: true }]} />
  ),

  ApiDocs: () => (
    <Breadcrumbs items={[{ label: 'Documentation API', current: true }]} />
  ),
};
