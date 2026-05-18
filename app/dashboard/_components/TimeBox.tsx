"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

type Slots = Record<string, string>;
type SlotMeta = Record<string, { bigThreeOrder: number }>;

interface Props {
  date?: string;
  slots: Slots;
  onSlotsChange?: (slots: Slots) => void;
  slotMeta: SlotMeta;
  slotNotes: Record<string, string>;
  onNotesSave?: (slotKey: string, notes: string) => void;
  onSlotClear?: (slotKey: string) => void;
  isBig3Dragging: boolean;
  readOnly?: boolean;
}

const BIG3_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "#FFF0EC", border: "#E8634A", text: "#E8634A" },
  2: { bg: "#EEF3FB", border: "#5B7FA6", text: "#5B7FA6" },
  3: { bg: "#EEF7F2", border: "#5B9B7E", text: "#5B9B7E" },
};

function DroppableSlot({
  hour,
  isFirstHalf,
  value,
  isBig3Dragging,
  meta,
  hasNotes,
  onDoubleClick,
}: {
  hour: number;
  isFirstHalf: boolean;
  value: string;
  isBig3Dragging: boolean;
  meta?: { bigThreeOrder: number };
  hasNotes: boolean;
  onDoubleClick: () => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `timebox-${hour}-${String(isFirstHalf)}`,
    data: { type: "timebox", hour, isFirstHalf },
  });

  const color = meta ? BIG3_COLORS[meta.bigThreeOrder] : null;

  const containerStyle = !isOver && color
    ? { backgroundColor: color.bg, borderLeftWidth: "3px", borderLeftColor: color.border }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={containerStyle}
      className={`flex-1 border-r last:border-r-0 border-[#f0e4da] transition-colors min-h-7
        ${isOver
          ? "bg-[#FDF0EC]"
          : !color && value
            ? "bg-[#FFF4F0] border-l-[3px] border-l-[#E8634A]"
            : !color && isBig3Dragging
              ? "bg-[#FFFCF9]"
              : ""
        }`}
    >
      {value ? (
        <div
          onDoubleClick={onDoubleClick}
          title="더블클릭하면 세부 내용을 볼 수 있어요"
          style={color ? { color: color.text } : {}}
          className="w-full px-2 py-1.5 text-xs font-bold cursor-pointer select-none leading-tight flex items-center justify-between gap-1"
        >
          <span className="truncate">{value}</span>
          {hasNotes && (
            <span
              className="shrink-0 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: color ? color.border : "#E8634A" }}
            />
          )}
        </div>
      ) : (
        <div className="w-full px-2 py-1.5 min-h-7" />
      )}
    </div>
  );
}

interface PopupState {
  key: string;
  hour: number;
  isFirstHalf: boolean;
  rangeStart: number;
  rangeEnd: number;
}

