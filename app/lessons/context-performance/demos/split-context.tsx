"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { createContext, type ReactNode, use, useState } from "react";

// 置き場所を関心ごとに分ける
const CountContext = createContext<{
	count: number;
	setCount: (value: number) => void;
}>({ count: 0, setCount: () => {} });

const NameContext = createContext<{
	name: string;
	setName: (value: string) => void;
}>({ name: "", setName: () => {} });

function CountProvider({ children }: { children: ReactNode }) {
	const [count, setCount] = useState(0);
	return <CountContext value={{ count, setCount }}>{children}</CountContext>;
}

function NameProvider({ children }: { children: ReactNode }) {
	const [name, setName] = useState("さとう");
	return <NameContext value={{ name, setName }}>{children}</NameContext>;
}

// count の置き場所だけを見る
function CountDisplay() {
	const { count } = use(CountContext);
	return (
		<RenderBox title="count だけを使う部品" tone="highlight">
			count: {count}
		</RenderBox>
	);
}

// name の置き場所だけを見る
function NameDisplay() {
	const { name } = use(NameContext);
	return (
		<RenderBox title="name だけを使う部品" tone="highlight">
			name: {name}
		</RenderBox>
	);
}

function Controls() {
	const { count, setCount } = use(CountContext);
	const { name, setName } = use(NameContext);

	return (
		<div className="flex flex-wrap gap-2">
			<Button size="sm" onClick={() => setCount(count + 1)}>
				count を増やす
			</Button>
			<Button
				size="sm"
				variant="outline"
				onClick={() => setName(name === "さとう" ? "すずき" : "さとう")}
			>
				name を変える
			</Button>
		</div>
	);
}

export function SplitContextDemo() {
	return (
		<CountProvider>
			<NameProvider>
				<div className="flex flex-col gap-4">
					<Controls />
					<CountDisplay />
					<NameDisplay />
				</div>
			</NameProvider>
		</CountProvider>
	);
}
