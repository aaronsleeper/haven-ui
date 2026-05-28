import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ZardCardComponent } from '@cena/catalog-ui';
import { GetMessagesData } from '@dataconnect/generated';
import { PatientDataService } from '../../services/patient-data.service';
import { ComposeBarComponent } from './compose-bar.component';

type Message = NonNullable<GetMessagesData['patientMessages']>[number];

interface ThreadItem {
  id: string;
  type: 'separator' | 'message';
  label?: string;
  direction?: 'in' | 'out';
  sender?: string;
  body?: string;
  time?: string;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ZardCardComponent, ComposeBarComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {
  private readonly patientData = inject(PatientDataService);

  readonly loading = signal(true);
  readonly messages = signal<Message[]>([]);

  readonly threadItems = computed<ThreadItem[]>(() => this.buildThreadItems(this.messages()));
  readonly hasUnreadIncoming = computed(() =>
    this.messages().some((m) => m.senderRole !== 'patient' && !m.isRead)
  );

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.patientData.getMessages({ limit: 50 });
      this.messages.set(data.patientMessages ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  async onSend(body: string): Promise<void> {
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic: Message = {
      id: tempId,
      senderRole: 'patient',
      senderUid: '',
      body,
      sentAt: new Date().toISOString(),
      isRead: true,
      imageUrl: null,
    };
    this.messages.update((list) => [...list, optimistic]);

    try {
      await this.patientData.sendMessage(body);
      const refreshed = await this.patientData.getMessages({ limit: 50 });
      this.messages.set(refreshed.patientMessages ?? []);
    } catch {
      this.messages.update((list) => list.filter((m) => m.id !== tempId));
    }
  }

  private buildThreadItems(messages: Message[]): ThreadItem[] {
    const items: ThreadItem[] = [];
    const ordered = [...messages].sort(
      (a, b) => this.tsValue(a.sentAt) - this.tsValue(b.sentAt)
    );

    let lastDayKey = '';
    for (const m of ordered) {
      const key = this.dayKey(m.sentAt);
      if (key !== lastDayKey) {
        items.push({ id: `sep-${key}`, type: 'separator', label: this.dayLabel(m.sentAt) });
        lastDayKey = key;
      }
      items.push({
        id: m.id,
        type: 'message',
        direction: m.senderRole === 'patient' ? 'out' : 'in',
        sender: m.senderRole === 'patient' ? undefined : this.senderLabel(m.senderRole),
        body: m.body,
        time: this.formatTime(m.sentAt),
      });
    }

    return items;
  }

  private senderLabel(role: string | null | undefined): string {
    const r = `${role ?? ''}`.trim().toLowerCase();
    if (r === 'dietitian') return 'Dietitian';
    if (r === 'care_coordinator') return 'Care Coordinator';
    if (r === '' || r === 'system') return 'Care Team';
    return r
      .split('_')
      .filter((p) => p.length > 0)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

  private formatTime(ts: string | null | undefined): string {
    const d = this.toDate(ts);
    return d ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';
  }

  private dayLabel(ts: string | null | undefined): string {
    const d = this.toDate(ts);
    if (!d) return 'Earlier';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    if (day.getTime() === today.getTime()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (day.getTime() === yesterday.getTime()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'long', day: 'numeric' });
  }

  private dayKey(ts: string | null | undefined): string {
    const d = this.toDate(ts);
    if (!d) return 'unknown';
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  private tsValue(ts: string | null | undefined): number {
    return this.toDate(ts)?.getTime() ?? 0;
  }

  private toDate(ts: string | null | undefined): Date | null {
    if (!ts) return null;
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? null : d;
  }
}
