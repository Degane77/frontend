import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiRefreshCw, FiSearch, FiDownload, FiSun, FiMoon } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE = "http://localhost:5000"; // change if needed

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
);

const EmptyState = ({ title, subtitle }) => (
  <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500" />
    <h4 className="text-slate-700 dark:text-slate-100 font-semibold">{title}</h4>
    <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>
  </div>
);

function toCSV(rows) {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(","), ...rows.map(r => headers.map(h => escape(r[h])).join(","))];
  return lines.join("\n");
}

const ChatAdmin = () => {
  const [topQuestions, setTopQuestions] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [res1, res2] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/top-questions`),
        axios.get(`${API_BASE}/api/admin/all-chats`),
      ]);
      setTopQuestions(Array.isArray(res1.data) ? res1.data : []);
      setAllChats(Array.isArray(res2.data) ? res2.data : []);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredChats = useMemo(() => {
    if (!query.trim()) return allChats;
    const q = query.toLowerCase();
    return allChats.filter(c =>
      (c.userId?.email || "").toLowerCase().includes(q) ||
      (c.userMessage || "").toLowerCase().includes(q) ||
      (c.botReply || "").toLowerCase().includes(q)
    );
  }, [allChats, query]);

  const totals = useMemo(() => ({
    conversations: allChats.length,
    uniqueUsers: new Set(allChats.map(c => c.userId?.email || c.userId || "unknown")).size,
    questionsTracked: topQuestions.reduce((acc, t) => acc + (t?.count || 0), 0),
  }), [allChats, topQuestions]);

  const exportChats = () => {
    const rows = allChats.map(c => ({
      date: c.createdAt || "",
      user: c.userId?.email || c.userId || "unknown",
      question: c.userMessage || "",
      reply: c.botReply || "",
      aiType: c.aiType || "",
    }));
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cafiye_chats_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-slate-950 dark:to-slate-900 py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Admin Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Insights for Cafiye AI conversations</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}<span className="hidden sm:inline">Theme</span>
            </button>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow"
              title="Refresh"
            >
              <FiRefreshCw /><span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {loading ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : (
            <>
              <div className="rounded-xl p-4 bg-white/80 dark:bg-slate-900/70 border border-emerald-100 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Conversations</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{totals.conversations}</p>
              </div>
              <div className="rounded-xl p-4 bg-white/80 dark:bg-slate-900/70 border border-emerald-100 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Unique Users</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{totals.uniqueUsers}</p>
              </div>
              <div className="rounded-xl p-4 bg-white/80 dark:bg-slate-900/70 border border-emerald-100 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Questions Tracked</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{totals.questionsTracked}</p>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Top Questions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl p-5 bg-white/80 dark:bg-slate-900/70 border border-emerald-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">🔝 Top Asked Questions</h3>
            {loading ? (
              <>
                <Skeleton className="h-6 mb-2" />
                <Skeleton className="h-6 mb-2" />
                <Skeleton className="h-6 mb-2" />
                <Skeleton className="h-6" />
              </>
            ) : topQuestions?.length ? (
              <ul className="space-y-2">
                {topQuestions.map((q, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-xs w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2">{q._id}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{q.count} times</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No questions yet" subtitle="When users start chatting, popular questions will appear here." />
            )}
          </div>

          <div className="rounded-2xl p-5 bg-white/80 dark:bg-slate-900/70 border border-emerald-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">📊 Frequency Chart</h3>
            {loading ? (
              <Skeleton className="h-72" />
            ) : topQuestions?.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topQuestions.map(t => ({ question: (t._id || "").slice(0, 24) + (String(t._id||"").length>24?"…":""), count: t.count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="question" interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="Nothing to chart" subtitle="Top questions will be charted here." />
            )}
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by email, question or reply…"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={exportChats}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900"
          >
            <FiDownload /> Export CSV
          </button>
        </div>

        {/* Conversations */}
        <div className="rounded-2xl overflow-hidden border border-emerald-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-sm">
          <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-emerald-100 dark:border-slate-800">
            <div className="col-span-3">User</div>
            <div className="col-span-4">Question</div>
            <div className="col-span-4">Reply</div>
            <div className="col-span-1 text-right">AI</div>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : filteredChats?.length ? (
            <ul className="divide-y divide-emerald-100 dark:divide-slate-800">
              {filteredChats.map((chat, i) => (
                <li key={i} className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-emerald-50/40 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-3 text-sm text-slate-700 dark:text-slate-200 truncate">{chat.userId?.email || "Unknown"}</div>
                  <div className="col-span-4 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{chat.userMessage}</div>
                  <div className="col-span-4 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{chat.botReply}</div>
                  <div className="col-span-1 text-right text-xs text-slate-500 dark:text-slate-400">{chat.aiType || "-"}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6"><EmptyState title="No conversations found" subtitle={query ? "Try clearing the search." : "Start a chat to see data here."} /></div>
          )}
        </div>

        <p className="text-[11px] text-center mt-6 text-slate-500 dark:text-slate-400">
          Tip: Use the search box to quickly filter conversations. Data loads from <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{API_BASE}</code>.
        </p>
      </div>
    </div>
  );
};

export default ChatAdmin;
