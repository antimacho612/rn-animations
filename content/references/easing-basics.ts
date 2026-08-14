import { callout, code, defineReference, md, sample } from '@/content/define';

export default defineReference({
  slug: 'easing-basics',
  title: 'Easing の選び方',
  category: 'common',
  summary: '同じ duration でも印象が変わる。用途ごとの定番カーブを覚える。',
  tags: ['easing', '基本'],
  addedAt: '2026-08-12',
  related: ['shared-value-box'],
  body: [
    md`
      ## TL;DR

      - **画面に入ってくる** → \`ease-out\`（速く始まってゆっくり止まる）
      - **画面から出ていく** → \`ease-in\`（ゆっくり始まって加速）
      - **その場で位置が変わる** → \`ease-in-out\`
      - \`linear\` は進捗バーやローディングなど「等速であってほしい」ものだけ

      下のサンプルで easing を切り替えると、同じ duration でも受ける印象が変わるのが分かる。
    `,
    sample('shared-value-box'),
    md`
      ## 使い方

      Animated API と Reanimated で \`Easing\` のインポート元は違うが、API はほぼ同じ。
    `,
    code('ts')`
      import { Easing } from 'react-native';              // Animated API 用
      import { Easing } from 'react-native-reanimated';   // Reanimated 用

      Easing.linear;
      Easing.out(Easing.cubic);        // 減速
      Easing.inOut(Easing.cubic);      // 両端がなめらか
      Easing.bezier(0.4, 0, 0.2, 1);   // Material の標準カーブ
    `,
    callout('info')`
      Reanimated の \`Easing.bezier()\` は関数ではなく \`{ factory }\` を返す。
      関数として使いたいときは \`Easing.bezier(...).factory()\` を呼ぶ。
    `,
    md`
      ## 迷ったときの目安

      | やりたいこと | カーブ |
      | --- | --- |
      | 出現・登場 | \`out(cubic)\` |
      | 退出・消える | \`in(cubic)\` |
      | 移動・並び替え | \`inOut(cubic)\` / \`bezier(0.4, 0, 0.2, 1)\` |
      | 弾ませたい | \`bounce\` / \`back\` |
      | 等速で見せたい | \`linear\` |

      なお \`spring\` 系は easing を取らない。動きの質は damping / stiffness で決める。
    `,
  ],
});
