# rn-animations

React Native のアニメーションを「読む」だけでなく「動かして」おぼえるためのカタログアプリ。

- **リファレンス** — 学習してまとめた Animated API / react-native-reanimated のメモを 1 ページ 1 トピックで読む
- **サンプル** — 実際に動くアニメーションを、再生・duration・easing を変えながら確かめる
- 両者は相互にリンクしていて、メモから実物へ / 実物から解説へ行き来できる
- ライト / ダークテーマ対応（システム追従・手動切り替え、設定は次回起動時も保持）

コンテンツは自分で書き足していく前提で、**`content/` にファイルを 1 つ置けば一覧・検索・相互リンクに載る** 構成になっている。

## セットアップ

```bash
npm install
```

```bash
npx expo start
```

出力された QR / メニューから、開発ビルド・iOS シミュレータ・Android エミュレータ・Expo Go のいずれかで開く。

| スクリプト | 内容 |
| --- | --- |
| `npm start` | 開発サーバーを起動 |
| `npm run ios` / `npm run android` / `npm run web` | プラットフォームを指定して起動 |
| `npm run typecheck` | `tsc --noEmit` で型チェック |
| `npm run lint` | ESLint |

## コンテンツを追加する

追加手順とテンプレートの使い方は **[content/README.md](content/README.md)** にまとめてある。

- サンプル → `content/samples/<animated-api|reanimated>/<id>.tsx`
- リファレンス → `content/references/<slug>.ts`
- テンプレートは `content/_templates/` にある（`_` 始まりは読み込み対象外）
- **index への登録は不要**。Metro の `require.context` が自動で拾う

## ディレクトリ構成

```txt
app/                    画面（expo-router のファイルベースルーティング）
  (tabs)/               ホーム / サンプル / リファレンス / 設定
  sample/[id].tsx       サンプル詳細
  reference/[slug].tsx  リファレンス詳細

content/                コンテンツ（ここだけ触れば増やせる）
  types.ts              サンプル / リファレンスの型定義
  define.ts             defineSample / defineReference / md / code / sample / callout
  registry.ts           require.context による自動収集・検索・相互リンク
  samples/              アニメーションサンプル
  references/           リファレンスページ
  _templates/           コピー元のテンプレート

components/
  sample/               ステージ・コントロール・再生状態フック
  doc/                  Markdown レンダラ・コードブロック
  ui/                   汎用 UI（テキスト・カード・チップ・セグメント等）

theme/                  デザイントークン / テーマ Provider / Navigation テーマ
lib/                    easing プリセット・簡易シンタックスハイライタ
```

## 仕組みのメモ

### サンプルの再生

サンプル本体（`Demo`）が受け取るのは 3 つの props だけ。

| props | 説明 |
| --- | --- |
| `playToken` | 値が変わったら最初から再生する。マウント時にも 1 度走る |
| `duration` | コントロールで指定された再生時間 (ms) |
| `easing` | 選択中の easing プリセット。`easing.animated` / `easing.reanimated` を使い分ける |

状態は `components/sample/use-sample-player.ts` の `useSamplePlayer` が持っていて、
duration や easing を変えるとその場で再生し直す。

`Animated.spring` やジェスチャーのように duration / easing の概念がないサンプルは、
`controls` でコントロールを無効化し、その理由を画面に表示する。

```ts
controls: {
  duration: false,
  easing: false,
  disabledReason: 'spring は物理パラメータで動きが決まるため duration / easing は使わない',
}
```

### easing プリセット

`lib/easing-presets.ts` に、Animated API 用と Reanimated 用の easing を 1 つのテーブルで持っている。
どちらの `Easing` もほぼ同じ API なので、サンプル側は使う方を選ぶだけでよい。

### テーマ

`theme/tokens.ts` の配色トークンを `useTheme()` 経由で参照する。
React Navigation のテーマと StatusBar にも同じトークンを流しているので、切り替えはアプリ全体に反映される。

## 技術スタック

Expo SDK 54 / expo-router 6 / React Native 0.81 / React 19 / react-native-reanimated 4 / TypeScript

New Architecture 有効。Reanimated 4 は `react-native-worklets` に依存し、Babel プラグインは `babel-preset-expo` が自動設定するため追加設定は不要（[Expo SDK 54 のドキュメント](https://docs.expo.dev/versions/v54.0.0/sdk/reanimated/)）。
