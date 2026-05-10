"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Props {
  date: string;
}

type SlotKey = string;

function key(hour: number, isFirstHalf: boolean): SlotKey {
  return `${hour}-${String(isFirstHalf)}`;
}

export default function TimeBox({ date }: Props) {
  const [slots, setSlots] = useState<Record<SlotKey, string>>({});
  const [drafts, setDrafts] = useState<Record<SlotKey, string>>({});

  useEffect(() => {
    setSlots({});
    setDrafts({});
    apiFetch(`/api/schedule/timebox?date=${date}`)
      .then((r) => r.json())
      .then(
        (data: Array<{ hour: number; isFirstHalf: boolean; content: string }>) => {
          const map: Record<SlotKey, string> = {};
          data.forEach((item) => {
            map[key(item.hour, item.isFirstHalf)] = item.content;
          });
          setSlots(map);
        }
      );
  }, [date]);

  async function handleBlur(hour: number, isFirstHalf: boolean) {
    const k = key(hour, isFirstHalf);
    const next = drafts[k] ?? slots[k] ?? "";
    const prev = slots[k] ?? "";

    if (next === prev) return;

    await apiFetch("/api/schedule/timebox", {
      method: "PUT",
      body: JSON.stringify({ date, hour, isFirstHalf, content: next }),
    });

    setSlots((prev) => ({ ...prev, [k]: next }));
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[k];
      return copy;
    });
  }

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="py-1.5 text-center text-[#b5651d] font-medium border-b border-zinc-200 text-sm shrink-0">
        Time Box
      </div>
      <div className="flex border-b border-zinc-200 shrink-0">
        <div className="w-14 shrink-0 text-center text-[10px] text-zinc-500 py-1.5 border-r border-zinc-200 font-medium">
          Time
        </div>
        <div className="flex-1 text-center text-[10px] text-zinc-500 py-1.5 border-r border-zinc-100 font-medium">
          00 ~ 30
        </div>
        <div className="flex-1 text-center text-[10px] text-zinc-500 py-1.5 font-medium">
          30 ~ 00
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={hour} className="flex border-b border-zinc-100 last:border-b-0">
            <div className="w-14 shrink-0 flex items-center justify-center text-[11px] text-[#b5651d] border-r border-zinc-200 font-medium py-1.5">
              {hour}:00
            </div>
            {([true, false] as const).map((isFirstHalf) => {
              const k = key(hour, isFirstHalf);
              return (
                <div
                  key={String(isFirstHalf)}
                  className="flex-1 border-r last:border-r-0 border-zinc-100"
                >
                  <input
                    className="w-full px-2 py-1.5 text-xs text-zinc-700 bg-transparent focus:bg-amber-50 focus:outline-none transition"
                    value={drafts[k] ?? slots[k] ?? ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [k]: e.target.value }))
                    }
                    onBlur={() => handleBlur(hour, isFirstHalf)}
                    placeholder=""
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
