import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const target = fileURLToPath(new URL("../../node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs", import.meta.url));
try {
  const source = await readFile(target, "utf8");
  await writeFile(target, source.replace(/\n\/\/# sourceMappingURL=LayoutGroupContext\.mjs\.map\s*$/, "\n"));
} catch {
  // The package is optional at installation time; Next will simply skip this dev-only patch.
}
