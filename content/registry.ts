import type {
  ApiKind,
  ReferenceCategory,
  ReferenceDefinition,
  SampleDefinition,
} from '@/content/types';
import type { Tag } from '@/lib/tags';

/**
 * `content/samples` と `content/references` を Metro の require.context で自動収集する。
 * → 新しいコンテンツはファイルを 1 つ置くだけで一覧・検索・リンクに反映される。
 *
 * `_` で始まるファイル / ディレクトリはテンプレート扱いで無視する。
 */

const sampleContext = require.context('./samples', true, /\.tsx?$/);
const referenceContext = require.context('./references', true, /\.tsx?$/);

function isTemplate(key: string): boolean {
  return key
    .split('/')
    .some((segment) => segment.startsWith('_'));
}

function collect<T>(context: NodeJS.RequireContext, kind: string): T[] {
  const items: T[] = [];

  for (const key of context.keys()) {
    if (isTemplate(key)) continue;

    const mod = context<{ default?: T }>(key);
    const definition = mod?.default;

    if (!definition) {
      if (__DEV__) {
        console.warn(`[content] ${kind} "${key}" に default export がありません`);
      }
      continue;
    }
    items.push(definition);
  }

  return items;
}

function warnDuplicates(keys: string[], kind: string) {
  if (!__DEV__) return;
  const seen = new Set<string>();
  for (const key of keys) {
    if (seen.has(key)) console.warn(`[content] ${kind} の識別子が重複しています: "${key}"`);
    seen.add(key);
  }
}

const samples = collect<SampleDefinition>(sampleContext, 'sample').sort((a, b) =>
  a.title.localeCompare(b.title, 'ja')
);
const references = collect<ReferenceDefinition>(referenceContext, 'reference').sort((a, b) =>
  a.title.localeCompare(b.title, 'ja')
);

warnDuplicates(
  samples.map((item) => item.id),
  'sample'
);
warnDuplicates(
  references.map((item) => item.slug),
  'reference'
);

const sampleById = new Map(samples.map((item) => [item.id, item]));
const referenceBySlug = new Map(references.map((item) => [item.slug, item]));

/* ------------------------------------------------------------------ *
 * 取得
 * ------------------------------------------------------------------ */

export function allSamples(): SampleDefinition[] {
  return samples;
}

export function allReferences(): ReferenceDefinition[] {
  return references;
}

export function getSample(id: string | undefined): SampleDefinition | undefined {
  return id ? sampleById.get(id) : undefined;
}

export function getReference(slug: string | undefined): ReferenceDefinition | undefined {
  return slug ? referenceBySlug.get(slug) : undefined;
}

export function samplesByApi(api: ApiKind): SampleDefinition[] {
  return samples.filter((item) => item.api === api);
}

export function referencesByCategory(category: ReferenceCategory): ReferenceDefinition[] {
  return references.filter((item) => item.category === category);
}

/** 追加日の新しい順（同日ならタイトル順） */
export function recentlyAdded(limit = 6): (SampleDefinition | ReferenceDefinition)[] {
  return [...samples, ...references]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.title.localeCompare(b.title, 'ja'))
    .slice(0, limit);
}

export function isSample(
  item: SampleDefinition | ReferenceDefinition
): item is SampleDefinition {
  return 'Demo' in item;
}

/* ------------------------------------------------------------------ *
 * タグ・検索
 * ------------------------------------------------------------------ */

export function sampleTags(): Tag[] {
  return uniqueSorted(samples.flatMap((item) => item.tags));
}

export function referenceTags(): Tag[] {
  return uniqueSorted(references.flatMap((item) => item.tags));
}

function uniqueSorted(values: Tag[]): Tag[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'ja'));
}

function matches(query: string, haystacks: string[]): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return haystacks.some((text) => text.toLowerCase().includes(needle));
}

export function searchSamples(query: string, samplesToSearch = samples): SampleDefinition[] {
  return samplesToSearch.filter((item) =>
    matches(query, [item.title, item.summary, item.id, ...item.tags])
  );
}

export function searchReferences(
  query: string,
  referencesToSearch = references
): ReferenceDefinition[] {
  return referencesToSearch.filter((item) =>
    matches(query, [item.title, item.summary, item.slug, ...item.tags])
  );
}

/* ------------------------------------------------------------------ *
 * 相互リンク
 * ------------------------------------------------------------------ */

/** サンプルから辿れるリファレンス */
export function relatedReferences(sample: SampleDefinition): ReferenceDefinition[] {
  const explicit = (sample.related ?? []).map((slug) => referenceBySlug.get(slug));
  // リファレンス側から related で参照されている場合も拾う（片方だけ書けば良い）
  const backlinks = references.filter((ref) => ref.related?.includes(sample.id));
  return dedupe([...explicit, ...backlinks]);
}

/** リファレンスから辿れるサンプル（本文に埋め込んだものも含む） */
export function relatedSamples(reference: ReferenceDefinition): SampleDefinition[] {
  const explicit = (reference.related ?? []).map((id) => sampleById.get(id));
  const embedded = reference.body
    .filter((block): block is { type: 'sample'; id: string } => block.type === 'sample')
    .map((block) => sampleById.get(block.id));
  const backlinks = samples.filter((item) => item.related?.includes(reference.slug));
  return dedupe([...explicit, ...embedded, ...backlinks]);
}

function dedupe<T>(items: (T | undefined)[]): T[] {
  const result: T[] = [];
  for (const item of items) {
    if (item && !result.includes(item)) result.push(item);
  }
  return result;
}

export const contentStats = {
  samples: samples.length,
  references: references.length,
  animated: samples.filter((item) => item.api === 'animated').length,
  reanimated: samples.filter((item) => item.api === 'reanimated').length,
};
