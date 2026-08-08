export const logs: string[] = [];

// 呼ばれたら記録するだけの関数
const say = () => {
  logs.push("よばれました");
};

// 関数を受け取って、それを 2 回呼ぶ関数
const runTwice = (fn: () => void) => {
  fn();
  fn();
};

// 関数そのものを渡す。ここで括弧をつけると、
// 渡すより先に実行されてしまい、渡るのは実行結果になる
runTwice(say);
