import fs from "node:fs";
import process from "node:process";

const sourceFile = `${process.cwd()}/dist/index.html`;
const distFile = `${process.cwd()}/dist/index.ejs`;

// htmlファイル読み込み
const source = fs.readFileSync(sourceFile, { encoding: "utf8" });

// ejsのコメントを全てejs構文に置換
const dist = source.replace(/<!--[ \t]*(%.+?%)[ \t]*-->/gs, "<$1>");

// ejsファイルへ書き込み
fs.writeFileSync(distFile, dist);
