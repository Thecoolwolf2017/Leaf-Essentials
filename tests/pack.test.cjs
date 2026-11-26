const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { resolve, sep } = require("node:path");
const { test } = require("node:test");

const root = resolve(__dirname, "..");
const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf8"));

test("the behavior pack declares distinct UUIDs and a valid JavaScript entry", () => {
  const ids = [manifest.header.uuid, ...manifest.modules.map((module) => module.uuid)];
  assert.equal(new Set(ids).size, ids.length);
  const entries = manifest.modules.filter((module) => module.type === "script");
  assert.ok(entries.length, "missing script module");

  for (const module of entries) {
    assert.equal(module.language, "javascript");
    assert.equal(typeof module.entry, "string");
    const entry = resolve(root, module.entry);
    assert.ok(entry.startsWith(root + sep), "script entry must be inside the pack");
    const result = spawnSync(process.execPath, ["--input-type=module", "--check"], {
      input: readFileSync(entry),
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr || String(result.error || ""));
  }
});

test("database merging preserves ordinary nested records, arrays and nulls", () => {
  const bundle = readFileSync(resolve(root, "scripts/lib/prismarinedb.js"), "utf8");
  const definition = bundle.match(/^function MergeRecursive\([^\n]*\n[\s\S]*?^}/m)?.[0];
  assert.ok(definition, "missing database merge helper");
  const merge = require("node:vm").runInThisContext("(" + definition + ")");
  assert.deepEqual(
    merge({ profile: { name: "Alex" }, scores: [1] }, { profile: { active: true }, scores: [2], note: null }),
    { profile: { name: "Alex", active: true }, scores: [2], note: null }
  );
});
