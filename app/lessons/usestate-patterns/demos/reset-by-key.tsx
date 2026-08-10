"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// 感想を書く欄。中に自分の state を持っている
function CommentBox({ target }: { target: string }) {
	const [text, setText] = useState("");

	return (
		<div className="flex flex-col gap-2">
			<p className="text-sm">{target} への感想</p>
			<Input
				placeholder="書いてみる"
				value={text}
				onChange={(event) => setText(event.target.value)}
			/>
		</div>
	);
}

const targets = ["りんご", "みかん"];

export function ResetByKey() {
	useTrackDemoRender();

	const [target, setTarget] = useState(targets[0]);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2">
				{targets.map((item) => (
					<Button
						key={item}
						size="sm"
						variant={target === item ? "default" : "outline"}
						onClick={() => setTarget(item)}
					>
						{item}
					</Button>
				))}
			</div>

			{/* key を変えると、React は別物として作り直す = state が消える */}
			<CommentBox key={target} target={target} />
		</div>
	);
}
