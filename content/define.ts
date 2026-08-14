import type {
  CalloutTone,
  DocBlock,
  ReferenceDefinition,
  SampleDefinition,
} from '@/content/types';

/**
 * コンテンツ定義用のヘルパー。
 * `content/samples` / `content/references` に置いたファイルは
 * registry.ts が自動で読み込むので、index への追記は不要。
 */

export function defineSample(sample: SampleDefinition): SampleDefinition {
  return sample;
}

export function defineReference(reference: ReferenceDefinition): ReferenceDefinition {
  return reference;
}

/**
 * Markdown ブロック。テンプレートリテラルの共通インデントは自動で除去される。
 *
 * ```ts
 * md`## 見出し
 *    - 箇条書き`
 * ```
 */
export function md(strings: TemplateStringsArray, ...values: unknown[]): DocBlock {
  const raw = strings.reduce(
    (acc, part, index) => acc + part + (index < values.length ? String(values[index]) : ''),
    ''
  );
  return { type: 'md', value: dedent(raw) };
}

/**
 * コードブロック。Markdown のフェンス（```）を書かずに済むので、
 * テンプレートリテラル内でバッククォートを毎回エスケープしなくてよい。
 *
 * ```ts
 * code('ts')`const value = new Animated.Value(0);`
 * ```
 */
export function code(lang = 'tsx') {
  return (strings: TemplateStringsArray, ...values: unknown[]): DocBlock => {
    const raw = strings.reduce(
      (acc, part, index) => acc + part + (index < values.length ? String(values[index]) : ''),
      ''
    );
    return { type: 'code', lang, value: dedent(raw) };
  };
}

/** 本文中にライブサンプルを埋め込む */
export function sample(id: string): DocBlock {
  return { type: 'sample', id };
}

/**
 * 補足・注意を目立たせる囲みブロック。
 *
 * ```ts
 * callout('warn')`useNativeDriver: true では layout 系のプロパティは動かせない`
 * ```
 */
export function callout(tone: CalloutTone) {
  return (strings: TemplateStringsArray, ...values: unknown[]): DocBlock => {
    const raw = strings.reduce(
      (acc, part, index) => acc + part + (index < values.length ? String(values[index]) : ''),
      ''
    );
    return { type: 'callout', tone, value: dedent(raw) };
  };
}

/** 先頭・末尾の空行と、全行に共通する字下げを取り除く */
function dedent(text: string): string {
  const lines = text.replace(/\t/g, '  ').split('\n');

  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();

  const indent = lines
    .filter((line) => line.trim() !== '')
    .reduce((min, line) => Math.min(min, line.length - line.trimStart().length), Infinity);

  if (!Number.isFinite(indent) || indent === 0) return lines.join('\n');
  return lines.map((line) => line.slice(indent)).join('\n');
}
