# Task: Patient Messages Screen (CARE-01)
_Generated: 2026-03-12_
_App: patient_

---

## Scope Classification

**Work type:** App only — composing existing patterns; no new components.

**Patterns being used (all verified in components.css):**
- `mobile-shell`, `mobile-app` — body/wrapper (special layout: full-height flex column)
- `mobile-i18n-bar`, `mobile-i18n-toggle` — language bar partial
- `mobile-bottom-nav`, `mobile-bottom-nav-tab`, `mobile-bottom-nav-badge` — nav partial
- `message-bubble-out`, `message-bubble-in` — chat bubbles
- `message-sender-label` — sender name above first bubble in group
- `message-date-sep` — date separator between day groups
- `message-timestamp` — timestamp below bubble
- `message-new-pill` — floating "New message" pill
- `empty-state`, `empty-state-icon` — fallback
- `btn-icon`, `btn-icon-primary` — attach and send buttons

**No new semantic classes needed.** Flag any gap found during audit before writing HTML.

---

## Pre-Build Audit

Before writing any HTML:

1. Read `src/styles/tokens/components.css` — confirm all class names above exist. Note exact `@apply` values for `message-bubble-out`, `message-bubble-in`, and `message-new-pill`.
2. Read `src/partials/patient-i18n-bar.html` and `src/partials/patient-bottom-nav.html` — copy verbatim.
3. Read `apps/patient/meals/index.html` — reference for head, shell, script loading pattern.
4. Read `.project-docs/decisions-log.md` — extract every **"Rule to follow in future prompts"** entry. List and flag applicable ones before proceeding.

---

## Prompt 1: Build `apps/patient/care-team/messages.html`

### File to create
`apps/patient/care-team/messages.html`

First, create the directory if it doesn't exist: `apps/patient/care-team/`

### Shell setup — special full-height layout

This screen uses a different shell layout than other screens. The body must fill the viewport height with the thread scrolling in the middle.

```html
<body class="mobile-app">
  <div class="mobile-shell" style="display: flex; flex-direction: column; height: 100dvh; padding-bottom: 0;">
```

The `.mobile-shell` normally has `pb-[64px]` or similar — override it here to `padding-bottom: 0` via inline style since this screen manages its own spacing. The bottom nav sits inside the flex column at the bottom.

Title: `"Messages — Cena Health"`

### Page structure

**1. i18n bar** — copy verbatim from partial (fixed top)

**2. Header zone** — `<div class="px-4 pt-20 pb-3 shrink-0 border-b border-gray-100">`
- `<h1 class="text-xl" style="font-family: var(--font-serif);">` — "Your Care Team"
- `<p class="text-sm text-gray-500 mt-0.5">` — "Your dietitian and coordinator"

**3. Thread area** — `<div class="flex-1 overflow-y-auto px-4 py-4" id="thread-area">`

This div fills the remaining height between header and compose bar. Build a static hardcoded thread with the following messages in order:

---

**Date separator:**
```html
<div class="message-date-sep">Yesterday</div>
```

**Incoming group — Maria Chen RD:**
```html
<div class="mb-4">
  <p class="message-sender-label">Maria Chen, RD</p>
  <div class="flex flex-col items-start gap-1">
    <div class="message-bubble-in">
      Hi! I've set up your meal plan for next week. You'll see 5 meals — let me know if anything doesn't look right.
    </div>
    <span class="message-timestamp">2:14 PM</span>
  </div>
</div>
```

**Outgoing group — patient:**
```html
<div class="mb-4 flex flex-col items-end">
  <div class="flex flex-col items-end gap-1">
    <div class="message-bubble-out">
      Thanks! The salmon looks great. Can I swap the Wednesday meal?
    </div>
    <span class="message-timestamp text-right">2:31 PM</span>
  </div>
</div>
```

**Incoming group — Maria Chen RD:**
```html
<div class="mb-4">
  <p class="message-sender-label">Maria Chen, RD</p>
  <div class="flex flex-col items-start gap-1">
    <div class="message-bubble-in">
      Of course! You can swap it directly in the Meals tab — just tap "Swap meal" on Wednesday's card.
    </div>
    <span class="message-timestamp">2:45 PM</span>
  </div>
</div>
```

---

**Date separator:**
```html
<div class="message-date-sep">Today</div>
```

**Incoming group — James Rivera:**
```html
<div class="mb-4">
  <p class="message-sender-label">James Rivera</p>
  <div class="flex flex-col items-start gap-1">
    <div class="message-bubble-in">
      Good morning! Just a reminder that your delivery window is Thursday between 11am and 1pm.
    </div>
    <span class="message-timestamp">8:02 AM</span>
  </div>
</div>
```

**Outgoing group — patient:**
```html
<div class="mb-4 flex flex-col items-end">
  <div class="flex flex-col items-end gap-1">
    <div class="message-bubble-out">
      Got it, thank you!
    </div>
    <span class="message-timestamp text-right">8:17 AM</span>
  </div>
</div>
```

---

**4. New message pill** — place inside `#thread-area`, at the bottom of the thread content (static, always visible for prototype):
```html
<div class="message-new-pill" role="status" aria-live="polite">
  <i class="fa-solid fa-arrow-down text-xs" aria-hidden="true"></i>
  <span data-i18n-en="New message" data-i18n-es="Nuevo mensaje">New message</span>
</div>
```

**5. Compose bar** — `<div class="shrink-0 border-t border-gray-100 bg-white px-3 py-3" style="padding-bottom: max(12px, env(safe-area-inset-bottom));">`

