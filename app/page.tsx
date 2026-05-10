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
            <button className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors px-4 py-2">
              로그인
            </button>
            <button className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
              무료 시작
            </button>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 text-sm px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            지금 무료로 사용해보세요
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 text-zinc-900">
            일정 관리,<br />
            <span className="text-zinc-400">더 스마트하게</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            팀과 개인의 일정을 한 곳에서 관리하세요.<br />
            실시간 동기화와 스마트 알림으로 중요한 약속을 놓치지 마세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-zinc-900 text-white px-8 py-4 rounded-xl text-base font-medium hover:bg-zinc-700 transition-colors">
              무료로 시작하기 →
            </button>
            <button className="border border-zinc-200 text-zinc-700 px-8 py-4 rounded-xl text-base font-medium hover:bg-zinc-50 transition-colors">
              데모 보기
            </button>
          </div>
          <p className="mt-6 text-sm text-zinc-400">신용카드 불필요 · 14일 무료 체험</p>
        </div>

        {/* 대시보드 미리보기 */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                <div key={day} className="text-center text-xs text-zinc-400 py-2 font-medium">{day}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 5;
                const isToday = day === 10;
                const hasEvent = [3, 8, 10, 15, 20, 22, 28].includes(day);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative
                      ${isToday ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"}
                      ${day < 1 || day > 31 ? "text-zinc-300" : "text-zinc-600"}
                    `}
                  >
                    {day > 0 && day <= 31 ? day : ""}
                    {hasEvent && day > 0 && day <= 31 && (
                      <div className={`w-1 h-1 rounded-full mt-0.5 ${isToday ? "bg-white" : "bg-zinc-400"}`}></div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              {[
                { time: "09:00", title: "팀 주간 회의", color: "bg-blue-100 text-blue-700" },
                { time: "14:00", title: "클라이언트 미팅", color: "bg-purple-100 text-purple-700" },
                { time: "16:30", title: "디자인 리뷰", color: "bg-green-100 text-green-700" },
              ].map((event) => (
                <div key={event.time} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${event.color}`}>
                  <span className="text-xs font-mono">{event.time}</span>
                  <span className="text-sm font-medium">{event.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="py-24 px-6 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">필요한 모든 기능</h2>
            <p className="text-zinc-500 text-lg">복잡한 일정도 쉽고 빠르게 관리할 수 있습니다.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                ),
                title: "스마트 캘린더",
                desc: "드래그 앤 드롭으로 일정을 쉽게 관리하세요. 월, 주, 일 뷰를 자유롭게 전환할 수 있습니다.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "팀 협업",
                desc: "팀원들의 가용 시간을 한눈에 파악하고, 겹치지 않는 최적의 미팅 시간을 자동으로 찾아드립니다.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                ),
                title: "스마트 알림",
                desc: "중요한 일정 전에 맞춤 알림을 받으세요. 이메일, 앱 푸시, SMS 중 원하는 방식을 선택하세요.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                title: "실시간 동기화",
                desc: "Google Calendar, Apple Calendar, Outlook과 실시간으로 동기화됩니다. 어디서든 최신 일정을 확인하세요.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                ),
                title: "예약 페이지",
                desc: "나만의 예약 링크를 만들어 공유하세요. 상대방이 편한 시간을 직접 선택할 수 있습니다.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                ),
                title: "분석 및 리포트",
                desc: "시간 사용 패턴을 분석하고 생산성을 높이세요. 주간, 월간 리포트를 자동으로 생성해드립니다.",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-8 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-colors">
                <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center text-zinc-700 mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
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
              { step: "01", title: "계정 만들기", desc: "이메일 하나로 무료 계정을 만드세요. 신용카드 정보는 필요 없습니다." },
              { step: "02", title: "캘린더 연결", desc: "기존에 사용하던 캘린더를 연결하면 기존 일정이 자동으로 가져와집니다." },
              { step: "03", title: "팀원 초대", desc: "팀원을 초대하고 함께 일정을 관리하세요. 역할별 권한 설정도 가능합니다." },
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
            지금 바로 시작하세요
          </h2>
          <p className="text-zinc-400 text-lg mb-10">
            14일 무료 체험 후 마음에 들면 계속 사용하세요.<br />
            언제든 취소 가능합니다.
          </p>
          <button className="bg-white text-zinc-900 px-10 py-4 rounded-xl text-base font-semibold hover:bg-zinc-100 transition-colors">
            무료로 시작하기 →
          </button>
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
