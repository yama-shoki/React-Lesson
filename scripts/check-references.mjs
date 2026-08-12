/*
  本文中の「Part X の『章タイトル』」という参照が、実在の章を指しているか検査する。

  章タイトルを 1 文字でも間違えると、読者はサイドバーを探して見つけられない。
  実際に「関数を値として渡す」（正しくは「扱う」）という誤記が 2 箇所あった。

  使い方: bun scripts/check-references.mjs
*/

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const curriculum = await readFile(path.join(root, "lib/curriculum.ts"), "utf8");

/** 実在する章タイトルの一覧 */
const titles = new Set(
	[...curriculum.matchAll(/title: "([^"]+)"/g)].map((m) => m[1]),
);

/**
 * 「Part 3 の「リストと key」で」のような、章を名指ししている書き方だけを拾う。
 * 「Part 9 で見た『古い結果が…』」のような、概念の引用は対象外にしたいので、
 * Part とカギ括弧のあいだに助詞しか挟まないものに絞る。
 */
const pattern = /Part \d+\s*の\s*「([^」]+)」/g;

const problems = [];
const lessons = path.join(root, "app/lessons");

for (const entry of await readdir(lessons, { withFileTypes: true })) {
	if (!entry.isDirectory()) continue;

	const file = path.join(lessons, entry.name, "page.tsx");
	let source;
	try {
		source = await readFile(file, "utf8");
	} catch {
		continue;
	}

	for (const match of source.matchAll(pattern)) {
		// 本文では && を &amp;&amp; と書くので、比べる前に戻す
		const quoted = match[1]
			.replace(/&amp;/g, "&")
			.replace(/&quot;/g, '"')
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">");
		if (!titles.has(quoted)) {
			problems.push(`${entry.name}: 「${quoted}」という章はありません`);
		}
	}
}

if (problems.length > 0) {
	console.error(`章の参照が合っていない箇所が ${problems.length} 件あります\n`);
	for (const problem of problems) console.error(`  - ${problem}`);
	process.exit(1);
}

console.log("章の参照はすべて実在する章を指しています");
