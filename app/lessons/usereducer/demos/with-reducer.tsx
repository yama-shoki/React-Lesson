"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReducer } from "react";

// 状態のかたち。1 つのオブジェクトにまとめる
type Form = {
	name: string;
	email: string;
	agreed: boolean;
};

// 「何が起きたか」の一覧。更新のしかたではなく、出来事を書く
type Action =
	| { type: "changed_name"; value: string }
	| { type: "changed_email"; value: string }
	| { type: "toggled_agreement" }
	| { type: "reset" };

const initialForm: Form = {
	name: "",
	email: "",
	agreed: false,
};

// 出来事を受け取って、次の状態を返す関数。ここが更新の一覧表になる
function formReducer(state: Form, action: Action): Form {
	switch (action.type) {
		case "changed_name":
			return { ...state, name: action.value };
		case "changed_email":
			return { ...state, email: action.value };
		case "toggled_agreement":
			return { ...state, agreed: !state.agreed };
		case "reset":
			return initialForm;
	}
}

export function WithReducer() {
	useTrackDemoRender();

	const [form, dispatch] = useReducer(formReducer, initialForm);

	return (
		<div className="flex flex-col gap-3">
			<Input
				placeholder="名前"
				value={form.name}
				onChange={(event) =>
					dispatch({ type: "changed_name", value: event.target.value })
				}
			/>
			<Input
				placeholder="メールアドレス"
				value={form.email}
				onChange={(event) =>
					dispatch({ type: "changed_email", value: event.target.value })
				}
			/>

			<label className="flex items-center gap-2">
				<input
					type="checkbox"
					checked={form.agreed}
					onChange={() => dispatch({ type: "toggled_agreement" })}
				/>
				規約に同意する
			</label>

			{/* リセットは 1 行。中身が増えても、ここは変わらない */}
			<Button
				size="sm"
				variant="outline"
				onClick={() => dispatch({ type: "reset" })}
			>
				リセット
			</Button>
		</div>
	);
}
