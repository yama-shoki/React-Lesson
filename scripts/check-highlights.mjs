/*
  すべての章の at(...) が指す目印が、実際のデモファイルに存在するか検査する。

  findRange の警告は開発時の console.warn なので、ビルドでは気づけない。
  デモを直して解説側の目印だけ古くなると、ハイライトが黙って消える。
  それを機械的に見つけるためのスクリプト。

  使い方: bun scripts/check-highlights.mjs
*/

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const APP_DIR = path.join(process.cwd(), "app");
const LESSONS_DIR = path.join(APP_DIR, "lessons");

/** SOURCES 配列から path を順番どおりに取り出す */
const parseSources = (source) => {
	const block = source.match(/const SOURCES = \[([\s\S]*?)\] as const;/);
	if (!block) return [];

	return [...block[1].matchAll(/path:\s*"([^"]+)"/g)].map((match) => match[1]);
};

/** const [A, B] = SOURCES.map(...) を名前 → path の対応にする */
const parseAliases = (source, paths) => {
	// 改行して書かれていることもあるので、空白はどこに入ってもよいことにする
	const block = source.match(
		/const \[([^\]]+)\]\s*=\s*SOURCES\.map\(\s*\(source\)\s*=>\s*source\.path,?\s*\);/,
	);
	if (!block) return {};

	const names = block[1].split(",").map((name) => name.trim());

	return Object.fromEntries(
		names.map((name, index) => [name, paths[index]]).filter(([, p]) => p),
	);
};

/** at(NAME, "from", "to") を拾う。引用符はどちらでもよい */
const parseCalls = (source) => {
	const pattern =
		/\bat\(\s*([A-Z0-9_]+)\s*,\s*(?:"([^"]*)"|'([^']*)')\s*(?:,\s*(?:"([^"]*)"|'([^']*)'))?\s*\)/g;

	return [...source.matchAll(pattern)].map((match) => ({
		alias: match[1],
		from: match[2] ?? match[3],
		to: match[4] ?? match[5],
	}));
};

const problems = [];
const entries = await readdir(LESSONS_DIR, { withFileTypes: true });
let checked = 0;

for (const entry of entries) {
	if (!entry.isDirectory()) continue;

	const pagePath = path.join(LESSONS_DIR, entry.name, "page.tsx");

	let source;
	try {
		source = await readFile(pagePath, "utf8");
	} catch {
		continue;
	}

	const paths = parseSources(source);
	const aliases = parseAliases(source, paths);
	const cache = new Map();

	for (const call of parseCalls(source)) {
		const relative = aliases[call.alias];

		if (!relative) {
			problems.push(`${entry.name}: ${call.alias} が SOURCES に対応しない`);
			continue;
		}

		if (!cache.has(relative)) {
			cache.set(relative, await readFile(path.join(APP_DIR, relative), "utf8"));
		}
		const raw = cache.get(relative);

		for (const marker of [call.from, call.to]) {
			if (!marker) continue;

			checked += 1;
			if (!raw.includes(marker)) {
				problems.push(`${entry.name}: "${marker}" が ${relative} にない`);
			}
		}
	}
}

if (problems.length > 0) {
	console.error(`目印が合っていない箇所が ${problems.length} 件あります\n`);
	for (const problem of problems) console.error(`  - ${problem}`);
	process.exit(1);
}

console.log(`目印 ${checked} 件すべて一致しました`);
