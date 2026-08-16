"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

/*
  この lint は「effect の中で setState するな」と言う。まったく正しい。
  この章はその禁じ手をあえて踏んで、何が起きるかを見るためのもの。
  下の EffectChain だけが対象で、JustCompute は effect を使っていない。
*/
/* eslint-disable react-hooks/set-state-in-effect */

const prices: Record<string, number> = { りんご: 150, みかん: 100 };

/** effect が次の effect を呼ぶ、数珠つなぎの形 */
export function EffectChain() {
  useTrackDemoRender();

  const [items, setItems] = useState<string[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  // 1 つめ … 品目が変わったら小計を出す
  useEffect(() => {
    setSubtotal(items.reduce((sum, name) => sum + prices[name], 0));
  }, [items]);

  // 2 つめ … 小計が変わったら税を出す
  useEffect(() => {
    setTax(Math.floor(subtotal * 0.1));
  }, [subtotal]);

  // 3 つめ … 税が変わったら合計を出す
  useEffect(() => {
    setTotal(subtotal + tax);
  }, [subtotal, tax]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setItems((current) => [...current, "りんご"])}
        >
          りんごを足す
        </Button>
        <Button size="sm" variant="outline" onClick={() => setItems([])}>
          空にする
        </Button>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex flex-col gap-1 font-mono text-sm">
          <span>品目: {items.length} 個</span>
          <span>小計: {subtotal} 円</span>
          <span>税: {tax} 円</span>
          <span>合計: {total} 円</span>
        </div>
      </div>
    </div>
  );
}

/** 連鎖をやめて、その場で計算する */
export function JustCompute() {
  useTrackDemoRender();

  const [items, setItems] = useState<string[]>([]);

  // 持つのは品目だけ。あとは全部その場で出す
  const subtotal = items.reduce((sum, name) => sum + prices[name], 0);
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setItems((current) => [...current, "りんご"])}
        >
          りんごを足す
        </Button>
        <Button size="sm" variant="outline" onClick={() => setItems([])}>
          空にする
        </Button>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex flex-col gap-1 font-mono text-sm">
          <span>品目: {items.length} 個</span>
          <span>小計: {subtotal} 円</span>
          <span>税: {tax} 円</span>
          <span>合計: {total} 円</span>
        </div>
      </div>
    </div>
  );
}
