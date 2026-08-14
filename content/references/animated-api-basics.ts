import { callout, code, defineReference, md, sample } from '@/content/define';

export default defineReference({
  slug: 'animated-api-basics',
  title: 'Animated API の基本',
  category: 'animated-api',
  summary: 'React Native 標準の Animated API を「値・定義・ラップ」の 3 ステップで押さえる。',
  tags: ['基本', 'Animated'],
  addedAt: '2026-08-14',
  related: ['fade-in', 'translate-sequence'],
  body: [
    md`
      ## TL;DR

      - Animated API は 3 ステップで作る
        1. アニメーションさせたい値を \`Animated.Value\` で管理する
        2. 値の変化を \`Animated.timing\` などで定義する
        3. 対象を \`Animated.View\` などでラップして値を流し込む
      - \`useNativeDriver: true\` を付けると UI スレッドで動く（[詳しくはこちら](/reference/use-native-driver)）
      - 複数の動きは \`Animated.sequence\` / \`Animated.parallel\` で組み合わせる

      ## 1. 値をつくる

      アニメーションさせたい値は \`Animated.Value\` で持つ。再レンダリングのたびに作り直さないよう、
      \`useRef\` に入れておくのが定番。
    `,
    code('ts')`
      // 数値ひとつ
      const opacity = useRef(new Animated.Value(0)).current;

      // XY 座標をまとめて扱いたいとき
      const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    `,
    md`
      ## 2. 変化のしかたを定義して start()

      \`Animated.timing\` は「何 ms かけて」「どのカーブで」値を変えるかを決める。
      定義しただけでは動かず、\`.start()\` を呼んで初めて走る。
    `,
    code('ts')`
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start();
    `,
    md`
      ## 3. Animated コンポーネントでラップ

      通常の \`View\` には \`Animated.Value\` を渡せない。\`Animated.View\` / \`Animated.Text\` /
      \`Animated.ScrollView\` などを使うか、自作コンポーネントを
      \`Animated.createAnimatedComponent()\` で包む。
    `,
    sample('fade-in'),
    md`
      ## 組み合わせる

      \`sequence\` は順番に、\`parallel\` は同時に、\`stagger\` は少しずつずらして実行する。
      いずれも「アニメーションの配列」を受け取って、ひとつのアニメーションとして扱えるようにするもの。
    `,
    sample('translate-sequence'),
    callout('tip')`
      再生し直すときは \`setValue()\` で初期値に戻してから \`start()\` する。
      \`reset()\` もあるが、途中で止めた場合の挙動が分かりにくいので \`setValue()\` の方が確実。
    `,
  ],
});
