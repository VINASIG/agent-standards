import { mkdir, open, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  begin,
  end,
  findBlock,
  manifestPath,
  managed,
  parseBundle,
  parseManifest,
  readOptional,
  record,
  replaceBlock,
  rootDirectory,
  safePath,
  sha256,
  string,
} from './model.ts';
import type { Backup, Bundle, Change, Manifest, Profile } from './model.ts';

export interface Plan {
  changes: Change[];
  oldBlock: string | null;
  newBlock: string | null;
  oldManifest: string | null;
  newManifest: string | null;
  agentsCreated: boolean;
}
export interface Check {
  name: string;
  status: 'PASS' | 'FAIL' | 'NOT_RUN';
  detail: string;
}
const basePolicies = ['core', 'language', 'quality', 'licensing'];
const webPolicies = [
  'web',
  'motion',
  'search',
  'performance',
  'agent-readiness',
];
const coreSkills = ['vinasig-workflow', 'vinasig-dependencies'];
const webSkills = [
  'vinasig-responsive',
  'vinasig-motion',
  'vinasig-search',
  'vinasig-performance',
  'vinasig-agent-readiness',
];

export function entrypoint(p: Profile, version: string): string {
  return (
    `${begin}\n## VINASIG SI agent standards ${version}\n\n` +
    'Read `.vinasig/standards/policies/core.md` and `language.md` before repository work. Respect platform instructions, current user authorization and local project guidance. Preserve unrelated changes. Never invent verification or weaken a quality gate to pass.\n\n' +
    `Active profile is \`${p}\`. Read \`.vinasig/standards/profiles/${p}.md\` and the task-relevant policies. Core is valid for CLI and documentation projects and installs no browser dependencies.\n\n` +
    'Use `$vinasig-workflow` for implementation work and `$vinasig-dependencies` when adding or upgrading dependencies. Report PASS, FAIL, NOT_RUN or NOT_APPLICABLE with evidence and reasons. Commit, push and publish only within the task authorization.\n\n' +
    'For VINASIG project creation, publication or changed public facts, apply CORE-009 and `templates/project-publication.md`. Set Repo details for every new GitHub repository immediately with a description, verified website or README homepage, and relevant topics. Read saved GitHub values back. Synchronize affected website inventory and both org profile languages within current authorization. The public org profile is `VINASIG/.github/profile/README.md`. Report pending destinations.\n\n' +
    'For license selection, imported material or distribution changes read `policies/licensing.md` and `LICENSES.md` inside the snapshot. LIC-001 through LIC-004 require purpose-based selection, authority and dependency review, separate documentation/font/data/brand rights, consistent SPDX metadata and delivery evidence. Importing this standard does not relicense the host project.\n\n' +
    (p === 'core'
      ? ''
      : 'For a new public VINASIG website handoff, launch, host change or DNS/discovery repair, apply SEARCH-003 and read templates/web/domain-discovery.md in the snapshot. Propose missing Cloudflare DNS and Search Console setup with exact fields/URLs. Retain working setup; separate submitted, fetched and indexed. Execute account changes only within existing authorization.\n\n' +
        'For UI changes read `policies/web.md` inside the snapshot. Apply LANG-004/LANG-005 to all visible copy and locales. WEB-001 requires original transparent header logos matched to the actual surface, without a padded or rounded logo card, linking to https://vinasig.io.vn/. Run inspectHeaderBrand and exercise the logo link on local and deployed pages. WEB-009 requires the shared header/footer contract for new projects too. Read templates/web/site-chrome.md, reuse the reviewed design-system source and run inspectSiteChrome on all layout routes/locales/themes. WEB-008 requires a full control inventory and styled initial/open/scrolled states, including popup scrollbars, checkbox/radio, search clear, range/progress parts and disclosure indicators. Use the reviewed control-surfaces CSS, preserve native form/keyboard/touch behavior and test forced colors. Run inspectControlSurfaces and inspectControlIndicators with nonzero expected counts. Ordinary dropdown indicators need a measured 16 px inner trailing inset, a 12 px value gap and their declared SVG size. Open before/after and deployed screenshots. Use `$vinasig-responsive` for layout/accessibility, `$vinasig-motion` for movement, `$vinasig-search` for SEO/AEO/GEO, `$vinasig-performance` for speed, and `$vinasig-agent-readiness` for browser-agent tasks. Space Grotesk, Lucide and Simple Icons follow their separate roles.\n\n') +
    'The local manifest pins the approved snapshot. A Markdown path is a reading instruction, not an automatic import. Stop and report unresolved conflicts with mandatory policy. Record approved exceptions with owner, reason and review date.\n' +
    end
  );
}

