// 受け取る値の形を決める
type Props = {
  name: string;
  // ? を付けた項目は、渡さなくてもよい
  role?: string;
};

function Member({ name, role }: Props) {
  return (
    <div className="rounded-md border p-3">
      <p className="font-semibold">{name}</p>
      <p className="text-muted-foreground">{role ?? "役割は未設定"}</p>
    </div>
  );
}

export function PropsBasic() {
  return (
    <div className="flex flex-col gap-2.5">
      <Member name="さとう" role="デザイナー" />
      {/* role を渡さなくてもエラーにならない */}
      <Member name="すずき" />
    </div>
  );
}
