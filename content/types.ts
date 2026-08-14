import type { ComponentType } from 'react';

import type { EasingPreset } from '@/lib/easing-presets';

/** サンプルがどちらの API で書かれているか */
export type ApiKind = 'animated' | 'reanimated';

/* ------------------------------------------------------------------ *
 * アニメーションサンプル
 * ------------------------------------------------------------------ */

/** サンプル本体（Demo コンポーネント）が受け取る props */
export type SampleRenderProps = {
  /** 値が変わったら最初から再生する。マウント時も 1 度再生される */
  playToken: number;
  /** コントロールで指定された再生時間 (ms) */
  duration: number;
  /** コントロールで指定された easing プリセット */
  easing: EasingPreset;
  /** 再生状態の通知（任意） */
  onPlayStateChange?: (playing: boolean) => void;
};

export type DurationControl = {
  default: number;
  min: number;
  max: number;
};

export type SampleControls = {
  /** false にすると duration スライダーを無効化（spring 系など） */
  duration?: DurationControl | false;
  /** false にすると easing の選択を無効化 */
  easing?: boolean;
  /** 無効にした理由。コントロール欄に注記として表示される */
  disabledReason?: string;
};

export type SampleDefinition = {
  /** URL に使う一意な ID。ファイル名と揃えると分かりやすい */
  id: string;
  title: string;
  api: ApiKind;
  /** 一覧カードに出る 1〜2 行の説明 */
  summary: string;
  tags: string[];
  /** 'YYYY-MM-DD'。ホームの「最近追加」の並び順に使う */
  addedAt: string;
  controls?: SampleControls;
  /** 関連するリファレンスの slug */
  related?: string[];
  /** 詳細ページに表示するソース抜粋（任意） */
  code?: string;
  Demo: ComponentType<SampleRenderProps>;
};

/* ------------------------------------------------------------------ *
 * リファレンス
 * ------------------------------------------------------------------ */

export type DocBlock =
  | { type: 'md'; value: string }
  | { type: 'code'; lang: string; value: string }
  | { type: 'sample'; id: string }
  | { type: 'callout'; tone: CalloutTone; value: string };

export type CalloutTone = 'info' | 'tip' | 'warn';

/** リファレンスのカテゴリ。一覧のセクション分けに使う */
export type ReferenceCategory = 'animated-api' | 'reanimated' | 'common';

export type ReferenceDefinition = {
  /** URL に使う一意な slug。ファイル名と揃えると分かりやすい */
  slug: string;
  title: string;
  category: ReferenceCategory;
  /** 一覧カードに出る 1〜2 行の説明 */
  summary: string;
  tags: string[];
  addedAt: string;
  /** 関連するサンプルの id */
  related?: string[];
  body: DocBlock[];
};

export const REFERENCE_CATEGORY_LABEL: Record<ReferenceCategory, string> = {
  'animated-api': 'Animated API',
  reanimated: 'Reanimated',
  common: '共通・基礎',
};

export const API_LABEL: Record<ApiKind, string> = {
  animated: 'Animated API',
  reanimated: 'Reanimated',
};
