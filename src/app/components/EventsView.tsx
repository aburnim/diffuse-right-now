"use client";

import { AppState } from "@/lib/types";
import { Calendar, Flag, Clock, Target } from "lucide-react";

interface EventsViewProps {
  state: AppState;
}

const TYPE_CONFIG = {
  meeting: { icon: Clock, color: "#3B82F6", label: "Meeting" },
  milestone: { icon: Flag, color: "#10B981", label: "Milestone" },
  deadline: { icon: Target, color: "#EF4444", label: "Deadline" },
};

export default function EventsView({ state }: EventsViewProps) {
  const today = new Date().toISOString().split("T")[0];

  const sorted = [...state.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcoming = sorted.filter((e) => e.date >= today);
  const past = sorted.filter((e) => e.date < today);

  const renderEvent = (event: (typeof state.events)[0]) => {
    const config = TYPE_CONFIG[event.type];
    const Icon = config.icon;
    const ws = event.workstreamId
      ? state.workstreams.find((w) => w.id === event.workstreamId)
      : null;
    const isPast = event.date < today;

    return (
      <div
        key={event.id}
        className={`flex items-start gap-4 p-4 bg-surface border border-border rounded-xl transition-colors ${
          isPast ? "opacity-50" : "hover:border-accent/30"
        }`}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.color + "20" }}
        >
          <Icon size={18} style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {event.title}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: config.color + "20",
                color: config.color,
              }}
            >
              {config.label}
            </span>
          </div>
          <p className="text-xs text-muted">{event.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
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
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar size={20} className="text-accent" />
        <h2 className="text-xl font-bold text-foreground">
          Events & Milestones
        </h2>
      </div>

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Upcoming
          </h3>
          <div className="space-y-3">{upcoming.map(renderEvent)}</div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Past
          </h3>
          <div className="space-y-3">{past.map(renderEvent)}</div>
        </div>
      )}

      {state.events.length === 0 && (
        <div className="text-center text-muted py-12">
          No events scheduled yet.
        </div>
      )}
    </div>
  );
}
