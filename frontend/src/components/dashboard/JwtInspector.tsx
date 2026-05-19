import { useMemo, useEffect, useState } from "react";

function b64decode(str: string) {
  try {
    return JSON.parse(atob(str.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function formatValue(key: string, val: unknown): string {
  if (key === "exp" || key === "iat") {
    return new Date((val as number) * 1000).toLocaleTimeString();
  }
  return String(val);
}

const Section = ({
  label,
  color,
  data,
}: {
  label: string;
  color: string;
  data: Record<string, unknown> | null;
}) => {
  return (
    <div>
      <p
        className={`text-[10px] font-semibold mb-1 tracking-widest uppercase ${color}`}
      >
        {label}
      </p>
      <div className="bg-white/3 rounded border border-white/5 p-2 text-[10px] text-gray-400 space-y-0.5">
        {data ? (
          Object.entries(data).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-gray-600 min-w-[40px]">{k}</span>
              <span className="text-gray-300 truncate">
                {formatValue(k, v)}
              </span>
            </div>
          ))
        ) : (
          <span className="text-gray-700">—</span>
        )}
      </div>
    </div>
  );
};

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

const Card = ({
  title,
  dot,
  children,
}: {
  title: string;
  dot: "red" | "green";
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-1.5 h-1.5 rounded-full ${dot === "green" ? "bg-emerald-400" : "bg-red-400"}`}
        />
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
};

const JwtInspector = ({ token }: { token: string | null }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = useMemo(() => {
    if (!token) return null;
    const [h, p, s] = token.split(".");
    return { raw: { h, p, s }, header: b64decode(h), payload: b64decode(p) };
  }, [token]);

  if (!token || !parts) {
    return (
      <Card title="JWT Inspector" dot="red">
        <p className="text-xs text-gray-600">No token found.</p>
      </Card>
    );
  }

  const { raw, header, payload } = parts;
  const exp = payload?.exp ? payload.exp * 1000 : null;
  const iat = payload?.iat ? payload.iat * 1000 : null;
  const total = exp && iat ? exp - iat : null;
  const remaining = exp ? exp - now : null;
  const pct =
    total && remaining
      ? Math.max(0, Math.min(100, (remaining / total) * 100))
      : 0;
  const expired = remaining !== null && remaining <= 0;

  const barColor =
    pct > 50 ? "bg-emerald-500" : pct > 20 ? "bg-yellow-500" : "bg-red-500";

  return (
    <Card title="JWT Inspector" dot={expired ? "red" : "green"}>
      {/* Raw token */}
      <div className="text-[10px] break-all leading-5 mb-4 p-3 bg-white/3 rounded border border-white/5">
        <span className="text-rose-400">{raw.h}</span>
        <span className="text-gray-500">.</span>
        <span className="text-violet-400">{raw.p}</span>
        <span className="text-gray-500">.</span>
        <span className="text-sky-400">{raw.s}</span>
      </div>

      {/* Expiry bar */}
      {exp && (
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Token lifetime</span>
            <span className={expired ? "text-red-400" : "text-gray-400"}>
              {expired
                ? "Expired"
                : remaining !== null
                  ? formatDuration(remaining)
                  : "—"}
            </span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Decoded sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Section label="Header" color="text-rose-400" data={header} />
        <Section label="Payload" color="text-violet-400" data={payload} />
      </div>

      <p className="text-[10px] text-gray-700 mt-3">
        Signature is verified server-side with HMAC-SHA256.
      </p>
    </Card>
  );
};

export default JwtInspector;
