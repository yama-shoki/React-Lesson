"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotepadStore } from "./store";
import { paletteLabels, paletteStyles, type Palette } from "./types";

/* memo で包んでいない。セレクタで絞れば、それだけで止まる */

function Header() {
  const palette = useNotepadStore((state) => state.palette);

  return (
    <RenderBox title="ヘッダー（配色だけ使う）">
      いまの配色: {paletteLabels[palette]}
    </RenderBox>
  );
}

function MemoList() {
  // titles は本文を打っても書き換わらない。だからここは動かない
  const titles = useNotepadStore((state) => state.titles);
  const selectedId = useNotepadStore((state) => state.selectedId);
  const select = useNotepadStore((state) => state.select);

  return (
    <RenderBox title="一覧（本文は読まない）">
      <ul className="flex flex-col gap-2">
        {titles.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => select(item.id)}
              className={`focus-ring w-full rounded-md border px-3 py-2 text-left ${
                item.id === selectedId ? "border-foreground/40" : ""
              }`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </RenderBox>
  );
}

function Editor() {
  // 取り出すのは 1 本の文字列。配列やオブジェクトを組み立てていない
  const body = useNotepadStore((state) => state.bodies[state.selectedId] ?? "");
  const palette = useNotepadStore((state) => state.palette);
  const updateBody = useNotepadStore((state) => state.updateBody);

  return (
    <RenderBox title="本文（ここに打つ）" tone="highlight">
      <Input
        value={body}
        onChange={(event) => updateBody(event.target.value)}
        aria-label="本文"
        className={paletteStyles[palette]}
      />
    </RenderBox>
  );
}

function PaletteButtons() {
  const palette = useNotepadStore((state) => state.palette);
  const setPalette = useNotepadStore((state) => state.setPalette);

  return (
    <RenderBox title="配色の切り替え">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(paletteLabels) as Palette[]).map((name) => (
          <Button
            key={name}
            size="sm"
            variant={palette === name ? "default" : "outline"}
            onClick={() => setPalette(name)}
          >
            {paletteLabels[name]}
          </Button>
        ))}
      </div>
    </RenderBox>
  );
}

export function Notepad() {
  return (
    <div className="flex flex-col gap-3">
      <Header />
      <MemoList />
      <Editor />
      <PaletteButtons />
    </div>
  );
}
