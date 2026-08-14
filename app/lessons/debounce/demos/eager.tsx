"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Input } from "@/components/ui/input";
import { memo, useEffect, useState } from "react";

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
    <RenderBox title="打つたびに検索">
      検索した回数: <strong>{count}</strong>
    </RenderBox>
  );
});

export function Eager() {
  const [keyword, setKeyword] = useState("");
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    if (!keyword) return;

    // 本来はここで API を呼ぶ。回数だけ数えている
    setSearchCount((count) => count + 1);
  }, [keyword]);

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="検索してみる"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      {/* 検索が走ったときだけ光らせたいので、打鍵の巻き添えを memo で切る */}
      <SearchBox count={searchCount} />
    </div>
  );
}
