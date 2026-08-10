const MEMBERS = [
	"さとう",
	"すずき",
	"たかはし",
	"やまだ",
	"いとう",
	"わたなべ",
];

/**
 * デモ用の API。呼ばれるたびにランダムな 3 人を返す。
 *
 * 毎回違う結果が返るようにしてあるのは、
 * 「本当に取り直したのか」を画面で確かめられるようにするため。
 */
export async function GET() {
	// 通信にかかる時間を再現する
	await new Promise((resolve) => setTimeout(resolve, 700));

	const shuffled = [...MEMBERS].sort(() => Math.random() - 0.5);

	return Response.json({ members: shuffled.slice(0, 3) });
}
