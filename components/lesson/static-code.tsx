import { highlight } from "@/lib/code";

/**
 * 本文の途中に置く、短いコードの引用。
 *
 * 右ペインに出すほどではないが、文章だけでは伝わらないときに使う。
 * サーバー側でハイライトまで済ませるので、クライアントには HTML しか渡らない。
 */
export const StaticCode = async ({
  code,
  lang = "tsx",
}: {
  code: string;
  lang?: string;
}) => {
  const html = await highlight(code.trim(), lang);

  return (
    <div
      className="static-code not-prose my-5 overflow-auto rounded-lg border bg-[var(--code-bg)]"
      // 中身は教材内に直接書いたコード。外部入力は通らない
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
