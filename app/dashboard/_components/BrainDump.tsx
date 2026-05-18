"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useDraggable } from "@dnd-kit/core";
import type { BrainDumpItem } from "../page";

interface Props {
  date: string;
  items: BrainDumpItem[];
  onItemsChange: (items: BrainDumpItem[]) => void;
  onMoveToBigThree: (item: BrainDumpItem) => void;
  hasEmptySlot: boolean;
}

function DraggableRow({
  item,
  draft,
  onChange,
  onBlur,
  onDelete,
  onMove,
  hasEmptySlot,
}: {
  item: BrainDumpItem;
  draft: string | undefined;
  onChange: (val: string) => void;
  onBlur: () => void;
  onDelete: () => void;
  onMove: () => void;
  hasEmptySlot: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `brain-${item.id}`,
    data: { type: "brain-dump", item },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center border-b border-[#f0e4da] group transition-opacity
        ${isDragging ? "opacity-40" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        tabIndex={-1}
        aria-label="드래그"
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

      <input
        className="flex-1 px-2 py-2 text-sm text-[#1B3A5C] bg-transparent focus:outline-none focus:bg-[#FDF8F4] transition"
        value={draft ?? item.content}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />

      {hasEmptySlot && (
        <button
          onClick={onMove}
          title="Big 3으로 이동"
          className="w-7 h-8 flex items-center justify-center shrink-0 text-[#c4a898] hover:text-[#E8634A] opacity-0 group-hover:opacity-100 transition"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h8M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <button
        onClick={onDelete}
        aria-label="삭제"
        className="w-7 h-8 flex items-center justify-center shrink-0 text-[#c4a898] hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export default function BrainDump({ date, items, onItemsChange, onMoveToBigThree, hasEmptySlot }: Props) {
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState("");
  const [editDrafts, setEditDrafts] = useState<Record<number, string>>({});

  async function handleAdd() {
    if (!newContent.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    setError("");
    const res = await apiFetch("/api/schedule/brain-dump", {
      method: "POST",
      body: JSON.stringify({ date, content: newContent.trim() }),
    });
    const item = await res.json();
    onItemsChange([...items, item]);
    setNewContent("");
  }

  async function handleBlur(id: number) {
    const draft = editDrafts[id];
    if (draft === undefined) return;

    if (!draft.trim()) {
      handleDelete(id);
      return;
    }

    const original = items.find((i) => i.id === id)?.content ?? "";
    if (draft === original) return;

    const res = await apiFetch(`/api/schedule/brain-dump/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content: draft }),
    });
    const updated = await res.json();
    onItemsChange(items.map((i) => (i.id === id ? updated : i)));
    setEditDrafts((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  async function handleDelete(id: number) {
    await apiFetch(`/api/schedule/brain-dump/${id}`, { method: "DELETE" });
    onItemsChange(items.filter((i) => i.id !== id));
  }

  return (
    <div className="flex flex-col h-full">
      <div className="py-1.5 px-3 text-center text-[#E8634A] font-semibold border-b border-[#e8d5c8] text-sm">
        Brain Dump
      </div>

      {items.map((item) => (
        <DraggableRow
          key={item.id}
          item={item}
          draft={editDrafts[item.id]}
          onChange={(val) => setEditDrafts((prev) => ({ ...prev, [item.id]: val }))}
          onBlur={() => handleBlur(item.id)}
          onDelete={() => handleDelete(item.id)}
          onMove={() => onMoveToBigThree(item)}
          hasEmptySlot={hasEmptySlot}
        />
      ))}

      <div className="flex items-center border-t border-[#f0e4da] mt-auto">
        <input
          className={`flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-[#1B3A5C] placeholder:text-[#c4a898] ${
            error ? "placeholder:text-red-300" : ""
          }`}
          value={newContent}
          onChange={(e) => { setNewContent(e.target.value); if (error) setError(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder={error || "생각을 추가하세요..."}
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 text-xs text-[#c4a898] hover:text-[#E8634A] transition shrink-0"
        >
          + 추가
        </button>
      </div>
    </div>
  );
}