export default function TimeBox({
  slots,
  slotMeta,
  slotNotes,
  onNotesSave,
  onSlotClear,
  isBig3Dragging,
  readOnly = false,
}: Props) {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [localNotes, setLocalNotes] = useState("");
  const [confirmAction, setConfirmAction] = useState<"save" | "clear" | null>(null);

  function slotKey(hour: number, isFirstHalf: boolean) {
    return `${hour}-${String(isFirstHalf)}`;
  }

  function openPopup(k: string, hour: number, isFirstHalf: boolean) {
    setLocalNotes(slotNotes[k] ?? "");
    setConfirmAction(null);

    const content = slots[k];
    const currentIdx = hour * 2 + (isFirstHalf ? 0 : 1);

    let rangeStart = currentIdx;
    while (rangeStart > 0) {
      const prevIdx = rangeStart - 1;
      const prevKey = `${Math.floor(prevIdx / 2)}-${String(prevIdx % 2 === 0)}`;
      if (slots[prevKey] === content) rangeStart = prevIdx;
      else break;
    }

    let rangeEnd = currentIdx + 1;
    while (rangeEnd <= 47) {
      const nextKey = `${Math.floor(rangeEnd / 2)}-${String(rangeEnd % 2 === 0)}`;
      if (slots[nextKey] === content) rangeEnd++;
      else break;
    }

    setPopup({ key: k, hour, isFirstHalf, rangeStart, rangeEnd });
  }

  function closePopup() {
    setPopup(null);
    setLocalNotes("");
    setConfirmAction(null);
  }

  function handleSaveConfirmed() {
    if (popup) onNotesSave?.(popup.key, localNotes);
    closePopup();
  }

  function handleClearConfirmed() {
    if (!popup) return;
    onSlotClear?.(popup.key);
    closePopup();
  }

  const popupMeta = popup ? slotMeta[popup.key] : undefined;
  const popupColor = popupMeta ? BIG3_COLORS[popupMeta.bigThreeOrder] : null;

  function timeLabel(p: PopupState) {
    const startH = Math.floor(p.rangeStart / 2);
    const startM = p.rangeStart % 2 === 0 ? "00" : "30";
    const endH = Math.floor(p.rangeEnd / 2);
    const endM = p.rangeEnd % 2 === 0 ? "00" : "30";
    return `${startH}:${startM} ~ ${endH === 24 ? "24" : endH}:${endM}`;
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 relative">
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
              const k = slotKey(hour, isFirstHalf);
              return (
                <DroppableSlot
                  key={String(isFirstHalf)}
                  hour={hour}
                  isFirstHalf={isFirstHalf}
                  value={slots[k] ?? ""}
                  isBig3Dragging={isBig3Dragging}
                  meta={slotMeta[k]}
                  hasNotes={!!slotNotes[k]}
                  onDoubleClick={() => openPopup(k, hour, isFirstHalf)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {popup && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 rounded-r-2xl"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-5 w-64 mx-4 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                {popupColor && popupMeta ? (
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit"
                    style={{ backgroundColor: popupColor.bg, color: popupColor.text }}
                  >
                    Big 3 목표 {popupMeta.bigThreeOrder}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#c4a898]">타임박스</span>
                )}
                <span className="text-[11px] text-[#c4a898]">{timeLabel(popup)}</span>
              </div>
              <button
                onClick={closePopup}
                aria-label="닫기"
                className="text-[#c4a898] hover:text-[#E8634A] transition shrink-0 mt-0.5 p-0.5"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Task name */}
            <div
              className="text-sm font-bold leading-snug"
              style={popupColor ? { color: popupColor.text } : { color: "#1B3A5C" }}
            >
              {slots[popup.key]}
            </div>

            {/* Notes */}
            <div>
              <div className="text-[11px] text-[#c4a898] mb-1">세부 내용</div>
              <textarea
                className={`w-full text-xs text-[#1B3A5C] border border-[#e8d5c8] rounded-xl px-3 py-2 focus:outline-none resize-none placeholder:text-[#d4bfb5]
                  ${readOnly ? "bg-[#FAFAF9] cursor-default" : "focus:ring-1 focus:ring-[#E8634A]"}`}
                rows={4}
                value={localNotes}
                onChange={readOnly ? undefined : (e) => { setLocalNotes(e.target.value); setConfirmAction(null); }}
                readOnly={readOnly}
                placeholder={readOnly ? "세부 내용 없음" : "세부 내용을 입력하세요..."}
                autoFocus={!readOnly}
              />
            </div>

            {/* Action area */}
            {readOnly ? (
              <button
                onClick={closePopup}
                className="text-xs text-white bg-[#E8634A] hover:bg-[#d4553e] rounded-xl py-1.5 transition"
              >
                닫기
              </button>
            ) : confirmAction ? (
              <div className="rounded-xl bg-[#FFF8F5] border border-[#f0e4da] px-3 py-3 flex flex-col gap-2.5">
                <p className="text-xs text-center text-[#1B3A5C]">
                  {confirmAction === "save"
                    ? "세부 내용을 저장하시겠습니까?"
                    : "이 슬롯을 삭제하시겠습니까?"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 text-xs text-[#c4a898] border border-[#e8d5c8] rounded-xl py-1.5 hover:border-[#c4a898] transition"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmAction === "save" ? handleSaveConfirmed : handleClearConfirmed}
                    className={`flex-1 text-xs text-white rounded-xl py-1.5 transition
                      ${confirmAction === "clear"
                        ? "bg-red-400 hover:bg-red-500"
                        : "bg-[#E8634A] hover:bg-[#d4553e]"}`}
                  >
                    {confirmAction === "clear" ? "삭제" : "저장"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmAction("clear")}
                  className="flex-1 text-xs text-[#c4a898] hover:text-red-400 border border-[#e8d5c8] hover:border-red-300 rounded-xl py-1.5 transition"
                >
                  슬롯 지우기
                </button>
                <button
                  onClick={() => setConfirmAction("save")}
                  className="flex-1 text-xs text-white bg-[#E8634A] hover:bg-[#d4553e] rounded-xl py-1.5 transition"
                >
                  저장
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
