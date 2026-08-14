# コンテンツの追加方法

`content/` 配下は Metro の `require.context` で自動収集される。
**index への登録は不要**。ファイルを 1 つ置いて再読み込みすれば一覧・検索・「最近追加」に載る。

```txt
content/
  samples/animated-api/*.tsx   Animated API のサンプル
  samples/reanimated/*.tsx     Reanimated のサンプル
  references/*.ts              リファレンス（1 ページ 1 トピック）
  _templates/                  テンプレート（_ 始まりは収集対象外）
```

## サンプルを追加する

`content/_templates/sample.tsx` を `content/samples/<api>/<id>.tsx` にコピーして書き換える。

Demo コンポーネントが受け取る props は 3 つ。

| props | 説明 |
| --- | --- |
| `playToken` | 値が変わったら最初から再生する。マウント時にも 1 度走る |
| `duration` | コントロールで指定された再生時間 (ms) |
| `easing` | 選択中の easing プリセット。`easing.animated` / `easing.reanimated` を使い分ける |

コントロールを無効にしたいときは `controls` を設定する。理由を書いておくと
コントロール欄に注記として表示される。

```ts
controls: {
  duration: false,
  easing: false,
  disabledReason: 'spring は物理パラメータで動きが決まるため duration / easing は使いません',
}
```

## リファレンスを追加する

`content/_templates/reference.ts` を `content/references/<slug>.ts` にコピーして書き換える。

`body` は次のブロックを並べる。

| ヘルパー | 用途 |
| --- | --- |
| ``md`...` `` | Markdown 本文。共通インデントは自動で除去される |
| ``code('ts')`...` `` | コードブロック。Markdown のフェンスを書かずに済む |
| `sample('fade-in')` | ライブサンプルの埋め込み |
| ``callout('warn')`...` `` | 補足・注意（`info` / `tip` / `warn`） |

本文中のリンクは `/reference/<slug>` や `/sample/<id>` と書けばアプリ内遷移になる。

## 相互リンクについて

`related` は片方に書けば両方から辿れる。

- サンプルの `related` … リファレンスの slug
- リファレンスの `related` … サンプルの id
- リファレンス本文に `sample()` で埋め込んだものも自動で関連扱いになる
