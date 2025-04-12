import * as Nodes from "./syntaxNode";
import { TOKEN, Token, TokenKind } from "./token";

// このモジュールではソースコードを読み取って構文ツリーを構築します。

export function parse(input: string): Nodes.FileNode {
  const p = new Parser();
  p.initialize(input);

  let attrs = [];
  const children = [];
  while (true) {
    if (p.match(TokenKind.OpenBracket)) {
      attrs.push(parseAttr(p));
      continue;
    }
    if (p.match("POST") || p.match("GET") || p.match("PUT") || p.match("PATCH") || p.match("DELETE")) {
      children.push(parseEndpoint(p, attrs));
      attrs = [];
      continue;
    }
    if (p.match("component")) {
      children.push(parseComponentDecl(p));
      attrs = [];
      continue;
    }
    break;
  }

  return {
    kind: "file",
    children: children,
  };
}

function parseEndpoint(p: Parser, parentAttrs: Nodes.AttrNode[]): Nodes.EndpointDeclNode {
  const method = p.getValue();
  p.next();

  p.expect(TokenKind.Word);
  p.throwIfExistErrors();
  const path = p.getValue();
  p.next();

  p.nextWith(TokenKind.OpenBrace);
  p.throwIfExistErrors();

  let attrs = [];
  const children = [];
  while (true) {
    if (p.match(TokenKind.OpenBracket)) {
      attrs.push(parseAttr(p));
      continue;
    }
    if (p.match("request")) {
      children.push(parseRequest(p, attrs));
      attrs = [];
      continue;
    }
    if (p.match("response")) {
      children.push(parseResponse(p, attrs));
      attrs = [];
      continue;
    }
    break;
  }

  p.nextWith(TokenKind.CloseBrace);
  p.throwIfExistErrors();

  return {
    kind: "endpointDecl",
    method: method,
    path: path,
    children: children,
    attrs: parentAttrs,
  };
}

function parseRequest(p: Parser, parentAttrs: Nodes.AttrNode[]): Nodes.RequestNode {
  p.next();

  p.nextWith(TokenKind.OpenBrace);
  p.throwIfExistErrors();

  let attrs = [];
  const children = [];
  while (true) {
    if (p.match(TokenKind.OpenBracket)) {
      attrs.push(parseAttr(p));
      continue;
    }
    if (p.match("headers") || p.match("query") || p.match("body")) {
      children.push(parseComponentBlock(p, attrs));
      attrs = [];
      continue;
    }
    break;
  }

  p.nextWith(TokenKind.CloseBrace);
  p.throwIfExistErrors();

  return {
    kind: "request",
    blocks: children,
    attrs: parentAttrs,
  };
}

function parseResponse(p: Parser, parentAttrs: Nodes.AttrNode[]): Nodes.ResponseNode {
  p.next();

  p.expect(TokenKind.NumberLiteral);
  p.throwIfExistErrors();
  const code = p.getValue();
  p.next();

  p.nextWith(TokenKind.OpenBrace);
  p.throwIfExistErrors();

  let attrs = [];
  const children = [];
  while (true) {
    if (p.match(TokenKind.OpenBracket)) {
      attrs.push(parseAttr(p));
      continue;
    }
    if (p.match("headers") || p.match("body")) {
      children.push(parseComponentBlock(p, attrs));
      attrs = [];
      continue;
    }
    break;
  }

  p.nextWith(TokenKind.CloseBrace);
  p.throwIfExistErrors();

  return {
    kind: "response",
    statusCode: code,
    blocks: children,
    attrs: parentAttrs,
  };
}

function parseComponentBlock(p: Parser, parentAttrs: Nodes.AttrNode[]): Nodes.ComponentBlockNode {
  const blockKind = p.getValue();
  p.next();

  p.nextWith(TokenKind.Colon);
  p.throwIfExistErrors();

  const component = parseComponent(p);

  p.nextWith(TokenKind.SemiColon);
  p.throwIfExistErrors();

  return {
    kind: "componentBlock",
    blockKind: blockKind,
    component: component,
    attrs: parentAttrs,
  };
}

function parseComponent(p: Parser): Nodes.ComponentNode {
  if (p.match(TokenKind.Word)) {
    return parseComponentRef(p);
  }
  if (p.match(TokenKind.OpenBrace)) {
    return parseObject(p);
  }
  throw new Error("unexpected token");
}

function parseComponentRef(p: Parser): Nodes.ComponentRefNode {
  const name = p.getValue();
  p.next();

  return {
    kind: "componentRef",
    name: name,
  };
}

