"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { memo, useCallback, useState } from "react";

// 子はさっきとまったく同じ
const Child = memo(function Child({ onSave }: { onSave: () => void }) {
	return (
		<RenderBox title="memo した子" tone="highlight">
			<Button size="sm" variant="outline" onClick={onSave}>
				保存
			</Button>
		</RenderBox>
	);
});

export function WithCallback() {
	const [count, setCount] = useState(0);
	const [saved, setSaved] = useState(0);

	// 同じ関数を使い回す。依存配列が空なので、作り直されることがない
	const handleSave = useCallback(() => setSaved((s) => s + 1), []);

	return (
		<div className="flex flex-col gap-4">
			<p className="rounded-md border p-3 font-mono">
				count: {count} / 保存した回数: {saved}
			</p>

			<Button size="sm" onClick={() => setCount((c) => c + 1)}>
				count を増やす（子には関係ない）
			</Button>

			<Child onSave={handleSave} />
		</div>
	);
}
