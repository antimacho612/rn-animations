import { callout, code, defineReference, md, sample } from '@/content/define';
import { TAGS } from '@/lib/tags';

export default defineReference({
  slug: 'loop-animations',
  title: '繰り返しアニメーション（loop / repeat）',
  category: 'common',
  summary: 'Animated.loop と withRepeat で同じ動きを繰り返す。無限ループの止め方と反転の作り方。',
  tags: [TAGS.BASIC],
  addedAt: '2026-08-14',
  related: ['rotate-loop'],
  body: [
    md`
      ## TL;DR

      - \`Animated.loop(animation)\` は 1 つのアニメーションをそのまま繰り返す
      - 既定では \`iterations: -1\`（無限）。有限回数にしたいときだけ数値を渡す
      - 無限ループは **自分で stop() しない限り止まらない** — アンマウント時に必ず止める
      - 「往復」させたいなら reverse 用の timing を並べるか、Reanimated の \`withRepeat\` を使う
    `,
    sample('rotate-loop'),
    md`
      ## Animated.loop のオプション

      \`Animated.loop\` は第 2 引数でループ回数などを調整できる。
    `,
    code('ts')`
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        {
          iterations: -1, // 既定値。-1 は無限、3 なら 3 回で止まる
          resetBeforeIteration: true, // 既定値。次周回の前に値を開始位置へ戻す
        }
      ).start();
    `,
    md`
      \`resetBeforeIteration\` を \`false\` にすると、値をリセットせずに次の周回へ進む。
      \`toValue\` を毎回変えるなど、値を積み上げていきたい特殊なケース向け。
      普段の「同じ動きを繰り返す」用途では既定の \`true\` のままでよい。
    `,
    callout('warn')`
      無限ループは \`start()\` した時点から自走し続ける。画面を離れてもアンマウント時に
      \`stop()\` を呼ばなければ動き続け、CPU を無駄に使う。\`useEffect\` の cleanup で
      \`loop.stop()\` を呼ぶこと（\`rotate-loop\` サンプルの実装を参照）。
    `,
    md`
      ## 往復させたいとき

      \`Animated.loop\` はアニメーションを最初から繰り返すだけで、逆再生はしてくれない。
      「行って戻る」ような動きにしたいなら、往復ぶんを \`sequence\` にまとめてからループさせる。
    `,
    code('ts')`
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    `,
    md`
      ## Reanimated の withRepeat

      Reanimated には往復専用のオプションが最初から用意されている。第 3 引数の
      \`reverse\` を \`true\` にするだけで、行き→戻りを自動で作ってくれる。
    `,
    code('ts')`
      progress.value = withRepeat(
        withTiming(1, { duration: 600 }),
        -1,   // 繰り返し回数。-1 で無限
        true  // true で往復（reverse）、false だと最初から繰り返すだけ
      );
    `,
    md`
      | | Animated.loop | withRepeat |
      | --- | --- | --- |
      | 無限ループ | \`iterations: -1\`（既定） | 第 2 引数に \`-1\`（既定） |
      | 往復 | 自前で sequence を組む | 第 3 引数 \`reverse\` |
      | 停止 | 返り値の \`.stop()\` | \`cancelAnimation(sharedValue)\` |

      止め方の作法が違う点に注意。Shared Value の基本は
      [Shared Value と useAnimatedStyle](/reference/reanimated-shared-value) を参照。
    `,
  ],
});
