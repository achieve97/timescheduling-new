import Link from "next/link";

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const BRAIN_DUMP_ROWS = 12;

function TimeSchedulingPreview() {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden text-sm select-none">
      {/* 헤더 */}
      <div className="border-b border-zinc-200 py-3 text-center">
        <span className="text-[#b5651d] font-semibold tracking-wide text-base">Time Scheduling</span>
      </div>

      <div className="flex divide-x divide-zinc-200">
        {/* 왼쪽: Big 3 + Brain Dump */}
        <div className="flex flex-col divide-y divide-zinc-200 w-[44%]">
          {/* Big 3 */}
          <div>
            <div className="py-1.5 px-3 text-center text-[#b5651d] font-medium border-b border-zinc-200 text-xs">
              Big 3
            </div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center border-b border-zinc-100 last:border-b-0">
                <span className="w-8 text-center text-zinc-400 text-xs py-2.5 border-r border-zinc-200 shrink-0">
                  {n}
                </span>
                <div className="flex-1 h-8" />
              </div>
            ))}
          </div>

          {/* Brain Dump */}
          <div>
            <div className="py-1.5 px-3 text-center text-[#b5651d] font-medium border-b border-zinc-200 text-xs">
              Brain Dump
            </div>
            {Array.from({ length: BRAIN_DUMP_ROWS }).map((_, i) => (
              <div key={i} className="h-7 border-b border-zinc-100 last:border-b-0" />
            ))}
          </div>
        </div>

        {/* 오른쪽: Time Box */}
        <div className="flex-1 flex flex-col">
          <div className="py-1.5 text-center text-[#b5651d] font-medium border-b border-zinc-200 text-xs">
            Time Box
          </div>
          {/* 컬럼 헤더 */}
          <div className="flex border-b border-zinc-200">
            <div className="w-14 shrink-0 text-center text-[10px] text-zinc-500 py-1.5 border-r border-zinc-200 font-medium">
              Time
            </div>
            <div className="flex-1 text-center text-[10px] text-zinc-500 py-1.5 border-r border-zinc-200 font-medium">
              00 ~ 30
            </div>
            <div className="flex-1 text-center text-[10px] text-zinc-500 py-1.5 font-medium">
              30 ~ 00
            </div>
          </div>
          {/* 시간 행 */}
          {HOURS.map((hour) => (
            <div key={hour} className="flex border-b border-zinc-100 last:border-b-0">
              <div className="w-14 shrink-0 text-center text-[10px] text-[#b5651d] py-1.5 border-r border-zinc-200 font-medium">
                {hour}
              </div>
              <div className="flex-1 border-r border-zinc-100 py-1.5" />
              <div className="flex-1 py-1.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" />
                <rect x="2" y="9" width="5" height="5" rx="1" fill="white" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight">TimeSync</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
            <a href="#features" className="hover:text-zinc-900 transition-colors">기능</a>
            <a href="#how" className="hover:text-zinc-900 transition-colors">사용 방법</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">요금제</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors px-4 py-2">
              로그인
            </Link>
            <Link href="/register" className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
              무료 시작
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* 텍스트 */}
            <div>
              <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 text-sm px-4 py-1.5 rounded-full mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                지금 무료로 사용해보세요
              </div>
              <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6 text-zinc-900">
                하루를<br />
                <span className="text-zinc-400">계획하는 가장</span><br />
                스마트한 방법
              </h1>
              <p className="text-lg text-zinc-500 mb-10 leading-relaxed">
                Big 3으로 오늘의 핵심 목표를 정하고,<br />
                Time Box로 24시간을 빈틈없이 채우세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-zinc-900 text-white px-8 py-4 rounded-xl text-base font-medium hover:bg-zinc-700 transition-colors text-center">
                  무료로 시작하기 →
                </Link>
                <Link href="/login" className="border border-zinc-200 text-zinc-700 px-8 py-4 rounded-xl text-base font-medium hover:bg-zinc-50 transition-colors text-center">
                  데모 보기
                </Link>
              </div>
              <p className="mt-6 text-sm text-zinc-400">신용카드 불필요 · 14일 무료 체험</p>
            </div>

            {/* UI 미리보기 */}
            <div className="lg:max-h-[600px] overflow-y-auto rounded-2xl shadow-xl ring-1 ring-zinc-200">
              <TimeSchedulingPreview />
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="py-24 px-6 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">핵심 기능 3가지</h2>
            <p className="text-zinc-500 text-lg">단순하지만, 강력합니다.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                badge: "Big 3",
                title: "오늘의 최우선 목표",
                desc: "매일 아침 3가지 핵심 목표를 정하세요. 무엇이 가장 중요한지 명확해지면 하루가 달라집니다.",
                color: "text-[#b5651d]",
                bg: "bg-orange-50",
              },
              {
                badge: "Brain Dump",
                title: "머릿속 비우기",
                desc: "떠오르는 모든 생각을 기록하세요. 뇌를 비워야 진짜 집중이 시작됩니다.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                badge: "Time Box",
                title: "30분 단위 시간 배분",
                desc: "0시부터 23시까지, 30분 단위로 하루를 설계하세요. 계획한 시간만큼 실행됩니다.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
            ].map((f) => (
              <div key={f.badge} className="bg-white p-8 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-colors">
                <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6 ${f.color} ${f.bg}`}>
                  {f.badge}
                </div>
                <h3 className="font-semibold text-xl mb-3">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 방법 */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">3단계로 시작하세요</h2>
            <p className="text-zinc-500 text-lg">5분이면 충분합니다.</p>
          </div>
          <div className="space-y-12">
            {[
              { step: "01", title: "Big 3 작성", desc: "오늘 반드시 해야 할 일 3가지를 적으세요. 3개를 넘기지 마세요 — 집중이 핵심입니다." },
              { step: "02", title: "Brain Dump", desc: "머릿속에 맴도는 걱정, 아이디어, 할 일을 모두 쏟아내세요. 쓰고 나면 머리가 가벼워집니다." },
              { step: "03", title: "Time Box 채우기", desc: "Big 3을 언제 할지 시간표에 배치하세요. 빈 칸이 줄수록 하루가 채워집니다." },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start">
                <div className="text-5xl font-bold text-zinc-100 tabular-nums shrink-0 w-16">{item.step}</div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 px-6 bg-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white tracking-tight mb-6">
            오늘부터 하루를 설계하세요
          </h2>
          <p className="text-zinc-400 text-lg mb-10">
            14일 무료 체험 후 마음에 들면 계속 사용하세요.<br />
            언제든 취소 가능합니다.
          </p>
          <Link href="/register" className="bg-white text-zinc-900 px-10 py-4 rounded-xl text-base font-semibold hover:bg-zinc-100 transition-colors">
            무료로 시작하기 →
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-6 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" />
                <rect x="2" y="9" width="5" height="5" rx="1" fill="white" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-sm">TimeSync</span>
          </div>
          <p className="text-zinc-400 text-sm">© 2026 TimeSync. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-zinc-900 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">이용약관</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">문의</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
