import { Scanner, TokenKind } from "./scan";

type N = NFile | NAttr | NRoute | NHeader | NQuery | NBody | NField | NResponse | NRefType | NObjectType | NTypeDecl;
type NFileMember = NRoute | NTypeDecl;
type NRouteMember = NHeader | NQuery | NBody | NResponse | NTypeDecl;
type NType = NRefType | NObjectType;

type NFile = {
  kind: 'file',
  children: NFileMember[];
};

type NAttr = {
  kind: 'attr',
  key: N,
  value: N,
};

type NRoute = {
  kind: 'route',
  method: string,
  path: string,
  name: string,
  children: NRouteMember[],
  attrs: NAttr[],
};

type NHeader = {
  kind: "header",
  name: string,
  type: NType | undefined,
  attrs: NAttr[],
};

type NQuery = {
  kind: "query",
  items: NField[],
};

type NBody = {
  kind: "body",
  items: N[],
  attrs: NAttr[],
};

type NField = {
  kind: "field",
  name: string,
  type: NType | undefined,
  attrs: NAttr[],
};

type NResponse = {
  kind: "response",
  statusCode: string,
  type: NType | undefined,
  attrs: NAttr[],
};

type NRefType = {
  kind: "refType",
  name: string,
};

type NObjectType = {
  kind: "objectType",
};

type NTypeDecl = {
  kind: "typeDecl",
  name: string,
  type: NType,
};

export function parse(input: string) {
  const p = new Parser();
  p.initialize(input);
}

function parseFile(p: Parser): NFile {
  throw new Error("not implemented yet");
}

function parseAttr(p: Parser): NAttr {
  throw new Error("not implemented yet");
}

function parseRoute(p: Parser): NRoute {
  throw new Error("not implemented yet");
}

function parseHeader(p: Parser): NHeader {
  throw new Error("not implemented yet");
}

function parseQuery(p: Parser): NQuery {
  throw new Error("not implemented yet");
}

function parseBody(p: Parser): NBody {
  throw new Error("not implemented yet");
}

function parseField(p: Parser): NField {
  throw new Error("not implemented yet");
}

function parseResponse(p: Parser): NResponse {
  throw new Error("not implemented yet");
}

function parseRefType(p: Parser): NRefType {
  throw new Error("not implemented yet");
}

function parseObjectType(p: Parser): NObjectType {
  throw new Error("not implemented yet");
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

  getKind() {
    return this.scanner.token.kind;
  }

  match(kindOrWord: TokenKind | string): boolean {
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
        this.scanner.token.kind != TokenKind.Word ||
        this.scanner.token.value != kindOrWord
      ) {
        this.generateError("unexpected token");
        return false;
      }
    } else {
      if (this.scanner.token.kind != kindOrWord) {
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
