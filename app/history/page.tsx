"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken, apiFetch } from "@/lib/api";
import Link from "next/link";
import TimeBox from "@/app/dashboard/_components/TimeBox";

interface HistoryItem {
  date: string;
  bigThreeTotal: number;
  bigThreeCompleted: number;
  timeBoxCount: number;
}

interface Big3Item {
  id: number;
  order: number;
  content: string;
  completed: boolean;
}

type Slots = Record<string, string>;
type SlotMeta = Record<string, { bigThreeOrder: number }>;

const BIG3_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "#FFF0EC", border: "#E8634A", text: "#E8634A" },
  2: { bg: "#EEF3FB", border: "#5B7FA6", text: "#5B7FA6" },
  3: { bg: "#EEF7F2", border: "#5B9B7E", text: "#5B9B7E" },
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const day = new Date(y, m - 1, d).getDay();
  return { full: `${y}년 ${m}월 ${d}일`, weekday: weekdays[day] };
}

export default function HistoryPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slots>({});
  const [slotMeta, setSlotMeta] = useState<SlotMeta>({});
  const [slotNotes, setSlotNotes] = useState<Record<string, string>>({});
  const [big3Items, setBig3Items] = useState<Big3Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    apiFetch("/api/schedule/history").then((r) => r.json()).then(setHistoryList);
  }, [ready]);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    setSlots({});
    setSlotMeta({});
    setSlotNotes({});
    setBig3Items([]);

    Promise.all([
      apiFetch(`/api/schedule/timebox?date=${selectedDate}`).then((r) => r.json()),
      apiFetch(`/api/schedule/big3?date=${selectedDate}`).then((r) => r.json()),
    ]).then(([timeboxData, big3Data]: [
      Array<{ hour: number; isFirstHalf: boolean; content: string; notes: string }>,
      Big3Item[],
    ]) => {
      const slotsMap: Slots = {};
      const notesMap: Record<string, string> = {};
      timeboxData.forEach(({ hour, isFirstHalf, content, notes }) => {
        const k = `${hour}-${String(isFirstHalf)}`;
        slotsMap[k] = content;
        if (notes) notesMap[k] = notes;
      });

      const meta: SlotMeta = {};
      Object.entries(slotsMap).forEach(([key, content]) => {
        const match = big3Data.find((b) => b.content.trim() === content.trim());
        if (match) meta[key] = { bigThreeOrder: match.order };
      });

      setSlots(slotsMap);
      setSlotNotes(notesMap);
      setSlotMeta(meta);
      setBig3Items(big3Data);
      setLoading(false);
    });
  }, [selectedDate]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#F8F0E6] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#e8d5c8] border-t-[#E8634A] rounded-full animate-spin" />
      </div>
    );
  }

  const filledBig3 = big3Items.filter((b) => b.content.trim());

  return (
    <div className="min-h-screen bg-[#F8F0E6] flex flex-col">
      <header className="bg-white border-b border-[#e8d5c8] px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-bold text-base text-[#1B3A5C] hover:text-[#E8634A] transition">
            TimeSync
          </Link>
          <span className="text-[#e8d5c8]">|</span>
          <span className="text-sm font-semibold text-[#E8634A]">기록</span>
        </div>
        <button
          onClick={() => { removeToken(); router.push("/login"); }}
          className="text-sm text-[#4A6A8C] hover:text-[#E8634A] transition px-3 py-1.5"
        >
          로그아웃
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Date list */}
        <div className="w-64 shrink-0 bg-white border border-[#e8d5c8] rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="py-3 px-4 border-b border-[#e8d5c8] shrink-0">
            <span className="text-sm font-semibold text-[#E8634A]">타임박스 기록</span>
            <span className="ml-2 text-xs text-[#c4a898]">{historyList.length}일</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 flex flex-col gap-1.5">
            {historyList.length === 0 ? (
              <div className="text-xs text-[#c4a898] text-center py-8">기록이 없습니다</div>
            ) : (
              historyList.map((item) => {
                const { full, weekday } = formatDate(item.date);
                const isSelected = selectedDate === item.date;
                return (
                  <button
                    key={item.date}
                    onClick={() => setSelectedDate(item.date)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition
                      ${isSelected
                        ? "bg-[#FDF0EC] border-[#E8634A]"
                        : "bg-white border-[#f0e4da] hover:border-[#E8634A] hover:bg-[#FFF8F5]"
                      }`}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-sm font-semibold ${isSelected ? "text-[#E8634A]" : "text-[#1B3A5C]"}`}>
                        {full}
                      </span>
                      <span className="text-[11px] text-[#c4a898]">({weekday})</span>
                    </div>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-[11px] text-[#c4a898]">
                        Big3 {item.bigThreeCompleted}/{item.bigThreeTotal}
                      </span>
                      <span className="text-[11px] text-[#c4a898]">
                        슬롯 {item.timeBoxCount}개
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* TimeBox view */}
        <div className="flex-1 bg-white border border-[#e8d5c8] rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {!selectedDate ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#c4a898] gap-2">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="15" stroke="#e8d5c8" strokeWidth="2" />
                <path d="M18 10v8l5 3" stroke="#e8d5c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm">날짜를 선택하면 타임박스를 볼 수 있어요</span>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#e8d5c8] border-t-[#E8634A] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Big 3 summary */}
              {filledBig3.length > 0 && (
                <div className="px-4 py-3 border-b border-[#e8d5c8] flex flex-wrap gap-2 shrink-0">
                  {filledBig3.map((item) => {
                    const color = BIG3_COLORS[item.order] ?? BIG3_COLORS[1];
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs"
                        style={{ backgroundColor: color.bg, color: color.text }}
                      >
                        {item.completed ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" fill="currentColor" opacity="0.2" />
                            <path d="M3 6l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        )}
                        <span className={`font-medium ${item.completed ? "line-through opacity-60" : ""}`}>
                          {item.content}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Read-only TimeBox */}
              <TimeBox
                slots={slots}
                slotMeta={slotMeta}
                slotNotes={slotNotes}
                isBig3Dragging={false}
                readOnly
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
