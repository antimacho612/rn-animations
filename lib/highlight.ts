/**
 * 依存を増やさないための最小限のシンタックスハイライタ。
 * TS / TSX / JS を「それらしく」色分けできれば十分という割り切り。
 */

export type TokenType =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'number'
  | 'fn'
  | 'tag'
  | 'punctuation';

export type Token = { type: TokenType; value: string };

const KEYWORDS = new Set([
  'as', 'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue',
  'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally',
  'for', 'from', 'function', 'if', 'import', 'in', 'instanceof', 'interface',
  'let', 'new', 'null', 'of', 'return', 'satisfies', 'static', 'switch', 'this',
  'throw', 'true', 'try', 'type', 'typeof', 'undefined', 'var', 'void', 'while',
  'yield',
]);

const PATTERNS: { type: TokenType; re: RegExp }[] = [
  // コメント
  { type: 'comment', re: /^\/\/[^\n]*/ },
  { type: 'comment', re: /^\/\*[\s\S]*?\*\// },
  // 文字列（テンプレートリテラル含む）
  { type: 'string', re: /^`(?:\\[\s\S]|[^`\\])*`/ },
  { type: 'string', re: /^'(?:\\[\s\S]|[^'\\\n])*'/ },
  { type: 'string', re: /^"(?:\\[\s\S]|[^"\\\n])*"/ },
  // JSX タグ / コンポーネント名
  { type: 'tag', re: /^<\/?[A-Z][\w.]*/ },
  { type: 'tag', re: /^<\/?[a-z][\w-]*(?=[\s/>])/ },
  // 数値
  { type: 'number', re: /^\d[\w.]*/ },
];

const IDENTIFIER = /^[A-Za-z_$][\w$]*/;
const PUNCTUATION = /^[{}()[\]<>.,;:=+\-*/%!&|?~^]+/;
const WHITESPACE = /^\s+/;

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let rest = source;

  const push = (type: TokenType, value: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last.type === type) last.value += value;
    else tokens.push({ type, value });
  };

  while (rest.length > 0) {
    const whitespace = WHITESPACE.exec(rest);
    if (whitespace) {
      push('plain', whitespace[0]);
      rest = rest.slice(whitespace[0].length);
      continue;
    }

    const pattern = PATTERNS.find(({ re }) => re.test(rest));
    if (pattern) {
      const matched = pattern.re.exec(rest)![0];
      push(pattern.type, matched);
      rest = rest.slice(matched.length);
      continue;
    }

    const identifier = IDENTIFIER.exec(rest);
    if (identifier) {
      const word = identifier[0];
      const after = rest.slice(word.length);
      if (KEYWORDS.has(word)) push('keyword', word);
      else if (/^\s*\(/.test(after)) push('fn', word);
      else push('plain', word);
      rest = after;
      continue;
    }

    const punctuation = PUNCTUATION.exec(rest);
    if (punctuation) {
      push('punctuation', punctuation[0]);
      rest = rest.slice(punctuation[0].length);
      continue;
    }

    push('plain', rest[0]);
    rest = rest.slice(1);
  }

  return tokens;
}
