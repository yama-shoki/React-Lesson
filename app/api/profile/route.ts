const PROFILES: Record<string, { name: string; role: string }> = {
	"1": { name: "さとう", role: "デザイナー" },
	"2": { name: "すずき", role: "エンジニア" },
};

/**
 * デモ用の API。
 *
 * 1 番だけ、わざと遅く返す。
 * 「先に頼んだほうが、あとから返ってくる」という並び替わりを
 * 毎回同じように再現するため（ランダムだと教材にならない）。
 */
export async function GET(request: Request) {
	const id = new URL(request.url).searchParams.get("id") ?? "1";
	const delay = id === "1" ? 1500 : 300;

	await new Promise((resolve) => setTimeout(resolve, delay));

	return Response.json({ id, ...(PROFILES[id] ?? PROFILES["1"]) });
}
