"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { createContext, use, useState } from "react";

// 値の置き場所を作る
const UserContext = createContext<string>("");

// 使う側は、この関数を呼ぶだけ
const useUser = () => use(UserContext);

// いちばん下の部品。props を受け取らず、自分で取りに行く
function Profile() {
	const user = useUser();
	return (
		<RenderBox title="Profile（使う人）" tone="highlight">
			{user} さん
		</RenderBox>
	);
}

// 途中の部品は user を知らない。props も受け取らない
function Sidebar() {
	return (
		<RenderBox title="Sidebar（何も知らない）">
			<Profile />
		</RenderBox>
	);
}

function Layout() {
	return (
		<RenderBox title="Layout（何も知らない）">
			<Sidebar />
		</RenderBox>
	);
}

export function WithContext() {
	const [user, setUser] = useState("さとう");

	return (
		<div className="flex flex-col gap-4">
			<Button
				size="sm"
				onClick={() => setUser(user === "さとう" ? "すずき" : "さとう")}
			>
				名前を変える
			</Button>

			{/* この中にいる部品なら、どこからでも user を取り出せる */}
			<UserContext value={user}>
				<Layout />
			</UserContext>
		</div>
	);
}