function selected(file: string, p: Profile): boolean {
  const web = p !== 'core';
  if (file.startsWith('skills/'))
    return [...coreSkills, ...(web ? webSkills : [])].some((name) =>
      file.startsWith(`skills/${name}/`),
    );
  if (file.startsWith('policies/'))
    return [...basePolicies, ...(web ? webPolicies : [])].some(
      (name) => file === `policies/${name}.md`,
    );
  if (file.startsWith('profiles/'))
    return file === 'profiles/core.md' || file === `profiles/${p}.md`;
  if (file.startsWith('configs/')) return web;
  if (file.startsWith('templates/web/')) return web;
  return (
    file === 'LICENSE' ||
    file === 'LICENSES.md' ||
    file === 'BRAND_POLICY.md' ||
    file === 'docs/audits/licensing-2026-10-04.md' ||
    file === 'docs/license-text-sources.json' ||
    file.startsWith('LICENSES/') ||
    file === 'standards.json' ||
    file === 'tools.lock.json' ||
    file === 'docs/sources.md' ||
    file === 'docs/tool-registry.md' ||
    file.startsWith('schemas/') ||
    file.startsWith('templates/')
  );
}
function destination(file: string): string {
  return managed(
    file.startsWith('skills/')
      ? `.agents/${file}`
      : `.vinasig/standards/${file}`,
  );
}

