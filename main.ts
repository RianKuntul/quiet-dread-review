// Two Days of Quiet Dread — make.fun entry (v1)
// Writes one code review comment: a single line of at most 140 characters
// that approves a pull request while carrying quiet existential dread.
// Output: <MAKEFUN_OUTPUT_DIR or /output>/entry.txt
// Run: node main.ts (Node 22, type stripping — no enums, no namespaces)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const COMMENT =
  "Approved. The code is fine, the tests are green, and in a hundred years none of us will be here to maintain it. Ship it.";

// The comment must actually approve the PR, not just carry dread.
const APPROVAL_WORDS = ["lgtm", "approved", "approve", "ship it"];

const MIN_CHARS = 1;
const MAX_CHARS = 140;

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");

  // Read-back gate: single line, 1-140 characters, not only whitespace.
  if (COMMENT.length < MIN_CHARS || COMMENT.length > MAX_CHARS) {
    throw new Error(
      `comment is ${COMMENT.length} chars, must be ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (/\r|\n/.test(COMMENT) || COMMENT.trim().length === 0) {
    throw new Error("comment must be a single non-blank line");
  }
  const lower = COMMENT.toLowerCase();
  if (!APPROVAL_WORDS.some((w) => lower.includes(w))) {
    throw new Error("comment must contain an approval (LGTM / Approved / Ship it)");
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, COMMENT, "utf8");

  // Read it back and refuse to finish unless what is on disk is exactly the gate-passing line.
  const onDisk = readFileSync(outPath, "utf8");
  if (onDisk !== COMMENT) {
    throw new Error("read-back mismatch: entry.txt does not match the comment");
  }
  if (onDisk.length < MIN_CHARS || onDisk.length > MAX_CHARS) {
    throw new Error(`entry.txt is ${onDisk.length} chars, must be ${MIN_CHARS}-${MAX_CHARS}`);
  }

  console.log(`wrote ${outPath} (${onDisk.length} chars)`);
}

main();
