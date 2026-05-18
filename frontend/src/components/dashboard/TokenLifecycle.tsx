import { useMemo, useEffect, useState } from "react";

function parsePayload(token: string | null) {
  if (!token) return null;
  try {
    return JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
  } catch {
    return null;
  }
}

const stages = [
  { key: "issued", label: "Issued" },
  { key: "active", label: "Active" },
  { key: "halflife", label: "Half-life" },
  { key: "expiring", label: "Expiring" },
  { key: "expired", label: "Expired" },
];

const Detail = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={highlight ? "text-amber-400" : "text-gray-300"}>
        {value}
      </span>
    </div>
  );
};

const TokenLifecycle = ({ token }: { token: string | null }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const payload = useMemo(() => parsePayload(token), [token]);

  const stageIndex = useMemo(() => {
    if (!payload?.exp || !payload?.iat) return 0;
    const total = (payload.exp - payload.iat) * 1000;
    const elapsed = now - payload.iat * 1000;
    const pct = elapsed / total;
    if (pct >= 1) return 4;
    if (pct >= 0.8) return 3;
    if (pct >= 0.5) return 2;
    if (pct > 0) return 1;
    return 0;
  }, [payload, now]);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
          Token Lifecycle
        </h2>
      </div>

      {!payload ? (
        <p className="text-xs text-gray-700">No token.</p>
      ) : (
        <>
          {/* Timeline */}
          <div className="flex items-center gap-0 mb-4">
            {stages.map((s, i) => {
              const active = i === stageIndex;
              const done = i < stageIndex;
              return (
                <div key={s.key} className="flex items-center flex-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 border transition-all
                    ${
                      active
                        ? "bg-amber-400 border-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                        : done
                          ? "bg-emerald-500 border-emerald-500"
                          : "bg-transparent border-white/10"
                    }`}
                  />
                  {i < stages.length - 1 && (
                    <div
                      className={`h-px flex-1 ${done ? "bg-emerald-500/50" : "bg-white/5"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Labels */}
          <div className="flex justify-between mb-4">
            {stages.map((s, i) => (
              <span
                key={s.key}
                className={`text-[9px] tracking-wide ${i === stageIndex ? "text-amber-400" : "text-gray-700"}`}
              >
                {s.label}
              </span>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-[11px]">
            <Detail
              label="Issued at"
              value={new Date(payload.iat * 1000).toLocaleTimeString()}
            />
            <Detail
              label="Expires at"
              value={new Date(payload.exp * 1000).toLocaleTimeString()}
            />
            <Detail label="Stage" value={stages[stageIndex].label} highlight />
          </div>
        </>
      )}
    </div>
  );
};

export default TokenLifecycle;
