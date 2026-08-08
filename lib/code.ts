import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type Highlighter } from "shiki";

/**
 * 右ペインに表示するコード 1 本分。
 *
 * 実際にこのリポジトリに存在するファイルを読んでいるので、
 * デモを直すと解説側のコードも自動で追従する（教材とコードがズレない）。
 */
export type Snippet = {
  /** ファイルパスをそのまま ID として使う */
  id: string;
  /** タブに表示する名前 */
  label: string;
  /** shiki が生成した <pre> の HTML */
  html: string;
  /** 行番号のガイド表示に使う */
  lineCount: number;
  /** 光らせたい行を文字列から探すために元のコードも持っておく */
  raw: string;
};

export type SnippetSource = {
  /** app ディレクトリからの相対パス（例: "lessons/list-and-key/demos/basic-list.tsx"） */
  path: string;
  label: string;
};

/**
 * ハイライターの生成は重いので 1 プロセスに 1 つだけ作って使い回す。
 * 言語とテーマを絞ってあるのは、フルバンドルを読み込むとビルドが遅くなるため。
 */
let highlighterPromise: Promise<Highlighter> | undefined;

const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "ts", "js", "json", "css", "html", "bash"],
  });
  return highlighterPromise;
};

const langFromPath = (filePath: string) => {
  const ext = path.extname(filePath).slice(1);
  return ext === "mjs" || ext === "cjs" ? "js" : ext || "tsx";
};

export const highlight = async (code: string, lang: string) => {
  const highlighter = await getHighlighter();

  return highlighter.codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    // CSS 変数方式にして、ダークモードの切り替えを CSS 側に任せる
    defaultColor: false,
    transformers: [
      {
        // 各行に行番号を持たせる。スクロール連動のハイライトがこれを見る
        line(node, line) {
          node.properties["data-line"] = line;
        },
      },
    ],
  });
};

export const loadSnippets = async (
  sources: readonly SnippetSource[]
): Promise<Snippet[]> => {
  return Promise.all(
    sources.map(async ({ path: relativePath, label }) => {
      // 読み込み先を app 配下に固定している。
      // 変数だけで組み立てるとビルド時に「プロジェクト全体を配布物に含める」と判断され、
      // デプロイが不必要に重くなるため、"app" をリテラルで挟んで範囲を絞っている
      const raw = await readFile(
        path.join(process.cwd(), "app", relativePath),
        "utf8"
      );
      // ファイル末尾の改行がそのまま空行として表示されるのを防ぐ
      const code = raw.replace(/\n+$/, "");

      return {
        id: relativePath,
        label,
        html: await highlight(code, langFromPath(relativePath)),
        lineCount: code.split("\n").length,
        raw: code,
      };
    })
  );
};

/**
 * 光らせたい行を「コードの中身」から探す。
 *
 * 行番号を解説側に直接書くと、デモを 1 行足しただけで全部ズレる。
 * 目印になる文字列で指定しておけば、コードを直しても解説が追従する。
 *
 * @param from この文字列を含む最初の行が開始行になる
 * @param to  省略すると 1 行だけ。指定すると、開始行以降でこの文字列を含む行までが範囲になる
 */
const findRange = (
  snippet: Snippet,
  from: string,
  to?: string
): readonly [number, number] | undefined => {
  const lines = snippet.raw.split("\n");
  const startIndex = lines.findIndex((line) => line.includes(from));

  if (startIndex === -1) {
    // 目印が見つからないのは、たいていコードを直したのに解説を直し忘れたとき。
    // 黙って全体表示に落とすと気づけないので、開発中は気づけるようにしておく
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[code] "${from}" が ${snippet.id} に見つかりません`);
    }
    return undefined;
  }

  if (!to) return [startIndex + 1, startIndex + 1] as const;

  const relativeEnd = lines
    .slice(startIndex)
    .findIndex((line) => line.includes(to));

  const endIndex = relativeEnd === -1 ? startIndex : startIndex + relativeEnd;

  return [startIndex + 1, endIndex + 1] as const;
};

/**
 * LessonSection にそのまま渡せる形で「どのファイルのどこ」を返す。
 *
 *   <LessonSection {...focus(snippets, PATH, "{members.map", "))}")}>
 */
export const focus = (
  snippets: Snippet[],
  id: string,
  from?: string,
  to?: string
) => {
  const snippet = snippets.find((item) => item.id === id);

  return {
    snippet: id,
    lines: snippet && from ? findRange(snippet, from, to) : undefined,
  };
};
