"use client";

import { useUser } from "@/components/UserProvider";
import { useState } from "react";

export function UserNamePrompt() {
  const { userName, setUserName, isReady } = useUser();
  const [input, setInput] = useState("");
  const [dismissed, setDismissed] = useState(false);

  if (!isReady || userName || dismissed) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setUserName(input.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-800">ようこそ！</h2>
        <p className="mt-2 text-sm text-slate-500">
          表示名を入力してください。プロジェクト作成やメンバー招待に使用します。
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="あなたの名前"
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              始める
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-lg px-4 py-2.5 text-sm text-slate-500 transition hover:bg-slate-100"
            >
              スキップ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
