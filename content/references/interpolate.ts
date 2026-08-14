import { callout, code, defineReference, md, sample } from '@/content/define';
import { TAGS } from '@/lib/tags';

export default defineReference({
  slug: 'interpolate',
  title: 'interpolate で値を変換する',
  category: 'common',
  summary: '進捗の値を別の範囲・別の単位にマッピングする。角度や色などへの変換の基本。',
  tags: [TAGS.BASIC],
  addedAt: '2026-08-14',
  related: ['rotate-loop', 'shared-value-box', 'translate-sequence', 'reanimated-shared-value'],
  body: [
    md`
      ## TL;DR

      - \`interpolate\` は「入力範囲のどこにいるか」を「出力範囲の対応する値」に変換する
      - \`inputRange: [0, 1]\`、\`outputRange: [0, 100]\` なら、入力 0.5 は出力 50 になる
      - 出力は数値だけでなく文字列（\`'0deg'\` → \`'360deg'\` など）も指定できる
      - 範囲を超えた入力をどう扱うかは extrapolate（Reanimated では extrapolation）オプションで決める

      Animated API では \`Animated.Value\` のメソッド、Reanimated では独立した関数として提供されている。
    `,
    md`
      ## 書き方の違い

      同じ「0〜1 の進捗を 0deg〜360deg の回転に変換する」を両方の API で書くとこうなる。
    `,
    code('ts')`
      // Animated API — Animated.Value のメソッドとして呼ぶ
      const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });

      // Reanimated — 独立した関数。第一引数に number を渡す
      const rotateDeg = interpolate(progress.value, [0, 1], [0, 360]);
    `,
    md`
      Animated API は \`inputRange\` / \`outputRange\` をオブジェクトで渡すが、Reanimated は
      \`interpolate(value, inputRange, outputRange, extrapolation?)\` と位置引数で渡す点に注意。
    `,
    sample('rotate-loop'),
    md`
      ## 範囲外の値はどうなるか（extrapolate）

      入力が \`inputRange\` の外に出たときの挙動を指定できる。

      | 値 | 挙動 |
      | --- | --- |
      | \`clamp\` | 範囲の端でそれ以上変化させず、出力の最小・最大で止める |
      | \`extend\`（デフォルト） | 範囲の外でも直線的に延長して計算する |
      | \`identity\` | 範囲外では入力値をそのまま出力する |

      スクロール連動などで「範囲外に飛び出て変な値にならないようにしたい」ときは \`clamp\` を使うことが多い。
    `,
    code('ts')`
      // Animated API — inputRange / outputRange と同じオブジェクトに extrapolate を追加
      const opacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

      // Reanimated — 第 4 引数（または Extrapolation.CLAMP）で指定
      const opacity = interpolate(scrollY.value, [0, 100], [1, 0], Extrapolation.CLAMP);
    `,
    callout('warn')`
      Reanimated では \`'clamp'\` のような文字列ではなく \`Extrapolation.CLAMP\` / \`Extrapolation.EXTEND\` /
      \`Extrapolation.IDENTITY\`（\`react-native-reanimated\` からインポート）を使う。
    `,
    md`
      ## ひとつの値から複数の見た目を作る

      \`interpolate\` の強みは、1 本の進捗値から位置・角度・色など複数のプロパティを同時に導出できること。
      state を増やさずに済むので、アニメーションの管理がシンプルになる。
    `,
    sample('shared-value-box'),
    callout('tip')`
      \`inputRange\` は昇順である必要がある（\`[0, 1]\` はよいが \`[1, 0]\` は不可）。
      値を反転させたいときは \`outputRange\` 側を \`[1, 0]\` のように逆順にする。
    `,
  ],
});
