import * as Nodes from "./syntaxNode";

export interface SymbolObject {
  node: Nodes.AnyNode;
  parentNode: Nodes.AnyNode | undefined;
  container?: Container;
}

export function createSymbol(node: Nodes.AnyNode, parentNode: Nodes.AnyNode | undefined): SymbolObject {
  const symbol: SymbolObject = {
    node: node,
    parentNode: parentNode,
  };
  node.symbol = symbol;
  return symbol;
}

export interface Container {
  symbolTable: Map<string, SymbolObject>;
}

export function createContainer(node: Nodes.AnyNode, parentNode: Nodes.AnyNode | undefined): SymbolObject {
  const symbol = createSymbol(node, parentNode);
  symbol.container = {
    symbolTable: new Map(),
  };
  return symbol;
}
