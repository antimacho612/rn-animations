# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

An Expo Router app that's a browsable catalog of React Native animation techniques — interactive
samples (Animated API and react-native-reanimated side by side) plus written reference docs. UI
text, code comments, and content are in Japanese. Expo SDK 54 / React Native 0.81 / React 19,
React Compiler and typed routes are both enabled (`app.json` → `experiments`).

## Commands

```bash
npm start          # expo start (Metro)
npm run android    # expo start --android
npm run ios        # expo start --ios
npm run web        # expo start --web
npm run typecheck  # tsc --noEmit
npm run lint       # expo lint
```

There is no test runner configured in this repo.

## Architecture

### Content is data-driven, not hand-registered

`content/registry.ts` uses Metro's `require.context` to auto-collect every file under
`content/samples/**` and `content/references/**` (files/dirs starting with `_` are skipped, so
`content/_templates/` never shows up). **Adding a new sample or reference is just adding a file —
nothing to register in an index.** See [content/README.md](content/README.md) for the authoring
workflow; copy from `content/_templates/sample.tsx` or `content/_templates/reference.ts`.

- `content/types.ts` — `SampleDefinition` (id, api: `'animated' | 'reanimated'`, controls,
  `Demo` component) and `ReferenceDefinition` (slug, category, `body: DocBlock[]`).
- `content/define.ts` — authoring helpers: `defineSample`/`defineReference`, and template-literal
  builders `md`, `code(lang)`, `sample(id)` (embeds a live demo in a reference body), and
  `callout(tone)`. All dedent common leading whitespace automatically.
- `content/registry.ts` also resolves bidirectional links between samples and references via each
  definition's `related` field (only needs to be declared on one side), plus search/tag/"recently
  added" helpers used by the list screens.

### Sample playback

`components/sample/use-sample-player.ts` owns a sample's runtime state — `playToken` (bump to
replay from the start), `duration`, `easing`, `playing` — and every `Demo` component just receives
these as `SampleRenderProps` and reacts to `playToken` changes in an effect. `lib/easing-presets.ts`
holds one shared preset table exposing both the Animated API's `Easing` and Reanimated's `Easing`
under the same key, since a sample can be written against either API.

### Routing

`app/(tabs)/` — ホーム / サンプル一覧 / リファレンス一覧 / 設定. Detail screens live outside the
tab group at `app/sample/[id].tsx` and `app/reference/[slug].tsx`, looked up from the registry by
`id`/`slug`.

### Theming

`theme/theme-provider.tsx` exposes `useTheme()`/`useColors()` (React Context), persists the user's
mode choice (`system`/`light`/`dark`) to AsyncStorage, and resolves the active `light`/`dark`
palette from `theme/tokens.ts`. All colors, spacing, radius, and fonts should come from these
tokens rather than hardcoded values, so light/dark stay in sync.

### Misc

- `lib/highlight.ts` is a small hand-rolled tokenizer (no external syntax-highlighter dependency)
  used by `components/doc/code-block.tsx` for both the reference docs and sample source display.
- `@/*` path alias maps to the repo root (`tsconfig.json`).
