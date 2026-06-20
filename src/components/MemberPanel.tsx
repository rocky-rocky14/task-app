"use client";

import type { Member } from "@/lib/types";
import { getInitials } from "@/lib/user";
import { useState } from "react";

interface MemberPanelProps {
  members: Member[];
  inviteCode: string;
  projectId: string;
  onMembersChange: (members: Member[]) => void;
}

export function MemberPanel({
  members,
  inviteCode,
  projectId,
  onMembersChange,
}: MemberPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${inviteCode}`
      : `/invite/${inviteCode}`;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "招待に失敗しました");
      }

      const member = await res.json();
      onMembersChange([...members, member]);
      setName("");
      setEmail("");
      setShowInvite(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "招待に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("このメンバーを削除しますか？")) return;

    try {
      const res = await fetch(`/api/projects/${projectId}/members/${memberId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("削除に失敗しました");
      onMembersChange(members.filter((m) => m.id !== memberId));
    } catch {
      alert("メンバーの削除に失敗しました");
    }
  };

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
      >
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((m) => (
            <span
              key={m.id}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-medium text-indigo-700"
              title={m.name}
            >
              {getInitials(m.name)}
            </span>
          ))}
          {members.length > 3 && (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-medium text-slate-600">
              +{members.length - 3}
            </span>
          )}
        </div>
        <span>{members.length} メンバー</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-4 py-3">
              <h3 className="font-semibold text-slate-800">メンバー</h3>
            </div>

            <div className="max-h-60 overflow-y-auto p-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">
                      {getInitials(m.name)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{m.name}</p>
                      {m.email && <p className="text-xs text-slate-500">{m.email}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(m.id)}
                    className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    title="削除"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 p-3 space-y-3">
              <button
                onClick={copyInviteLink}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {copied ? "コピーしました！" : "招待リンクをコピー"}
              </button>

              {!showInvite ? (
                <button
                  onClick={() => setShowInvite(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  メンバーを追加
                </button>
              ) : (
                <form onSubmit={handleInvite} className="space-y-2">
                  {error && (
                    <p className="text-xs text-red-600">{error}</p>
                  )}
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="名前"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="メール（任意）"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowInvite(false)}
                      className="flex-1 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !name.trim()}
                      className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      追加
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
