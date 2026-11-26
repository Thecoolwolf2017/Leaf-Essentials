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

for (const file of ["scripts/lib/prismarinedb.js"]) {
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

test("URL validation accepts normal links and rejects malformed URLs", () => {
  const file = read("scripts/lib/yup.esm.js");
  const definition = file.match(/^function isLeafUrl\([^\n]*\n[\s\S]*?^}/m)?.[0];
  const validate = require("node:vm").runInThisContext("(" + definition + ")");
  for (const value of ["https://example.org/docs?section=1", "//example.org", "http://192.0.2.1:8080", "https://café.example"]) {
    assert.equal(validate(value), true, value);
  }
  for (const value of ["javascript:alert", "https://example .org", "https://example.org:99999", "https://999.0.2.1"]) {
    assert.equal(validate(value), false, value);
  }
});

test("Moment converts format tokens to literal matches", () => {
  const file = read("scripts/lib/moment.js");
  const a = file.match(/^function unescapeFormat\([^\n]*\n[\s\S]*?^}/m)?.[0];
  const b = file.match(/^function regexEscape\([^\n]*\n[\s\S]*?^}/m)?.[0];
  const escape = require("node:vm").runInThisContext("(() => {" + a + "\n" + b + ";return unescapeFormat;})()");
  for (const [token, literal] of [["[literal]", "literal"], ["\\[", "["], ["\\.", "."], ["?", "?"]]) {
    assert.equal(new RegExp("^" + escape(token) + "$").test(literal), true);
  }
});
