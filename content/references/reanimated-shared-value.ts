import { callout, code, defineReference, md, sample } from '@/content/define';
import { TAGS } from '@/lib/tags';

export default defineReference({
  slug: 'reanimated-shared-value',
  title: 'Shared Value と useAnimatedStyle',
  category: 'reanimated',
  summary: 'Reanimated の中心にある 2 つの概念。state ではなく Shared Value で値を持つ理由。',
  tags: [TAGS.BASIC],
  addedAt: '2026-08-14',
  related: ['shared-value-box', 'gesture-drag'],
  body: [
    md`
      ## TL;DR

      - \`useSharedValue\` は **UI スレッド側に住む値**。書き換えても React の再レンダリングは起きない
      - \`useAnimatedStyle\` は Shared Value からスタイルを作る関数。UI スレッドで毎フレーム実行される
      - \`withTiming\` / \`withSpring\` は「値をこう変化させる」という指示を作るヘルパー

      ## 3 行で書ける
    `,
    code('tsx')`
      const progress = useSharedValue(0);

      const animatedStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
      }));

      // どこからでも代入するだけで動き出す
      progress.value = withTiming(1, { duration: 800 });
    `,
    sample('shared-value-box'),
    md`
      ## state と何が違うのか

      | | useState | useSharedValue |
      | --- | --- | --- |
      | 値の置き場所 | JS スレッド | UI スレッド |
      | 更新時の再レンダリング | 起きる | 起きない |
      | 毎フレーム更新 | 重い | 得意 |
      | 読み書き | \`value\` / \`setValue\` | \`ref.value\` |

      毎フレーム変わる値を state に置くと、そのたびに再レンダリングが走って重くなる。
      Shared Value ならレンダリングを挟まず UI スレッド内で完結する。

      ## ひとつの値から複数のスタイルへ

      \`interpolate\` を使うと、0 → 1 の進捗ひとつから位置・角度・色などを派生させられる。
      値を 1 本に絞るとアニメーションの状態管理がとても楽になる。
    `,
    code('ts')`
      const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(progress.value, [0, 1], [-70, 70]) }],
        borderRadius: interpolate(progress.value, [0, 1], [12, 34]),
        backgroundColor: interpolateColor(progress.value, [0, 1], ['#8B5CF6', '#22D3EE']),
      }));
    `,
    callout('info')`
      \`useAnimatedStyle\` に渡した関数は UI スレッドで動く「worklet」。
      その中から通常の JS 関数を呼びたいときは \`runOnJS()\` を挟む必要がある。
    `,
    sample('gesture-drag'),
  ],
});
