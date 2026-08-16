"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

/** 6 項目を useState で 1 つずつ持った版 */
export function ManyUseStates() {
  useTrackDemoRender();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [zip, setZip] = useState("");
  const [note, setNote] = useState("");

  const fields = [
    { label: "メールアドレス", value: email, set: setEmail },
    { label: "パスワード", value: password, set: setPassword },
    { label: "名前", value: name, set: setName },
    { label: "年齢", value: age, set: setAge },
    { label: "郵便番号", value: zip, set: setZip },
    { label: "備考", value: note, set: setNote },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        どこか 1 つに打って、下の 3 つの箱を見てください
      </p>

      {[0, 1, 2].map((group) => (
        <RenderBox key={group} title={`項目 ${group * 2 + 1}・${group * 2 + 2}`}>
          <div className="flex flex-col gap-2">
            {fields.slice(group * 2, group * 2 + 2).map((field) => (
              <Input
                key={field.label}
                placeholder={field.label}
                aria-label={field.label}
                value={field.value}
                onChange={(event) => field.set(event.target.value)}
              />
            ))}
          </div>
        </RenderBox>
      ))}

      <Button
        size="sm"
        variant="outline"
        onClick={() => fields.forEach((field) => field.set(""))}
      >
        全部消す
      </Button>
    </div>
  );
}
