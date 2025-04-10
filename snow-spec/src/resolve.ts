import * as Syntax from "./syntaxNode";

export type SnowSymbol = {};

// NOTE:
// OpenAPIにおけるコンポーネントの種類を決定する必要がある(参照が複数ある場合はそれぞれ別の種類に分類される可能性あり)。

export function resolve(input: Syntax.FileNode, symbolTable: Map<Syntax.SyntaxNode, SnowSymbol>): void {

}
