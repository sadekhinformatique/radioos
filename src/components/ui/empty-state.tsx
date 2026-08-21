'use client';

import { ReactNode } from 'react';
import { FileX, Search, FolderOpen, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  variant?: 'default' | 'search' | 'error';
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const defaultIcons = {
    default: <FolderOpen className="w-12 h-12" />,
    search: <Search className="w-12 h-12" />,
    error: <FileX className="w-12 h-12" />,
  };

  return (
    <div className={cn('empty-state', className)}>
      <div className={cn(
        'empty-state-icon',
        variant === 'error' && 'bg-danger-light text-danger',
        variant === 'search' && 'bg-info-light text-info',
        variant === 'default' && 'bg-background text-text-tertiary'
      )}>
        {icon || defaultIcons[variant]}
      </div>
      
      <h3 className="empty-state-title">{title}</h3>
      
      <p className="empty-state-description">{description}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary"
        >
          {action.icon || <Plus className="w-4 h-4" />}
          {action.label}
        </button>
      )}
    </div>
  );
}

// Pre-configured empty states for common scenarios
export const EmptyStates = {
  // First time use
  FirstTime: ({ onAction }: { onAction?: () => void }) => (
    <EmptyState
      title="Bienvenue sur RadioOS !"
      description="Commencez par créer votre première radio ou connecter votre flux existant."
      action={onAction ? { label: 'Créer ma radio', onClick: onAction } : undefined}
    />
  ),

  // No podcasts
  NoPodcasts: ({ onAction }: { onAction?: () => void }) => (
    <EmptyState
      title="Aucun podcast"
      description="Vous n'avez pas encore publié de podcast. Commencez par enregistrer votre premier épisode."
      action={onAction ? { label: 'Créer un podcast', onClick: onAction } : undefined}
    />
  ),

  // No messages
  NoMessages: ({ isFiltered = false }: { isFiltered?: boolean }) => (
    <EmptyState
      variant={isFiltered ? 'search' : 'default'}
      title={isFiltered ? 'Aucun message trouvé' : 'Boîte de réception vide'}
      description={
        isFiltered
          ? 'Aucun message ne correspond à vos filtres. Essayez d\'élargir votre recherche.'
          : 'Vous n\'avez pas encore reçu de messages de vos auditeurs.'
      }
    />
  ),

  // No dedications
  NoDedications: ({ onAction }: { onAction?: () => void }) => (
    <EmptyState
      title="Aucune dédicace"
      description="Aucune dédicace en attente. Vos auditeurs pourront envoyer des dédicaces via WhatsApp ou la page publique."
      action={onAction ? { label: 'Activer les dédicaces', onClick: onAction } : undefined}
    />
  ),

  // No streams
  NoStreams: ({ onAction }: { onAction?: () => void }) => (
    <EmptyState
      title="Aucun flux configuré"
      description="Connectez votre serveur de streaming (Icecast, Shoutcast) pour commencer à diffuser."
      action={onAction ? { label: 'Ajouter un flux', onClick: onAction } : undefined}
    />
  ),

  // No polls
  NoPolls: ({ onAction }: { onAction?: () => void }) => (
    <EmptyState
      title="Aucun sondage"
      description="Créez votre premier sondage pour interagir avec vos auditeurs en direct."
      action={onAction ? { label: 'Créer un sondage', onClick: onAction } : undefined}
    />
  ),

  // No analytics
  NoAnalytics: () => (
    <EmptyState
      title="Pas encore de données"
      description="Les statistiques apparaîtront une fois que votre radio sera en ligne et que des auditeurs se connecteront."
    />
  ),

  // No users/members
  NoUsers: ({ onAction }: { onAction?: () => void }) => (
    <EmptyState
      title="Aucun membre"
      description="Invitez des collaborateurs pour gérer votre radio en équipe."
      action={onAction ? { label: 'Inviter un membre', onClick: onAction } : undefined}
    />
  ),

  // No campaigns
  NoCampaigns: ({ onAction }: { onAction?: () => void }) => (
    <EmptyState
      title="Aucune campagne publicitaire"
      description="Créez votre première campagne pour monétiser votre radio."
      action={onAction ? { label: 'Créer une campagne', onClick: onAction } : undefined}
    />
  ),

  // No notifications
  NoNotifications: () => (
    <EmptyState
      title="Aucune notification"
      description="Vous êtes à jour ! Les nouvelles notifications apparaîtront ici."
    />
  ),

  // Search no results
  SearchNoResults: ({ query }: { query: string }) => (
    <EmptyState
      variant="search"
      title="Aucun résultat"
      description={`Aucun résultat pour "${query}". Essayez avec d'autres termes ou vérifiez l'orthographe.`}
    />
  ),

  // Error state
  Error: ({ onRetry }: { onRetry?: () => void }) => (
    <EmptyState
      variant="error"
      title="Une erreur est survenue"
      description="Impossible de charger les données. Vérifiez votre connexion et réessayez."
      action={onRetry ? { label: 'Réessayer', onClick: onRetry } : undefined}
    />
  ),

  // Plan limit reached
  PlanLimit: ({ feature, onUpgrade }: { feature: string; onUpgrade?: () => void }) => (
    <EmptyState
      variant="error"
      title="Limite atteinte"
      description={`Vous avez atteint la limite de ${feature} de votre plan actuel. Passez à un plan supérieur pour continuer.`}
      action={onUpgrade ? { label: 'Voir les plans', onClick: onUpgrade } : undefined}
    />
  ),
};
