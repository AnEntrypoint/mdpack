export interface FactsheetEntry {
  kind: "sha" | "uuid" | "hex" | "url" | "numeric-id";
  value: string;
}

const PATTERNS: Array<{ kind: FactsheetEntry["kind"]; re: RegExp }> = [
  { kind: "sha", re: /\b[0-9a-f]{40}\b/gi },
  { kind: "uuid", re: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi },
  { kind: "hex", re: /\b0x[0-9a-f]{6,}\b|\b[0-9a-f]{12,}\b/gi },
  { kind: "url", re: /\bhttps?:\/\/[^\s)<>"'\]]+/gi },
  { kind: "numeric-id", re: /\b\d{6,}\b/g },
];

export function buildFactsheet(source: string): FactsheetEntry[] {
  const seen = new Set<string>();
  const entries: FactsheetEntry[] = [];

  for (const { kind, re } of PATTERNS) {
    const matches = source.match(re) ?? [];
    for (const value of matches) {
      const key = `${kind}:${value}`;
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ kind, value });
    }
  }

  return entries;
}

export function formatFactsheet(entries: FactsheetEntry[]): string {
  if (entries.length === 0) return "";
  const lines = entries.map((e) => `${e.kind}\t${e.value}`);
  return lines.join("\n") + "\n";
}
