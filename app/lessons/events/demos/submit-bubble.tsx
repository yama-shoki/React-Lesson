"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

/** 送信を止めた版と、止めていない版 */
export function SubmitForm() {
  const [log, setLog] = useState<string[]>([]);
  const [text, setText] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    // これを書かないと、ブラウザがページを再読み込みしてしまう
    event.preventDefault();
    setLog((current) => [...current, `送信: ${text || "（空）"}`]);
  };

  return (
    <RenderBox title="form の送信">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="何か書いて Enter か「送信」"
            aria-label="送信するテキスト"
          />
          {/* type を書かないと submit になる。ここでは意図してそうしている */}
          <Button size="sm" type="submit">
            送信
          </Button>
        </div>

        <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
          {log.length === 0 ? (
            <li>まだ送信していません</li>
          ) : (
            log.map((line, index) => <li key={index}>{line}</li>)
          )}
        </ul>
      </form>
    </RenderBox>
  );
}

/** クリックが親まで伝わることを見せる */
export function Bubbling() {
  const [log, setLog] = useState<string[]>([]);
  const [stop, setStop] = useState(false);

  const add = (who: string) => setLog((current) => [...current, who]);

  return (
    <div className="flex flex-col gap-3">
      <Button size="sm" variant="outline" onClick={() => setStop(!stop)}>
        伝わるのを止める: {stop ? "する" : "しない"}
      </Button>

      {/* 行全体が押せる。その中に削除ボタンがある、というよくある形 */}
      <div
        onClick={() => add("行が押された")}
        className="cursor-pointer rounded-md border p-4"
      >
        <div className="flex items-center gap-3">
          <span>牛乳を買う</span>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={(event) => {
              if (stop) event.stopPropagation();
              add("削除ボタンが押された");
            }}
          >
            消す
          </Button>
        </div>
      </div>

      <RenderBox title="押された順">
        <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
          {log.length === 0 ? (
            <li>まだ何も押していません</li>
          ) : (
            log.map((line, index) => <li key={index}>{line}</li>)
          )}
        </ul>
      </RenderBox>

      <Button size="sm" variant="ghost" onClick={() => setLog([])}>
        記録を消す
      </Button>
    </div>
  );
}
