"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useDroppable } from "@dnd-kit/core";

type Slots = Record<string, string>;

interface Props {
  date: string;
  slots: Slots;
  onSlotsChange: (slots: Slots) => void;
  isBig3Dragging: boolean;
}

function DroppableSlot({
  hour,
  isFirstHalf,
  value,
  onChange,
  onBlur,
  isBig3Dragging,
}: {
  hour: number;
  isFirstHalf: boolean;
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  isBig3Dragging: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `timebox-${hour}-${String(isFirstHalf)}`,
    data: { type: "timebox", hour, isFirstHalf },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 border-r last:border-r-0 border-[#f0e4da] transition-colors
        ${isOver ? "bg-[#FDF0EC]" : isBig3Dragging ? "bg-[#FFFCF9]" : ""}`}
    >
      <input
        className="w-full px-2 py-1.5 text-xs text-[#1B3A5C] bg-transparent focus:bg-[#FDF8F4] focus:outline-none transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder=""
      />
    </div>
  );
}

export default function TimeBox({ date, slots, onSlotsChange, isBig3Dragging }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function key(hour: number, isFirstHalf: boolean) {
    return `${hour}-${String(isFirstHalf)}`;
  }

  async function handleBlur(hour: number, isFirstHalf: boolean) {
    const k = key(hour, isFirstHalf);
    const next = drafts[k] ?? slots[k] ?? "";
    const prev = slots[k] ?? "";

    if (next === prev) return;

    await apiFetch("/api/schedule/timebox", {
      method: "PUT",
      body: JSON.stringify({ date, hour, isFirstHalf, content: next }),
    });

    onSlotsChange({ ...slots, [k]: next });
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[k];
      return copy;
    });
  }

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="py-1.5 text-center text-[#E8634A] font-semibold border-b border-[#e8d5c8] text-sm shrink-0">
        Time Box
      </div>
      <div className="flex border-b border-[#e8d5c8] shrink-0">
        <div className="w-14 shrink-0 text-center text-[10px] text-[#c4a898] py-1.5 border-r border-[#e8d5c8] font-medium">
          Time
        </div>
        <div className="flex-1 text-center text-[10px] text-[#c4a898] py-1.5 border-r border-[#f0e4da] font-medium">
          00 ~ 30
        </div>
        <div className="flex-1 text-center text-[10px] text-[#c4a898] py-1.5 font-medium">
          30 ~ 00
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={hour} className="flex border-b border-[#f0e4da] last:border-b-0">
            <div className="w-14 shrink-0 flex items-center justify-center text-[11px] text-[#E8634A] border-r border-[#e8d5c8] font-medium py-1.5">
              {hour}:00
            </div>
            {([true, false] as const).map((isFirstHalf) => {
              const k = key(hour, isFirstHalf);
              return (
                <DroppableSlot
                  key={String(isFirstHalf)}
                  hour={hour}
                  isFirstHalf={isFirstHalf}
                  value={drafts[k] ?? slots[k] ?? ""}
                  onChange={(val) => setDrafts((prev) => ({ ...prev, [k]: val }))}
                  onBlur={() => handleBlur(hour, isFirstHalf)}
                  isBig3Dragging={isBig3Dragging}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
