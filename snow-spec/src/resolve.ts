import * as S from "./snowTree";

export type SnowSymbol = {};

// NOTE:
// OpenAPIにおけるコンポーネントの種類を決定する必要がある(参照が複数ある場合はそれぞれ別の種類に分類される可能性あり)。

export function resolve(input: S.SFile, symbolTable: Map<S.SNode, SnowSymbol>): void {

}
