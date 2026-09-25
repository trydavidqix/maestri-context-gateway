import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOTS = ["apps", "packages"];
const SOURCE_EXTENSIONS = new Set([".cjs", ".cts", ".js", ".jsx", ".mjs", ".mts", ".ts", ".tsx"]);

function within(parent, child) {
  const rel = relative(parent, child);
  return rel === "" || (rel !== ".." && !rel.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && !isAbsolute(rel));
}

function workspaceDirectories(root) {
  const yaml = readFileSync(join(root, "pnpm-workspace.yaml"), "utf8");
  const patterns = [...yaml.matchAll(/^\s*-\s+["']?([^\s"'#]+)["']?\s*$/gm)].map((match) => match[1]);
  const directories = new Set();

  for (const pattern of patterns) {
    const wildcard = pattern.endsWith("/*");
    const base = resolve(root, wildcard ? pattern.slice(0, -2) : pattern);
    if (wildcard) {
      if (!statSync(base, { throwIfNoEntry: false })?.isDirectory()) continue;
      for (const entry of readdirSync(base, { withFileTypes: true })) {
        if (entry.isDirectory() && statSync(join(base, entry.name, "package.json"), { throwIfNoEntry: false })?.isFile()) {
          directories.add(resolve(base, entry.name));
        }
      }
    } else if (statSync(join(base, "package.json"), { throwIfNoEntry: false })?.isFile()) {
      directories.add(base);
    }
  }
  return [...directories].sort();
}

function sourceFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...sourceFiles(fullPath));
    else if (entry.isFile() && SOURCE_EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf(".")))) files.push(fullPath);
  }
  return files;
}

function importSpecifiers(source) {
  const found = new Set();
  const patterns = [
    /(?:\bfrom\s*|\bimport\s*)["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
    /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) for (const match of source.matchAll(pattern)) found.add(match[1]);
  return [...found];
}

function packageNameFromSpecifier(specifier) {
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}

export function inspectPackageArchitecture(root) {
  const issues = [];
  const directories = workspaceDirectories(root);
  const packages = [];
  const byName = new Map();

  for (const directory of directories) {
    const manifestPath = join(directory, "package.json");
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch (error) {
      issues.push(`invalid package manifest ${relative(root, manifestPath)}: ${error.message}`);
      continue;
    }
    if (!manifest.name) {
      issues.push(`package has no name: ${relative(root, manifestPath)}`);
      continue;
    }
    if (byName.has(manifest.name)) issues.push(`duplicate workspace package name: ${manifest.name}`);
    const info = { directory, manifest, name: manifest.name, dependencies: new Set() };
    byName.set(manifest.name, info);
    packages.push(info);
  }

  for (const info of packages) {
    const manifestDeps = Object.assign({}, info.manifest.dependencies, info.manifest.devDependencies, info.manifest.peerDependencies, info.manifest.optionalDependencies);
    for (const [name, version] of Object.entries(manifestDeps)) {
      if (!String(version).startsWith("workspace:")) continue;
      if (!byName.has(name)) issues.push(`${info.name} declares missing workspace dependency ${name}`);
      else info.dependencies.add(name);
    }

    for (const file of sourceFiles(info.directory)) {
      const source = readFileSync(file, "utf8");
      for (const specifier of importSpecifiers(source)) {
        if (specifier.startsWith(".") || specifier.startsWith("/")) {
          if (specifier.startsWith(".")) {
            const target = resolve(dirname(file), specifier);
            if (!within(info.directory, target)) {
              issues.push(`${info.name} relative cross-package import: ${relative(root, file)} -> ${specifier}`);
            }
          }
          continue;
        }
        const dependency = byName.get(packageNameFromSpecifier(specifier));
        if (dependency && dependency.name !== info.name && !info.dependencies.has(dependency.name)) {
          issues.push(`${info.name} imports undeclared workspace dependency ${dependency.name}: ${relative(root, file)} -> ${specifier}`);
        }
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  function visit(name) {
    if (visiting.has(name)) {
      const start = stack.indexOf(name);
      issues.push(`workspace dependency cycle: ${[...stack.slice(start), name].join(" -> ")}`);
      return;
    }
    if (visited.has(name)) return;
    visiting.add(name);
    stack.push(name);
    for (const dependency of byName.get(name)?.dependencies ?? []) visit(dependency);
    stack.pop();
    visiting.delete(name);
    visited.add(name);
  }
  for (const info of packages) visit(info.name);

  return { issues, packageCount: packages.length };
}

function main() {
  const rootIndex = process.argv.indexOf("--root");
  const root = resolve(rootIndex >= 0 ? process.argv[rootIndex + 1] : process.cwd());
  const result = inspectPackageArchitecture(root);
  if (result.issues.length) {
    for (const issue of result.issues) console.error(`FAIL: ${issue}`);
    console.error(`architecture check: FAIL (${result.issues.length} issue(s), ${result.packageCount} package(s))`);
    process.exitCode = 1;
    return;
  }
  console.log(`architecture check: PASS (${result.packageCount} package(s), no undeclared imports or dependency cycles)`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
