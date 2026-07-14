export interface RenderProfile {
  name: string;
  pageWidth: number;
  pageHeight: number;
  fontSize: number;
  lineHeight: number;
  charWidth: number;
  fontFamily: string;
  maxImages: number;
}

export const PROFILES: Record<string, RenderProfile> = {
  claude: {
    name: "claude",
    pageWidth: 1568,
    pageHeight: 728,
    fontSize: 16,
    lineHeight: 20,
    charWidth: 9.6,
    fontFamily: "monospace",
    maxImages: 64,
  },
  gpt: {
    name: "gpt",
    pageWidth: 768,
    pageHeight: 1600,
    fontSize: 14,
    lineHeight: 18,
    charWidth: 8.4,
    fontFamily: "monospace",
    maxImages: 100,
  },
  grok: {
    name: "grok",
    pageWidth: 912,
    pageHeight: 512,
    fontSize: 14,
    lineHeight: 18,
    charWidth: 6,
    fontFamily: "monospace",
    maxImages: 64,
  },
};

export const DEFAULT_PROFILE = "claude";

export function resolveProfile(name?: string): RenderProfile {
  const key = (name ?? DEFAULT_PROFILE).toLowerCase();
  const profile = PROFILES[key];
  if (!profile) {
    const known = Object.keys(PROFILES).join(", ");
    throw new Error(`Unknown render profile "${name}". Known profiles: ${known}`);
  }
  return profile;
}

export function columnsFor(profile: RenderProfile): number {
  return Math.max(20, Math.floor(profile.pageWidth / profile.charWidth) - 4);
}

export function rowsFor(profile: RenderProfile): number {
  return Math.max(10, Math.floor(profile.pageHeight / profile.lineHeight) - 2);
}
