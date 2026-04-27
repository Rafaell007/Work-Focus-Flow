"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            key="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 32,
            }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border-subtle bg-bg-elevated shadow-[0_30px_120px_rgba(0,0,0,0.7)]"
          >
            {/* Soft glow band at top */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--glow-color)]/60 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(50%_100%_at_50%_0%,var(--glow-color-soft),transparent_70%)] opacity-60"
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-text-muted transition-colors hover:bg-bg-elevated-hi hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex flex-col gap-7 px-7 py-9">
              <header className="flex flex-col items-center gap-2 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--glow-color)]/40 bg-[color:var(--glow-color)]/8 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--glow-color)]">
                  Coming soon
                </span>
                <h2
                  id="auth-title"
                  className="font-display text-3xl font-normal tracking-tight text-text-primary"
                >
                  Welcome back.
                </h2>
                <p className="max-w-xs text-sm text-text-muted">
                  Save your sessions across devices. Authentication is on the
                  roadmap — sneak peek of the flow below.
                </p>
              </header>

              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => e.preventDefault()}
                aria-disabled="true"
              >
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-text-faint">
                    Email
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    disabled
                    className="rounded-2xl border border-border-subtle bg-bg-void px-4 py-2.5 text-sm text-text-primary placeholder:text-text-faint disabled:cursor-not-allowed"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-text-faint">
                    Password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    disabled
                    className="rounded-2xl border border-border-subtle bg-bg-void px-4 py-2.5 text-sm text-text-primary placeholder:text-text-faint disabled:cursor-not-allowed"
                  />
                </label>

                <button
                  type="submit"
                  disabled
                  className={cn(
                    "mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--glow-color)]/45 bg-[color:var(--glow-color)]/14 px-5 py-2.5 text-sm font-medium text-text-primary",
                    "shadow-[0_0_22px_var(--glow-color-soft)]",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  Sign in
                </button>
              </form>

              <div className="relative flex items-center gap-3">
                <span className="h-px flex-1 bg-border-subtle" />
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-text-faint">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-border-subtle" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ProviderButton icon={<GoogleGlyph />} label="Google" />
                <ProviderButton icon={<GithubGlyph />} label="GitHub" />
              </div>

              <p className="text-center text-xs text-text-faint">
                <Mail className="mr-1 inline h-3 w-3" />
                Magic links are planned too.
              </p>

              <p className="text-center text-xs text-text-muted">
                No account?{" "}
                <span className="cursor-not-allowed text-text-primary opacity-60 underline decoration-text-faint underline-offset-4">
                  Create one
                </span>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ProviderButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled
      aria-label={`Continue with ${label} (coming soon)`}
      className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-border-subtle bg-bg-void px-4 py-2.5 text-sm text-text-muted opacity-70"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function GithubGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.49 11.49 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M21.6 12.227c0-.708-.064-1.388-.182-2.045H12v3.867h5.385a4.605 4.605 0 0 1-1.998 3.022v2.51h3.232c1.892-1.744 2.981-4.31 2.981-7.354Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.619-2.42l-3.232-2.51c-.896.6-2.04.955-3.387.955-2.605 0-4.81-1.76-5.597-4.123H3.064v2.59A9.997 9.997 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.403 13.902a6.01 6.01 0 0 1 0-3.804V7.508H3.064a10 10 0 0 0 0 8.984l3.339-2.59Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.973c1.469 0 2.788.505 3.825 1.498L18.71 4.59C16.96 2.962 14.696 2 12 2A9.997 9.997 0 0 0 3.064 7.508l3.339 2.59C7.19 7.733 9.395 5.973 12 5.973Z"
        fill="#EA4335"
      />
    </svg>
  );
}
