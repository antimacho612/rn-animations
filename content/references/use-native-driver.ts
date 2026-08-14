import { callout, code, defineReference, md, sample } from '@/content/define';
import { TAGS } from '@/lib/tags';

export default defineReference({
  slug: 'use-native-driver',
  title: 'useNativeDriver について',
  category: 'animated-api',
  summary: 'アニメーションを JS スレッドから切り離す仕組みと、使えるプロパティの制限。',
  tags: [TAGS.PERFORMANCE],
  addedAt: '2026-08-13',
  related: ['fade-in'],
  body: [
    md`
      ## TL;DR

      - \`useNativeDriver: true\` にすると、アニメーションの計算がネイティブ側に渡り、
        JS スレッドが忙しくてもカクつかない
      - ただし **transform と opacity しか動かせない**
      - \`width\` / \`height\` / \`backgroundColor\` などを動かしたいときは \`false\` にするしかない

      ## なぜ必要か

      既定（\`useNativeDriver: false\`）では、毎フレーム JS スレッドが値を計算して
      ネイティブへ送る。そのため重い処理やナビゲーションの初期化と重なると、
      フレーム落ちして動きがガタつく。

      \`true\` にすると、アニメーションの内容が開始時に一度だけネイティブへ渡され、
      あとはネイティブ側だけで進む。JS が固まっても動き続ける。
    `,
    code('ts')`
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true, // ← これ
      }).start();
    `,
    sample('fade-in'),
    md`
      ## 動かせるプロパティ

      | 分類 | 例 | native driver |
      | --- | --- | --- |
      | transform | translateX / translateY / scale / rotate | ○ |
      | 不透明度 | opacity | ○ |
      | レイアウト | width / height / margin / padding | × |
      | 色・影 | backgroundColor / shadowOpacity | × |

      レイアウトを動かしたい場合、多くは \`scale\` や \`translate\` で代用できる。
      「幅を伸ばす」より「横に拡大する」方が速い、と考えると設計しやすい。
    `,
    callout('warn')`
      対応していないプロパティに \`useNativeDriver: true\` を指定すると、
      実行時に警告が出てアニメーションが動かない。開発中は警告を必ず読むこと。
    `,
    md`
      ## Reanimated ではどうか

      react-native-reanimated は既定で UI スレッド上で動くため、このフラグ自体が存在しない。
      レイアウトや色も含めて UI スレッドで扱える点が大きな違い。
      → [Shared Value と useAnimatedStyle](/reference/reanimated-shared-value)
    `,
  ],
});
