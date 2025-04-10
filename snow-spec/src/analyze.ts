import * as Nodes from "./syntaxNode";
import * as Symbols from "./symbolNode";

// このモジュールでは構文ツリーからシンボルグラフを構築します。

// NOTE:
// OpenAPIにおけるコンポーネントの種類を決定する必要がある(参照が複数ある場合はそれぞれ別の種類に分類される可能性あり)。

export function analyze(input: Nodes.FileNode): Symbols.FileSymbol {
  throw new Error("not implemented yet");
}
