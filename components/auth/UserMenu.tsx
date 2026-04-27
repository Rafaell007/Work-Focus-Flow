"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "compact" | "full";
};

export function UserMenu({ variant = "full" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Sign in"
        aria-haspopup="dialog"
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated text-text-muted transition-colors hover:border-[color:var(--glow-color)]/45 hover:text-text-primary",
          variant === "compact" ? "h-9 w-9 justify-center" : "px-3.5 py-2",
        )}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border-strong bg-bg-void text-text-muted transition-colors group-hover:border-[color:var(--glow-color)]/55 group-hover:text-[color:var(--glow-color)]">
          <UserRound className="h-3 w-3" />
        </span>
        {variant === "full" && <span className="text-sm">Sign in</span>}
      </button>

      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
