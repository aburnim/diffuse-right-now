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
import AboutView from "./components/AboutView";

export type View = "board" | "workstream" | "activity" | "team" | "events" | "about";

const VALID_VIEWS: View[] = ["board", "workstream", "activity", "team", "events", "about"];

function getViewFromHash(): View {
  if (typeof window === "undefined") return "board";
  const hash = window.location.hash.replace("#", "");
  return VALID_VIEWS.includes(hash as View) ? (hash as View) : "board";
}

export default function Home() {
  const [state, setState] = useState<AppState | null>(null);
  const [view, setView] = useState<View>("board");
  const [selectedWorkstream, setSelectedWorkstream] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [filterWorkstream, setFilterWorkstream] = useState<string | null>(null);

  // Set initial view from URL hash
  useEffect(() => {
    setView(getViewFromHash());
  }, []);

  // Sync hash to URL when view changes
  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
    const newHash = newView === "board" ? window.location.pathname : `#${newView}`;
    window.history.pushState(null, "", newHash);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const onHashChange = () => setView(getViewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

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
      updates: Partial<Pick<Card, "title" | "description" | "assignees" | "checkInDate">>
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
    handleViewChange("workstream");
  }, [handleViewChange]);

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
        onViewChange={handleViewChange}
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
        {view === "about" && <AboutView />}
      </main>
    </div>
  );
}
