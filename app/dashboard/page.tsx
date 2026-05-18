"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken, getTodayString, apiFetch } from "@/lib/api";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Link from "next/link";
import BigThree from "./_components/BigThree";
import BrainDump from "./_components/BrainDump";
import TimeBox from "./_components/TimeBox";

export interface BigThreeItem {
  id: number;
  order: number;
  content: string;
  completed: boolean;
}

export interface BrainDumpItem {
  id: number;
  content: string;
}

export type Slots = Record<string, string>;
export type SlotMeta = Record<string, { bigThreeOrder: number }>;

export default function DashboardPage() {
  const router = useRouter();
  const [date, setDate] = useState(getTodayString());
  const [ready, setReady] = useState(false);
  const [bigThreeItems, setBigThreeItems] = useState<BigThreeItem[]>([]);
  const [brainDumpItems, setBrainDumpItems] = useState<BrainDumpItem[]>([]);
  const [slots, setSlots] = useState<Slots>({});
  const [slotMeta, setSlotMeta] = useState<SlotMeta>({});
  const [slotNotes, setSlotNotes] = useState<Record<string, string>>({});
  const [activeDragItem, setActiveDragItem] = useState<BrainDumpItem | null>(null);
  const [activeBig3Item, setActiveBig3Item] = useState<BigThreeItem | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!bigThreeItems.length || !Object.keys(slots).length) return;
    setSlotMeta((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.entries(slots).forEach(([key, content]) => {
        if (!content.trim() || next[key]) return;
        const match = bigThreeItems.find((b) => b.content.trim() === content.trim());
        if (match) {
          next[key] = { bigThreeOrder: match.order };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [bigThreeItems, slots]);

  useEffect(() => {
    if (!ready) return;
    setBigThreeItems([]);
    setBrainDumpItems([]);
    setSlots({});
    setSlotMeta({});
    setSlotNotes({});
    apiFetch(`/api/schedule/big3?date=${date}`).then((r) => r.json()).then(setBigThreeItems);
    apiFetch(`/api/schedule/brain-dump?date=${date}`).then((r) => r.json()).then(setBrainDumpItems);
    apiFetch(`/api/schedule/timebox?date=${date}`)
      .then((r) => r.json())
      .then((data: Array<{ hour: number; isFirstHalf: boolean; content: string; notes: string }>) => {
        const map: Slots = {};
        const notesMap: Record<string, string> = {};
        data.forEach(({ hour, isFirstHalf, content, notes }) => {
          const k = `${hour}-${String(isFirstHalf)}`;
          map[k] = content;
          if (notes) notesMap[k] = notes;
        });
        setSlots(map);
        setSlotNotes(notesMap);
      });
  }, [date, ready]);

  function handleLogout() {
    removeToken();
    router.push("/login");
  }

  async function moveToBrainDump(bigItem: BigThreeItem) {
    if (!bigItem.content.trim()) return;

    const [newBrainItem] = await Promise.all([
      apiFetch("/api/schedule/brain-dump", {
        method: "POST",
        body: JSON.stringify({ date, content: bigItem.content }),
      }).then((r) => r.json()),
      apiFetch(`/api/schedule/big3/${bigItem.id}`, {
        method: "PUT",
        body: JSON.stringify({ content: "", completed: false }),
      }),
    ]);

    setBrainDumpItems((prev) => [...prev, newBrainItem]);
    setBigThreeItems((prev) =>
      prev.map((b) => (b.id === bigItem.id ? { ...b, content: "", completed: false } : b))
    );
  }

  async function moveToBigThree(brainItem: BrainDumpItem) {
    const emptySlot = bigThreeItems.find((b) => !b.content.trim());
    if (!emptySlot) return;

    const [updated] = await Promise.all([
      apiFetch(`/api/schedule/big3/${emptySlot.id}`, {
        method: "PUT",
        body: JSON.stringify({ content: brainItem.content }),
      }).then((r) => r.json()),
      apiFetch(`/api/schedule/brain-dump/${brainItem.id}`, { method: "DELETE" }),
    ]);

    setBigThreeItems((prev) => prev.map((b) => (b.id === emptySlot.id ? updated : b)));
    setBrainDumpItems((prev) => prev.filter((b) => b.id !== brainItem.id));
  }

  async function moveToBigThreeSlot(brainItem: BrainDumpItem, targetSlot: BigThreeItem) {
    const [updated] = await Promise.all([
      apiFetch(`/api/schedule/big3/${targetSlot.id}`, {
        method: "PUT",
        body: JSON.stringify({ content: brainItem.content }),
      }).then((r) => r.json()),
      apiFetch(`/api/schedule/brain-dump/${brainItem.id}`, { method: "DELETE" }),
    ]);

    setBigThreeItems((prev) => prev.map((b) => (b.id === targetSlot.id ? updated : b)));
    setBrainDumpItems((prev) => prev.filter((b) => b.id !== brainItem.id));
  }

  async function reorderBigThree(activeId: number, overId: number) {
    const oldIndex = bigThreeItems.findIndex((b) => b.id === activeId);
    const newIndex = bigThreeItems.findIndex((b) => b.id === overId);
    if (oldIndex === newIndex) return;

    const reordered = arrayMove(bigThreeItems, oldIndex, newIndex).map((item, i) => ({
      ...item,
      order: i + 1,
    }));
    setBigThreeItems(reordered);

    await apiFetch("/api/schedule/big3", {
      method: "PATCH",
      body: JSON.stringify(reordered.map(({ id, order }) => ({ id, order }))),
    });
  }

  async function saveSlotNotes(slotKey: string, notesVal: string) {
    const parts = slotKey.split("-");
    const hour = parseInt(parts[0]);
    const isFirstHalf = parts[1] === "true";
    const content = slots[slotKey] ?? "";
    setSlotNotes((prev) => ({ ...prev, [slotKey]: notesVal }));
    await apiFetch("/api/schedule/timebox", {
      method: "PUT",
      body: JSON.stringify({ date, hour, isFirstHalf, content, notes: notesVal }),
    });
  }

  async function clearTimeBoxSlot(slotKey: string) {
    const parts = slotKey.split("-");
    const hour = parseInt(parts[0]);
    const isFirstHalf = parts[1] === "true";
    setSlots((prev) => { const n = { ...prev }; delete n[slotKey]; return n; });
    setSlotNotes((prev) => { const n = { ...prev }; delete n[slotKey]; return n; });
    setSlotMeta((prev) => { const n = { ...prev }; delete n[slotKey]; return n; });
    await apiFetch("/api/schedule/timebox", {
      method: "PUT",
      body: JSON.stringify({ date, hour, isFirstHalf, content: "" }),
    });
  }

  async function fillTimeBoxSlot(item: BigThreeItem, hour: number, isFirstHalf: boolean) {
    const k = `${hour}-${String(isFirstHalf)}`;
    setSlots((prev) => ({ ...prev, [k]: item.content }));
    setSlotMeta((prev) => ({ ...prev, [k]: { bigThreeOrder: item.order } }));
    await apiFetch("/api/schedule/timebox", {
      method: "PUT",
      body: JSON.stringify({ date, hour, isFirstHalf, content: item.content }),
    });
  }

  async function fillTimeBoxRange(item: BigThreeItem, startIdx: number, endIdx: number) {
    if (endIdx <= startIdx) return;
    const updates = Array.from({ length: endIdx - startIdx }, (_, i) => {
      const idx = startIdx + i;
      return { hour: Math.floor(idx / 2), isFirstHalf: idx % 2 === 0 };
    });
    setSlots((prev) => {
      const next = { ...prev };
      updates.forEach(({ hour, isFirstHalf }) => {
        next[`${hour}-${String(isFirstHalf)}`] = item.content;
      });
      return next;
    });
    setSlotMeta((prev) => {
      const next = { ...prev };
      updates.forEach(({ hour, isFirstHalf }) => {
        next[`${hour}-${String(isFirstHalf)}`] = { bigThreeOrder: item.order };
      });
      return next;
    });
    await Promise.all(
      updates.map(({ hour, isFirstHalf }) =>
        apiFetch("/api/schedule/timebox", {
          method: "PUT",
          body: JSON.stringify({ date, hour, isFirstHalf, content: item.content }),
        })
      )
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const type = event.active.data.current?.type;
    if (type === "brain-dump") setActiveDragItem(event.active.data.current!.item);
    if (type === "big3") setActiveBig3Item(event.active.data.current!.item);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDragItem(null);
    setActiveBig3Item(null);
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "brain-dump" && overType === "big3") {
      moveToBigThreeSlot(active.data.current!.item, over.data.current!.item);
      return;
    }

    if (activeType === "big3" && overType === "big3" && active.id !== over.id) {
      reorderBigThree(active.data.current!.item.id, over.data.current!.item.id);
      return;
    }

    if (activeType === "big3" && overType === "timebox") {
      fillTimeBoxSlot(
        active.data.current!.item,
        over.data.current!.hour,
        over.data.current!.isFirstHalf,
      );
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#F8F0E6] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#e8d5c8] border-t-[#E8634A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F0E6] flex flex-col">
      <header className="bg-white border-b border-[#e8d5c8] px-4 h-14 flex items-center justify-between shrink-0">
        <span className="font-bold text-base text-[#1B3A5C]">TimeSync</span>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm border border-[#e8d5c8] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#E8634A] focus:border-transparent text-[#1B3A5C] bg-white transition"
          />
          <Link
            href="/history"
            className="text-sm text-[#4A6A8C] hover:text-[#E8634A] transition px-3 py-1.5"
          >
            기록
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-[#4A6A8C] hover:text-[#E8634A] transition px-3 py-1.5"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="bg-white border border-[#e8d5c8] rounded-2xl shadow-sm flex flex-col lg:flex-row flex-1 overflow-hidden">
            <div className="text-center py-3 border-b border-[#e8d5c8] lg:hidden">
              <span className="text-[#E8634A] font-semibold">Time Scheduling</span>
            </div>

            <div className="w-full lg:w-80 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-[#e8d5c8]">
              <div className="hidden lg:block text-center py-3 border-b border-[#e8d5c8]">
                <span className="text-[#E8634A] font-semibold text-sm">Time Scheduling</span>
              </div>
              <BigThree
                items={bigThreeItems}
                onItemsChange={setBigThreeItems}
                onMoveToBrainDump={moveToBrainDump}
                onSchedule={fillTimeBoxRange}
              />
              <div className="flex-1 border-t border-[#e8d5c8]">
                <BrainDump
                  date={date}
                  items={brainDumpItems}
                  onItemsChange={setBrainDumpItems}
                  onMoveToBigThree={moveToBigThree}
                  hasEmptySlot={bigThreeItems.some((b) => !b.content.trim())}
                />
              </div>
            </div>

            <TimeBox
              date={date}
              slots={slots}
              onSlotsChange={setSlots}
              slotMeta={slotMeta}
              slotNotes={slotNotes}
              onNotesSave={saveSlotNotes}
              onSlotClear={clearTimeBoxSlot}
              isBig3Dragging={activeBig3Item !== null}
            />
          </div>

          <DragOverlay>
            {(activeDragItem ?? activeBig3Item) ? (
              <div className="bg-white border-2 border-[#E8634A] rounded-xl px-3 py-2 text-sm text-[#1B3A5C] shadow-lg">
                {activeDragItem?.content ?? activeBig3Item?.content}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
