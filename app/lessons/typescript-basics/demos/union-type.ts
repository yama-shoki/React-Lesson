// 取りうる値そのものを列挙して、型にできる
export type Status = "todo" | "doing" | "done";

// Status のすべてに対して、ひとつずつ用意することを強制される。
// 増やし忘れがあるとエラーになる
const statusLabel: Record<Status, string> = {
  todo: "未着手",
  doing: "作業中",
  done: "完了",
};

const tasks: { title: string; status: Status }[] = [
  { title: "資料をまとめる", status: "done" },
  { title: "レビューを依頼する", status: "doing" },
  { title: "公開する", status: "todo" },
];

export const rows = tasks.map((task) => ({
  title: task.title,
  label: statusLabel[task.status],
}));
