"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Input } from "@/components/ui/input";
import { memo, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

/*
  本来ここは「API を呼んで、返ってきた結果を state に入れる」処理。
  デモでは通信の代わりに回数だけ数えている。
  lint は「effect の中で直接 setState するな」と止めてくるが、
  実物では await を挟むので、この形自体は現実のコードに近い。
*/
/* eslint-disable react-hooks/set-state-in-effect */

// 検索の回数が変わったときだけ描き直される
const SearchBox = memo(function SearchBox({ count }: { count: number }) {
  return (
    <RenderBox title="落ち着いてから検索">
      検索した回数: <strong>{count}</strong>
    </RenderBox>
  );
});

export function Debounced() {
  const [keyword, setKeyword] = useState("");

  // 打つのが 500ms 止まってから、こちらの値が追いつく
  const [debouncedKeyword] = useDebounce(keyword, 500);

  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    if (!debouncedKeyword) return;

    // 見張るのは「落ち着いたほうの値」
    setSearchCount((count) => count + 1);
  }, [debouncedKeyword]);

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="検索してみる"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <p className="text-sm text-muted-foreground">
        入力欄: {keyword || "（空）"} / 検索に使う値:{" "}
        {debouncedKeyword || "（空）"}
      </p>

      {/* 検索が走ったときだけ光らせたいので、打鍵の巻き添えを memo で切る */}
      <SearchBox count={searchCount} />
    </div>
  );
}
