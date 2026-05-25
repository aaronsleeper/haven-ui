import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';

/**
 * PROVING SLICE — Path C (Angular mechanical emit), AD-08-revisit.
 * Hand-port of haven-ui PL `quantity-stepper` into Andrey's current idioms
 * (cena-health-spark devel @ 2026-05-19): Angular 19 zoneless, standalone,
 * signal input()/output(), @if/@for, separate templateUrl/styleUrl, app- prefix.
 *
 * Contract preserved from `quantity-stepper.js` (events + bounds + a11y),
 * but the IMPLEMENTATION is re-expressed as signals — the vanilla module's
 * self-running IIFE + direct DOM mutation does NOT bind in Angular (it runs at
 * script load, before the component renders, and zoneless Angular owns the DOM).
 * See RESULTS.md for the judgment-call ledger.
 */
export interface QuantityChange {
  value: number;
  previousValue: number;
  source: 'click' | 'set';
}

@Component({
  selector: 'app-quantity-stepper',
  standalone: true,
  templateUrl: './quantity-stepper.component.html',
  styleUrl: './quantity-stepper.component.scss',
})
export class QuantityStepperComponent {
  // Mechanical from PL: data-value/min/max/step → signal inputs (Andrey's input() idiom).
  readonly initial = input<number>(0);
  readonly min = input<number>(0);
  readonly max = input<number>(Number.POSITIVE_INFINITY);
  readonly step = input<number>(1);

  // Mechanical from PL: 'quantity-change' CustomEvent → output() (his idiom).
  readonly quantityChange = output<QuantityChange>();

  // JUDGMENT CALL #1 — internal state. The PL primitive holds `value` in the DOM;
  // zoneless Angular holds it in a signal. linkedSignal (Angular 19) seeds the
  // writable internal value from `initial`, clamped — the idiomatic "writable
  // signal derived from an input" tool. No observed Andrey precedent for stateful
  // components, but signals/zoneless make this the canonical choice.
  protected readonly value = linkedSignal<number>(() => this.clamp(this.initial()));

  // Mechanical: disabled-at-bounds → computed signals bound to [disabled] in template.
  protected readonly atMin = computed(() => this.value() <= this.min());
  protected readonly atMax = computed(() => this.value() >= this.max());

  // JUDGMENT CALL #2 — debounced SR announcement. The PL module debounces the
  // live-region update 400ms (chatty-announce a11y fix). Re-expressed as a signal
  // the template binds; the timer logic ports 1:1 from the vanilla module.
  protected readonly announce = signal<string>('');
  private announceTimer: ReturnType<typeof setTimeout> | null = null;

  decrement(): void {
    this.change(-this.step());
  }

  increment(): void {
    this.change(this.step());
  }

  private change(delta: number): void {
    const previous = this.value();
    const next = this.clamp(previous + delta);
    if (next === previous) return;
    this.value.set(next);
    this.scheduleAnnounce(next);
    this.quantityChange.emit({ value: next, previousValue: previous, source: 'click' });
  }

  private clamp(n: number): number {
    return Math.min(this.max(), Math.max(this.min(), n));
  }

  private scheduleAnnounce(v: number): void {
    if (this.announceTimer) {
      clearTimeout(this.announceTimer);
    }
    this.announceTimer = setTimeout(() => this.announce.set(String(v)), 400);
  }
}
