import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = await mkdtemp(join(tmpdir(), "nexus-architecture-"));
const checker = fileURLToPath(new URL("../../tooling/scripts/check-package-architecture.mjs", import.meta.url));

async function writePackage(name, manifest, files = {}) {
  const folder = join(root, "packages", name);
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, "package.json"), JSON.stringify(manifest));
  for (const [path, content] of Object.entries(files)) {
    const target = join(folder, path);
    await mkdir(join(target, ".."), { recursive: true });
    await writeFile(target, content);
  }
}

function run() {
  return spawnSync(process.execPath, [checker, "--root", root], { encoding: "utf8" });
}

try {
  await writeFile(join(root, "pnpm-workspace.yaml"), "packages:\n  - packages/*\n");
  await writePackage("contracts", { name: "@nexus-brain/contracts" }, { "src/index.mjs": "export const ok = true;\n" });
  await writePackage("consumer", {
    name: "@nexus-brain/consumer",
    dependencies: { "@nexus-brain/contracts": "workspace:*" },
  }, { "src/index.mjs": 'import "@nexus-brain/contracts";\n' });

  const valid = run();
  assert.equal(valid.status, 0, valid.stderr || valid.stdout);
  assert.match(valid.stdout, /architecture check: PASS/);

  await writePackage("contracts", {
    name: "@nexus-brain/contracts",
    dependencies: { "@nexus-brain/consumer": "workspace:*" },
  }, { "src/index.mjs": 'import "@nexus-brain/consumer";\n' });
  const cycle = run();
  assert.equal(cycle.status, 1);
  assert.match(cycle.stdout + cycle.stderr, /cycle/i);

  await writePackage("contracts", { name: "@nexus-brain/contracts" }, { "src/index.mjs": "export const ok = true;\n" });
  await writePackage("consumer", { name: "@nexus-brain/consumer" }, {
    "src/index.mjs": 'import "@nexus-brain/contracts";\nimport "../../contracts/src/index.mjs";\n',
  });
  const boundaryViolation = run();
  assert.equal(boundaryViolation.status, 1);
  assert.match(boundaryViolation.stdout + boundaryViolation.stderr, /undeclared dependency|relative cross-package/i);
} finally {
  await rm(root, { recursive: true, force: true });
}
