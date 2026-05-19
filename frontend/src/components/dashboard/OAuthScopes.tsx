interface UserProfile {
  provider: "LOCAL" | "GOOGLE" | "GITHUB";
}

const googleScopes = [
  {
    name: "openid",
    desc: "Confirms your identity and issues a Google ID token",
  },
  { name: "email", desc: "Reads your email address from your Google account" },
  { name: "profile", desc: "Reads your display name and profile picture" },
];

const githubScopes = [
  { name: "read:user", desc: "Reads your GitHub profile info" },
  { name: "user:email", desc: "Reads your primary email address" },
];

export default function OAuthScopes({ user }: { user: UserProfile | null }) {
  const scopes =
    user?.provider === "GOOGLE"
      ? googleScopes
      : user?.provider === "GITHUB"
        ? githubScopes
        : null;

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
          OAuth Scopes
        </h2>
      </div>

      {!user || user.provider === "LOCAL" ? (
        <p className="text-xs text-gray-700">
          Not applicable — local password login.
        </p>
      ) : scopes ? (
        <div className="space-y-2">
          {scopes.map((s) => (
            <div key={s.name} className="flex gap-2 text-xs">
              <span className="text-pink-400 font-mono shrink-0">{s.name}</span>
              <span className="text-gray-500">{s.desc}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
