export function looksBinary(buf: Buffer): boolean {
  const sampleLen = Math.min(buf.length, 8000);
  let suspicious = 0;
  for (let i = 0; i < sampleLen; i++) {
    const byte = buf[i];
    if (byte === 0) return true;
    if (byte < 7 || (byte > 13 && byte < 32)) suspicious++;
  }
  return sampleLen > 0 && suspicious / sampleLen > 0.05;
}

export function decodeUtf8Strict(buf: Buffer): string {
  const decoder = new TextDecoder("utf-8", { fatal: true });
  return decoder.decode(buf);
}
