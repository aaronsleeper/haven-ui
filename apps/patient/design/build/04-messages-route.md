# Task 04: Messages Route (`/messages`)

## Scope
App only (composing existing PL classes; no new semantic classes)

## Task class
deterministic

## Model tier
sonnet

## Context
The Messages route is the patient's thread equivalent — a strict-allowlist view of coordinator messages, patient replies, and system notifications. It implements the defense-in-depth allowlist pattern: server filters first; the React component filters again as a backstop. At v1 demo, worked-example content from the wireframe is hardcoded. Reply composer is present but sends to console (no real API at v1). All copy is bilingual EN/ES.

## Prerequisites
- Task 01 complete
- Task 02 complete

## Files to Read First
- `apps/patient/design/wireframes/pt-02-messages.md` — layout spec, copy, allowlist pattern, interaction specs
- `apps/patient/design/review-notes.md` — final copy strings (Stage 2 §pt-02-messages)
- `packages/design-system/pattern-library/COMPONENT-INDEX.md` — verify `message-bubble-in`, `message-bubble-out`, `message-sender-label`, `message-date-sep`, `message-new-pill`, `notif-item`, `data-empty-state`

## Instructions

**Style rule:** Use Haven semantic classes for all styled elements. Only use raw Tailwind utilities for layout-specific adjustments unique to this screen.

### Step 1: Create `apps/patient/src/screens/messages/index.tsx`

**Worked-example demo messages (file-top constants):**
```tsx
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
      es: "Su entrega se cambió al miércoles — avíseme si no le funciona.",
    },
    timestamp: '2026-05-03T10:15:00Z',
    isUnread: false,
  },
  {
    id: 'msg-2',
    type: 'human_message',
    direction: 'out',
    body: {
      en: "Wednesday is fine. Thank you!",
      es: "El miércoles está bien. ¡Gracias!",
    },
    timestamp: '2026-05-03T10:22:00Z',
  },
  {
    id: 'notif-1',
    type: 'notification',
    body: {
      en: "Your weekly check-in is ready. It takes about 2 minutes.",
      es: "Su revisión semanal está lista. Toma como 2 minutos.",
    },
    timestamp: '2026-05-03T08:00:00Z',
  },
];
```

**Component:**
```tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/useLanguage';

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
        <h1 className="text-[27.65px] font-serif font-medium text-sand-900">
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
```

**Known Constraints:**
- **HIPAA defense-in-depth:** the `ALLOWED_TYPES` filter above is the CLIENT BACKSTOP. Server-side filtering is the PRIMARY gate. Both must be present and tested before ship. The comment in the code is the marker that dev-tasker implemented the pattern.
- `thread-panel` PL component is NOT imported as a React component here — `ThreadPanel` from `@haven/ui-react` is a structural shell. For pt-02 the message rendering is inline in the route (Tier 1 promotable composition per Stage 3 mapping; promote when kitchen ships its own allowlist). Using `ThreadPanel` from ui-react is acceptable if it fits; inline is the fallback.
- `message-bubble-out`: right-align with `flex flex-col items-end` wrapper (NOT inside the bubble itself — semantic class handles the bubble surface)
- `role="log"` + `aria-live="polite"` on message list — required for accessibility (new arrival announcements)
- `pb-safe-4` on the reply composer's sticky container for iOS home indicator clearance
- `btn-ghost` + `btn-sm`: compose, do not modify
- The word "thread" and "agent" must NEVER appear in any patient-facing string

## Expected Result
- `apps/patient/src/screens/messages/index.tsx` exports `Messages` component
- Renders 3 demo messages (1 incoming, 1 outgoing, 1 system notification) from `DEMO_MESSAGES`
- Client backstop filter drops any non-allowlist type silently
- Reply composer collapses/expands on tap; sends to console at v1
- All strings bilingual EN/ES via `useLanguage()`

## Verification
- [ ] `Messages` exported from `apps/patient/src/screens/messages/index.tsx`
- [ ] `ALLOWED_TYPES` filter implemented (client backstop documented in comments)
- [ ] `role="log"` + `aria-live="polite"` on message list container
- [ ] `pb-safe-4` on sticky reply bar
- [ ] `<main aria-label="Messages">` landmark present
- [ ] No "thread" / "agent" in any string
- [ ] `<time datetime>` ISO 8601 for all timestamps
- [ ] No `style={{}}` attributes
- [ ] Dark mode: not applicable
- [ ] Schema delta: not applicable

## Completion Report

```
## Completion Report — Task 04: Messages Route

- New semantic classes added to components.css: none
- Existing classes modified: none
- Pattern library files created or updated: none
- Judgment calls: none
- Dark mode added: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: none
```

## If Something Goes Wrong
- **`notif-item-icon-info` class not found:** read `components.css` around line 7366 to confirm exact class name (`notif-item-icon-info` vs `notif-item-icon-default`)
- **Reply composer z-index overlapping bottom-nav:** `bottom: 0` on `sticky` positions relative to scroll container; if nav overlaps, add `bottom: 64px` to the sticky container (the `sticky-footer` semantic class handles this — use it if needed)
