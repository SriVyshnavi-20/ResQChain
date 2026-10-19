import { config } from '../config';

const tz = config.timezone;

const dayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
const clockFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true });

export const nowIso = () => new Date().toISOString();
export const minutesAgoIso = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

function dayNumber(d: Date): number {
  const [y, m, day] = dayFmt.format(d).split('-').map(Number);
  return Date.UTC(y, m - 1, day) / 86_400_000;
}

function clockText(d: Date): string {
  return clockFmt.format(d).replace(/[\u202f\u00a0]/g, ' ');
}

/** "Just now", "12 mins ago", "3 hours ago", "Yesterday", "4 days ago" */
export function ago(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return '';
  const d = new Date(iso);
  const mins = Math.floor((now.getTime() - d.getTime()) / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`;
  const days = dayNumber(now) - dayNumber(d);
  if (days <= 1) return 'Yesterday';
  return `${days} days ago`;
}

/**
 * Clock-style timestamp: "Just now", "9:42 AM" (today), "Yesterday", "2 days ago".
 * With withDay, older entries keep their time of day: "Yesterday 4:00 PM".
 */
export function clock(iso: string | null | undefined, opts: { withDay?: boolean } = {}, now = new Date()): string {
  if (!iso) return '';
  const d = new Date(iso);
  const mins = Math.floor((now.getTime() - d.getTime()) / 60_000);
  if (mins < 1) return 'Just now';
  const days = dayNumber(now) - dayNumber(d);
  if (days <= 0) return clockText(d);
  const dayLabel = days === 1 ? 'Yesterday' : `${days} days ago`;
  return opts.withDay ? `${dayLabel} ${clockText(d)}` : dayLabel;
}

/** Time of day in the configured timezone, e.g. "9:42 AM". */
export const timeOfDay = (iso: string) => clockText(new Date(iso));
