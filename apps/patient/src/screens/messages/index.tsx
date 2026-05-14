import { useEffect, useState } from 'react';
import { useLanguage } from '../../lib/useLanguage';
import {
  demoCareTeam,
  demoDates,
  demoMessageThread,
  MESSAGE_REPLY_KEY,
} from '../../lib/demo-patient';

type AllowedMessageType = 'notification' | 'human_message' | 'status_change_patient';

interface MessageEvent {
  id: string;
  type: AllowedMessageType;
  direction?: 'in' | 'out';
  sender?: { en: string; es: string };
  body: { en: string; es: string } | string;
  timestamp: string; // ISO 8601
  isUnread?: boolean;
}

// CLIENT BACKSTOP: filter enforced here as well as server-side.
// HIPAA defense-in-depth — server-FIRST allowlist is the PRIMARY gate;
// this client filter is the BACKSTOP. Both must be present and tested before ship.
// If a non-allowlist event arrives, drop silently and log P0 to telemetry.
const ALLOWED_TYPES: AllowedMessageType[] = ['notification', 'human_message', 'status_change_patient'];

// localStorage key for the patient's reply text (so the demo persists across reload).
const REPLY_TEXT_KEY = 'cena-demo-message-reply-text';

function getSenderLabels(): { en: string; es: string } {
  return {
    en: `${demoCareTeam.coordinator.shortName}, Care Coordinator`,
    es: `${demoCareTeam.coordinator.shortName}, Coordinadora`,
  };
}

const DEMO_MESSAGES: MessageEvent[] = [
  {
    id: 'msg-patient-earlier',
    type: 'human_message',
    direction: 'out',
    body: demoMessageThread.patientEarlier,
    timestamp: demoDates.messageFromPatient,
  },
  {
    id: 'notif-checkin',
    type: 'notification',
    body: {
      en: 'Your weekly check-in is ready. It takes about 2 minutes.',
      es: 'Su revisión semanal está lista. Toma como 2 minutos.',
    },
    timestamp: '2026-05-21T14:00:00Z',
  },
  {
    id: 'msg-coordinator-latest',
    type: 'human_message',
    direction: 'in',
    sender: getSenderLabels(),
    body: demoMessageThread.coordinatorLatest,
    timestamp: demoDates.messageFromCoordinator,
    isUnread: true,
  },
];

export function Messages() {
  const [lang] = useLanguage();
  const [replyExpanded, setReplyExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [persistedReply, setPersistedReply] = useState<string | null>(null);

  // Restore previously sent reply from localStorage (survives demo refreshes).
  useEffect(() => {
    try {
      if (localStorage.getItem(MESSAGE_REPLY_KEY) === 'yes') {
        const text = localStorage.getItem(REPLY_TEXT_KEY);
        if (text) setPersistedReply(text);
      }
    } catch {
      // localStorage unavailable — show no persisted reply
    }
  }, []);

  // Once the patient has read the latest coordinator message, suppress the
  // unread pill. The pill should only fire as a "new" beat on cold-start.
  const suppressUnread = persistedReply !== null;
  const safeMessages = DEMO_MESSAGES.filter((m) => ALLOWED_TYPES.includes(m.type)).map((m) =>
    suppressUnread ? { ...m, isUnread: false } : m,
  );

  function handleSend() {
    const text = replyText.trim();
    if (!text) return;
    try {
      localStorage.setItem(MESSAGE_REPLY_KEY, 'yes');
      localStorage.setItem(REPLY_TEXT_KEY, text);
    } catch {
      // localStorage unavailable — state stays in-session only
    }
    setPersistedReply(text);
    setReplyText('');
    setReplyExpanded(false);
  }

  function bodyFor(msg: MessageEvent): string {
    if (typeof msg.body === 'string') return msg.body;
    return msg.body[lang];
  }

  return (
    <div className="flex flex-col pb-safe-8">
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
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div className="notif-item-content">
                  <p className="text-xs font-semibold text-sand-500 mb-1">
                    {lang === 'es' ? 'Recordatorio de cuidado' : 'Care reminder'}
                  </p>
                  <p className="notif-item-description">{bodyFor(msg)}</p>
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
                  <p className="text-sm">{bodyFor(msg)}</p>
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
                <p className="text-sm">{bodyFor(msg)}</p>
              </article>
              <time className="message-timestamp" dateTime={msg.timestamp}>
                {new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
                  hour: 'numeric', minute: '2-digit',
                }).format(new Date(msg.timestamp))}
              </time>
            </div>
          );
        })}

        {/* Patient's reply (after sending) — sits below the thread */}
        {persistedReply && (
          <div className="flex flex-col items-end">
            <article className="message-bubble-out">
              <p className="text-sm">{persistedReply}</p>
            </article>
            <time className="message-timestamp">
              {new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
                hour: 'numeric', minute: '2-digit',
              }).format(new Date())}
            </time>
          </div>
        )}
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
              autoFocus
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
            <span className="material-symbols-outlined" aria-hidden="true">edit</span>
            <span>
              {lang === 'es' ? 'Escriba a su coordinadora…' : 'Write to your coordinator…'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
