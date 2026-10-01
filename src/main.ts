import { Component, computed, signal, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

type Stage = 'ask' | 'date' | 'done';

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

@Component({
  selector: 'app-root',
  template: `
<div class="sky" aria-hidden="true"></div>

<main class="wrap">
  @switch (stage()) {
    @case ('date') {
      <section class="card">
        <p class="eyebrow">من حمد · إلى ضحى</p>
        <h1 class="display">دعوة عشاء</h1>

        <div class="ticket">
          <div class="ticket-row">
            <span class="label">الموعد</span>
            <span class="value">عشاء لشخصين</span>
          </div>
          <div class="ticket-row">
            <span class="label">اليوم</span>
            <span class="value">باجر · الجمعة ٢ أكتوبر</span>
          </div>
          <div class="ticket-row">
            <span class="label">الساعة</span>
            <span class="value">١٢:٠٠ منتصف الليل</span>
          </div>
          <div class="ticket-row">
            <span class="label">الحضور</span>
            <span class="value">حمد و ضحى</span>
          </div>
        </div>

        <div class="actions">
          <button
            id="accept-date"
            class="btn yes dodge"
            (click)="onYes($event)"
          >
            {{ yesLabel() }}
          </button>
        </div>
      </section>
    }

    @case ('done') {
      <section class="card done">
        <p class="eyebrow">تأكيد رسمي</p>
        <h1 class="display">حمد ♥ ضحى</h1>

        <ul class="stamps">
          <li><span class="tick">✓</span> يا من حظك يا حمد، ضحى وافقت على موعد العشاء</li>
          <li><span class="tick">✓</span> باجر الجمعة · الساعة ١٢ منتصف الليل</li>
        </ul>

        <p class="when">وقت الموافقة: {{ acceptedAt() }}</p>

        <div class="shot">
          <strong>آخر خطوة:</strong>
          كبجري الشاشة (سكرين شوت) ودزيها لحمد
        </div>
      </section>
    }
  }
</main>

@for (h of hearts(); track h.id) {
  <span
    class="heart"
    aria-hidden="true"
    [style.left.%]="h.left"
    [style.font-size.px]="h.size"
    [style.animation-delay.s]="h.delay"
    [style.animation-duration.s]="h.duration"
    >♥</span
  >
}
`,
  styles: `
/* Layout: one centered card over a midnight sky — the date is at midnight */
:host {
  display: block;
  min-height: 100%;
}

.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(1.5px 1.5px at 12% 18%, var(--star) 50%, transparent 51%),
    radial-gradient(1px 1px at 28% 72%, var(--star) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 44% 12%, var(--star) 50%, transparent 51%),
    radial-gradient(1px 1px at 63% 38%, var(--star) 50%, transparent 51%),
    radial-gradient(2px 2px at 82% 22%, var(--star) 50%, transparent 51%),
    radial-gradient(1px 1px at 90% 66%, var(--star) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 8% 88%, var(--star) 50%, transparent 51%),
    radial-gradient(1px 1px at 54% 90%, var(--star) 50%, transparent 51%),
    radial-gradient(ellipse at 50% 120%, var(--glow), transparent 60%),
    var(--bg);
}

.wrap {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding-inline: 16px;
  padding-block: 32px;
  box-sizing: border-box;
}

.card {
  width: 100%;
  max-width: 460px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 36px 28px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: rise 1s ease-out both;
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  color: var(--gold);
}

.display {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2rem, 8vw, 2.8rem);
  line-height: 1.35;
  color: var(--fg);
  text-wrap: balance;
}

.actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 6px;
}

.btn {
  font-family: inherit;
  font-size: 1.15rem;
  font-weight: 600;
  border-radius: 999px;
  padding: 12px 34px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.15s ease, background 0.2s ease;
}

.btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.btn.yes {
  background: var(--rose);
  color: var(--on-rose);
}

.btn.yes.dodge {
  position: relative;
  min-width: 220px;
  box-sizing: border-box;
  z-index: 5;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  will-change: transform;
}

.ticket {
  border: 1px dashed var(--gold-dim);
  border-radius: 14px;
  padding: 6px 18px;
  text-align: start;
}

.ticket-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-block: 12px;
  border-bottom: 1px solid var(--line);
}

.ticket-row:last-child {
  border-bottom: 0;
}

.label {
  color: var(--muted);
  font-size: 0.9rem;
}

.value {
  color: var(--fg);
  font-weight: 600;
}

.stamps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: start;
}

.stamps li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--fg);
  font-size: 1.05rem;
}

.tick {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 50%;
  background: var(--gold);
  color: var(--bg);
  font-size: 0.85rem;
  font-weight: 700;
}

.when {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
}

.shot {
  background: var(--rose-soft);
  border-radius: 14px;
  padding: 14px 16px;
  color: var(--fg);
  line-height: 1.7;
}

.heart {
  position: fixed;
  bottom: -40px;
  z-index: 10;
  color: var(--rose);
  pointer-events: none;
  animation-name: float-up;
  animation-timing-function: ease-in;
  animation-fill-mode: both;
}

@keyframes float-up {
  0% { transform: translateY(0) rotate(0); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(-110vh) rotate(25deg); opacity: 0; }
}

@keyframes rise {
  from { transform: translateY(12px); opacity: 0.4; }
  to { transform: none; opacity: 1; }
}

`,
})
export class App {
  protected readonly stage = signal<Stage>('date');

  // كم مرة هرب الزر
  protected readonly dodges = signal(0);
  protected readonly maxDodges = 3;
  protected readonly offset = signal({ x: 0, y: 0 });

  protected readonly hearts = signal<Heart[]>([]);
  protected readonly acceptedAt = signal('');

  protected readonly yesLabel = computed(
    () => ['موافقة', 'متأكدة؟', 'أكيد أكيد؟', 'آخر فرصة تفكرين!'][Math.min(this.dodges(), 3)]
  );

  protected onYes(ev: Event): void {
    if (this.dodges() < this.maxDodges) {
      this.dodges.update((d) => d + 1);
      this.moveYes(ev.currentTarget as HTMLElement);
      return;
    }
    this.acceptDate();
  }

  protected acceptDate(): void {
    const now = new Date();
    this.acceptedAt.set(
      now.toLocaleString('ar-KW', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: '2-digit',
      })
    );
    this.celebrate();
    this.stage.set('done');
  }

  private moveYes(btn: HTMLElement): void {
    const r = btn.getBoundingClientRect();
    const cur = this.offset();
    // مكان الزر الأصلي (بدون الإزاحة الحالية)
    const baseL = r.left - cur.x;
    const baseT = r.top - cur.y;
    const pad = 16;
    const minX = pad - baseL;
    const maxX = window.innerWidth - pad - r.width - baseL;
    const minY = pad - baseT;
    const maxY = window.innerHeight - pad - r.height - baseT;
    const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

    // حركة قريبة: ٧٠–١٣٠ بكسل بعيد عن مكانه الحالي
    let x = cur.x;
    let y = cur.y;
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 60;
      x = clamp(cur.x + Math.cos(angle) * dist, minX, maxX);
      y = clamp(cur.y + Math.sin(angle) * dist * 0.7, minY, maxY);
      if (Math.hypot(x - cur.x, y - cur.y) > 50) break;
    }
    this.offset.set({ x, y });

    // أنيميشن بالـ Web Animations API عشان يشتغل على الآيفون (Safari)
    const from = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
    const to = `translate3d(${x}px, ${y}px, 0)`;
    btn.style.transform = to;
    btn.animate(
      [
        { transform: from },
        { transform: `translate3d(${cur.x + (x - cur.x) * 1.08}px, ${cur.y + (y - cur.y) * 1.08}px, 0)`, offset: 0.75 },
        { transform: to },
      ],
      { duration: 700, easing: 'ease-out' }
    );
  }

  private celebrate(): void {
    const base = Date.now();
    const batch: Heart[] = Array.from({ length: 28 }, (_, i) => ({
      id: base + i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 5 + Math.random() * 3,
      size: 14 + Math.random() * 22,
    }));
    this.hearts.set(batch);
    setTimeout(() => this.hearts.set([]), 10500);
  }
}

bootstrapApplication(App, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
}).catch((err) => console.error(err));
