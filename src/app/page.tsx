"use client";

import { useState, useEffect, useCallback } from "react";
import { AppState, Card } from "@/lib/types";
import {
  loadState,
  loadStateFromServer,
  saveState,
  moveCard,
  updateCard,
  addCard,
  deleteCard,
  resetState,
} from "@/lib/store";
import Header from "./components/Header";
import BoardView from "./components/BoardView";
import WorkstreamView from "./components/WorkstreamView";
import ActivityFeed from "./components/ActivityFeed";
import TeamView from "./components/TeamView";
import EventsView from "./components/EventsView";

export type View = "board" | "workstream" | "activity" | "team" | "events";

export default function Home() {
  const [state, setState] = useState<AppState | null>(null);
  const [view, setView] = useState<View>("board");
  const [selectedWorkstream, setSelectedWorkstream] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [filterWorkstream, setFilterWorkstream] = useState<string | null>(null);

  useEffect(() => {
    // Try KV first (production), fall back to localStorage
    loadStateFromServer().then((serverState) => {
      if (serverState) {
        setState(serverState);
        saveState(serverState); // sync to localStorage too
      } else {
        setState(loadState());
      }
    });
  }, []);

  const persist = useCallback((newState: AppState) => {
    setState(newState);
    saveState(newState);
  }, []);

  const handleMoveCard = useCallback(
    (cardId: string, newColumn: Card["column"]) => {
      if (!state) return;
      persist(moveCard(state, cardId, newColumn));
    },
    [state, persist]
  );

  const handleUpdateCard = useCallback(
    (
      cardId: string,
      updates: Partial<Pick<Card, "title" | "description" | "assignees">>
    ) => {
      if (!state) return;
      persist(updateCard(state, cardId, updates));
    },
    [state, persist]
  );

  const handleAddCard = useCallback(
    (
      workstreamId: string,
      title: string,
      column: Card["column"] = "next-up"
    ) => {
      if (!state) return;
      persist(addCard(state, workstreamId, title, column));
    },
    [state, persist]
  );

  const handleDeleteCard = useCallback(
    (cardId: string) => {
      if (!state) return;
      persist(deleteCard(state, cardId));
    },
    [state, persist]
  );

  const handleReset = useCallback(() => {
    if (
      window.confirm("Reset board to original state? All changes will be lost.")
    ) {
      persist(resetState());
    }
  }, [persist]);

  const handleSelectWorkstream = useCallback((wsId: string) => {
    setSelectedWorkstream(wsId);
    setView("workstream");
  }, []);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        view={view}
        onViewChange={setView}
        editMode={editMode}
        onToggleEdit={() => setEditMode(!editMode)}
        onReset={handleReset}
        workstreams={state.workstreams}
        filterWorkstream={filterWorkstream}
        onFilterWorkstream={setFilterWorkstream}
      />
      <main className="flex-1 overflow-hidden">
        {view === "board" && (
          <BoardView
            state={state}
            editMode={editMode}
            filterWorkstream={filterWorkstream}
            onMoveCard={handleMoveCard}
            onUpdateCard={handleUpdateCard}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onSelectWorkstream={handleSelectWorkstream}
          />
        )}
        {view === "workstream" && (
          <WorkstreamView
            state={state}
            workstreamId={selectedWorkstream || state.workstreams[0]?.id}
            onSelectWorkstream={setSelectedWorkstream}
            editMode={editMode}
            onMoveCard={handleMoveCard}
            onUpdateCard={handleUpdateCard}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
          />
        )}
        {view === "activity" && <ActivityFeed state={state} />}
        {view === "team" && (
          <TeamView state={state} onSelectWorkstream={handleSelectWorkstream} />
        )}
        {view === "events" && <EventsView state={state} />}
      </main>
    </div>
  );
}
