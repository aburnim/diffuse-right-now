"use client";

import { useState } from "react";
import { Card, Workstream } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  X,
  Check,
  Pencil,
  Trash2,
  CalendarClock,
  Clock,
} from "lucide-react";

interface CardItemProps {
  card: Card;
  workstream: Workstream;
  editMode: boolean;
  onUpdate: (
    cardId: string,
    updates: Partial<Pick<Card, "title" | "description" | "assignees" | "checkInDate">>
  ) => void;
  onDelete: (cardId: string) => void;
  isDragOverlay?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysAgo(dateStr: string): string {
  const days = Math.floor(
    (Date.now() - new Date(dateStr + "T00:00:00").getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function daysUntil(dateStr: string): string {
  const days = Math.floor(
    (new Date(dateStr + "T00:00:00").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "today";
  if (days === 1) return "in 1 day";
  return `in ${days} days`;
}

function getStaleness(updatedAt: string): {
  level: number;
  color: string;
} {
  const days = Math.floor(
    (Date.now() - new Date(updatedAt + "T00:00:00").getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 7) return { level: 0, color: "" };
  if (days <= 14) return { level: 1, color: "#f59e0b" };
  if (days <= 30) return { level: 2, color: "#f97316" };
  return { level: 3, color: "#ef4444" };
}

function getCheckInUrgency(checkInDate: string): {
  overdue: boolean;
  daysNum: number;
} {
  const days = Math.floor(
    (new Date(checkInDate + "T00:00:00").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return { overdue: days < 0, daysNum: days };
}

export default function CardItem({
  card,
  workstream,
  editMode,
  onUpdate,
  onDelete,
  isDragOverlay,
}: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDesc, setEditDesc] = useState(card.description);
  const [editCheckIn, setEditCheckIn] = useState(card.checkInDate || "");
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { card },
    disabled: !editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const staleness = card.column !== "complete" ? getStaleness(card.updatedAt) : { level: 0, label: "", color: "" };
  const checkIn = card.checkInDate ? getCheckInUrgency(card.checkInDate) : null;

  const borderColor =
    staleness.level >= 3
      ? "#ef4444"
      : staleness.level >= 2
        ? "#f97316"
        : staleness.level >= 1
          ? "#f59e0b"
          : undefined;

  const handleSave = () => {
    onUpdate(card.id, {
      title: editTitle,
      description: editDesc,
      checkInDate: editCheckIn || undefined,
    } as Partial<Pick<Card, "title" | "description" | "assignees" | "checkInDate">>);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(card.title);
    setEditDesc(card.description);
    setEditCheckIn(card.checkInDate || "");
    setIsEditing(false);
  };

  if (isEditing && editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-surface border-2 border-accent/40 rounded-lg p-3 space-y-2 shadow-sm"
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-accent"
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-accent resize-none"
          rows={3}
        />
        <div className="flex items-center gap-2">
          <CalendarClock size={12} className="text-muted" />
          <input
            type="date"
            value={editCheckIn}
            onChange={(e) => setEditCheckIn(e.target.value)}
            className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-accent"
          />
          <span className="text-[10px] text-muted">Check-in date</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-accent/20 text-accent hover:bg-accent/30"
          >
            <Check size={12} /> Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted hover:text-foreground"
          >
            <X size={12} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderColor: borderColor || undefined,
      }}
      className={`bg-surface border-2 rounded-lg p-3 transition-colors group shadow-sm ${
        borderColor ? "" : "border-border"
      } ${isDragOverlay ? "drag-overlay" : "hover:shadow-md"}`}
    >
      <div className="flex items-start gap-2">
        {editMode && (
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 text-muted hover:text-foreground cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={14} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: workstream.color }}
            />
            <span className="text-[10px] text-muted uppercase tracking-wider truncate font-medium">
              {workstream.name}
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-semibold text-foreground text-left w-full hover:text-accent transition-colors"
          >
            {card.title}
          </button>
          {expanded && card.description && (
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              {card.description}
            </p>
          )}
          {card.assignees.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap mt-2">
              {card.assignees.map((name) => (
                <span
                  key={name}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent font-medium"
                >
                  {name.split(" ")[0]}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-border/50 space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px]">
              <Clock size={9} className="text-muted flex-shrink-0" />
              <span className="text-muted">Last updated:</span>
              <span
                className="font-medium"
                style={{ color: staleness.level > 0 ? staleness.color : undefined }}
              >
                {formatDate(card.updatedAt)} | {daysAgo(card.updatedAt)}
              </span>
            </div>
            {card.checkInDate && (
              <div className="flex items-center gap-1.5 text-[10px]">
                <CalendarClock size={9} className="text-muted flex-shrink-0" />
                <span className="text-muted">Next check-in:</span>
                <span
                  className={`font-medium ${
                    checkIn?.overdue
                      ? "text-red-500"
                      : checkIn && checkIn.daysNum <= 7
                        ? "text-amber-500"
                        : ""
                  }`}
                >
                  {formatDate(card.checkInDate)} | {daysUntil(card.checkInDate)}
                </span>
              </div>
            )}
          </div>
        </div>
        {editMode && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-muted hover:text-accent rounded"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="p-1 text-muted hover:text-red-500 rounded"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
