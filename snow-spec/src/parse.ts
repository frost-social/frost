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
    if (p.match("type")) {
      children.push(parseTypeDecl(p));
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

function parseRoute(p: Parser, routeAttrs: S.SAttr[]): S.SRoute {
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
    if (p.match("header")) {
      children.push(parseHeader(p, attrs));
      attrs = [];
      continue;
    }
    if (p.match("query")) {
      children.push(parseQuery(p));
      attrs = [];
      continue;
    }
    if (p.match("body")) {
      children.push(parseBody(p, attrs));
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
    attrs: routeAttrs,
  };
}

function parseHeader(p: Parser, headerAttrs: S.SAttr[]): S.SHeader {
  p.next();

  p.expect(TokenKind.Word);
  p.throwIfExistErrors();

  const name = p.getValue();
  p.next();
  p.throwIfExistErrors();

  let type;
  if (p.match(TokenKind.Colon)) {
    p.next();
    type = parseType(p);
  }

  p.nextWith(TokenKind.SemiColon);
  p.throwIfExistErrors();

  return {
    kind: "header",
    name: name,
    type: type,
    attrs: headerAttrs,
  };
}

function parseQuery(p: Parser): S.SQuery {
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
    if (p.match("field")) {
      children.push(parseField(p, attrs));
      attrs = [];
      continue;
    }
    break;
  }

  p.nextWith(TokenKind.CloseBrace);
  p.throwIfExistErrors();

  return {
    kind: "query",
    items: children,
  };
}

function parseBody(p: Parser, bodyAttrs: S.SAttr[]): S.SBody {
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
    if (p.match("field")) {
      children.push(parseField(p, attrs));
      attrs = [];
      continue;
    }
    break;
  }

  p.nextWith(TokenKind.CloseBrace);
  p.throwIfExistErrors();

  return {
    kind: "body",
    items: children,
    attrs: bodyAttrs,
  };
}

function parseField(p: Parser, fieldAttrs: S.SAttr[]): S.SField {
  p.next();

  p.expect(TokenKind.Word);
  p.throwIfExistErrors();

  const name = p.getValue();
  p.next();
  p.throwIfExistErrors();

  let type;
  if (p.match(TokenKind.Colon)) {
    p.next();
    type = parseType(p);
  }

  p.nextWith(TokenKind.SemiColon);
  p.throwIfExistErrors();

  return {
    kind: "field",
    name: name,
    type: type,
    attrs: fieldAttrs,
  };
}

function parseResponse(p: Parser, responseAttrs: S.SAttr[]): S.SResponse {
  p.next();

  p.expect(TokenKind.NumberLiteral);
  p.throwIfExistErrors();

  const code = p.getValue();
  p.next();

  let type;
  if (p.match(TokenKind.Colon)) {
    p.next();
    type = parseType(p);
  }

  p.nextWith(TokenKind.SemiColon);
  p.throwIfExistErrors();

  return {
    kind: "response",
    statusCode: code,
    type: type,
    attrs: responseAttrs,
  };
}

function parseType(p: Parser): S.SType {
  if (p.match(TokenKind.Word)) {
    return parseRefType(p);
  }
  if (p.match(TokenKind.OpenBrace)) {
    return parseObjectType(p);
  }
  throw new Error("unexpected token");
}

function parseRefType(p: Parser): S.SRefType {
  const name = p.getValue();
  p.next();

  return {
    kind: "refType",
    name: name,
  };
}

function parseObjectType(p: Parser): S.SObjectType {
  p.next();

  const children = [];
  while (true) {
    if (children.length > 0) {
      // コンマがあれば消費して継続
      // コンマがなければフィールド列の終わりと判断
      if (p.match(TokenKind.Comma)) {
        p.next();
      } else {
        break;
      }
    }
    if (p.match(TokenKind.Word)) {
      children.push(parseObjectField(p));
      continue;
    }
    // いずれかでもなければフィールド列の終わりと判断
    break;
  }

  p.nextWith(TokenKind.CloseBrace);
  p.throwIfExistErrors();

  return {
    kind: "objectType",
    children: children,
  };
}

function parseObjectField(p: Parser): S.SObjectField {
  const name = p.getValue();
  p.next();

  p.nextWith(TokenKind.Colon);
  p.throwIfExistErrors();

  const type = parseType(p);

  return {
    kind: "objectField",
    name: name,
    value: type,
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

function parseTypeDecl(p: Parser): S.STypeDecl {
  p.next();

  p.expect(TokenKind.Word);
  p.throwIfExistErrors();

  const name = p.getValue();
  p.next();
  p.throwIfExistErrors();

  let type;
  if (p.match(TokenKind.Eq)) {
    p.next();
    type = parseType(p);
  }

  p.nextWith(TokenKind.SemiColon);
  p.throwIfExistErrors();

  return {
    kind: "typeDecl",
    name: name,
    type: type,
  };
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
