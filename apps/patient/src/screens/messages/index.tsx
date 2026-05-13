import { useState } from 'react';
import { useLanguage } from '../../lib/useLanguage';

type AllowedMessageType = 'notification' | 'human_message' | 'status_change_patient';

interface MessageEvent {
  id: string;
  type: AllowedMessageType;
  direction?: 'in' | 'out';
  sender?: { en: string; es: string };
  body: { en: string; es: string };
  timestamp: string; // ISO 8601
  isUnread?: boolean;
}

// CLIENT BACKSTOP: filter enforced here as well as server-side.
// HIPAA defense-in-depth — server-FIRST allowlist is the PRIMARY gate;
// this client filter is the BACKSTOP. Both must be present and tested before ship.
// If a non-allowlist event arrives, drop silently and log P0 to telemetry.
const ALLOWED_TYPES: AllowedMessageType[] = ['notification', 'human_message', 'status_change_patient'];

const DEMO_MESSAGES: MessageEvent[] = [
  {
    id: 'msg-1',
    type: 'human_message',
    direction: 'in',
    sender: { en: 'Sarah K., Care Coordinator', es: 'Sarah K., Coordinadora' },
    body: {
      en: "Your delivery was rescheduled to Wednesday — let me know if that doesn't work for you.",
      es: 'Su entrega se cambió al miércoles — avíseme si no le funciona.',
    },
    timestamp: '2026-05-03T10:15:00Z',
    isUnread: false,
  },
  {
    id: 'msg-2',
    type: 'human_message',
    direction: 'out',
    body: {
      en: 'Wednesday is fine. Thank you!',
      es: 'El miércoles está bien. ¡Gracias!',
    },
    timestamp: '2026-05-03T10:22:00Z',
  },
  {
    id: 'notif-1',
    type: 'notification',
    body: {
      en: 'Your weekly check-in is ready. It takes about 2 minutes.',
      es: 'Su revisión semanal está lista. Toma como 2 minutos.',
    },
    timestamp: '2026-05-03T08:00:00Z',
  },
];

export function Messages() {
  const [lang] = useLanguage();
  const [replyExpanded, setReplyExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Client-backstop: filter non-allowed types
  const safeMessages = DEMO_MESSAGES.filter((m) => ALLOWED_TYPES.includes(m.type));

  function handleSend() {
    if (!replyText.trim()) return;
    // v1: log to console; production: POST to messages API
    console.info('[Messages] Patient reply:', replyText);
    setReplyText('');
    setReplyExpanded(false);
  }

  return (
    <main className="flex flex-col pb-safe-8" aria-label="Messages">
      {/* Header */}
      <div className="p-4">
        <h1 className="page-title">
          {lang === 'es' ? 'Mensajes' : 'Messages'}
        </h1>
        <p className="text-sm text-sand-500 mt-1">
          {lang === 'es' ? 'De su equipo de cuidado.' : 'From your care team.'}
        </p>
      </div>

      {/* Message list */}
      <div
        className="flex-1 overflow-y-auto px-4 space-y-3"
        role="log"
        aria-live="polite"
        aria-label={lang === 'es' ? 'Lista de mensajes' : 'Message list'}
      >
        {safeMessages.map((msg) => {
          if (msg.type === 'notification' || msg.type === 'status_change_patient') {
            return (
              <div key={msg.id} className="notif-item">
                <div className="notif-item-icon notif-item-icon-info" aria-hidden="true">
                  <i className="fa-solid fa-circle-info" />
                </div>
                <div className="notif-item-content">
                  <p className="notif-item-description">{msg.body[lang]}</p>
                  <time
                    className="notif-item-time"
                    dateTime={msg.timestamp}
                  >
                    {new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                    }).format(new Date(msg.timestamp))}
                  </time>
                </div>
              </div>
            );
          }

          if (msg.direction === 'out') {
            return (
              <div key={msg.id} className="flex flex-col items-end">
                <article className="message-bubble-out">
                  <p className="text-sm">{msg.body[lang]}</p>
                </article>
                <time className="message-timestamp" dateTime={msg.timestamp}>
                  {new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
                    hour: 'numeric', minute: '2-digit',
                  }).format(new Date(msg.timestamp))}
                </time>
              </div>
            );
          }

          // direction === 'in'
          return (
            <div key={msg.id} className="flex flex-col items-start">
              {msg.sender && (
                <span className="message-sender-label">{msg.sender[lang]}</span>
              )}
              <article className="message-bubble-in">
                {msg.isUnread && (
                  <span className="message-new-pill mb-1">
                    {lang === 'es' ? 'Nuevo' : 'New'}
                  </span>
                )}
                <p className="text-sm">{msg.body[lang]}</p>
              </article>
              <time className="message-timestamp" dateTime={msg.timestamp}>
                {new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
                  hour: 'numeric', minute: '2-digit',
                }).format(new Date(msg.timestamp))}
              </time>
            </div>
          );
        })}
      </div>

      {/* Reply composer (sticky above bottom-nav) */}
      <div className="sticky bottom-0 border-t border-sand-200 bg-white pb-safe-4">
        {replyExpanded ? (
          <div className="p-3 flex flex-col gap-2">
            <textarea
              className="w-full text-sm rounded-lg border border-sand-200 p-2 resize-none"
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              aria-label={lang === 'es' ? 'Escribir respuesta' : 'Write a reply'}
              placeholder={lang === 'es' ? 'Escriba su mensaje…' : 'Write your message…'}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => { setReplyExpanded(false); setReplyText(''); }}
              >
                {lang === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={handleSend}
                disabled={!replyText.trim()}
              >
                {lang === 'es' ? 'Enviar' : 'Send'}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="flex items-center gap-2 w-full p-3 text-sm text-sand-400 text-left"
            onClick={() => setReplyExpanded(true)}
            aria-label={lang === 'es' ? 'Escribir mensaje' : 'Write a message'}
          >
            <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
            <span>
              {lang === 'es' ? 'Escriba a su coordinadora…' : 'Write to your coordinator…'}
            </span>
          </button>
        )}
      </div>
    </main>
  );
}
