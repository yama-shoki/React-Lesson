// async を付けると、その中で await が使えるようになる
export const loadMembers = async (path: string) => {
	try {
		// 1. サーバーに問い合わせて、返事が来るまで待つ
		const response = await fetch(path);

		// 2. 404 や 500 でも fetch は成功扱い。自分で確かめる
		if (!response.ok) {
			throw new Error(`サーバーが ${response.status} を返しました`);
		}

		// 3. 本文を JavaScript の値に変換する。これも待つ
		const data = await response.json();

		return `取得できました: ${data.members.join("、")}`;
	} catch (error) {
		// 通信が切れた場合も、上で投げた場合も、ここに来る
		return error instanceof Error ? `失敗: ${error.message}` : "失敗しました";
	}
};
