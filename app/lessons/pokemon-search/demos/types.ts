/*
  画面が受け取るデータの形。

  PokeAPI が返す JSON は項目が数百ある。
  そのまま持ち回らず、こちらで「要るものだけ」の形を決めておく。
  こうしておくと、向こうの形が変わってもここだけ直せば済む。
*/

export type Pokemon = {
  id: number;
  /** 日本語名 */
  name: string;
  imageUrl: string | null;
  /** 日本語のタイプ名 */
  types: string[];
  /** cm */
  height: number;
  /** kg */
  weight: number;
};
