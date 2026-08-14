import { code, defineReference, md } from '@/content/define';
import { TAGS } from '@/lib/tags';

export default defineReference({
  slug: 'performance-optimization',
  title: 'パフォーマンスの最適化',
  category: 'animated-api',
  summary: 'React Native のアニメーションでパフォーマンスを最適化するためのポイントをいくつか。',
  tags: [TAGS.BASIC, TAGS.PERFORMANCE],
  addedAt: '2026-08-14',
  related: [],
  body: [
    md`
      ## ネイティブドライバーを使用する

      \`useNativeDriver: true\` を指定することで、アニメーションをネイティブスレッドで実行することができる。これにより、JavaScript スレッドの負荷を軽減し、パフォーマンスを向上させることができる。

      [useNativeDriver について](/reference/use-native-driver)を参照。

      ## アニメーション中のレンダリングを最小限に

      アニメーション中は、できるだけ再レンダリングを避けるようにする。特に、アニメーション対象のコンポーネントの親コンポーネントが再レンダリングされると、パフォーマンスに影響を与える。
    `,
    code('ts')`
      // Bad
      const AnimatedComponent = () => {
        const [animate, setAnimate] = useState(false);
        const fadeAnim = new Animated.Value(0);

        // この useEffect が実行されるたびに Animated.Value が再作成される
        useEffect(() => {
          if (animate) {
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }).start();
          }
        }, [animate]);
      };

      // Good
      const AnimatedComponent = () => {
        const [animate, setAnimate] = useState(false);
        // useRef を使って Animated.Value を保持
        const fadeAnim = useRef(new Animated.Value(0)).current;

        // 以下同じ...
      };
    `,
  ],
});
