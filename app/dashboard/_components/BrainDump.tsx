"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { apiFetch } from "@/lib/api";

interface BrainDumpItem {
  id: number;
  content: string;
}

interface Props {
  date: string;
}

export default function BrainDump({ date }: Props) {
  const [items, setItems] = useState<BrainDumpItem[]>([]);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState("");
  const [editDrafts, setEditDrafts] = useState<Record<number, string>>({});

  useEffect(() => {
    setItems([]);
    setEditDrafts({});
    apiFetch(`/api/schedule/brain-dump?date=${date}`)
      .then((r) => r.json())
      .then(setItems);
  }, [date]);

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
    setItems((prev) => [...prev, item]);
    setNewContent("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAdd();
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
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    setEditDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function handleDelete(id: number) {
    await apiFetch(`/api/schedule/brain-dump/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="flex flex-col">
      <div className="py-1.5 px-3 text-center text-[#b5651d] font-medium border-b border-zinc-200 text-sm">
        Brain Dump
      </div>

      {items.map((item) => (
        <div key={item.id} className="flex items-center border-b border-zinc-100 group">
          <input
            className="flex-1 px-3 py-2 text-sm text-zinc-700 bg-transparent focus:outline-none focus:bg-amber-50 transition"
            value={editDrafts[item.id] ?? item.content}
            onChange={(e) =>
              setEditDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
            }
            onBlur={() => handleBlur(item.id)}
          />
          <button
            onClick={() => handleDelete(item.id)}
            className="w-8 h-8 flex items-center justify-center shrink-0 text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
            aria-label="삭제"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}

      <div className="flex items-center gap-0 border-t border-zinc-100 mt-auto">
        <input
          className={`flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none placeholder:text-zinc-300 ${
            error ? "placeholder:text-red-300" : ""
          }`}
          value={newContent}
          onChange={(e) => {
            setNewContent(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={error || "생각을 추가하세요..."}
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 text-xs text-zinc-400 hover:text-[#b5651d] transition shrink-0"
        >
          + 추가
        </button>
      </div>
    </div>
  );
}
