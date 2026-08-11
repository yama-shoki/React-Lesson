/*
  "use client" が付いていない = Server Component。
  サーバー側で await できるので、データが揃うまでの間だけ
  Suspense の fallback が代わりに表示される。
*/

async function getMembers() {
  // 実際の API 呼び出しの代わり。誰の環境でも必ず 2 秒かかる
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return ["田中", "佐藤", "鈴木", "高橋"];
}

export async function SlowList() {
  const members = await getMembers();

  return (
    <ul className="flex h-24 flex-wrap items-center gap-2">
      {members.map((member) => (
        <li key={member} className="rounded-md border px-3 py-1.5">
          {member}
        </li>
      ))}
    </ul>
  );
}