Layout:
```html
<div class="flex items-end gap-2">
  <button class="btn-icon shrink-0" aria-label="Attach image" type="button">
    <i class="fa-solid fa-image" aria-hidden="true"></i>
  </button>
  <textarea
    id="compose-input"
    class="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
    rows="1"
    placeholder="Message your care team..."
    aria-label="Message your care team"
    style="max-height: 96px; overflow-y: auto;"
  ></textarea>
  <button class="btn-icon-primary shrink-0" id="btn-send" aria-label="Send message" type="button" disabled>
    <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
  </button>
</div>
```

**6. Bottom nav** — copy verbatim from partial, set "Care Team" tab active (third tab). Add unread badge to the Care Team tab icon with `mobile-bottom-nav-badge`.

Place the bottom nav as the last child inside `.mobile-shell`, after the compose bar. It must be `shrink-0`.

### i18n on thread content
Thread messages are dummy data -- do NOT add `data-i18n-*` attributes to message bubble text. Only the compose placeholder and new message pill need i18n attributes (already specified above).

### Scripts
- `<script src="/src/scripts/components/i18n.js"></script>`
- `<script src="/src/scripts/components/messages-compose.js"></script>`
- `<script src="/src/scripts/main.js" type="module"></script>` — last

### Known Constraints
- **No `<script>` blocks in HTML.**
- **Semantic classes only** on component elements. The compose textarea uses layout utilities (`flex-1`, `resize-none`, `rounded-xl`) directly -- this is acceptable as a one-off form element in the page template.
- **`env(safe-area-inset-bottom)`** on compose bar padding -- required for iOS home indicator clearance.
- **`100dvh`** on `.mobile-shell` -- use `dvh` not `vh` to handle mobile browser chrome correctly.

---

## Prompt 2: Build `src/scripts/components/messages-compose.js`

Create `src/scripts/components/messages-compose.js`.

### Auto-grow textarea

```js
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('compose-input');
  const btnSend = document.getElementById('btn-send');

  if (!textarea || !btnSend) return;

  function updateSendButton() {
    btnSend.disabled = textarea.value.trim().length === 0;
  }

  function autoGrow() {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 96) + 'px';
    updateSendButton();
  }

  textarea.addEventListener('input', autoGrow);

  // Send: append bubble to thread, clear compose
  btnSend.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) return;

    const threadArea = document.getElementById('thread-area');
    const bubble = document.createElement('div');
    bubble.className = 'mb-4 flex flex-col items-end';
    bubble.innerHTML = `
      <div class="flex flex-col items-end gap-1">
        <div class="message-bubble-out">${text}</div>
        <span class="message-timestamp text-right">Just now</span>
      </div>
    `;

    // Insert before the new-message pill if it exists, otherwise append
    const pill = threadArea.querySelector('.message-new-pill');
    if (pill) {
      threadArea.insertBefore(bubble, pill);
    } else {
      threadArea.appendChild(bubble);
    }

    textarea.value = '';
    textarea.style.height = 'auto';
    updateSendButton();
    threadArea.scrollTop = threadArea.scrollHeight;
  });

  // Also send on Enter (not Shift+Enter)
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!btnSend.disabled) btnSend.click();
    }
  });
});
```

### Known Constraints
- No Preline dependencies on this screen.
- Inserted bubble HTML uses semantic classes (`message-bubble-out`, `message-timestamp`) -- not utility chains.

---

## Verification

After both prompts complete, verify at `http://localhost:5173/apps/patient/care-team/messages.html`:

- [ ] Page fills full viewport height -- no scrollbar on body, only thread area scrolls
- [ ] Header is fixed below i18n bar, does not scroll with thread
- [ ] Thread renders all messages in correct order with correct alignment (outgoing right, incoming left)
- [ ] Sender labels appear above first bubble of each group
- [ ] Date separators ("Yesterday", "Today") render between groups
- [ ] Timestamps render below each bubble
- [ ] "New message" pill is visible above compose bar
- [ ] Compose textarea starts at 1 row, grows up to ~4 rows as text is entered
- [ ] Send button disabled when textarea is empty, enabled when text is present
- [ ] Sending a message appends it to the thread and clears the compose area
- [ ] Enter key sends (Shift+Enter does not)
- [ ] Bottom nav renders with Care Team tab active and unread badge visible
- [ ] i18n toggle works on pill and placeholder
- [ ] Compose bar clears iOS home indicator via `env(safe-area-inset-bottom)`
- [ ] No utility class chains on `message-bubble-*` or `message-sender-label` elements
- [ ] No `<script>` blocks in HTML
- [ ] `src/scripts/components/messages-compose.js` exists
- [ ] Dark mode: not applicable
- [ ] No new pattern library files needed
- [ ] ANDREY-README.md: not applicable

---

## Completion Report

After verification passes, output:

```
## Completion Report — Patient Messages Screen (CARE-01)

- New semantic classes added to components.css: [list, or "none"]
- Existing classes modified: [list, or "none"]
- Pattern library files created or updated: [list, or "none"]
- Judgment calls: [list, or "none"]
- Dark mode added: not applicable
- ANDREY-README.md updated: not applicable
- Schema delta logged: not applicable
- Items deferred or incomplete: [list, or "none"]
```

---

## Final Step

```bash
git add -A
git commit -m "feat(patient): add messages screen (CARE-01) with auto-grow compose"
```

Then output:

---
**View your result:**
- http://localhost:5173/apps/patient/care-team/messages.html
---
