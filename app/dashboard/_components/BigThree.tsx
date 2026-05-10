"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface BigThreeItem {
  id: number;
  order: number;
  content: string;
  completed: boolean;
}

interface Props {
  date: string;
}

export default function BigThree({ date }: Props) {
  const [items, setItems] = useState<BigThreeItem[]>([]);
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  useEffect(() => {
    setItems([]);
    setDrafts({});
    apiFetch(`/api/schedule/big3?date=${date}`)
      .then((r) => r.json())
      .then(setItems);
  }, [date]);

  async function handleBlur(id: number) {
    const item = items.find((i) => i.id === id);
    const next = drafts[id] ?? item?.content ?? "";
    const prev = item?.content ?? "";

    if (next === prev) return;

    const res = await apiFetch(`/api/schedule/big3/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content: next }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }

  async function toggleCompleted(item: BigThreeItem) {
    const res = await apiFetch(`/api/schedule/big3/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !item.completed }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  return (
    <div>
      <div className="py-1.5 px-3 text-center text-[#b5651d] font-medium border-b border-zinc-200 text-sm">
        Big 3
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center border-b border-zinc-100 last:border-b-0 group"
        >
          <button
            onClick={() => toggleCompleted(item)}
            className="w-8 h-8 flex items-center justify-center shrink-0 border-r border-zinc-200 text-zinc-300 hover:text-zinc-500 transition"
            aria-label={item.completed ? "완료 취소" : "완료 표시"}
          >
            {item.completed ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" fill="#b5651d" />
                <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#d4d4d8" strokeWidth="1.5" />
              </svg>
            )}
          </button>
          <span className="w-7 text-center text-xs text-zinc-400 shrink-0 border-r border-zinc-200 py-2">
            {item.order}
          </span>
          <input
            className={`flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none focus:bg-amber-50 transition placeholder:text-zinc-300
              ${item.completed ? "line-through text-zinc-400" : "text-zinc-700"}`}
            value={drafts[item.id] ?? item.content}
            onChange={(e) =>
              setDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
            }
            onBlur={() => handleBlur(item.id)}
            placeholder={`목표 ${item.order}`}
          />
        </div>
      ))}
    </div>
  );
}
