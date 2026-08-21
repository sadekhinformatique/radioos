import { createClient } from "@/utils/supabase/client";

export interface ActivityLog {
  id: string;
  user_id: string;
  radio_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  "auth.login": "Connexion",
  "auth.logout": "Déconnexion",
  "auth.register": "Inscription",
  "radio.create": "Radio créée",
  "radio.update": "Radio mise à jour",
  "radio.delete": "Radio supprimée",
  "stream.create": "Flux ajouté",
  "stream.update": "Flux modifié",
  "stream.delete": "Flux supprimé",
  "podcast.create": "Podcast publié",
  "podcast.update": "Podcast modifié",
  "podcast.delete": "Podcast supprimé",
  "message.read": "Message lu",
  "message.archive": "Message archivé",
  "message.delete": "Message supprimé",
  "dedication.approve": "Dédicace approuvée",
  "dedication.reject": "Dédicace rejetée",
  "dedication.play": "Dédicace diffusée",
  "poll.create": "Sondage créé",
  "poll.close": "Sondage fermé",
  "poll.vote": "Vote enregistré",
  "user.invite": "Utilisateur invité",
  "user.remove": "Utilisateur retiré",
  "user.role_change": "Rôle modifié",
  "settings.update": "Paramètres mis à jour",
  "settings.api_key_create": "Clé API créée",
  "settings.api_key_delete": "Clé API supprimée",
  "billing.upgrade": "Plan mis à niveau",
  "billing.downgrade": "Plan rétrogradé",
  "billing.payment": "Paiement effectué",
};

export async function logActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  radioId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string
) {
  try {
    const supabase = createClient();
    await supabase.from("activity_logs").insert({
      user_id: userId,
      radio_id: radioId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || {},
      ip_address: ipAddress,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function getActivityLogs(
  radioId: string,
  options?: {
    limit?: number;
    offset?: number;
    action?: string;
    entityType?: string;
  }
): Promise<ActivityLog[]> {
  try {
    const supabase = createClient();

    let query = supabase
      .from("activity_logs")
      .select("*")
      .eq("radio_id", radioId)
      .order("created_at", { ascending: false });

    if (options?.action) {
      query = query.eq("action", options.action);
    }

    if (options?.entityType) {
      query = query.eq("entity_type", options.entityType);
    }

    const limit = options?.limit || 50;
    const offset = options?.offset || 0;
    const { data } = await query.range(offset, offset + limit - 1);

    return data || [];
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    return [];
  }
}

export function getActionLabel(action: string): string {
  return ACTION_LABELS[action] || action;
}

export function getActionColor(action: string): string {
  if (action.startsWith("auth.")) return "text-blue-600 bg-blue-100";
  if (action.startsWith("radio.")) return "text-purple-600 bg-purple-100";
  if (action.startsWith("stream.")) return "text-emerald-600 bg-emerald-100";
  if (action.startsWith("podcast.")) return "text-pink-600 bg-pink-100";
  if (action.startsWith("message.")) return "text-orange-600 bg-orange-100";
  if (action.startsWith("dedication.")) return "text-rose-600 bg-rose-100";
  if (action.startsWith("poll.")) return "text-indigo-600 bg-indigo-100";
  if (action.startsWith("user.")) return "text-cyan-600 bg-cyan-100";
  if (action.startsWith("settings.")) return "text-gray-600 bg-gray-100";
  if (action.startsWith("billing.")) return "text-amber-600 bg-amber-100";
  return "text-gray-600 bg-gray-100";
}
