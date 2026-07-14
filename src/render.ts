import { createCanvas } from "@napi-rs/canvas";
import { columnsFor, resolveProfile, rowsFor, type RenderProfile } from "./profiles.js";

export interface RenderOptions {
  profile?: string;
}

export interface RenderResult {
  pages: Buffer[];
  profile: RenderProfile;
  columns: number;
  rows: number;
  truncated: boolean;
}

function wrapLine(line: string, columns: number): string[] {
  if (line.length === 0) return [""];
  const chars = Array.from(line);
  const out: string[] = [];
  for (let i = 0; i < chars.length; i += columns) {
    out.push(chars.slice(i, i + columns).join(""));
  }
  return out.length > 0 ? out : [""];
}

export function reflowToLines(text: string, columns: number): string[] {
  const rawLines = text.split(/\r\n|\r|\n/);
  const out: string[] = [];
  for (const line of rawLines) {
    out.push(...wrapLine(line, columns));
  }
  return out;
}

export async function renderTextToImages(text: string, opts: RenderOptions = {}): Promise<RenderResult> {
  const profile = resolveProfile(opts.profile);
  const columns = columnsFor(profile);
  const rows = rowsFor(profile);

  if (text.length === 0) {
    return { pages: [], profile, columns, rows, truncated: false };
  }

  const lines = reflowToLines(text, columns);
  const pages: Buffer[] = [];
  let truncated = false;

  for (let start = 0; start < lines.length; start += rows) {
    if (pages.length >= profile.maxImages) {
      truncated = true;
      break;
    }
    const pageLines = lines.slice(start, start + rows);
    pages.push(await renderPage(pageLines, profile));
  }

  return { pages, profile, columns, rows, truncated };
}

async function renderPage(lines: string[], profile: RenderProfile): Promise<Buffer> {
  const canvas = createCanvas(profile.pageWidth, profile.pageHeight);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, profile.pageWidth, profile.pageHeight);

  ctx.fillStyle = "#000000";
  ctx.font = `${profile.fontSize}px ${profile.fontFamily}`;
  ctx.textBaseline = "top";

  const padding = 8;
  for (let row = 0; row < lines.length; row++) {
    ctx.fillText(lines[row], padding, padding + row * profile.lineHeight);
  }

  return canvas.encode("png");
}
