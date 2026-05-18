import { useEffect, useState } from "react";

interface AuthEvent {
  id: number;
  time: string;
  method: string;
  mfa: boolean;
  ip: string;
  result: "success" | "fail";
}

// Mock log — replace with a real backend call if you add GET /api/auth/events
function getMockEvents(): AuthEvent[] {
  const base = Date.now();
  return [
    {
      id: 1,
      time: new Date(base - 120000).toLocaleTimeString(),
      method: "Password + MFA",
      mfa: true,
      ip: "192.168.1.10",
      result: "success",
    },
    {
      id: 2,
      time: new Date(base - 3600000).toLocaleTimeString(),
      method: "Google OAuth",
      mfa: false,
      ip: "192.168.1.10",
      result: "success",
    },
    {
      id: 3,
      time: new Date(base - 86400000).toLocaleTimeString(),
      method: "Password + MFA",
      mfa: true,
      ip: "10.0.0.5",
      result: "fail",
    },
  ];
}

const AuthEventLog = () => {
  const [events, setEvents] = useState<AuthEvent[]>([]);

  useEffect(() => {
    setEvents(getMockEvents());
  }, []);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
          Auth Event Log
        </h2>
        <span className="ml-auto text-[9px] text-gray-700 italic">
          Mock data — wire to /api/auth/events when ready
        </span>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-gray-700 text-left border-b border-white/5">
              <th className="pb-2 pr-4 font-normal">Time</th>
              <th className="pb-2 pr-4 font-normal">Method</th>
              <th className="pb-2 pr-4 font-normal">MFA</th>
              <th className="pb-2 pr-4 font-normal">IP</th>
              <th className="pb-2 font-normal">Result</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-1.5 pr-4 text-gray-500 font-mono">
                  {e.time}
                </td>
                <td className="py-1.5 pr-4 text-gray-300">{e.method}</td>
                <td className="py-1.5 pr-4">
                  <span
                    className={e.mfa ? "text-emerald-400" : "text-gray-600"}
                  >
                    {e.mfa ? "✓" : "—"}
                  </span>
                </td>
                <td className="py-1.5 pr-4 text-gray-500 font-mono">{e.ip}</td>
                <td className="py-1.5">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] tracking-wider uppercase
                    ${e.result === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                  >
                    {e.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthEventLog;