function parseObject(p: Parser): Nodes.ObjectNode {
  p.next();

  let attrs = [];
  const children = [];
  while (true) {
    if (p.match(TokenKind.OpenBracket)) {
      attrs.push(parseAttr(p));
      continue;
    }
    if (p.match(TokenKind.Word)) {
      children.push(parseObjectField(p, attrs));
      attrs = [];
      continue;
    }
    // コンマがあれば消費して継続
    // コンマがなければフィールド列の終わりと判断
    if (p.match(TokenKind.Comma)) {
      p.next();
    } else {
      break;
    }
  }

  p.nextWith(TokenKind.CloseBrace);
  p.throwIfExistErrors();

  return {
    kind: "object",
    children: children,
  };
}

function parseObjectField(p: Parser, parentAttrs: Nodes.AttrNode[]): Nodes.ObjectFieldNode {
  const name = p.getValue();
  p.next();

  p.nextWith(TokenKind.Colon);
  p.throwIfExistErrors();

  const type = parseComponent(p);

  return {
    kind: "objectField",
    name: name,
    value: type,
    attrs: parentAttrs,
  };
}

function parseComponentDecl(p: Parser): Nodes.ComponentDeclNode {
  p.next();

  p.expect(TokenKind.Word);
  p.throwIfExistErrors();
  const name = p.getValue();
  p.next();

  let component;
  if (p.match(TokenKind.Eq)) {
    p.next();
    component = parseComponent(p);
  }

  p.nextWith(TokenKind.SemiColon);
  p.throwIfExistErrors();

  return {
    kind: "componentDecl",
    name: name,
    component: component,
  };
}

function parseAttr(p: Parser): Nodes.AttrNode {
  p.next();

  p.expect(TokenKind.Word);
  p.throwIfExistErrors();
  const key = p.getValue();
  p.next();

  let value;
  if (!p.match(TokenKind.CloseBracket)) {
    value = parseValue(p);
  }

  p.nextWith(TokenKind.CloseBracket);
  p.throwIfExistErrors();

  return {
    kind: "attr",
    key: key,
    value: value,
  };
}

function parseValue(p: Parser): Nodes.ValueNode {
  if (p.match(TokenKind.StringLiteral)) {
    const value = p.getValue();
    p.next();
    return {
      kind: "stringValue",
      value: value,
    };
  }
  if (p.match("true") || p.match("false")) {
    const value = p.getValue();
    p.next();
    return {
      kind: "boolValue",
      value: value,
    };
  }
  if (p.match(TokenKind.NumberLiteral)) {
    const value = p.getValue();
    p.next();
    return {
      kind: "numberValue",
      value: value,
    };
  }
  throw new Error("unexpected token");
}

class Parser {
  errors: string[] = [];
  private scanner = new Scanner();

  initialize(input: string) {
    this.scanner.initialize(input);
    this.errors = [];

    this.next();
  }

  private generateError(message: string) {
    this.errors.push(message);
  }

  throwIfExistErrors() {
    if (this.errors.length > 0) {
      throw new Error("Parsing error\n" + this.errors.map(x => "- " + x).join("\n"));
    }
  }

  getValue(): string {
    if (this.scanner.token!.value == null) {
      throw new Error("invalid operation");
    }
    return this.scanner.token!.value;
  }

  getKind(): TokenKind {
    return this.scanner.token!.kind;
  }

  match(kindOrWord: TokenKind | string): boolean {
    if (this.scanner.token == null) {
      return false;
    }
    if (typeof kindOrWord == "string") {
      return (
        this.scanner.token.kind == TokenKind.Word &&
        this.scanner.token.value == kindOrWord
      );
    } else {
      return (this.scanner.token.kind == kindOrWord);
    }
  }

  expect(kind: TokenKind): boolean {
    if (this.scanner.token == null) {
      return false;
    }
    if (this.scanner.token.kind != kind) {
      this.generateError("unexpected token");
      return false;
    }

    return true;
  }

  next(): boolean {
    if (!this.scanner.read()) {
      if (this.scanner.error != null) {
        this.generateError(this.scanner.error!);
      }
      return false;
    }
    return true;
  }

  nextWith(kindOrWord: TokenKind | string): boolean {
    if (typeof kindOrWord == "string") {
      if (
        this.scanner.token!.kind != TokenKind.Word ||
        this.scanner.token!.value != kindOrWord
      ) {
        this.generateError("unexpected token");
        return false;
      }
    } else {
      if (this.scanner.token!.kind != kindOrWord) {
        this.generateError("unexpected token");
      }
    }

    if (!this.scanner.read()) {
      if (this.scanner.error != null) {
        this.generateError(this.scanner.error!);
      }
      return false;
    }

    return true;
  }
}

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
            if (ch == '' || !digit.test(ch)) {
              break;
            }

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
          // 先読みして必要に応じて消費する
          const ch = this.peekChar();
          if (ch == '' || !wordChar.test(ch)) {
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
