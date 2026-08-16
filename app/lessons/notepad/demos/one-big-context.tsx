"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createContext, memo, use, useState, type ReactNode } from "react";
import {
  initialMemos,
  paletteLabels,
  paletteStyles,
  type Memo,
  type Palette,
} from "./types";

/** 全部ひとまとめの Context */
const NotepadContext = createContext<{
  memos: Memo[];
  selectedId: number;
  palette: Palette;
  select: (id: number) => void;
  updateBody: (body: string) => void;
  setPalette: (palette: Palette) => void;
}>({
  memos: [],
  selectedId: 1,
  palette: "plain",
  select: () => {},
  updateBody: () => {},
  setPalette: () => {},
});

function Provider({ children }: { children: ReactNode }) {
  const [memos, setMemos] = useState(initialMemos);
  const [selectedId, setSelectedId] = useState(1);
  const [palette, setPalette] = useState<Palette>("plain");

  const updateBody = (body: string) =>
    setMemos((current) =>
      current.map((memoItem) =>
        memoItem.id === selectedId ? { ...memoItem, body } : memoItem,
      ),
    );

  // value をその場で作っている。Provider が描き直されるたびに新しくなる
  return (
    <NotepadContext
      value={{
        memos,
        selectedId,
        palette,
        select: setSelectedId,
        updateBody,
        setPalette,
      }}
    >
      {children}
    </NotepadContext>
  );
}

/** memo で包んであるが、Context を購読しているので効かない */
const Header = memo(function Header() {
  const { palette } = use(NotepadContext);
  return (
    <RenderBox title="ヘッダー（配色だけ使う）">
      いまの配色: {paletteLabels[palette]}
    </RenderBox>
  );
});

const MemoList = memo(function MemoList() {
  const { memos, selectedId, select } = use(NotepadContext);

  return (
    <RenderBox title="一覧（本文は使わない）">
      <ul className="flex flex-col gap-2">
        {memos.map((memoItem) => (
          <li key={memoItem.id}>
            <button
              type="button"
              onClick={() => select(memoItem.id)}
              className={`focus-ring w-full rounded-md border px-3 py-2 text-left ${
                memoItem.id === selectedId ? "border-foreground/40" : ""
              }`}
            >
              {memoItem.title}
            </button>
          </li>
        ))}
      </ul>
    </RenderBox>
  );
});

const Editor = memo(function Editor() {
  const { memos, selectedId, updateBody, palette } = use(NotepadContext);
  const current = memos.find((memoItem) => memoItem.id === selectedId);

  return (
    <RenderBox title="本文（ここに打つ）" tone="highlight">
      <Input
        value={current?.body ?? ""}
        onChange={(event) => updateBody(event.target.value)}
        aria-label="本文"
        className={paletteStyles[palette]}
      />
    </RenderBox>
  );
});

const PaletteButtons = memo(function PaletteButtons() {
  const { palette, setPalette } = use(NotepadContext);

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
});

export function OneBigContext() {
  return (
    <Provider>
      <div className="flex flex-col gap-3">
        <Header />
        <MemoList />
        <Editor />
        <PaletteButtons />
      </div>
    </Provider>
  );
}
