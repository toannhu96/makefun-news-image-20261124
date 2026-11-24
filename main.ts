import { closeSync, copyFileSync, existsSync, mkdirSync, openSync, readSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";

// Locate entry.png next to this script (works under node, tsx, ts-node), falling back to cwd.
const scriptDir = process.argv[1] ? path.dirname(path.resolve(process.argv[1])) : process.cwd();
const candidates = [path.join(scriptDir, "entry.png"), path.join(process.cwd(), "entry.png")];
const src = candidates.find((p) => existsSync(p));
if (!src) {
  console.error(`entry.png not found (looked in: ${candidates.join(", ")})`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const dest = path.join(outDir, "entry.png");
copyFileSync(src, dest);

// Validate the written output file.
const fail = (msg: string): never => {
  console.error(`Output validation failed for ${dest}: ${msg}`);
  // Remove the invalid output so the harness never picks it up.
  try {
    unlinkSync(dest);
    console.error(`Removed invalid output ${dest}`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Could not remove invalid output ${dest}: ${(err as Error).message}`);
    }
  }
  process.exit(1);
};

const MAX_BYTES = 1048576; // bounty cap: 1 MiB
const size = statSync(dest).size;
if (size === 0) fail("file is empty (0 bytes)");
if (size > MAX_BYTES) fail(`file is ${size} bytes, exceeds 1 MiB cap (${MAX_BYTES} bytes)`);

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const header = Buffer.alloc(8);
const fd = openSync(dest, "r");
let bytesRead: number;
try {
  bytesRead = readSync(fd, header, 0, 8, 0);
} finally {
  closeSync(fd);
}
if (bytesRead < 8 || !header.equals(PNG_SIGNATURE)) {
  fail(`missing PNG signature (got ${header.subarray(0, bytesRead).toString("hex") || "nothing"})`);
}

console.log(`Wrote ${dest} (${size} bytes, valid PNG)`);
