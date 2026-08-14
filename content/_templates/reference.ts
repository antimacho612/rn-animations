/**
 * リファレンスページのテンプレート。
 *
 * 使い方:
 *   1. このファイルを content/references/<slug>.ts にコピーする
 *   2. slug / title / summary などを書き換える
 *   3. body に md / code / callout / sample を並べる
 *
 * 1 ページ 1 トピック。長くなってきたら分割して related で繋ぐ。
 */
import { callout, code, defineReference, md, sample } from '@/content/define';

export default defineReference({
  slug: 'template-reference',
  title: 'ページのタイトル',
  category: 'common', // 'animated-api' | 'reanimated' | 'common'
  summary: '一覧カードに出る 1〜2 行の説明。',
  tags: ['タグ'],
  addedAt: '2026-01-01',
  // 関連するサンプルの id
  related: [],
  body: [
    md`
      ## TL;DR

      - 要点を箇条書きで
      - インラインコードは \`useNativeDriver\` のように書く
      - 別ページへのリンクは [こう書く](/reference/easing-basics)
    `,
    code('ts')`
      // フェンス（\`\`\`）を書かずにコードブロックを置ける
      const value = useSharedValue(0);
    `,
    // 本文中にライブサンプルを埋め込む
    sample('fade-in'),
    callout('tip')`
      'info' | 'tip' | 'warn' の 3 種類。補足や注意はこれで目立たせる。
    `,
  ],
});
