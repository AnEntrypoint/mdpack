# mdpix

Render any Markdown file into dense PNG image pages plus a text factsheet, for token-efficient LLM context injection — the same idea as [pxpipe](https://github.com/teamchong/pxpipe), applied to a single `.md` file instead of a live API proxy.

Dense text (code fences, tables) packs more characters per image-token than per text-token on vision-capable models. `mdpix` reflows the token-heavy parts of a Markdown file into fixed-width character grids, rasterizes them as PNG pages, and writes an adjacent factsheet with exact-value strings (hashes, UUIDs, URLs, numeric IDs) that vision models are prone to misreading.

## Install

```bash
npm install -g mdpix
```

## CLI usage

```bash
mdpix <file.md> [--out dir] [--profile claude|gpt|grok] [--text-mode auto|all|none]
```

- `--out` — output directory (default `mdpix-out`)
- `--profile` — page dimensions/font metrics tuned per target model (default `claude`)
- `--text-mode`
  - `auto` (default) — only dense blocks (code fences, tables, long paragraphs) are imaged; short prose stays out of the image pages
  - `all` — the entire file is imaged
  - `none` — no images are produced (only the factsheet/manifest)

Output directory contains:
- `page-001.png`, `page-002.png`, … — rendered pages
- `factsheet.txt` — extracted exact-value strings (only written if any were found)
- `manifest.json` — page count, profile used, truncation flag

## Library usage

```ts
import { renderMarkdownFile } from "mdpix";

const result = await renderMarkdownFile("docs/spec.md", {
  outDir: "out",
  profile: "claude",
  textMode: "auto",
});
```

Lower-level primitives are also exported: `renderTextToImages`, `segmentMarkdown`, `buildFactsheet`.

## Config file

Drop an `mdpix.config.json` in your project root (or an `"mdpix"` field in `package.json`) to set defaults:

```json
{
  "profile": "claude",
  "outDir": "mdpix-out",
  "textMode": "auto"
}
```

CLI flags always override the config file.

## Profiles

| profile | page size | intended target |
| --- | --- | --- |
| `claude` | 1568×728 | Claude family (default) |
| `gpt` | 768×1600 | GPT vision models |
| `grok` | 912×512 | Grok vision models |

## Known limitations

Vision models are not OCR. Byte-exact values (hashes, IDs, secrets, precise numbers) can be misread from a rendered page — this is why `mdpix` pulls those into a separate text `factsheet.txt` rather than trusting the image alone. Don't rely on image pages for content where a single wrong character matters and no factsheet entry covers it.

The default renderer uses the system "monospace" font via `@napi-rs/canvas`, which is Latin-glyph-only in this build. Non-Latin content (CJK, Arabic, emoji, etc.) will render as missing/fallback glyphs rather than legible text. If your Markdown contains meaningful non-Latin content, either keep it out of the imaged portion (`--text-mode auto`, and rely on the surrounding text prompt) or bundle a CJK/emoji-capable font via `@napi-rs/canvas`'s `GlobalFonts.registerFromPath` before calling the library API — this is not yet wired into the CLI.

## License

MIT
