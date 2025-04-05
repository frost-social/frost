type Token = {
  kind: TokenKind,
  value: string | undefined,
};

function TOKEN(kind: TokenKind, value?: string): Token {
  return {
    kind,
    value,
  };
}

enum TokenKind {
  EOF,
  Word,
  NumberLiteral,

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

const digit = /^[0-9]$/;
const wordChar = /^[A-Za-z0-9_]$/;

// NOTE: なんかもうよく分からん

export class Scanner {
  private input: string | undefined;
  private offset: number;
  private _bufChar: string | undefined;

  column: number;
  line: number;
  token: Token | undefined;
  error: string | undefined;

  initialize(input: string) {
    this.input = input;
    this.offset = 0;
    this._bufChar = undefined;
    this.column = 1;
    this.line = 1;
    this.token = undefined;
    this.error = undefined;
  }

  /**
   * 現在offsetが指している文字を退避し、offsetを次の位置へ移動させる。
  */
  private forwardChar() {
    this._bufChar = this.input!.slice(this.offset, this.offset + 1);
    this.offset++;
  }

  /**
   * 現在offsetが指している文字を取得する。
  */
  private peekChar() {
    return this.input!.slice(this.offset, this.offset + 1);
  }

  /**
   * 退避させた文字を取得する。
  */
  private char(): string | undefined {
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
      this.forwardChar();
      if (this.char() == null) {
        this.token = TOKEN(TokenKind.EOF);
        return;
      }
      this.skipCommentLine();
      this.skipCommentRange();

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
          if (this.peekChar() == '\n')
          {
              this.forwardChar();
          }
          this.column = 1;
          this.line += 1;
          continue;

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
          this.column += 1;
          this.forwardChar();
          if () {

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
      if (this.char() != null && digit.test(this.char()!)) {
          //beginLocation = new TokenLocation(this.column, this.line);
          let wholeNumber = "";

          wholeNumber += this.char();
          this.column += 1;

          // 後続の文字を読む
          while (true)
          {
              const ch = this.peekChar();
              if (ch == null || !(ch >= '0' && ch <= '9')) break;

              this.forwardChar();
              wholeNumber += ch;
              this.column += 1;
          }

          const value = wholeNumber;
          this.token = TOKEN(TokenKind.NumberLiteral, value);
          return;
      }

      // 識別子またはキーワード
      if (this.char() != null && wordChar.test(this.char()!)) {
        //beginLocation = new TokenLocation(this.column, this.line);
        let value = "";

        value += this.char();
        this.column += 1;

        // 後続の文字を読む
        while (true) {
          const ch = this.peekChar();
          if (ch == null || !(
              ch >= '0' && ch <= '9' ||
              ch >= 'A' && ch <= 'Z' ||
              ch >= 'a' && ch <= 'z' ||
              ch == '_')
          ) {
            break;
          }

          this.forwardChar();
          value += ch;
          this.column += 1;
        }

        this.token = TOKEN(TokenKind.Word, value);
        return;
      }

      this.error = `Unexpected char: '${this.char()}' ${this.line}:${this.column}`;
    }
  }

  peek() {
    throw new Error("not implemented yet");
  }

  private skipCommentLine(): void {
    while (true) {
      if (this.char() == null) {
        break;
      }
      if (this.char() == '\n') {
        this.forwardChar();
        break;
      }
      this.forwardChar();
    }
  }

  private skipCommentRange(): void {
    while (true) {
      if (this.char() == null) {
        break;
      }
      if (this.char() == '*') {
        this.forwardChar();
        if (this.char() == '/') {
          this.forwardChar();
          break;
        }
        continue;
      }
      this.forwardChar();
    }
  }
}
