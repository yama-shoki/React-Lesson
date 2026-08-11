"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = ["お試し", "標準", "たっぷり"];

export function Selection() {
  useTrackDemoRender();

  // 「まだ選んでいない」を null で表す。型は string か null
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {plans.map((plan) => (
          <Button
            key={plan}
            size="sm"
            // 選ばれているかどうかは、比べて求める。持たない
            variant={selected === plan ? "default" : "outline"}
            onClick={() => setSelected(plan)}
          >
            {plan}
          </Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {selected === null ? "まだ選んでいません" : `${selected} を選びました`}
      </p>
    </div>
  );
}
