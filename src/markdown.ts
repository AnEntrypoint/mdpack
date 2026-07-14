export type BlockKind = "heading" | "code" | "table" | "list" | "paragraph" | "blank";

export interface Block {
  kind: BlockKind;
  lines: string[];
  dense: boolean;
}

const CODE_FENCE = /^```/;
const HEADING = /^#{1,6}\s/;
const LIST_ITEM = /^\s*([-*+]|\d+[.)])\s/;
const TABLE_ROW = /^\s*\|.*\|\s*$/;

export function segmentMarkdown(source: string): Block[] {
  const rawLines = source.split(/\r\n|\r|\n/);
  const blocks: Block[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    if (CODE_FENCE.test(line)) {
      const codeLines: string[] = [line];
      i++;
      while (i < rawLines.length && !CODE_FENCE.test(rawLines[i])) {
        codeLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length) {
        codeLines.push(rawLines[i]);
        i++;
      }
      blocks.push({ kind: "code", lines: codeLines, dense: true });
      continue;
    }

    if (line.trim() === "") {
      blocks.push({ kind: "blank", lines: [""], dense: false });
      i++;
      continue;
    }

    if (HEADING.test(line)) {
      blocks.push({ kind: "heading", lines: [line], dense: false });
      i++;
      continue;
    }

    if (TABLE_ROW.test(line)) {
      const tableLines: string[] = [];
      while (i < rawLines.length && TABLE_ROW.test(rawLines[i])) {
        tableLines.push(rawLines[i]);
        i++;
      }
      blocks.push({ kind: "table", lines: tableLines, dense: true });
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const listLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim() !== "" && !CODE_FENCE.test(rawLines[i])) {
        listLines.push(rawLines[i]);
        i++;
      }
      blocks.push({ kind: "list", lines: listLines, dense: false });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < rawLines.length &&
      rawLines[i].trim() !== "" &&
      !CODE_FENCE.test(rawLines[i]) &&
      !HEADING.test(rawLines[i]) &&
      !TABLE_ROW.test(rawLines[i]) &&
      !LIST_ITEM.test(rawLines[i])
    ) {
      paraLines.push(rawLines[i]);
      i++;
    }
    blocks.push({ kind: "paragraph", lines: paraLines, dense: paraLines.join(" ").length > 400 });
  }

  return blocks;
}
