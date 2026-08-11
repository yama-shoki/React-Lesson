"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function BooleanSoup() {
  useTrackDemoRender();

  // 真偽値を並べると、ありえない組み合わせが作れてしまう
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isError, setIsError] = useState(false);

  const send = (shouldFail: boolean) => {
    setIsLoading(true);
    setIsDone(false);
    setIsError(false);

    setTimeout(() => {
      setIsLoading(false);
      if (shouldFail) setIsError(true);
      else setIsDone(true);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => send(false)}>
          送信（成功する）
        </Button>
        <Button size="sm" variant="outline" onClick={() => send(true)}>
          送信（失敗する）
        </Button>
        <Button
          size="sm"
          variant="outline"
          // 3 つとも true。画面の指示どおりには、こうも書けてしまう
          onClick={() => {
            setIsLoading(true);
            setIsDone(true);
            setIsError(true);
          }}
        >
          壊す
        </Button>
      </div>

      <p className="text-sm">
        {isLoading && "送信中…　"}
        {isDone && "送信しました　"}
        {isError && "失敗しました　"}
        {!isLoading && !isDone && !isError && "待機中"}
      </p>
    </div>
  );
}
