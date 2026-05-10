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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-white border-b border-zinc-200 px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span className="font-semibold text-base text-zinc-900">TimeSync</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm border border-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-zinc-700"
          />
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-500 hover:text-zinc-900 transition px-3 py-1.5"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col lg:flex-row flex-1 overflow-hidden">
          <div className="text-center py-3 border-b border-zinc-200 lg:hidden">
            <span className="text-[#b5651d] font-semibold">Time Scheduling</span>
          </div>

          <div className="hidden lg:flex items-center justify-center absolute" style={{ display: "none" }} />

          <div className="w-full lg:w-80 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-200">
            <div className="hidden lg:block text-center py-3 border-b border-zinc-200">
              <span className="text-[#b5651d] font-semibold text-sm">Time Scheduling</span>
            </div>
            <BigThree date={date} />
            <div className="flex-1 border-t border-zinc-200">
              <BrainDump date={date} />
            </div>
          </div>

          <TimeBox date={date} />
        </div>
      </main>
    </div>
  );
}
