import { Scanner, TokenKind } from "./scan";
import * as S from "./snowTree";

export function parse(input: string): S.SFile {
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
      children.push(parseRoute(p, attrs));
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

function parseRoute(p: Parser, parentAttrs: S.SAttr[]): S.SRoute {
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
    kind: "route",
    method: method,
    path: path,
    children: children,
    attrs: parentAttrs,
  };
}

function parseRequest(p: Parser, parentAttrs: S.SAttr[]): S.SRequest {
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

function parseResponse(p: Parser, parentAttrs: S.SAttr[]): S.SResponse {
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

function parseComponentBlock(p: Parser, parentAttrs: S.SAttr[]): S.SComponentBlock {
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

function parseComponent(p: Parser): S.SComponent {
  if (p.match(TokenKind.Word)) {
    return parseComponentRef(p);
  }
  if (p.match(TokenKind.OpenBrace)) {
    return parseObjectType(p);
  }
  throw new Error("unexpected token");
}

function parseComponentRef(p: Parser): S.SComponentRef {
  const name = p.getValue();
  p.next();

  return {
    kind: "componentRef",
    name: name,
  };
}

function parseObjectType(p: Parser): S.SObjectType {
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
    kind: "objectType",
    children: children,
  };
}

function parseObjectField(p: Parser, parentAttrs: S.SAttr[]): S.SObjectField {
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

function parseComponentDecl(p: Parser): S.SComponentDecl {
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

function parseAttr(p: Parser): S.SAttr {
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

function parseValue(p: Parser): S.SValue {
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
