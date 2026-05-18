"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken, getTodayString } from "@/lib/api";
import BigThree from "./_components/BigThree";
import BrainDump from "./_components/BrainDump";
import TimeBox from "./_components/TimeBox";

export default function DashboardPage() {
  const router = useRouter();
  const [date, setDate] = useState(getTodayString());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  function handleLogout() {
    removeToken();
    router.push("/login");
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
          <button
            onClick={handleLogout}
            className="text-sm text-[#4A6A8C] hover:text-[#E8634A] transition px-3 py-1.5"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="bg-white border border-[#e8d5c8] rounded-2xl shadow-sm flex flex-col lg:flex-row flex-1 overflow-hidden">
          <div className="text-center py-3 border-b border-[#e8d5c8] lg:hidden">
            <span className="text-[#E8634A] font-semibold">Time Scheduling</span>
          </div>

          <div className="w-full lg:w-80 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-[#e8d5c8]">
            <div className="hidden lg:block text-center py-3 border-b border-[#e8d5c8]">
              <span className="text-[#E8634A] font-semibold text-sm">Time Scheduling</span>
            </div>
            <BigThree date={date} />
            <div className="flex-1 border-t border-[#e8d5c8]">
              <BrainDump date={date} />
            </div>
          </div>

          <TimeBox date={date} />
        </div>
      </main>
    </div>
  );
}
