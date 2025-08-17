import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ mode, setMode, resolved }) {
  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 text-sm px-2 py-2 text-slate-700 dark:text-slate-200"
        title="Theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800"
        title={`Resolved: ${resolved}`}
      >
        {resolved === "dark" ? <FiMoon /> : <FiSun />}
      </span>
    </div>
  );
}
