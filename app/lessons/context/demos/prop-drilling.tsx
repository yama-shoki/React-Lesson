"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// いちばん下の部品。ここだけが user を使う
function Profile({ user }: { user: string }) {
  return <RenderBox title="Profile（使う人）">{user} さん</RenderBox>;
}

// 途中の部品。user を使わないのに、渡すためだけに受け取っている
function Sidebar({ user }: { user: string }) {
  return (
    <RenderBox title="Sidebar（素通しするだけ）">
      <Profile user={user} />
    </RenderBox>
  );
}

// ここも同じ。使わないのに受け取って、下に渡す
function Layout({ user }: { user: string }) {
  return (
    <RenderBox title="Layout（素通しするだけ）">
      <Sidebar user={user} />
    </RenderBox>
  );
}

export function PropDrilling() {
  const [user, setUser] = useState("さとう");

  return (
    <div className="flex flex-col gap-4">
      <Button
        size="sm"
        onClick={() => setUser(user === "さとう" ? "すずき" : "さとう")}
      >
        名前を変える
      </Button>

      <Layout user={user} />
    </div>
  );
}
