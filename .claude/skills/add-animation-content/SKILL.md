---
name: add-animation-content
description: >-
  rn-animations リポジトリで、ユーザーがアニメーション技法のお題やソース（URL、コードスニペット、ライブラリのドキュメント、
  「〇〇みたいな動き」といった説明など）を渡してきたときに使うスキル。content/samples・content/references に
  同じ内容の既存コンテンツがすでにあるか調べ、なければサンプル/リファレンスとして新規作成する。
  「〇〇のサンプル追加して」「このURLの動き、うちにある？」「このコードをサンプル化して」「〇〇のリファレンス書いて」
  「このアニメーション、実装したい」といった依頼、animation/gesture/easing/spring 系の URL や
  react-native-reanimated / Animated API のコード貼り付けで積極的に発動する。単なる bug fix や
  UI 実装依頼（サンプル・リファレンス以外の変更）には使わない。
---

# アニメーションコンテンツの追加

`content/samples/**` と `content/references/**` は Metro の `require.context` で自動収集される（[content/README.md](../../content/README.md) 参照）。
つまり、このスキルの仕事は「ファイルを 1 つ正しく置く」ことに尽きる。index への登録や配線は不要。

進め方は 調査 → 判定 → 作成 → 検証 → 報告 の 5 ステップ。**調査を飛ばして作り始めない** — 同じ効果の
サンプルが `title` や `tags` だけ違う形ですでにあることはよくあるため、最初に必ず既存コンテンツと突き合わせる。

## 1. お題を理解する

入力の形に応じて情報を集める。

- **URL** — WebFetch で内容を取得する。CodePen / Twitter(X) / ブログ記事など、実装の詳細まで書いていないページもある。
  動きの要点（何がどう動くか、時間ベースか物理ベースか、ジェスチャー起点か）が分かればよく、無理に元コードを一字一句移植する必要はない。
- **ソースコード** — 貼られたコードや指定ファイルをそのまま読む。Web/CSS のコードでも、React Native で再現するとしたら何に相当するかを考える。
- **お題のみ（「バウンドして止まるカード」等）** — そのまま技法名として扱ってよい。曖昧なら後述の重複チェックの結果と合わせてユーザーに確認する。

## 2. 重複を調べる

`content/samples/**/*.tsx` と `content/references/*.ts` を Glob で列挙し、各ファイルの `title` / `summary` / `tags` / `id または slug` を読む（Demo 本体や body 全文までは読まなくてよい — メタデータだけで大半は判定できる）。
`content/registry.ts` の `searchSamples` / `searchReferences` が使うのと同じ観点（title・summary・id・tags の部分一致）に加えて、**名前が違っても本質的に同じ動きなら重複とみなす**（キーワード一致だけに頼らない）。

判定は 3 パターン:

| 判定 | 対応 |
| --- | --- |
| 完全に同じ内容が既にある | 作成せず、該当ファイルを示して終了する |
| 似ているが差分がある（例: `fade-in` はあるが `fade-in-out` はない） | **差分を具体的に説明した上でユーザーに確認する** — 新規作成するか、既存ファイルの `controls` や `body` を拡張するかはユーザーに委ねる |
| 該当なし | そのまま作成に進む |

## 3. 何を作るか決める（サンプル / リファレンス / 両方）

内容から自動判定する。
迷ったら「動くデモ 1 つで説明が完結する = サンプルのみ」「概念・使い分け・注意点の説明が要る = リファレンスのみ／サンプル埋め込み」の軸で考える。

- **単体の動くデモで説明が完結する** → サンプルのみ
- **概念・比較・落とし穴の説明が必要** → リファレンスのみ、または `sample()` で既存/新規サンプルを埋め込む
- **両方要る**（新しい技法で、動くデモと使い方の説明の両方が要る） → 両方作成し、`related` で相互に繋ぐ
  （片方に書けば `registry.ts` の backlink 解決で双方から辿れる — 両側に書く必要はない）

新規作成する場合、既存のタグ語彙（`content/samples/**` と `content/references/*.ts` の `tags` を横断的に見る）を再利用できないか先に確認する。
タグが増えすぎると一覧の絞り込みが効かなくなるため、似た意味のタグがすでにあればそれに合わせる。

## 4. API を決める（サンプルの場合）

ソースから Animated API か Reanimated かが明確ならそれに従う。
**明確でない場合は必ずユーザーに確認する** （例: 「Reanimated 版で作りますか？Animated API 版も両方作りますか？」）。
すでにあるサンプルの内訳（`content/samples/animated-api/` と `content/samples/reanimated/` を Glob で見る）を伝えると、ユーザーが「どちらを増やすか」を判断しやすい。

「両方の API を並べて比較する」自体がこのリポジトリのコンセプトなので、同じ技法を両 API で作るのは自然な選択肢として提案してよい。

## 5. 作成する

- サンプル: `content/_templates/sample.tsx` を `content/samples/<animated-api|reanimated>/<id>.tsx` にコピーして書き換える
- リファレンス: `content/_templates/reference.ts` を `content/references/<slug>.ts` にコピーして書き換える

書き方の詳細（`SampleRenderProps` の 3 props、`controls.disabledReason` の使いどころ、`md`/`code`/`sample`/`callout` ヘルパー）は [content/README.md](../../content/README.md) と `content/types.ts` / `content/define.ts` を参照。
迷ったら既存ファイルを 1〜2 個読んで文体・粒度を揃える（`summary` は一覧カードに出る 1〜2 行、`tags` は 1〜3 個程度、`addedAt` は作成日）。

気をつけたい点:

- `id` / `slug` はファイル名と揃える（kebab-case）
- `playToken` が変わったら最初から再生し直す前提で `Demo` を書く（`useEffect` の依存に `playToken` を含める）
- `duration` / `easing` を使わない動き（`withSpring` など物理ベース）は `controls.duration: false` / `controls.easing: false` と `disabledReason` を設定する
- サンプルの色・見た目は既存サンプル（`#8B5CF6` や `#6366F1` 系のアクセントカラーなど）のトーンに合わせる — テーマトークン（`theme/`）はアプリ UI 用で、サンプルの Demo 内では使わない
- リファレンス本文からサンプルへのリンクは `sample('<id>')` で埋め込む、通常の文中リンクは`[こう書く](/sample/<id>)` / `[こう書く](/reference/<slug>)`

## 6. 検証する

1. `npm run typecheck` — 型エラーがないか
2. `npm run lint` — ESLint エラーがないか
3. `related` の相互リンクを確認する — サンプル/リファレンスを両方作った場合、片方にだけ `related` を書けば双方向に辿れる（`content/registry.ts` の `relatedReferences` / `relatedSamples` が backlink を解決する）。書き忘れていないか、書いた側の id/slug のスペルが合っているかをチェックする。

require.context によって自動収集されるため、追加でファイルを登録する作業は不要。

## 7. 報告する

ユーザーには次を簡潔に伝える。

- 調査結果（重複はなかった／似たものがあったので確認を取った、など）
- 作成したファイルパスと、サンプル/リファレンスどちらを作ったか
- typecheck / lint の結果
- 動作確認は実機/シミュレータでの目視確認が必要な旨（このスキル自体は起動・スクリーンショットまでは行わない）
