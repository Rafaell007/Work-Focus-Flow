"use client";

import { useEffect, useMemo, useState } from "react";
import { useSessionsStore } from "@/lib/store/sessions";
import { cn } from "@/lib/utils";

const DAYS = 7;

const fmtKey = (d: Date) => {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const fmtLabel = (d: Date) =>
  d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// Returns intensity tier 0–4 based on minutes
const tierFor = (minutes: number): 0 | 1 | 2 | 3 | 4 => {
  if (minutes <= 0) return 0;
  if (minutes < 15) return 1;
  if (minutes < 45) return 2;
  if (minutes < 90) return 3;
  return 4;
};

const tierOpacity: Record<0 | 1 | 2 | 3 | 4, number> = {
  0: 0,
  1: 0.25,
  2: 0.5,
  3: 0.75,
  4: 1,
};

type Cell = {
  key: string;
  label: string;
  minutes: number;
  tier: 0 | 1 | 2 | 3 | 4;
};

export function ContributionGraph() {
  // Avoid SSR hydration mismatch — render only after mount, since the data
  // comes from localStorage which is client-only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const minutesByDay = useSessionsStore((s) => s.minutesByDay);

  const { weeks, monthLabels, year, currentStreak, longestStreak, totalMinutes } =
    useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yr = today.getFullYear();
      const yearStart = new Date(yr, 0, 1); // Jan 1
      const yearEnd = new Date(yr, 11, 31); // Dec 31

      // Align grid start to the Sunday of the week containing Jan 1
      const start = new Date(yearStart);
      start.setDate(start.getDate() - start.getDay());

      // Total weeks needed to cover Jan 1 → Dec 31
      const spanDays =
        Math.floor((yearEnd.getTime() - start.getTime()) / 86_400_000) + 1;
      const totalWeeks = Math.ceil(spanDays / DAYS);

      const weeksOut: Cell[][] = [];
      const monthsOut: { col: number; label: string }[] = [];
      let lastMonth = -1;

      const cursor = new Date(start);
      for (let w = 0; w < totalWeeks; w++) {
        const week: Cell[] = [];
        for (let d = 0; d < DAYS; d++) {
          const inYear =
            cursor.getFullYear() === yr && cursor <= yearEnd;
          if (!inYear || cursor > today) {
            week.push({
              key: cursor < yearStart ? "preyear" : "future",
              label: "",
              minutes: 0,
              tier: 0,
            });
          } else {
            const k = fmtKey(cursor);
            const minutes = minutesByDay[k] ?? 0;
            week.push({
              key: k,
              label: fmtLabel(cursor),
              minutes,
              tier: tierFor(minutes),
            });
          }
          // Month header label — first row of each week, anchored to first
          // week the month appears in (skip pre-year padding)
          if (d === 0 && cursor >= yearStart && cursor <= yearEnd) {
            const m = cursor.getMonth();
            if (m !== lastMonth) {
              monthsOut.push({
                col: w,
                label: cursor.toLocaleDateString(undefined, {
                  month: "short",
                }),
              });
              lastMonth = m;
            }
          }
          cursor.setDate(cursor.getDate() + 1);
        }
        weeksOut.push(week);
      }

      // Current streak — walk backward from today across all data (any year)
      let streak = 0;
      const cur = new Date(today);
      while (true) {
        const k = fmtKey(cur);
        if ((minutesByDay[k] ?? 0) > 0) {
          streak++;
          cur.setDate(cur.getDate() - 1);
        } else {
          break;
        }
      }

      // Longest streak — across all logged days, not just this year
      const sortedKeys = Object.keys(minutesByDay)
        .filter((k) => (minutesByDay[k] ?? 0) > 0)
        .sort();
      let longest = 0;
      let run = 0;
      let prevDate: Date | null = null;
      for (const k of sortedKeys) {
        const d = new Date(k);
        if (prevDate) {
          const diff = Math.round(
            (d.getTime() - prevDate.getTime()) / 86_400_000,
          );
          run = diff === 1 ? run + 1 : 1;
        } else {
          run = 1;
        }
        if (run > longest) longest = run;
        prevDate = d;
      }

      const total = Object.values(minutesByDay).reduce((a, b) => a + b, 0);

      return {
        weeks: weeksOut,
        monthLabels: monthsOut,
        year: yr,
        currentStreak: streak,
        longestStreak: longest,
        totalMinutes: total,
      };
    }, [minutesByDay]);

  if (!mounted) {
    // Reserve layout to avoid CLS while waiting for client hydration
    return <div className="h-[260px] w-full" aria-hidden="true" />;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const totalRemMin = totalMinutes % 60;
  const hasData = totalMinutes > 0;

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-1">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-text-muted">
          Your progress · {year}
        </span>
        <h2 className="font-display text-3xl font-normal tracking-tight text-text-primary md:text-4xl">
          {hasData ? "Keep the rhythm." : "Your sessions show up here."}
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Current streak"
          value={currentStreak}
          unit={currentStreak === 1 ? "day" : "days"}
        />
        <StatCard
          label="Longest streak"
          value={longestStreak}
          unit={longestStreak === 1 ? "day" : "days"}
        />
        <StatCard
          label="Total focus"
          value={totalHours}
          unit={`h ${totalRemMin}m`}
          valueAsHours
        />
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-2 [--cell:11px] md:[--cell:12px]">
          {/* Month label row */}
          <div className="relative ml-7 h-3.5">
            {monthLabels.map((m) => (
              <span
                key={`${m.col}-${m.label}`}
                className="absolute font-mono text-[0.6rem] uppercase tracking-[0.2em] text-text-faint"
                style={{
                  left: `calc(${m.col} * (var(--cell) + 3px))`,
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5">
            {/* Day-of-week labels (every other) */}
            <div className="flex flex-col justify-between pr-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-text-faint">
              <span className="h-[var(--cell)] leading-[var(--cell)]">Mon</span>
              <span className="h-[var(--cell)] leading-[var(--cell)]">Wed</span>
              <span className="h-[var(--cell)] leading-[var(--cell)]">Fri</span>
            </div>

            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((cell, di) => (
                    <div
                      key={`${wi}-${di}`}
                      title={
                        cell.key === "future" || cell.key === "preyear"
                          ? ""
                          : cell.minutes > 0
                            ? `${cell.label} — ${cell.minutes} min`
                            : `${cell.label} — no session`
                      }
                      aria-label={
                        cell.key === "future" || cell.key === "preyear"
                          ? undefined
                          : `${cell.label}: ${cell.minutes} minutes`
                      }
                      className={cn(
                        "h-[var(--cell)] w-[var(--cell)] rounded-[3px] transition-colors",
                        cell.key === "future" || cell.key === "preyear"
                          ? "bg-transparent"
                          : cell.tier === 0
                            ? "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.04)]"
                            : "border border-[color:var(--glow-color)]/30",
                      )}
                      style={
                        cell.tier === 0 || cell.key === "future" || cell.key === "preyear"
                          ? undefined
                          : {
                              backgroundColor: "var(--glow-color)",
                              opacity: tierOpacity[cell.tier],
                              boxShadow:
                                cell.tier >= 3
                                  ? "0 0 6px var(--glow-color-soft)"
                                  : undefined,
                            }
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="ml-7 mt-2 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-text-faint">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((t) => (
              <span
                key={t}
                className={cn(
                  "h-[var(--cell)] w-[var(--cell)] rounded-[3px]",
                  t === 0 && "bg-[rgba(255,255,255,0.04)]",
                )}
                style={
                  t === 0
                    ? undefined
                    : {
                        backgroundColor: "var(--glow-color)",
                        opacity: tierOpacity[t as 1 | 2 | 3 | 4],
                      }
                }
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  unit,
  valueAsHours = false,
}: {
  label: string;
  value: number;
  unit: string;
  valueAsHours?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border-subtle bg-bg-elevated p-4">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-faint">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-normal leading-none tracking-tight text-text-primary md:text-4xl">
          {value}
        </span>
        <span className="text-sm text-text-muted">
          {valueAsHours ? unit : unit}
        </span>
      </div>
    </div>
  );
}
