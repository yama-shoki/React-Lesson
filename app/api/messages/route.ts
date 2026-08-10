import { NextResponse } from "next/server";

/*
  Part 9「データを送る」で使う、練習用の受け口。

  実際に保存はしない。教材として見せたいのは
  「送る → 待つ → 成功か失敗かで表示を分ける」の一巡なので、
  わざと 0.8 秒かけて返し、空の本文は 400 で断る。
*/

export async function POST(request: Request) {
	const body = await request.json().catch(() => null);
	const text = typeof body?.text === "string" ? body.text.trim() : "";

	await new Promise((resolve) => setTimeout(resolve, 800));

	if (!text) {
		return NextResponse.json(
			{ message: "本文が空です" },
			{ status: 400 },
		);
	}

	// 「サーバー側でも失敗しうる」ことを見せるための仕掛け
	if (text.includes("エラー")) {
		return NextResponse.json(
			{ message: "サーバー側で問題が起きました" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ id: text.length, text });
}
