import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * shadcn が生成する実装は useEffect の中で setState していて、
 * React 19 のルール（副作用の中で state を同期的に更新しない）に反する。
 * ブラウザの画面幅は「React の外側にある値」なので、
 * それを購読するための useSyncExternalStore で書き直してある。
 */
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth < MOBILE_BREAKPOINT,
    // サーバー側には画面幅が存在しないので、モバイルではない前提で描いておく
    () => false
  )
}
