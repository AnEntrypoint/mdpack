import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface MdpixConfig {
  profile?: string;
  outDir?: string;
  textMode?: "auto" | "all" | "none";
}

export function loadConfig(cwd: string): MdpixConfig {
  const configPath = join(cwd, "mdpix.config.json");
  if (existsSync(configPath)) {
    const raw = readFileSync(configPath, "utf-8");
    return JSON.parse(raw) as MdpixConfig;
  }

  const pkgPath = join(cwd, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    if (pkg.mdpix && typeof pkg.mdpix === "object") {
      return pkg.mdpix as MdpixConfig;
    }
  }

  return {};
}

export function mergeConfig(base: MdpixConfig, override: Partial<MdpixConfig>): MdpixConfig {
  return {
    profile: override.profile ?? base.profile,
    outDir: override.outDir ?? base.outDir,
    textMode: override.textMode ?? base.textMode,
  };
}
