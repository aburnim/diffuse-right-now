"use client";

import { View } from "../page";
import { Workstream } from "@/lib/types";
import {
  LayoutGrid,
  Layers,
  Activity,
  Users,
  Calendar,
  Pencil,
  PencilOff,
  RotateCcw,
} from "lucide-react";

interface HeaderProps {
  view: View;
  onViewChange: (view: View) => void;
  editMode: boolean;
  onToggleEdit: () => void;
  onReset: () => void;
  workstreams: Workstream[];
  filterWorkstream: string | null;
  onFilterWorkstream: (id: string | null) => void;
}

const NAV_ITEMS: { view: View; label: string; icon: typeof LayoutGrid }[] = [
  { view: "board", label: "Board", icon: LayoutGrid },
  { view: "workstream", label: "Workstreams", icon: Layers },
  { view: "activity", label: "Activity", icon: Activity },
  { view: "team", label: "Team", icon: Users },
  { view: "events", label: "Events", icon: Calendar },
];

export default function Header({
  view,
  onViewChange,
  editMode,
  onToggleEdit,
  onReset,
  workstreams,
  filterWorkstream,
  onFilterWorkstream,
}: HeaderProps) {
  return (
    <header className="border-b-2 border-border bg-surface sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-accent tracking-tight">
            DiffUSE Right Now
          </h1>
          <span className="text-xs text-muted hidden sm:inline">
            Astera Institute
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ view: v, label, icon: Icon }) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                view === v
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Icon size={15} />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleEdit}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              editMode
                ? "bg-amber-500/20 text-amber-400"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
            title={editMode ? "Exit edit mode" : "Enter edit mode"}
          >
            {editMode ? <PencilOff size={15} /> : <Pencil size={15} />}
            <span className="hidden sm:inline">
              {editMode ? "Editing" : "Edit"}
            </span>
          </button>
          {editMode && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              title="Reset to defaults"
            >
              <RotateCcw size={15} />
            </button>
          )}
        </div>
      </div>

      {view === "board" && (
        <div className="flex items-center gap-2 px-4 pb-2 overflow-x-auto">
          <button
            onClick={() => onFilterWorkstream(null)}
            className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
              filterWorkstream === null
                ? "bg-accent/20 text-accent"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            All
          </button>
          {workstreams.map((ws) => (
            <button
              key={ws.id}
              onClick={() =>
                onFilterWorkstream(filterWorkstream === ws.id ? null : ws.id)
              }
              className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                filterWorkstream === ws.id
                  ? "text-white"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
              style={
                filterWorkstream === ws.id
                  ? { backgroundColor: ws.color + "33", color: ws.color }
                  : {}
              }
            >
              {ws.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
