"use client";

import { AppState } from "@/lib/types";
import { User, ExternalLink } from "lucide-react";

interface TeamViewProps {
  state: AppState;
  onSelectWorkstream: (wsId: string) => void;
}

export default function TeamView({ state, onSelectWorkstream }: TeamViewProps) {
  const getAssignments = (name: string) => {
    return state.cards.filter(
      (c) =>
        c.assignees.some((a) => a.toLowerCase().includes(name.toLowerCase())) &&
        c.column !== "complete"
    );
  };

  // Group by affiliation
  const byAffiliation: Record<string, typeof state.team> = {};
  state.team.forEach((member) => {
    const key = member.affiliation;
    if (!byAffiliation[key]) byAffiliation[key] = [];
    byAffiliation[key].push(member);
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <User size={20} className="text-accent" />
        <h2 className="text-xl font-bold text-foreground">Team</h2>
        <span className="text-xs text-muted ml-2">
          {state.team.length} members
        </span>
      </div>

      <div className="space-y-8">
        {Object.entries(byAffiliation).map(([affiliation, members]) => (
          <div key={affiliation}>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
              {affiliation}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.map((member) => {
                const assignments = getAssignments(member.name.split(" ")[0]);
                return (
                  <div
                    key={member.id}
                    className="bg-surface border border-border rounded-xl p-4 hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-accent text-sm font-semibold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {member.name}
                        </div>
                        <div className="text-xs text-muted">{member.role}</div>
                      </div>
                    </div>

                    {assignments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-1.5">
                          Active work
                        </div>
                        {assignments.map((card) => {
                          const ws = state.workstreams.find(
                            (w) => w.id === card.workstreamId
                          );
                          return (
                            <button
                              key={card.id}
                              onClick={() =>
                                ws && onSelectWorkstream(ws.id)
                              }
                              className="flex items-center gap-1.5 text-xs text-foreground hover:text-accent w-full text-left py-0.5 transition-colors"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor: ws?.color || "#888",
                                }}
                              />
                              <span className="truncate">{card.title}</span>
                              <ExternalLink
                                size={10}
                                className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
