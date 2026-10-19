import type { TimelineEvent as TimelineDto } from '../../src/types';
import { clock } from './time';

export interface StoredEvent {
  title: string;
  subtitle: string;
  at: string | null;
  completed: boolean;
}

export const STEP = {
  submitted: 'Request Submitted',
  matched: 'Matched to Responder',
  enroute: 'Responder Enroute',
  resolved: 'Resolved and Closed'
} as const;

const STANDARD_TITLES: string[] = Object.values(STEP);

export function initialTimeline(at: string, subtitle = 'Timestamped and logged on public ledger'): StoredEvent[] {
  return [
    { title: STEP.submitted, subtitle, at, completed: true },
    { title: STEP.matched, subtitle: 'Awaiting responder assignment', at: null, completed: false },
    { title: STEP.enroute, subtitle: 'Pending assignment', at: null, completed: false },
    { title: STEP.resolved, subtitle: 'Pending completion', at: null, completed: false }
  ];
}

export function parseTimeline(json: string): StoredEvent[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? (v as StoredEvent[]) : [];
  } catch {
    return [];
  }
}

const find = (tl: StoredEvent[], title: string) => tl.find((e) => e.title === title);

/** Mark a standard step finished (idempotent: keeps the original timestamp if already completed). */
export function completeStep(tl: StoredEvent[], title: string, subtitle: string, at: string): void {
  const ev = find(tl, title);
  if (!ev) return;
  if (!ev.completed) {
    ev.completed = true;
    ev.at = ev.at ?? at;
    ev.subtitle = subtitle;
  }
}

/** Mark a standard step as in-progress (timestamped, not yet completed). */
export function startStep(tl: StoredEvent[], title: string, subtitle: string, at: string): void {
  const ev = find(tl, title);
  if (!ev || ev.completed) return;
  ev.at = at;
  ev.subtitle = subtitle;
}

export function addEvent(
  tl: StoredEvent[],
  ev: { title: string; subtitle: string; at: string },
  where: 'beforePending' | 'end' | { before: string } = 'beforePending'
): void {
  const entry: StoredEvent = { ...ev, completed: true };
  if (where === 'end') {
    tl.push(entry);
    return;
  }
  let idx: number;
  if (typeof where === 'object') {
    idx = tl.findIndex((e) => e.title === where.before);
  } else {
    idx = tl.findIndex((e) => !e.completed);
  }
  if (idx < 0) tl.push(entry);
  else tl.splice(idx, 0, entry);
}

export function renderTimeline(tl: StoredEvent[], status: string): TimelineDto[] {
  const finalState = status === 'Resolved' || status === 'Cancelled';
  const currentIdx = finalState ? -1 : tl.findIndex((e) => !e.completed);
  return tl.map((e, i) => ({
    title: e.title,
    subtitle: e.subtitle,
    ...(e.at ? { time: clock(e.at, { withDay: true }) } : {}),
    completed: e.completed,
    current: i === currentIdx
  }));
}

export const isStandardTitle = (t: string) => STANDARD_TITLES.includes(t);
