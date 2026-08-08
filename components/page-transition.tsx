"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

/**
 * 章を移動したときに、内容をふわりと入れ替える。
 *
 * 何もしないと、押した瞬間に前の内容が消えて次が出るので、
 * どこへ移動したのかが分かりにくい。少し重ねて切り替えると
 * 「同じ場所で中身が変わった」ことが伝わる。
 *
 * key に現在のパスを渡しているのは、React に
 * 「これは同じ場所の更新ではなく、前の内容と次の内容の入れ替えだ」
 * と伝えるため。これがないと、ただの再描画とみなされて何も起きない。
 */
export const PageTransition = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  return (
    <ViewTransition
      key={pathname}
      name="page-content"
      share="auto"
      enter="auto"
      default="none"
    >
      {children}
    </ViewTransition>
  );
};
