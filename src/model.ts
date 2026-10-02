import { createHash } from 'node:crypto';
import { lstat, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

export const profiles = ['core', 'web-static', 'web-typescript'] as const;
export type Profile = (typeof profiles)[number];
export const begin = '<!-- VINASIG STANDARDS BEGIN -->';
export const end = '<!-- VINASIG STANDARDS END -->';
export const manifestPath = '.vinasig/manifest.json';

export interface Source {
  repository: string;
  ref: string;
  kind: string;
}
export interface Bundle {
  format: number;
  version: string;
  source: Source;
  files: Record<string, string>;
}
export interface Manifest extends Bundle {
  profile: Profile;
  bundleSha256: string;
  agentBlock: string;
  agentsCreated: boolean;
}
export interface Change {
  path: string;
  before: string | null;
  after: string | null;
}
export interface Backup {
  format: number;
  changes: Change[];
  oldBlock: string | null;
  newBlock: string | null;
  oldManifest: string | null;
  newManifest: string | null;
  agentsCreated: boolean;
}

export function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}
export function record(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new Error('Expected an object');
  return Object.fromEntries(Object.entries(value));
}
export function string(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Expected a string');
  return value;
}
export function nullableString(value: unknown): string | null {
  return value === null ? null : string(value);
}
export function digest(value: unknown): string {
  const s = string(value);
  if (!/^[a-f0-9]{64}$/.test(s)) throw new Error('Expected a SHA-256 digest');
  return s;
}
export function profile(value: unknown): Profile {
  const found = profiles.find((p) => p === value);
  if (!found) throw new Error('Unknown profile');
  return found;
}
export function safeRelative(value: string): string {
  if (
    !value ||
    value
      .split('/')
      .some(
        (part) =>
          !/^[A-Za-z0-9_.-]+$/.test(part) || part === '.' || part === '..',
      )
  )
    throw new Error(`Unsafe path: ${value}`);
  return value;
}
export function managed(value: string): string {
  safeRelative(value);
  if (
    !value.startsWith('.vinasig/standards/') &&
    !/^\.agents\/skills\/vinasig-[a-z0-9-]+\//.test(value)
  )
    throw new Error(`Unmanaged path: ${value}`);
  return value;
}
export async function rootDirectory(directory: string): Promise<string> {
  const resolved = path.resolve(directory);
  const actual = await realpath(resolved);
  if (
    (process.platform === 'win32'
      ? actual.toLowerCase() !== resolved.toLowerCase()
      : actual !== resolved) ||
    !(await lstat(resolved)).isDirectory()
  )
    throw new Error(
      'Target must be an existing directory without symlink ancestors',
    );
  return resolved;
}
export async function safePath(
  root: string,
  relative: string,
): Promise<string> {
  safeRelative(relative);
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink())
        throw new Error(`Symlink boundary: ${relative}`);
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
  }
  return current;
}
export function isMissing(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
export async function readOptional(
  root: string,
  relative: string,
): Promise<Buffer | null> {
  try {
    return await readFile(await safePath(root, relative));
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}
function knownKeys(
  value: Record<string, unknown>,
  allowed: readonly string[],
): void {
  if (Object.keys(value).some((key) => !allowed.includes(key)))
    throw new Error('Unknown metadata field');
}
function nonempty(value: unknown): string {
  const s = string(value);
  if (!s.length) throw new Error('Expected a nonempty string');
  return s;
}
export function parseBundle(
  input: unknown,
  extraKeys: readonly string[] = [],
): Bundle {
  const value = record(input);
  knownKeys(value, ['format', 'version', 'source', 'files', ...extraKeys]);
  if (value['format'] !== 1) throw new Error('Unsupported bundle format');
  const version = string(value['version']);
  if (!/^\d+\.\d+\.\d+$/.test(version))
    throw new Error('Expected a stable version');
  const s = record(value['source']);
  knownKeys(s, ['repository', 'ref', 'kind']);
  const source = {
    repository: nonempty(s['repository']),
    ref: nonempty(s['ref']),
    kind: nonempty(s['kind']),
  };
  const files = Object.fromEntries(
    Object.entries(record(value['files'])).map(([file, hash]) => [
      safeRelative(file),
      digest(hash),
    ]),
  );
  if (!Object.keys(files).length) throw new Error('Empty bundle');
  return { format: 1, version, source, files };
}
export function parseManifest(input: unknown): Manifest {
  const bundle = parseBundle(input, [
    'profile',
    'bundleSha256',
    'agentBlock',
    'agentsCreated',
  ]);
  for (const file of Object.keys(bundle.files)) managed(file);
  const v = record(input);
  if (typeof v['agentsCreated'] !== 'boolean')
    throw new Error('Invalid agentsCreated');
  return {
    ...bundle,
    profile: profile(v['profile']),
    bundleSha256: digest(v['bundleSha256']),
    agentBlock: digest(v['agentBlock']),
    agentsCreated: v['agentsCreated'],
  };
}
export function findBlock(text: string): string | null {
  const starts = text.split(begin).length - 1;
  const stops = text.split(end).length - 1;
  if (!starts && !stops) return null;
  if (starts !== 1 || stops !== 1 || text.indexOf(end) < text.indexOf(begin))
    throw new Error('Invalid or duplicated managed AGENTS block');
  return text.slice(text.indexOf(begin), text.indexOf(end) + end.length);
}
export function replaceBlock(
  text: string,
  oldBlock: string | null,
  newBlock: string | null,
): string {
  if (findBlock(text) !== oldBlock)
    throw new Error('Managed AGENTS block conflict');
  if (oldBlock) return text.replace(oldBlock, newBlock ?? '');
  if (!newBlock) return text;
  return text + newBlock;
}
