"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/lib/api";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type Errors = {
  email?: string;
  password?: string;
  confirm?: string;
  general?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!email || !isValidEmail(email)) next.email = "유효한 이메일을 입력해주세요.";
    if (!password || password.length < 8) next.password = "비밀번호는 8자 이상이어야 합니다.";
    if (password !== confirm) next.confirm = "비밀번호가 일치하지 않습니다.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message });
        return;
      }

      setToken(data.token);
      router.push("/dashboard");
    } catch {
      setErrors({ general: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F0E6] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-[#1B3A5C]">TimeSync</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1B3A5C]">회원가입</h1>
          <p className="text-[#4A6A8C] text-sm mt-1">지금 바로 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#e8d5c8] p-6 space-y-4 shadow-sm" noValidate>
          {errors.general && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-2xl">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#1B3A5C] mb-1.5" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#E8634A] focus:border-transparent transition placeholder:text-[#c4a898]
                ${errors.email ? "border-red-300 bg-red-50" : "border-[#e8d5c8] bg-white"}`}
              placeholder="name@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B3A5C] mb-1.5" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#E8634A] focus:border-transparent transition placeholder:text-[#c4a898]
                ${errors.password ? "border-red-300 bg-red-50" : "border-[#e8d5c8] bg-white"}`}
              placeholder="8자 이상 입력해주세요"
              autoComplete="new-password"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B3A5C] mb-1.5" htmlFor="confirm">
              비밀번호 확인
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm text-[#1B3A5C] focus:outline-none focus:ring-2 focus:ring-[#E8634A] focus:border-transparent transition placeholder:text-[#c4a898]
                ${errors.confirm ? "border-red-300 bg-red-50" : "border-[#e8d5c8] bg-white"}`}
              placeholder="비밀번호를 다시 입력해주세요"
              autoComplete="new-password"
            />
            {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-[#E8634A] text-[#E8634A] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#E8634A] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-[#4A6A8C] mt-4">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-[#E8634A] font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
