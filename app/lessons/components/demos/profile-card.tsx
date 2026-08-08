// 小さい部品を作って
function Avatar() {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border font-semibold">
      さ
    </div>
  );
}

function Name() {
  return (
    <div>
      <p className="font-semibold">さとう</p>
      <p className="text-muted-foreground">デザイナー</p>
    </div>
  );
}

// 組み合わせて大きい部品にする
export function ProfileCard() {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <Avatar />
      <Name />
    </div>
  );
}
