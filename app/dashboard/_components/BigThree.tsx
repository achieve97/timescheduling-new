"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BigThreeItem } from "../page";

interface Props {
  items: BigThreeItem[];
  onItemsChange: (items: BigThreeItem[]) => void;
  onMoveToBrainDump: (item: BigThreeItem) => void;
  onSchedule: (item: BigThreeItem, startIdx: number, endIdx: number) => void;
}

function SortableRow({
  item,
  draft,
  onChange,
  onBlur,
  onToggle,
  onClear,
  onDoubleClick,
  onSchedule,
}: {
  item: BigThreeItem;
  draft: string | undefined;
  onChange: (val: string) => void;
  onBlur: () => void;
  onToggle: () => void;
  onClear: () => void;
  onDoubleClick: () => void;
  onSchedule: (startIdx: number, endIdx: number) => void;
}) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [startIdx, setStartIdx] = useState(18);
  const [endIdx, setEndIdx] = useState(20);

  function idxToLabel(idx: number) {
    const h = Math.floor(idx / 2);
    const m = idx % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
  }

  function confirmSchedule() {
    if (endIdx <= startIdx) return;
    onSchedule(startIdx, endIdx);
    setShowSchedule(false);
  }

  const { attributes, listeners, setNodeRef, transform, transition, isOver, isDragging } =
    useSortable({
      id: `big3-${item.id}`,
      data: { type: "big3", item },
    });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex flex-col border-b border-[#f0e4da] last:border-b-0 group transition-colors
        ${isOver ? "bg-[#FDF0EC]" : ""}
        ${isDragging ? "opacity-40" : ""}`}
    >
      <div className="flex items-center">
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
          onDoubleClick={onDoubleClick}
          placeholder={`목표 ${item.order}`}
        />

        {item.content.trim() && (
          <button
            onClick={() => setShowSchedule((v) => !v)}
            aria-label="타임박스에 배정"
            className={`w-7 h-8 flex items-center justify-center shrink-0 transition opacity-0 group-hover:opacity-100
              ${showSchedule ? "text-[#E8634A] opacity-100" : "text-[#c4a898] hover:text-[#E8634A]"}`}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.5 3.5V6.5L8.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {item.content.trim() && (
          <button
            onClick={onClear}
            aria-label="내용 지우기"
            className="w-7 h-8 flex items-center justify-center shrink-0 text-[#c4a898] hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {showSchedule && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#FFF8F5] border-t border-[#f0e4da] flex-wrap">
          <span className="text-xs text-[#c4a898] shrink-0">배정 시간</span>
          <select
            value={startIdx}
            onChange={(e) => setStartIdx(Number(e.target.value))}
            className="text-xs border border-[#e8d5c8] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#E8634A] text-[#1B3A5C] bg-white"
          >
            {Array.from({ length: 48 }, (_, i) => (
              <option key={i} value={i}>{idxToLabel(i)}</option>
            ))}
          </select>
          <span className="text-xs text-[#c4a898]">~</span>
          <select
            value={endIdx}
            onChange={(e) => setEndIdx(Number(e.target.value))}
            className="text-xs border border-[#e8d5c8] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#E8634A] text-[#1B3A5C] bg-white"
          >
            {Array.from({ length: 48 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{idxToLabel(i + 1)}</option>
            ))}
          </select>
          <button
            onClick={confirmSchedule}
            className="text-xs text-white bg-[#E8634A] hover:bg-[#d4553e] px-2.5 py-1 rounded-lg transition shrink-0"
          >
            배정
          </button>
          <button
            onClick={() => setShowSchedule(false)}
            className="text-xs text-[#c4a898] hover:text-red-400 transition shrink-0"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}

export default function BigThree({ items, onItemsChange, onMoveToBrainDump, onSchedule }: Props) {
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

  async function clearItem(id: number) {
    const res = await apiFetch(`/api/schedule/big3/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content: "", completed: false }),
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
            onClear={() => clearItem(item.id)}
            onDoubleClick={() => onMoveToBrainDump(item)}
            onSchedule={(startIdx, endIdx) => onSchedule(item, startIdx, endIdx)}
          />
        ))}
      </SortableContext>
    </div>
  );
}
