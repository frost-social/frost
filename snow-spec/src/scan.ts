const digit = /^[0-9]$/;
const wordChar = /^[A-Za-z0-9_/]$/;

export class Scanner {
  private input: string | undefined;
  private nextOffset: number = 0;
  private _bufChar: string = '';
  private column: number = 1;
  private line: number = 1;
  token: Token | undefined;
  error: string | undefined;

  initialize(input: string) {
    this.input = input;
    this.nextOffset = 0;
    this._bufChar = '';
    this.column = 1;
    this.line = 1;
    this.token = undefined;
    this.error = undefined;
  }

  /**
   * 次の文字を読み取り、その文字を格納する。
  */
  private readChar(): void {
    this._bufChar = this.input!.slice(this.nextOffset, this.nextOffset + 1);
    this.nextOffset++;
  }

  /**
   * 次の文字を先読みし、戻り値として返す。
  */
  private peekChar(): string {
    return this.input!.slice(this.nextOffset, this.nextOffset + 1);
  }

  /**
   * 最後に読み取った文字を取得する。
  */
  private char(): string {
    return this._bufChar;
  }

  read(): boolean {
    this.readInternal();
    return this.token != null;
  }

  private readInternal(): void {
    if (this.input == null) {
      throw new Error("not initialized");
    }
    this.token = undefined;
    while (true) {
      this.readChar();
      if (this.char() == '') {
        this.token = TOKEN(TokenKind.EOF);
        return;
      }

      switch (this.char()) {
        case " ":
          this.column += 1;
          continue;

        case "\t":
          this.column += 1;
          continue;

        // LF
        case "\n":
          this.column = 1;
          this.line += 1;
          continue;

        // CR
        case "\r":
          // LFが続いていたら一緒に消費する
          if (this.peekChar() == '\n') {
            this.readChar();
          }
          this.column = 1;
          this.line += 1;
          continue;

        case "\"":
          this.scanStringLiteral();
          return;

        case "(":
          this.column += 1;
          this.token = TOKEN(TokenKind.OpenBrace);
          return;

        case ")":
          this.column += 1;
          this.token = TOKEN(TokenKind.CloseBrace);
          return;

        case ",":
          this.column += 1;
          this.token = TOKEN(TokenKind.Comma);
          return;

        case "/":
          if (this.peekChar() == '*') {
            this.column += 2;
            this.skipCommentRange();
            continue;
          }
          if (this.peekChar() == '/') {
            this.column += 2;
            this.skipCommentLine();
            continue;
          }
          break;

        case ":":
          this.column += 1;
          this.token = TOKEN(TokenKind.Colon);
          return;

        case ";":
          this.column += 1;
          this.token = TOKEN(TokenKind.SemiColon);
          return;

        case "=":
          this.column += 1;
          this.token = TOKEN(TokenKind.Eq);
          return;

        case "[":
          this.column += 1;
          this.token = TOKEN(TokenKind.OpenBracket);
          return;

        case "]":
          this.column += 1;
          this.token = TOKEN(TokenKind.CloseBracket);
          return;

        case "{":
          this.column += 1;
          this.token = TOKEN(TokenKind.OpenBrace);
          return;

        case "}":
          this.column += 1;
          this.token = TOKEN(TokenKind.CloseBrace);
          return;
      }

      // 数字
      if (this.char() != '' && digit.test(this.char())) {
          //beginLocation = new TokenLocation(this.column, this.line);
          let wholeNumber = "";

          wholeNumber += this.char();
          this.column += 1;

          // 後続の文字を読む
          while (true)
          {
            // 先読みして必要に応じて消費する
            const ch = this.peekChar();
            if (ch == '' || !(ch >= '0' && ch <= '9')) break;
            this.readChar();

            wholeNumber += ch;
            this.column += 1;
          }

          const value = wholeNumber;
          this.token = TOKEN(TokenKind.NumberLiteral, value);
          return;
      }

      // 識別子またはキーワード
      if (this.char() != '' && wordChar.test(this.char())) {
        //beginLocation = new TokenLocation(this.column, this.line);
        let value = "";

        value += this.char();
        this.column += 1;

        // 後続の文字を読む
        while (true) {
          const ch = this.peekChar();
          if (ch == '' || !(
              ch >= '0' && ch <= '9' ||
              ch >= 'A' && ch <= 'Z' ||
              ch >= 'a' && ch <= 'z' ||
              ch == '_')
          ) {
            break;
          }

          this.readChar();
          value += ch;
          this.column += 1;
        }

        this.token = TOKEN(TokenKind.Word, value);
        return;
      }

      this.error = `Unexpected char: '${this.char()}' ${this.line}:${this.column}`;
      return;
    }
  }

  peek() {
    throw new Error("not implemented yet");
  }

  private scanStringLiteral() {
    //beginLocation = new TokenLocation(this.column, this.line);
    let value = "";
    while (true) {
      const ch = this.peekChar();
      if (ch == '') {
        throw new Error("unexpected EOF");
      }
      if (ch == "\"") {
        this.readChar();
        break;
      }

      this.readChar();
      value += ch;
      this.column += 1;
    }

    this.token = TOKEN(TokenKind.StringLiteral, value);
  }

  private skipCommentLine(): void {
    while (true) {
      this.readChar();
      if (this.char() == '') {
        break;
      }
      if (this.char() == '\r') {
        // LFが続いていたら一緒に消費する
        if (this.peekChar() == '\n') {
          this.readChar();
        }
        this.column = 1;
        this.line += 1;
      }
      if (this.char() == '\n') {
        this.column = 1;
        this.line += 1;
        break;
      }
      this.column += 1;
    }
  }

  private skipCommentRange(): void {
    while (true) {
      this.readChar();
      if (this.char() == '') {
        break;
      }
      if (this.char() == '*') {
        if (this.peekChar() == '/') {
          this.readChar();
          break;
        }
      }
    }
  }
}

export type Token = {
  kind: TokenKind,
  value: string | undefined,
};

export function TOKEN(kind: TokenKind, value?: string): Token {
  return {
    kind,
    value,
  };
}

export enum TokenKind {
  EOF,
  Word,
  NumberLiteral,
  StringLiteral,

  /** "(" */
  OpenParen,

  /** ")" */
  CloseParen,

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
