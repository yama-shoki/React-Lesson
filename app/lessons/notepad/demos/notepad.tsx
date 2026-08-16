"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createContext,
  memo,
  use,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialMemos,
  paletteLabels,
  paletteStyles,
  type Memo,
  type Palette,
} from "./types";

/* 関心ごとに 3 つに分ける。一緒に変わらないものは、同じ箱に入れない */

const PaletteContext = createContext<{
  palette: Palette;
  setPalette: (palette: Palette) => void;
}>({ palette: "plain", setPalette: () => {} });

const MemosContext = createContext<{ memos: Memo[]; selectedId: number }>({
  memos: [],
  selectedId: 1,
});

/** 操作だけの Context。中身の値を持たないので、何が変わっても変化しない */
const ActionsContext = createContext<{
  select: (id: number) => void;
  updateBody: (body: string) => void;
}>({ select: () => {}, updateBody: () => {} });

function PaletteProvider({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState<Palette>("plain");
  const value = useMemo(() => ({ palette, setPalette }), [palette]);
  return <PaletteContext value={value}>{children}</PaletteContext>;
}

function MemosProvider({ children }: { children: ReactNode }) {
  const [memos, setMemos] = useState(initialMemos);
  const [selectedId, setSelectedId] = useState(1);

  const memosValue = useMemo(() => ({ memos, selectedId }), [memos, selectedId]);

  const updateBody = useCallback(
    (body: string) =>
      setMemos((current) =>
        current.map((memoItem) =>
          memoItem.id === selectedId ? { ...memoItem, body } : memoItem,
        ),
      ),
    [selectedId],
  );

  // 操作は、値が変わっても作り直さない
  const actionsValue = useMemo(
    () => ({ select: setSelectedId, updateBody }),
    [updateBody],
  );

  return (
    <MemosContext value={memosValue}>
      <ActionsContext value={actionsValue}>{children}</ActionsContext>
    </MemosContext>
  );
}

const Header = memo(function Header() {
  const { palette } = use(PaletteContext);
  return (
    <RenderBox title="ヘッダー（配色だけ使う）">
      いまの配色: {paletteLabels[palette]}
    </RenderBox>
  );
});

const MemoList = memo(function MemoList() {
  const { memos, selectedId } = use(MemosContext);
  const { select } = use(ActionsContext);

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
  const { memos, selectedId } = use(MemosContext);
  const { updateBody } = use(ActionsContext);
  const { palette } = use(PaletteContext);
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

/** 操作しか使わないので、本文をいくら打っても描き直されない */
const PaletteButtons = memo(function PaletteButtons() {
  const { palette, setPalette } = use(PaletteContext);

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

export function Notepad() {
  return (
    <PaletteProvider>
      <MemosProvider>
        <div className="flex flex-col gap-3">
          <Header />
          <MemoList />
          <Editor />
          <PaletteButtons />
        </div>
      </MemosProvider>
    </PaletteProvider>
  );
}
