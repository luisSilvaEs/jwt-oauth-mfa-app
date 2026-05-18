import { useState } from "react";
import { apiFetch } from "../../api/client";

const ApiTester = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const run = async () => {
    setLoading(true);
    setResponse(null);
    const start = Date.now();
    try {
      const res = await apiFetch("/user/me");
      setStatus(res.status);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (e) {
      setResponse(String(e));
      setStatus(0);
    } finally {
      setElapsed(Date.now() - start);
      setLoading(false);
    }
  };

  const statusColor =
    status === 200
      ? "text-emerald-400"
      : status
        ? "text-red-400"
        : "text-gray-600";

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
            API Tester
          </h2>
        </div>
        {status && (
          <span className={`text-[10px] font-mono ${statusColor}`}>
            {status} · {elapsed}ms
          </span>
        )}
      </div>

      {/* Request preview */}
      <div className="bg-black/40 rounded border border-white/5 p-3 text-[10px] font-mono text-gray-500 mb-3 space-y-0.5">
        <div>
          <span className="text-cyan-400">GET</span> /api/user/me
        </div>
        <div>
          <span className="text-gray-700">Authorization:</span> Bearer
          &lt;token&gt;
        </div>
        <div>
          <span className="text-gray-700">Content-Type:</span> application/json
        </div>
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="w-full text-[11px] py-1.5 rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5 transition-colors disabled:opacity-40 tracking-wider uppercase mb-3"
      >
        {loading ? "Sending…" : "Send Request"}
      </button>

      {response && (
        <pre className="text-[10px] bg-black/40 border border-white/5 rounded p-3 text-gray-300 overflow-auto max-h-36 whitespace-pre-wrap">
          {response}
        </pre>
      )}
    </div>
  );
};

export default ApiTester;
