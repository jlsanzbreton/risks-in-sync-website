import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

test("keeps the back-to-top control above mobile browser chrome", () => {
  assert.match(
    styles,
    /@media \(hover: none\) and \(pointer: coarse\)[\s\S]*?\.back-to-top\s*\{[^}]*bottom:\s*calc\(env\(safe-area-inset-bottom, 0px\) \+ 5rem\)/,
  );
});

test("preserves native tap feedback on the back-to-top control", () => {
  const rule = styles.match(/\.back-to-top\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.doesNotMatch(rule, /-webkit-tap-highlight-color:\s*transparent/);
});
