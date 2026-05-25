import type { ClassLogEntry } from '@/contexts/class-log-context';

export const STUDIO_PALETTE = [
  '#1085ff',
  '#49bd50',
  '#ff8a00',
  '#d5c415',
  '#ba64d9',
  '#4832EE',
  '#ff2a00',
  '#00a896',
] as const;

const KNOWN_STUDIO_COLORS: Record<string, string> = {
  'Dock 11': '#1085ff',
  "Fit' Ballet": '#49bd50',
  'Center of Dance': '#ff8a00',
  Papillion: '#d5c415',
  'House of Healing': '#ba64d9',
};

export type StudioAttendanceRow = {
  name: string;
  displayName: string;
  count: number;
  color: string;
  flex: number;
  widthPct: number;
};

function colorForStudio(name: string, index: number): string {
  return KNOWN_STUDIO_COLORS[name] ?? STUDIO_PALETTE[index % STUDIO_PALETTE.length]!;
}

export function buildStudioAttendance(
  entries: ClassLogEntry[],
  year = new Date().getFullYear(),
): StudioAttendanceRow[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    const d = new Date(e.dateTimeISO);
    if (Number.isNaN(d.getTime()) || d.getFullYear() !== year) continue;
    const school = e.school.trim() || 'Unknown';
    counts.set(school, (counts.get(school) ?? 0) + 1);
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] ?? 1;

  return sorted.map(([name, count], index) => ({
    name,
    displayName: index === 0 && sorted.length > 1 ? `${name} (Most)` : name,
    count,
    color: colorForStudio(name, index),
    flex: count,
    widthPct: max > 0 ? (count / max) * 100 : 0,
  }));
}
