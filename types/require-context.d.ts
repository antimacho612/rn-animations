/**
 * Metro が対応している `require.context` の型定義。
 * expo-router 自身も同じ仕組みで app ディレクトリを読み込んでいる。
 */
declare namespace NodeJS {
  interface RequireContext {
    keys(): string[];
    <T = unknown>(id: string): T;
    resolve(id: string): string;
    id: string;
  }

  interface Require {
    context(
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp,
      mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once'
    ): RequireContext;
  }
}
