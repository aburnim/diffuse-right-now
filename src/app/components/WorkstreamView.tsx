"use client";

import { AppState, Card } from "@/lib/types";
import CardItem from "./CardItem";
import { ChevronRight } from "lucide-react";

interface WorkstreamViewProps {
  state: AppState;
  workstreamId: string;
  onSelectWorkstream: (id: string) => void;
  editMode: boolean;
  onMoveCard: (cardId: string, newColumn: Card["column"]) => void;
  onUpdateCard: (
    cardId: string,
    updates: Partial<Pick<Card, "title" | "description" | "assignees" | "checkInDate">>
  ) => void;
  onAddCard: (
    workstreamId: string,
    title: string,
    column: Card["column"]
  ) => void;
  onDeleteCard: (cardId: string) => void;
}

export default function WorkstreamView({
  state,
  workstreamId,
  onSelectWorkstream,
  editMode,
  onUpdateCard,
  onDeleteCard,
}: WorkstreamViewProps) {
  const ws = state.workstreams.find((w) => w.id === workstreamId);
  if (!ws) return null;

  const cards = state.cards.filter((c) => c.workstreamId === workstreamId);
  const inProgress = cards.filter((c) => c.column === "in-progress");
  const nextUp = cards.filter((c) => c.column === "next-up");
  const complete = cards.filter((c) => c.column === "complete");
  const recentActivity = state.activity.filter(
    (a) => a.workstreamId === workstreamId
  );

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-border p-3 overflow-y-auto flex-shrink-0">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Workstreams
        </h3>
        {state.workstreams.map((w) => (
          <button
            key={w.id}
            onClick={() => onSelectWorkstream(w.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors mb-1 ${
              w.id === workstreamId
                ? "bg-surface text-foreground"
                : "text-muted hover:text-foreground hover:bg-surface"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: w.color }}
            />
            <span className="truncate">{w.name}</span>
            {w.id === workstreamId && (
              <ChevronRight size={14} className="ml-auto flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: ws.color }}
            />
            <h2 className="text-2xl font-bold text-foreground">{ws.name}</h2>
          </div>

          {/* Vision / Status / Next panels (matching slide format) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Vision
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {ws.vision}
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Current Status
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {ws.statusText}
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Next
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {ws.nextText}
              </p>
            </div>
          </div>

          {/* Cards by status */}
          <div className="space-y-6">
            {inProgress.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 rounded-lg px-3 py-2 mb-3">
                  IN PROGRESS ({inProgress.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {inProgress.map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      workstream={ws}
                      editMode={editMode}
                      onUpdate={onUpdateCard}
                      onDelete={onDeleteCard}
                    />
                  ))}
                </div>
              </div>
            )}

            {nextUp.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 rounded-lg px-3 py-2 mb-3">
                  NEXT UP ({nextUp.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {nextUp.map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      workstream={ws}
                      editMode={editMode}
                      onUpdate={onUpdateCard}
                      onDelete={onDeleteCard}
                    />
                  ))}
                </div>
              </div>
            )}

            {complete.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 rounded-lg px-3 py-2 mb-3">
                  COMPLETE ({complete.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {complete.map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      workstream={ws}
                      editMode={editMode}
                      onUpdate={onUpdateCard}
                      onDelete={onDeleteCard}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent activity for this workstream */}
          {recentActivity.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Recent Activity
              </h3>
              <div className="space-y-2">
                {recentActivity.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 text-sm">
                    <span className="text-xs text-muted whitespace-nowrap mt-0.5">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-foreground">
                      {entry.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
