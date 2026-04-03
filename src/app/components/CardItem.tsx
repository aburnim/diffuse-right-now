"use client";

import { useState } from "react";
import { Card, Workstream } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Check, Pencil, Trash2 } from "lucide-react";

interface CardItemProps {
  card: Card;
  workstream: Workstream;
  editMode: boolean;
  onUpdate: (
    cardId: string,
    updates: Partial<Pick<Card, "title" | "description" | "assignees">>
  ) => void;
  onDelete: (cardId: string) => void;
  isDragOverlay?: boolean;
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

  const handleSave = () => {
    onUpdate(card.id, { title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(card.title);
    setEditDesc(card.description);
    setIsEditing(false);
  };

  if (isEditing && editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-surface border border-accent/30 rounded-lg p-3 space-y-2"
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
      style={style}
      className={`bg-surface border border-border rounded-lg p-3 transition-colors hover:border-border group ${isDragOverlay ? "drag-overlay" : ""}`}
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
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: workstream.color }}
            />
            <span className="text-[10px] text-muted uppercase tracking-wider truncate">
              {workstream.name}
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-foreground text-left w-full hover:text-accent transition-colors"
          >
            {card.title}
          </button>
          {expanded && card.description && (
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              {card.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {card.assignees.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {card.assignees.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent"
                  >
                    {name.split(" ")[0]}
                  </span>
                ))}
              </div>
            )}
            <span className="text-[10px] text-muted ml-auto flex-shrink-0">
              {card.updatedAt}
            </span>
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
              className="p-1 text-muted hover:text-red-400 rounded"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
