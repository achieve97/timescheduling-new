import Link from "next/link";

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const BRAIN_DUMP_ROWS = 12;

function TimeSchedulingPreview() {
  return (
    <div className="bg-white border border-[#e8d5c8] rounded-2xl shadow-lg overflow-hidden text-sm select-none">
      <div className="border-b border-[#e8d5c8] py-3 text-center">
        <span className="text-[#E8634A] font-semibold tracking-wide text-base">Time Scheduling</span>
      </div>
      <div className="flex divide-x divide-[#e8d5c8]">
        <div className="flex flex-col divide-y divide-[#e8d5c8] w-[44%]">
          <div>
            <div className="py-1.5 px-3 text-center text-[#E8634A] font-medium border-b border-[#e8d5c8] text-xs">
              Big 3
            </div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center border-b border-[#f0e4da] last:border-b-0">
                <span className="w-8 text-center text-[#c4a898] text-xs py-2.5 border-r border-[#e8d5c8] shrink-0">
                  {n}
                </span>
                <div className="flex-1 h-8" />
              </div>
            ))}
          </div>
          <div>
            <div className="py-1.5 px-3 text-center text-[#E8634A] font-medium border-b border-[#e8d5c8] text-xs">
              Brain Dump
            </div>
            {Array.from({ length: BRAIN_DUMP_ROWS }).map((_, i) => (
              <div key={i} className="h-7 border-b border-[#f0e4da] last:border-b-0" />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="py-1.5 text-center text-[#E8634A] font-medium border-b border-[#e8d5c8] text-xs">
            Time Box
          </div>
          <div className="flex border-b border-[#e8d5c8]">
            <div className="w-14 shrink-0 text-center text-[10px] text-[#c4a898] py-1.5 border-r border-[#e8d5c8] font-medium">
              Time
            </div>
            <div className="flex-1 text-center text-[10px] text-[#c4a898] py-1.5 border-r border-[#e8d5c8] font-medium">
              00 ~ 30
            </div>
            <div className="flex-1 text-center text-[10px] text-[#c4a898] py-1.5 font-medium">
              30 ~ 00
            </div>
          </div>
          {HOURS.map((hour) => (
            <div key={hour} className="flex border-b border-[#f0e4da] last:border-b-0">
              <div className="w-14 shrink-0 text-center text-[10px] text-[#E8634A] py-1.5 border-r border-[#e8d5c8] font-medium">
                {hour}
              </div>
              <div className="flex-1 border-r border-[#f0e4da] py-1.5" />
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
    <div className="min-h-screen bg-[#F8F0E6] text-[#1B3A5C]">

      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F0E6]/90 backdrop-blur-md border-b border-[#e8d5c8]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-[#1B3A5C]">
            <a href="#features" className="hover:text-[#E8634A] transition-colors">기능</a>
            <a href="#how" className="hover:text-[#E8634A] transition-colors">사용 방법</a>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1B3A5C]">
            TimeSync
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-bold tracking-widest uppercase text-[#1B3A5C] hover:text-[#E8634A] transition-colors px-4 py-2">
              로그인
            </Link>
            <Link href="/register" className="text-xs font-bold tracking-widest uppercase border-2 border-[#1B3A5C] text-[#1B3A5C] px-5 py-2.5 rounded-xl hover:bg-[#1B3A5C] hover:text-[#F8F0E6] transition-colors">
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#E8634A] mb-6">
                Elon Musk Time Boxing Method
              </p>
              <h1 className="text-5xl font-bold leading-tight mb-3 text-[#1B3A5C]">
                하루를 설계하는<br />가장 스마트한<br />방법
              </h1>
              <svg viewBox="0 0 300 16" className="w-60 mb-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 8 C25 2, 50 14, 75 8 C100 2, 125 14, 150 8 C175 2, 200 14, 225 8 C250 2, 275 14, 300 8" stroke="#E8634A" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
              <p className="text-base text-[#4A6A8C] mb-10 leading-relaxed">
                Big 3으로 오늘의 핵심 목표를 정하고,<br />
                Time Box로 24시간을 빈틈없이 채우세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="border-2 border-[#E8634A] text-[#E8634A] px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[#E8634A] hover:text-white transition-colors text-center">
                  시작하기 →
                </Link>
                <Link href="/login" className="border-2 border-[#1B3A5C] text-[#1B3A5C] px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[#1B3A5C] hover:text-[#F8F0E6] transition-colors text-center">
                  로그인
                </Link>
              </div>
            </div>
            <div className="lg:max-h-[600px] overflow-y-auto rounded-2xl shadow-xl ring-1 ring-[#e8d5c8]">
              <TimeSchedulingPreview />
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-[#E8634A] mb-4">기능</p>
            <h2 className="text-4xl font-bold text-[#1B3A5C] mb-4">핵심 기능 3가지</h2>
            <p className="text-[#4A6A8C] text-lg">단순하지만, 강력합니다.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                badge: "Big 3",
                title: "오늘의 최우선 목표",
                desc: "매일 아침 3가지 핵심 목표를 정하세요. 무엇이 가장 중요한지 명확해지면 하루가 달라집니다.",
                accent: "#E8634A",
                bg: "#FDF0EC",
              },
              {
                badge: "Brain Dump",
                title: "머릿속 비우기",
                desc: "떠오르는 모든 생각을 기록하세요. 뇌를 비워야 진짜 집중이 시작됩니다.",
                accent: "#1B3A5C",
                bg: "#EDF3F8",
              },
              {
                badge: "Time Box",
                title: "30분 단위 시간 배분",
                desc: "0시부터 23시까지, 30분 단위로 하루를 설계하세요. 계획한 시간만큼 실행됩니다.",
                accent: "#4A9B8E",
                bg: "#EBF5F3",
              },
            ].map((f) => (
              <div key={f.badge} className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8d5c8] hover:shadow-md transition-shadow">
                <div
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-6"
                  style={{ color: f.accent, backgroundColor: f.bg }}
                >
                  {f.badge}
                </div>
                <h3 className="font-bold text-xl mb-3 text-[#1B3A5C]">{f.title}</h3>
                <p className="text-[#4A6A8C] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 방법 — 핑크 섹션 */}
      <section id="how" className="py-24 px-6 bg-[#F5C4B4]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-[#E8634A] mb-4">사용 방법</p>
            <h2 className="text-4xl font-bold text-[#1B3A5C] mb-4">3단계로 시작하세요</h2>
            <p className="text-[#6B4A40] text-lg">5분이면 충분합니다.</p>
          </div>
          <div className="space-y-6">
            {[
              { step: "01", title: "Big 3 작성", desc: "오늘 반드시 해야 할 일 3가지를 적으세요. 3개를 넘기지 마세요 — 집중이 핵심입니다." },
              { step: "02", title: "Brain Dump", desc: "머릿속에 맴도는 걱정, 아이디어, 할 일을 모두 쏟아내세요. 쓰고 나면 머리가 가벼워집니다." },
              { step: "03", title: "Time Box 채우기", desc: "Big 3을 언제 할지 시간표에 배치하세요. 빈 칸이 줄수록 하루가 채워집니다." },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-3xl p-8 flex gap-6 items-start shadow-sm">
                <div className="text-4xl font-bold text-[#E8634A] tabular-nums shrink-0 w-14">{item.step}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#1B3A5C]">{item.title}</h3>
                  <p className="text-[#4A6A8C] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — 민트 섹션 */}
      <section className="py-24 px-6 bg-[#BDD8D4]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#1B3A5C] mb-6">
            오늘부터 하루를 설계하세요
          </h2>
          <p className="text-[#2E5A54] text-lg mb-10">
            회원가입만 하면 모든 기능을 무료로 사용할 수 있습니다.<br />
            별도 요금이나 구독 없이 영구 무료입니다.
          </p>
          <Link
            href="/register"
            className="inline-block border-2 border-[#1B3A5C] text-[#1B3A5C] px-10 py-4 rounded-2xl text-base font-semibold hover:bg-[#1B3A5C] hover:text-white transition-colors"
          >
            시작하기 →
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-6 bg-[#E8634A]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-bold text-white">TimeSync</span>
          <p className="text-white/80 text-sm">© 2026 TimeSync. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/80">
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">문의</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
