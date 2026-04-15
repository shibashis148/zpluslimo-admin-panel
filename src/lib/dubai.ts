// ─── Centralised Dubai timezone & helper utilities ───────────────────────────

export const DUBAI_TZ = 'Asia/Dubai';

export function dubaiNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: DUBAI_TZ }));
}

export function fmtDubaiTime(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleString('en-AE', {
    timeZone: DUBAI_TZ,
    hour: '2-digit', minute: '2-digit',
    ...opts,
  });
}

export function fmtDubaiDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AE', {
    timeZone: DUBAI_TZ,
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function dubaiFullDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-AE', {
    timeZone: DUBAI_TZ,
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function minutesAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

export function fmtCurrency(amount: number): string {
  return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Driver score → classification
export function scoreClass(score: number): 'top_performer' | 'acceptable' | 'underperformer' | 'critical_review' {
  if (score >= 85) return 'top_performer';
  if (score >= 70) return 'acceptable';
  if (score >= 50) return 'underperformer';
  return 'critical_review';
}

// Compute driver score from raw metrics (formula per spec)
export function computeDriverScore(m: {
  revenueEfficiency: number;  // 0–100
  tripCount: number;           // 0–100
  idleTimeControl: number;     // 0–100
  acceptanceRate: number;      // 0–100
  cancellationControl: number; // 0–100 (100 = no cancellations)
  onlineDiscipline: number;    // 0–100
  complaintRating: number;     // 0–100
}): number {
  return Math.round(
    m.revenueEfficiency  * 0.25 +
    m.tripCount          * 0.20 +
    m.idleTimeControl    * 0.15 +
    m.acceptanceRate     * 0.10 +
    m.cancellationControl* 0.10 +
    m.onlineDiscipline   * 0.10 +
    m.complaintRating    * 0.10
  );
}
