// 1 秒かかる処理のつもり。この 1 行は書けなくて構わない
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ✕ 待たない書き方
export const withoutAwait = (add: (line: string) => void) => {
	add("1. お茶を注文した");
	wait(1000).then(() => add("2. お茶が届いた"));
	add("3. 席に座った");
};

// ◯ 待つ書き方。await のところで、いったん止まる
export const withAwait = async (add: (line: string) => void) => {
	add("1. お茶を注文した");
	await wait(1000);
	add("2. お茶が届いた");
	add("3. 席に座った");
};
