// コンポーネントは、JSX を返すただの関数
function Greeting() {
  return <p className="rounded-md border p-2.5">こんにちは</p>;
}

// 大文字で始まっていれば、タグとして書ける
export function Greetings() {
  return (
    <div className="flex flex-col gap-2.5">
      <Greeting />
      <Greeting />
      <Greeting />
    </div>
  );
}
