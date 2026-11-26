const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");

const root = resolve(__dirname, "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");
function syntaxCheck(source) {
  const result = spawnSync(process.execPath, ["--input-type=module", "--check"], {
    input: source, encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || String(result.error || ""));
}

test("manifest loads a syntax-valid tracked startup module", () => {
  const manifest = JSON.parse(read("manifest.json"));
  const modules = manifest.modules.filter((module) => module.type === "script");
  assert.ok(modules.length);
  assert.equal(new Set([manifest.header.uuid, ...manifest.modules.map((module) => module.uuid)]).size, manifest.modules.length + 1);
  for (const module of modules) {
    assert.equal(module.entry, "scripts/startup.js");
    syntaxCheck(read(module.entry));
  }
});

test("built startup bundle is valid ESM", () => {
  syntaxCheck(read("dist/startup.js"));
});

for (const file of ["scripts/lib/prismarinedb.js", "scripts/lib/prismarinedb13.js"]) {
  test(file + " preserves normal nested records, arrays and nulls", () => {
    const definition = read(file).match(/^function MergeRecursive\([^\n]*\n[\s\S]*?^}/m)?.[0];
    assert.ok(definition, "missing database merge helper");
    const merge = require("node:vm").runInThisContext("(" + definition + ")");
    assert.deepEqual(
      merge({ profile: { name: "Alex" }, scores: [1] }, { profile: { active: true }, scores: [2], note: null }),
      { profile: { name: "Alex", active: true }, scores: [2], note: null }
    );
  });
}
