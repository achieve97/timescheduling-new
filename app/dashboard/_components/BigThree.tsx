"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BigThreeItem } from "../page";

interface Props {
  items: BigThreeItem[];
  onItemsChange: (items: BigThreeItem[]) => void;
}

function SortableRow({
  item,
  draft,
  onChange,
  onBlur,
  onToggle,
}: {
  item: BigThreeItem;
  draft: string | undefined;
  onChange: (val: string) => void;
  onBlur: () => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isOver, isDragging } =
    useSortable({
      id: `big3-${item.id}`,
      data: { type: "big3", item },
    });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center border-b border-[#f0e4da] last:border-b-0 group transition-colors
        ${isOver ? "bg-[#FDF0EC]" : ""}
        ${isDragging ? "opacity-40" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        tabIndex={-1}
        aria-label="순서 변경"
        className="w-6 h-8 flex items-center justify-center shrink-0 text-[#e8d5c8] hover:text-[#c4a898] cursor-grab active:cursor-grabbing touch-none"
      >
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
          <circle cx="2" cy="2" r="1" fill="currentColor" />
          <circle cx="6" cy="2" r="1" fill="currentColor" />
          <circle cx="2" cy="6" r="1" fill="currentColor" />
          <circle cx="6" cy="6" r="1" fill="currentColor" />
          <circle cx="2" cy="10" r="1" fill="currentColor" />
          <circle cx="6" cy="10" r="1" fill="currentColor" />
        </svg>
      </button>

      <button
        onClick={onToggle}
        aria-label={item.completed ? "완료 취소" : "완료 표시"}
        className="w-7 h-8 flex items-center justify-center shrink-0 border-x border-[#e8d5c8] text-[#c4a898] hover:text-[#E8634A] transition"
      >
        {item.completed ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" fill="#E8634A" />
            <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#e8d5c8" strokeWidth="1.5" />
          </svg>
        )}
      </button>

      <span className="w-6 text-center text-xs text-[#c4a898] shrink-0 py-2 border-r border-[#e8d5c8]">
        {item.order}
      </span>

      <input
        className={`flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none focus:bg-[#FDF8F4] transition placeholder:text-[#c4a898]
          ${item.completed ? "line-through text-[#c4a898]" : "text-[#1B3A5C]"}`}
        value={draft ?? item.content}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={`목표 ${item.order}`}
      />
    </div>
  );
}

export default function BigThree({ items, onItemsChange }: Props) {
  const [drafts, setDrafts] = useState<Record<number, string>>({});

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
    onItemsChange(items.map((i) => (i.id === id ? updated : i)));
    setDrafts((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  async function toggleCompleted(item: BigThreeItem) {
    const res = await apiFetch(`/api/schedule/big3/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !item.completed }),
    });
    const updated = await res.json();
    onItemsChange(items.map((i) => (i.id === item.id ? updated : i)));
  }

  return (
    <div>
      <div className="py-1.5 px-3 text-center text-[#E8634A] font-semibold border-b border-[#e8d5c8] text-sm">
        Big 3
      </div>
      <SortableContext items={items.map((i) => `big3-${i.id}`)} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableRow
            key={item.id}
            item={item}
            draft={drafts[item.id]}
            onChange={(val) => setDrafts((prev) => ({ ...prev, [item.id]: val }))}
            onBlur={() => handleBlur(item.id)}
            onToggle={() => toggleCompleted(item)}
          />
        ))}
      </SortableContext>
    </div>
  );
}
