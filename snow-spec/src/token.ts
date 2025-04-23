// ソースコード中の字句を定義します。

export interface Token {
  kind: TokenKind;
  value: string | undefined;
}

export enum TokenKind {
  EOF,
  Word,
  NumberLiteral,
  StringLiteral,

  /** "," */
  Comma,

  /** ":" */
  Colon,

  /** ";" */
  SemiColon,

  /** "=" */
  Eq,

  /** "[" */
  OpenBracket,

  /** "]" */
  CloseBracket,

  /** "{" */
  OpenBrace,

  /** "}" */
  CloseBrace,
}

export function TOKEN(kind: TokenKind, value?: string): Token {
  return {
    kind,
    value,
  };
}
