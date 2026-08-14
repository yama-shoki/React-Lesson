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

/*
  ついでに、どこからも読まれていないデモファイルを探す。
  章を分割・削除したときに取り残されると、コードペインに出ないまま
  リポジトリに残り続ける。
*/

const orphans = [];

for (const entry of await readdir(lessons, { withFileTypes: true })) {
	if (!entry.isDirectory()) continue;

	const demos = path.join(lessons, entry.name, "demos");
	let files;
	try {
		files = await readdir(demos);
	} catch {
		continue;
	}

	const siblings = await Promise.all(
		[
			path.join(lessons, entry.name, "page.tsx"),
			...files.map((f) => path.join(demos, f)),
		].map(async (f) => ({ f, text: await readFile(f, "utf8").catch(() => "") })),
	);

	for (const file of files) {
		const stem = file.replace(/\.[jt]sx?$/, "");
		const used = siblings.some(
			({ f, text }) => !f.endsWith(file) && text.includes(stem),
		);
		if (!used) orphans.push(`${entry.name}/demos/${file}`);
	}
}

if (orphans.length > 0) {
	console.error(`\nどこからも読まれていないデモが ${orphans.length} 件あります\n`);
	for (const o of orphans) console.error(`  - ${o}`);
	process.exit(1);
}

console.log("取り残されたデモはありません");


/*
  章の構成が「本文 → クイズ → まとめ」の順になっているか。

  節の移動・分割を繰り返した結果、クイズが本文より前に来ていたり、
  まとめの節の中に解説が入り込んでいたりした章が実際にあった。
  読み口が章によって変わるのは、59 章ある教材では効いてくる。
*/

const orderProblems = [];

for (const entry of await readdir(lessons, { withFileTypes: true })) {
	if (!entry.isDirectory()) continue;

	let source;
	try {
		source = await readFile(
			path.join(lessons, entry.name, "page.tsx"),
			"utf8",
		);
	} catch {
		continue;
	}

	const quiz = source.indexOf('id="quiz"');
	const summary = source.indexOf('id="summary"');
	if (quiz === -1 || summary === -1) continue;

	if (quiz > summary) {
		orderProblems.push(`${entry.name}: まとめがクイズより前にある`);
	}

	// クイズ節とまとめ節に、見出し h2 が 2 つ以上ある = 別の節が紛れ込んでいる
	for (const [name, at] of [["quiz", quiz], ["summary", summary]]) {
		const next = source.indexOf("<LessonSection", at);
		const end = next === -1 ? source.length : next;
		const headings = source.slice(at, end).match(/<h2>/g)?.length ?? 0;
		if (headings > 1) {
			orderProblems.push(
				`${entry.name}: ${name} の節に見出しが ${headings} 個ある`,
			);
		}
	}
}

if (orderProblems.length > 0) {
	console.error(`\n章の構成が崩れている箇所が ${orderProblems.length} 件あります\n`);
	for (const p of orderProblems) console.error(`  - ${p}`);
	process.exit(1);
}

console.log("章の構成（本文 → クイズ → まとめ）は揃っています");
