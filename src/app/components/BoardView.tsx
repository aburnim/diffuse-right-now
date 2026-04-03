"use client";

import { useState } from "react";
import { AppState, Card } from "@/lib/types";
import CardItem from "./CardItem";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";

interface BoardViewProps {
  state: AppState;
  editMode: boolean;
  filterWorkstream: string | null;
  onMoveCard: (cardId: string, newColumn: Card["column"]) => void;
  onReorderCard: (cardId: string, targetCardId: string) => void;
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
  onSelectWorkstream: (wsId: string) => void;
}

const COLUMNS: { id: Card["column"]; label: string; accent: string }[] = [
  { id: "in-progress", label: "In Progress", accent: "#3B82F6" },
  { id: "next-up", label: "Next Up", accent: "#F59E0B" },
  { id: "complete", label: "Complete", accent: "#10B981" },
];

function DroppableColumn({
  id,
  label,
  accent,
  cards,
  workstreams,
  editMode,
  onUpdateCard,
  onDeleteCard,
  onAddCard,
  state,
}: {
  id: Card["column"];
  label: string;
  accent: string;
  cards: Card[];
  workstreams: AppState["workstreams"];
  editMode: boolean;
  onUpdateCard: BoardViewProps["onUpdateCard"];
  onDeleteCard: BoardViewProps["onDeleteCard"];
  onAddCard: BoardViewProps["onAddCard"];
  state: AppState;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [addingCard, setAddingCard] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newWs, setNewWs] = useState(workstreams[0]?.id || "");

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAddCard(newWs, newTitle.trim(), id);
      setNewTitle("");
      setAddingCard(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[300px] max-w-[340px] flex-1 rounded-xl transition-colors ${
        isOver ? "bg-accent/5" : ""
      }`}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg"
        style={{ backgroundColor: accent + "15" }}
      >
        <h2
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          {label}
        </h2>
        <span
          className="text-xs font-semibold ml-auto"
          style={{ color: accent }}
        >
          {cards.length}
        </span>
      </div>

      <SortableContext
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 px-1 pb-2 flex-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {cards.map((card) => {
            const ws = workstreams.find((w) => w.id === card.workstreamId);
            if (!ws) return null;
            return (
              <CardItem
                key={card.id}
                card={card}
                workstream={ws}
                editMode={editMode}
                teamMembers={state.team}
                onUpdate={onUpdateCard}
                onDelete={onDeleteCard}
              />
            );
          })}

          {editMode && !addingCard && (
            <button
              onClick={() => setAddingCard(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted hover:text-accent hover:bg-surface rounded-lg transition-colors"
            >
              <Plus size={14} /> Add card
            </button>
          )}

          {editMode && addingCard && (
            <div className="bg-surface border border-border rounded-lg p-3 space-y-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Card title..."
                className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-accent"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <select
                value={newWs}
                onChange={(e) => setNewWs(e.target.value)}
                className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                {state.workstreams.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="px-2 py-1 rounded text-xs bg-accent/20 text-accent hover:bg-accent/30"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setAddingCard(false);
                    setNewTitle("");
                  }}
                  className="px-2 py-1 rounded text-xs text-muted hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function BoardView({
  state,
  editMode,
  filterWorkstream,
  onMoveCard,
  onReorderCard,
  onUpdateCard,
  onAddCard,
  onDeleteCard,
}: BoardViewProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Sort: manually ordered cards first (by sortOrder), then auto-sort the rest
  const sortCards = (cards: Card[]) =>
    [...cards].sort((a, b) => {
      // Cards with explicit sortOrder come first
      if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder;
      if (a.sortOrder != null) return -1;
      if (b.sortOrder != null) return 1;
      // Cards with check-in dates come first, sorted by nearest date
      if (a.checkInDate && b.checkInDate)
        return new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime();
      if (a.checkInDate) return -1;
      if (b.checkInDate) return 1;
      // Then sort by oldest updated first (stalest rises)
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });

  const filteredCards = filterWorkstream
    ? state.cards.filter((c) => c.workstreamId === filterWorkstream)
    : state.cards;

  const handleDragStart = (event: DragStartEvent) => {
    const card = state.cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    // Dropped directly on a column
    if (COLUMNS.some((c) => c.id === overId)) {
      onMoveCard(cardId, overId as Card["column"]);
      return;
    }

    // Dropped on another card
    const draggedCard = state.cards.find((c) => c.id === cardId);
    const targetCard = state.cards.find((c) => c.id === overId);
    if (!targetCard || !draggedCard) return;

    if (draggedCard.column === targetCard.column) {
      // Same column — reorder
      onReorderCard(cardId, overId);
    } else {
      // Different column — move then reorder to target position
      onMoveCard(cardId, targetCard.column);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 overflow-x-auto h-full">
        {COLUMNS.map((col) => (
          <DroppableColumn
            key={col.id}
            id={col.id}
            label={col.label}
            accent={col.accent}
            cards={sortCards(filteredCards.filter((c) => c.column === col.id))}
            workstreams={state.workstreams}
            editMode={editMode}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
            onAddCard={onAddCard}
            state={state}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? (
          <CardItem
            card={activeCard}
            workstream={
              state.workstreams.find(
                (w) => w.id === activeCard.workstreamId
              )!
            }
            editMode={false}
            onUpdate={() => {}}
            onDelete={() => {}}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
