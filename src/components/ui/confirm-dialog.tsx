'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from './skeleton';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const variantStyles = {
    danger: {
      icon: 'bg-danger-light text-danger',
      button: 'btn-danger',
    },
    warning: {
      icon: 'bg-warning-light text-warning',
      button: 'btn-primary',
    },
    info: {
      icon: 'bg-info-light text-info',
      button: 'btn-primary',
    },
  };

  const styles = variantStyles[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-modal-backdrop"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
        <div className="bg-surface rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-start gap-4 p-6">
            <div className={cn('p-3 rounded-full', styles.icon)}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-h3 font-semibold text-text-primary">
                {title}
              </h3>
              <p className="mt-2 text-body text-text-secondary">
                {description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-background text-text-tertiary"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              className={cn(styles.button, 'min-w-[100px]')}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>En cours...</span>
                </span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Pre-configured confirmation dialogs
export const ConfirmDialogs = {
  DeletePodcast: ({
    open,
    onClose,
    onConfirm,
    podcastName,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    podcastName: string;
  }) => (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Supprimer le podcast"
      description={`Êtes-vous sûr de vouloir supprimer le podcast "${podcastName}" ? Cette action est irréversible et toutes les données associées seront perdues.`}
      confirmLabel="Supprimer"
      variant="danger"
    />
  ),

  DeleteStream: ({
    open,
    onClose,
    onConfirm,
    streamName,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    streamName: string;
  }) => (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Supprimer le flux"
      description={`Supprimer le flux "${streamName}" ? Les auditeurs connectés seront déconnectés.`}
      confirmLabel="Supprimer"
      variant="danger"
    />
  ),

  RemoveMember: ({
    open,
    onClose,
    onConfirm,
    memberName,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    memberName: string;
  }) => (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Retirer le membre"
      description={`Retirer "${memberName}" de l'équipe ? Il n'aura plus accès au dashboard de la radio.`}
      confirmLabel="Retirer"
      variant="danger"
    />
  ),

  DeleteCampaign: ({
    open,
    onClose,
    onConfirm,
    campaignName,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    campaignName: string;
  }) => (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Supprimer la campagne"
      description={`Supprimer la campagne "${campaignName}" ? Les statistiques associées seront également supprimées.`}
      confirmLabel="Supprimer"
      variant="danger"
    />
  ),

  RejectDedication: ({
    open,
    onClose,
    onConfirm,
    dedicationFrom,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    dedicationFrom: string;
  }) => (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Rejeter la dédicace"
      description={`Rejeter la dédicace de "${dedicationFrom}" ? Cette action est irréversible.`}
      confirmLabel="Rejeter"
      variant="warning"
    />
  ),

  BulkDelete: ({
    open,
    onClose,
    onConfirm,
    count,
    itemType,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    count: number;
    itemType: string;
  }) => (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Supprimer ${count} ${itemType}`}
      description={`Êtes-vous sûr de vouloir supprimer ${count} ${itemType} ? Cette action est irréversible.`}
      confirmLabel={`Supprimer ${count} ${itemType}`}
      variant="danger"
    />
  ),

  UnsavedChanges: ({
    open,
    onClose,
    onConfirm,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) => (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Modifications non sauvegardées"
      description="Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter cette page ?"
      confirmLabel="Quitter"
      cancelLabel="Rester"
      variant="warning"
    />
  ),
};
