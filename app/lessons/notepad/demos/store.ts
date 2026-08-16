import { create } from "zustand";
import { initialMemos, type Palette } from "./types";

export type NotepadStore = {
  /** 一覧が読むもの。題名は変わらないので、ここは動かない */
  titles: { id: number; title: string }[];
  /** 本文。打つたびに変わる */
  bodies: Record<number, string>;

  selectedId: number;
  palette: Palette;

  select: (id: number) => void;
  updateBody: (body: string) => void;
  setPalette: (palette: Palette) => void;
};

/**
 * メモ帳の状態を 1 か所に置く。
 *
 * 題名と本文を分けて持っているのがポイント。
 * 1 つの配列にまとめると、本文を打つたびに配列全体が作り直され、
 * 題名しか読まない一覧まで描き直されてしまう。
 * ストアの形は、読む側に合わせて決める。
 */
export const useNotepadStore = create<NotepadStore>((set) => ({
  titles: initialMemos.map((memo) => ({ id: memo.id, title: memo.title })),
  bodies: Object.fromEntries(
    initialMemos.map((memo) => [memo.id, memo.body]),
  ),

  selectedId: 1,
  palette: "plain",

  select: (id) => set({ selectedId: id }),

  updateBody: (body) =>
    set((state) => ({
      // 書き換わるのは bodies だけ。titles は元のまま
      bodies: { ...state.bodies, [state.selectedId]: body },
    })),

  setPalette: (palette) => set({ palette }),
}));
