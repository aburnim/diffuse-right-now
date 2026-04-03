"use client";

import { useState, useMemo } from "react";
import { AppState } from "@/lib/types";
import { Clock, Filter, Download } from "lucide-react";

interface ActivityFeedProps {
  state: AppState;
}

export default function ActivityFeed({ state }: ActivityFeedProps) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [wsFilter, setWsFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let entries = state.activity;

    if (wsFilter) {
      entries = entries.filter((e) => e.workstreamId === wsFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      entries = entries.filter((e) => new Date(e.timestamp) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setDate(to.getDate() + 1);
      entries = entries.filter((e) => new Date(e.timestamp) < to);
    }

    return entries;
  }, [state.activity, wsFilter, dateFrom, dateTo]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach((entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return groups;
  }, [filtered]);

  const handleExport = () => {
    const lines = filtered.map((e) => {
      const date = new Date(e.timestamp).toLocaleDateString();
      const ws = e.workstreamId
        ? state.workstreams.find((w) => w.id === e.workstreamId)?.name
        : "";
      return `${date}  ${ws ? `[${ws}] ` : ""}${e.description}`;
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diffuse-activity-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const presets = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 4 months", days: 120 },
    { label: "All time", days: 0 },
  ];

  const applyPreset = (days: number) => {
    if (days === 0) {
      setDateFrom("");
      setDateTo("");
    } else {
      const from = new Date();
      from.setDate(from.getDate() - days);
      setDateFrom(from.toISOString().split("T")[0]);
      setDateTo("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-accent" />
          <h2 className="text-xl font-bold text-foreground">Activity Feed</h2>
          <span className="text-xs text-muted ml-2">
            {filtered.length} entries
          </span>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-surface transition-colors"
        >
          <Download size={14} /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-xl p-4 mb-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className="text-muted" />
          <span className="text-xs text-muted uppercase tracking-wider font-semibold">
            Filters
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.days)}
              className="px-2.5 py-1 rounded-full text-xs text-muted hover:text-accent hover:bg-accent/10 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-accent"
            />
          </div>
          <select
            value={wsFilter || ""}
            onChange={(e) => setWsFilter(e.target.value || null)}
            className="bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-accent"
          >
            <option value="">All workstreams</option>
            {state.workstreams.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date}>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 sticky top-0 bg-background py-1">
              {date}
            </h3>
            <div className="space-y-2 ml-4 border-l border-border pl-4">
              {entries.map((entry) => {
                const ws = entry.workstreamId
                  ? state.workstreams.find(
                      (w) => w.id === entry.workstreamId
                    )
                  : null;
                return (
                  <div key={entry.id} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 -ml-[21px] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {entry.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted">
                          {new Date(entry.timestamp).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        {ws && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: ws.color + "20",
                              color: ws.color,
                            }}
                          >
                            {ws.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-muted py-12">
            No activity found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
