import "react";

/*
  Next.js の App Router がバンドルしている React には ViewTransition が入っているが、
  安定版の @types/react にはまだ型が用意されていない。
  実行はできるのに型だけが通らない状態なので、ここで補っている。

  @types/react が対応したら、このファイルは削除してよい。
*/
declare module "react" {
  type ViewTransitionAnimation = "auto" | "none" | (string & {});

  export const ViewTransition: React.ExoticComponent<{
    children?: React.ReactNode;
    /** 動かす対象を見分けるための名前 */
    name?: string;
    /** 個別に指定しなかった場合の動き */
    default?: ViewTransitionAnimation;
    /** 現れるとき */
    enter?: ViewTransitionAnimation;
    /** 消えるとき */
    exit?: ViewTransitionAnimation;
    /** 同じ name のものが入れ替わるとき */
    share?: ViewTransitionAnimation;
    /** 中身だけが変わるとき */
    update?: ViewTransitionAnimation;
  }>;
}
