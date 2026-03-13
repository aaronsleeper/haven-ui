# Messages

**Navigation Label:** "Messages"

## Screen Overview

Patients view and send secure messages to their care team (providers, coordinators). They can compose new messages, reply to threads, attach files, search message history, and get Ava's help drafting messages or replies.

## Features on Screen

- **Message Inbox** - List of message threads sorted by most recent. Shows sender name, subject, preview text, timestamp, unread badge, attachment icon.
- **Compose Button** - Opens new message modal. Select recipient (from care team), subject line, message body, optional file attachments.
- **Message Thread View** - Click inbox item to open full thread. Shows all messages in conversation with timestamps, sender photos, and message bodies.
- **Reply/Forward** - Reply to current thread or forward to another care team member.
- **Attachments** - Attach images/documents (insurance card, food photos, lab results) to messages. View/download attached files.
- **Search** - Search messages by keyword, sender, or date range.
- **Unread Indicator** - Badge count of unread messages. Bold text for unread threads.

**Key data:** messageId, threadId, senderName, subject, body, timestamp, isRead, attachments, recipientName

## Ava Integration

**Unread messages:** "You have 2 unread messages from Dr. Chen and your care coordinator. Want me to summarize them or help you draft a reply?"

**Composing:** "Who would you like to message? I can help you write a clear message to your dietitian, behavioral health navigator, or care coordinator."

**After appointment:** "Would you like to send a follow-up message to Dr. Chen about your appointment today?"

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Messages          [Compose CLICK]    │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ [🔍 Search]                          │ "You have 2     │
│                                      │ unread messages │
│ INBOX                                │ Want me to      │
│ ┌──────────────────────────────────┐ │ summarize?"     │
│ │ ● Dr. Sarah Chen                 │ │                 │
│ │ Lab results ready                │ │ [Chat input]    │
│ │ "Your A1C results came back..." │ │                 │
│ │ 2 hours ago  [📎]                │ │                 │
│ │ [CLICK TO OPEN]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ ● Care Coordinator               │ │ [Audit log]     │
│ │ Appointment reminder             │ │                 │
│ │ "Your appointment with..."       │ │                 │
│ │ Yesterday                        │ │                 │
│ │ [CLICK TO OPEN]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Dr. John Martinez                │ │                 │
│ │ Re: Stress management tips       │ │                 │
│ │ "Try these breathing exercises" │ │                 │
│ │ Dec 5                            │ │                 │
│ │ [CLICK TO OPEN]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Message recipients:** Can patients message any care team member or only assigned? → **A) Only assigned care team**
- **Real-time:** Push notifications for new messages or email-only alerts? → **A) Both push (if enabled) + email**
- **Message types:** Support urgent/priority flags? → **A) No special flags for v1, treat all as standard**