export async function loadBundle(
  directory: string,
  approvedDigest: string,
): Promise<{ bundle: Bundle; bytes: Map<string, Buffer>; hash: string }> {
  const root = await rootDirectory(directory);
  const text = await readOptional(root, 'bundle.json');
  if (!text || sha256(text) !== approvedDigest)
    throw new Error('Bundle digest does not match the approved SHA-256');
  const parsed: unknown = JSON.parse(text.toString());
  const bundle = parseBundle(parsed);
  const bytes = new Map<string, Buffer>();
  for (const [file, hash] of Object.entries(bundle.files)) {
    const content = await readOptional(root, file);
    if (!content || sha256(content) !== hash)
      throw new Error(`Bundle integrity failed: ${file}`);
    bytes.set(file, content);
  }
  return { bundle, bytes, hash: sha256(text) };
}
export async function installed(
  root: string,
): Promise<{ manifest: Manifest; text: string } | null> {
  const bytes = await readOptional(root, manifestPath);
  if (!bytes) return null;
  const parsed: unknown = JSON.parse(bytes.toString());
  return { manifest: parseManifest(parsed), text: bytes.toString() };
}
export async function doctor(directory: string): Promise<Check[]> {
  const root = await rootDirectory(directory);
  const old = await installed(root);
  if (!old)
    return [
      {
        name: 'manifest',
        status: 'FAIL',
        detail: 'Standards are not installed',
      },
    ];
  const checks: Check[] = [];
  for (const [file, hash] of Object.entries(old.manifest.files)) {
    const content = await readOptional(root, file);
    checks.push({
      name: file,
      status: content && sha256(content) === hash ? 'PASS' : 'FAIL',
      detail: content
        ? 'Compare installed bytes with manifest'
        : 'Managed file missing',
    });
  }
  const agents = (await readOptional(root, 'AGENTS.md'))?.toString() ?? '';
  const block = findBlock(agents);
  checks.push({
    name: 'AGENTS block',
    status:
      block && sha256(block) === old.manifest.agentBlock ? 'PASS' : 'FAIL',
    detail: 'Managed block integrity; outside content is not owned',
  });
  checks.push({
    name: 'Codex root override',
    status: (await readOptional(root, 'AGENTS.override.md')) ? 'FAIL' : 'PASS',
    detail:
      'A root override replaces AGENTS.md; integrate explicitly before use',
  });
  checks.push({
    name: 'Root instruction budget',
    status: Buffer.byteLength(agents) <= 8192 ? 'PASS' : 'FAIL',
    detail:
      'Local target 8 KiB; actual default chain limit 32 KiB includes other instructions',
  });
  checks.push({
    name: 'Codex runtime discovery',
    status: 'NOT_RUN',
    detail:
      'Doctor validates files only. Start a new Codex session to verify actual discovery',
  });
  return checks;
}
async function assertClean(root: string): Promise<void> {
  const failures = (await doctor(root)).filter(
    (check) => check.status === 'FAIL',
  );
  if (failures.length)
    throw new Error(
      `Local conflict: ${failures.map((item) => item.name).join(', ')}`,
    );
}
export async function planInstall(
  directory: string,
  bundleDirectory: string,
  approvedDigest: string,
  p: Profile,
  update = false,
): Promise<Plan> {
  const root = await rootDirectory(directory);
  if (await readOptional(root, 'AGENTS.override.md'))
    throw new Error(
      'AGENTS.override.md shadows the entrypoint; resolve it explicitly',
    );
  const loaded = await loadBundle(bundleDirectory, approvedDigest);
  const old = await installed(root);
  if (update && !old)
    throw new Error('Update requires an existing installation');
  if (old) await assertClean(root);
  if (
    old &&
    !update &&
    (old.manifest.bundleSha256 !== approvedDigest || old.manifest.profile !== p)
  )
    throw new Error('Use update to change an existing snapshot or profile');
  const agents = await readOptional(root, 'AGENTS.md');
  const text = agents?.toString() ?? '';
  const oldBlock = findBlock(text);
  if (oldBlock && !old) throw new Error('Unowned managed block already exists');
  const newBlock = entrypoint(p, loaded.bundle.version);
  if (Buffer.byteLength(replaceBlock(text, oldBlock, newBlock)) > 8192)
    throw new Error(
      'AGENTS.md exceeds the 8 KiB local entrypoint budget; split project guidance',
    );
  const files: Record<string, string> = {};
  const changes: Change[] = [];
  for (const [file, bytes] of loaded.bytes) {
    if (!selected(file, p)) continue;
    const dest = destination(file);
    files[dest] = sha256(bytes);
    const current = await readOptional(root, dest);
    if (current && !old?.manifest.files[dest])
      throw new Error(`Unowned file collision: ${dest}`);
    if (!current || sha256(current) !== files[dest])
      changes.push({
        path: dest,
        before: current?.toString('base64') ?? null,
        after: bytes.toString('base64'),
      });
  }
  for (const file of Object.keys(old?.manifest.files ?? {})) {
    if (!(file in files))
      changes.push({
        path: file,
        before: (await readOptional(root, file))?.toString('base64') ?? null,
        after: null,
      });
  }
  const manifest: Manifest = {
    ...loaded.bundle,
    files,
    profile: p,
    bundleSha256: loaded.hash,
    agentBlock: sha256(newBlock),
    agentsCreated: old?.manifest.agentsCreated ?? !agents,
  };
  return {
    changes,
    oldBlock,
    newBlock,
    oldManifest: old?.text ?? null,
    newManifest: JSON.stringify(manifest, null, 2) + '\n',
    agentsCreated: manifest.agentsCreated,
  };
}
export async function planUninstall(directory: string): Promise<Plan> {
  const root = await rootDirectory(directory);
  const old = await installed(root);
  if (!old)
    return {
      changes: [],
      oldBlock: null,
      newBlock: null,
      oldManifest: null,
      newManifest: null,
      agentsCreated: false,
    };
  await assertClean(root);
  const changes: Change[] = [];
  for (const file of Object.keys(old.manifest.files))
    changes.push({
      path: file,
      before: (await readOptional(root, file))?.toString('base64') ?? null,
      after: null,
    });
  const block = findBlock(
    (await readOptional(root, 'AGENTS.md'))?.toString() ?? '',
  );
  return {
    changes,
    oldBlock: block,
    newBlock: null,
    oldManifest: old.text,
    newManifest: null,
    agentsCreated: old.manifest.agentsCreated,
  };
}
function encode(value: string | null): string | null {
  return value === null ? null : Buffer.from(value).toString('base64');
}
function decode(value: string | null): string | null {
  return value === null ? null : Buffer.from(value, 'base64').toString();
}
async function write(
  root: string,
  relative: string,
  content: string | null,
): Promise<void> {
  const target = await safePath(root, relative);
  if (content === null) {
    if (await readOptional(root, relative)) await unlink(target);
    return;
  }
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(content, 'base64'));
}
async function apply(root: string, plan: Plan): Promise<void> {
  for (const change of plan.changes)
    await write(root, managed(change.path), change.after);
  const agents = (await readOptional(root, 'AGENTS.md'))?.toString() ?? '';
  const replacement = replaceBlock(agents, plan.oldBlock, plan.newBlock);
  if (plan.agentsCreated && replacement.trim() === '')
    await write(root, 'AGENTS.md', null);
  else if (replacement !== agents)
    await write(root, 'AGENTS.md', encode(replacement));
  await write(root, manifestPath, encode(plan.newManifest));
}
export async function execute(
  directory: string,
  plan: Plan,
  dryRun = false,
): Promise<{ changed: boolean; backup: string | null; paths: string[] }> {
  const root = await rootDirectory(directory);
  const paths = plan.changes.map((change) => change.path);
  if (plan.oldBlock !== plan.newBlock) paths.push('AGENTS.md');
  if (plan.oldManifest !== plan.newManifest) paths.push(manifestPath);
  if (!paths.length || dryRun)
    return { changed: paths.length > 0, backup: null, paths };
  const lockPath = await safePath(root, '.vinasig/install.lock');
  await mkdir(path.dirname(lockPath), { recursive: true });
  const lock = await open(lockPath, 'wx');
  try {
    for (const change of plan.changes) {
      const current =
        (await readOptional(root, change.path))?.toString('base64') ?? null;
      if (current !== change.before)
        throw new Error(`Source changed after planning: ${change.path}`);
    }
    if (
      ((await readOptional(root, manifestPath))?.toString() ?? null) !==
      plan.oldManifest
    )
      throw new Error('Manifest changed after planning');
    if (
      findBlock((await readOptional(root, 'AGENTS.md'))?.toString() ?? '') !==
      plan.oldBlock
    )
      throw new Error('AGENTS block changed after planning');
    const id = randomUUID();
    const backup: Backup = { format: 1, ...plan };
    await write(
      root,
      `.vinasig/backups/${id}.json`,
      encode(JSON.stringify(backup, null, 2) + '\n'),
    );
    try {
      await apply(root, plan);
    } catch (error) {
      await apply(root, {
        ...plan,
        changes: plan.changes.map((c) => ({
          ...c,
          before: c.after,
          after: c.before,
        })),
        oldBlock: findBlock(
          (await readOptional(root, 'AGENTS.md'))?.toString() ?? '',
        ),
        newBlock: plan.oldBlock,
        newManifest: plan.oldManifest,
      });
      throw error;
    }
    return { changed: true, backup: id, paths };
  } finally {
    await lock.close();
    await unlink(lockPath);
  }
}
export async function planRollback(
  directory: string,
  id: string,
): Promise<Plan> {
  const root = await rootDirectory(directory);
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error('Invalid backup identifier');
  const bytes = await readOptional(root, `.vinasig/backups/${id}.json`);
  if (!bytes) throw new Error('Backup missing');
  const parsed: unknown = JSON.parse(bytes.toString());
  const value = record(parsed);
  if (value['format'] !== 1 || !Array.isArray(value['changes']))
    throw new Error('Invalid backup');
  const changes: Change[] = [];
  for (const item of value['changes']) {
    const c = record(item);
    const file = managed(string(c['path']));
    const previous = c['before'] === null ? null : string(c['before']);
    const expected = c['after'] === null ? null : string(c['after']);
    if (
      ((await readOptional(root, file))?.toString('base64') ?? null) !==
      expected
    )
      throw new Error(`Rollback local conflict: ${file}`);
    changes.push({ path: file, before: expected, after: previous });
  }
  const oldManifest =
    value['newManifest'] === null ? null : string(value['newManifest']);
  const newManifest =
    value['oldManifest'] === null ? null : string(value['oldManifest']);
  for (const m of [oldManifest, newManifest])
    if (m) {
      const parsedManifest: unknown = JSON.parse(m);
      parseManifest(parsedManifest);
    }
  if (
    ((await readOptional(root, manifestPath))?.toString() ?? null) !==
    oldManifest
  )
    throw new Error('Rollback manifest conflict');
  const oldBlock = decode(
    encode(value['newBlock'] === null ? null : string(value['newBlock'])),
  );
  const newBlock =
    value['oldBlock'] === null ? null : string(value['oldBlock']);
  if (
    findBlock((await readOptional(root, 'AGENTS.md'))?.toString() ?? '') !==
    oldBlock
  )
    throw new Error('Rollback AGENTS conflict');
  if (typeof value['agentsCreated'] !== 'boolean')
    throw new Error('Invalid backup ownership');
  return {
    changes,
    oldBlock,
    newBlock,
    oldManifest,
    newManifest,
    agentsCreated: value['agentsCreated'],
  };
}
