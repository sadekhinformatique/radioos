// WhatsApp Business API Integration for RadioOS
// Official API only - no scraping

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// WhatsApp API Configuration
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || '';

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
  INTERACTIVE: 'interactive',
  TEMPLATE: 'template',
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

// Interactive message types
export const INTERACTIVE_TYPES = {
  BUTTON: 'button',
  LIST: 'list',
} as const;

interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: MessageType;
  text?: { body: string; preview_url?: boolean };
  image?: { id: string; caption?: string };
  audio?: { id: string };
  interactive?: {
    type: string;
    header?: { type: string; text?: string; image?: { id: string } };
    body: { text: string };
    action: {
      buttons?: Array<{ type: string; reply: { id: string; title: string } }>;
      sections?: Array<{
        title: string;
        rows: Array<{ id: string; title: string; description?: string }>;
      }>;
    };
  };
  template?: {
    name: string;
    language: { code: string };
    components?: Array<{
      type: string;
      parameters: Array<{ type: string; text?: string; image?: { id: string } }>;
    }>;
  };
}

interface WebhookMessage {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { id: string; mime_type: string };
          audio?: { id: string; mime_type: string };
          interactive?: {
            type: string;
            button_reply?: { id: string; title: string };
            list_reply?: { id: string; title: string; description?: string };
          };
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

/**
 * Send a text message via WhatsApp
 */
export async function sendWhatsAppText(
  to: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Erreur d\'envoi',
      };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur réseau',
    };
  }
}

/**
 * Send an interactive poll via WhatsApp
 * Used for: polls, dedication confirmations, menu navigation
 */
export async function sendWhatsAppPoll(
  to: string,
  question: string,
  options: Array<{ id: string; title: string; description?: string }>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'list',
            body: { text: question },
            action: {
              sections: [
                {
                  title: 'Options',
                  rows: options.map((opt) => ({
                    id: opt.id,
                    title: opt.title,
                    description: opt.description,
                  })),
                },
              ],
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Erreur d\'envoi',
      };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur réseau',
    };
  }
}

/**
 * Send a button-based message via WhatsApp
 */
export async function sendWhatsAppButtons(
  to: string,
  message: string,
  buttons: Array<{ id: string; title: string }>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: message },
            action: {
              buttons: buttons.map((btn) => ({
                type: 'reply',
                reply: { id: btn.id, title: btn.title },
              })),
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Erreur d\'envoi',
      };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur réseau',
    };
  }
}

/**
 * Process incoming WhatsApp webhook message
 */
export async function processIncomingMessage(
  webhookData: WebhookMessage
): Promise<{
  type: 'message' | 'status' | 'unknown';
  data?: Record<string, unknown>;
}> {
  try {
    const entry = webhookData.entry[0];
    const change = entry.changes[0];
    const value = change.value;

    // Handle messages
    if (value.messages && value.messages.length > 0) {
      const message = value.messages[0];
      const contact = value.contacts?.[0];

      // Store message in database
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);

      // Find which radio this number belongs to
      const { data: radioMapping } = await supabase
        .from('whatsapp_numbers')
        .select('radio_id')
        .eq('phone_number', message.from)
        .single();

      if (radioMapping) {
        // Store the message
        await supabase.from('messages').insert({
          radio_id: radioMapping.radio_id,
          sender_name: contact?.profile?.name || 'Inconnu',
          sender_phone: message.from,
          content: message.text?.body || `[Message ${message.type}]`,
          channel: 'whatsapp',
          whatsapp_message_id: message.id,
          metadata: {
            type: message.type,
            image: message.image,
            audio: message.audio,
            interactive: message.interactive,
          },
        });

        // If it's a poll reply, record the vote
        if (message.interactive?.type === 'list_reply' && message.interactive.list_reply) {
          await supabase.from('poll_votes').insert({
            poll_id: message.interactive.list_reply.id,
            radio_id: radioMapping.radio_id,
            option_id: message.interactive.list_reply.id,
            voter_ip_hash: undefined, // WhatsApp doesn't provide IP
            voter_identifier: message.from,
            channel: 'whatsapp',
          });
        }
      }

      return {
        type: 'message',
        data: {
          from: message.from,
          fromName: contact?.profile?.name,
          type: message.type,
          content: message.text?.body,
          messageId: message.id,
          timestamp: message.timestamp,
        },
      };
    }

    // Handle status updates
    if (value.statuses && value.statuses.length > 0) {
      const status = value.statuses[0];
      return {
        type: 'status',
        data: {
          messageId: status.id,
          status: status.status,
          timestamp: status.timestamp,
          recipientId: status.recipient_id,
        },
      };
    }

    return { type: 'unknown' };
  } catch (error) {
    console.error('[WHATSAPP] Error processing message:', error);
    return { type: 'unknown' };
  }
}

/**
 * Send dedication notification to radio
 */
export async function notifyRadioNewDedication(
  radioId: string,
  dedication: {
    senderName: string;
    recipientName: string;
    message: string;
    audioUrl?: string;
  }
): Promise<void> {
  // Get radio owner's WhatsApp number
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: owner } = await supabase
    .from('radio_members')
    .select('user_id, users!inner(whatsapp_number)')
    .eq('radio_id', radioId)
    .eq('role', 'owner')
    .single();

  if (owner && (owner as any).users?.whatsapp_number) {
    await sendWhatsAppText(
      (owner as any).users.whatsapp_number,
      `🎙️ Nouvelle dédicace !\n\n` +
      `De: ${dedication.senderName}\n` +
      `Pour: ${dedication.recipientName}\n` +
      `Message: "${dedication.message}"\n\n` +
      `Connectez-vous au dashboard pour la modérer.`
    );
  }
}

/**
 * Send stream offline alert
 */
export async function notifyStreamOffline(
  radioId: string,
  streamName: string
): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Get all moderators and admins
  const { data: members } = await supabase
    .from('radio_members')
    .select('user_id, users!inner(whatsapp_number)')
    .eq('radio_id', radioId)
    .in('role', ['owner', 'admin', 'moderator']);

  if (members) {
    for (const member of members) {
      const whatsappNumber = (member as any).users?.whatsapp_number;
      if (whatsappNumber) {
        await sendWhatsAppText(
          whatsappNumber,
          `⚠️ Flux "${streamName}" est hors ligne !\n\n` +
          `Vérifiez votre équipement de diffusion.`
        );
      }
    }
  }
}

/**
 * Verify WhatsApp webhook signature
 */
export function verifyWhatsAppSignature(
  body: string,
  signature: string | null
): boolean {
  if (!signature || !process.env.WHATSAPP_APP_SECRET) {
    return false;
  }

  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
    .update(body)
    .digest('hex');

  return signature === `sha256=${expectedSignature}`;
}
