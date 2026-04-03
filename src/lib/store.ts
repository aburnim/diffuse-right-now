import { AppState, Card, ActivityEntry } from "./types";
import { seedData } from "./seed-data";

const STATE_KEY = "diffuse-scoreboard-state";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function now(): string {
  return new Date().toISOString();
}

// --- Persistence: localStorage locally, Vercel KV in production ---

export function loadState(): AppState {
  if (typeof window === "undefined") return seedData;
  const saved = localStorage.getItem(STATE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return seedData;
    }
  }
  return seedData;
}

export async function loadStateFromServer(): Promise<AppState | null> {
  try {
    const res = await fetch("/api/state");
    const json = await res.json();
    if (json.data) return json.data as AppState;
  } catch {
    // KV not available, fall through
  }
  return null;
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
  // Fire-and-forget save to KV
  fetch("/api/state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  }).catch(() => {});
}

// --- State mutations ---

export function addActivity(
  state: AppState,
  description: string,
  cardId?: string,
  workstreamId?: string
): AppState {
  const entry: ActivityEntry = {
    id: generateId(),
    timestamp: now(),
    description,
    cardId,
    workstreamId,
  };
  return {
    ...state,
    activity: [entry, ...state.activity],
  };
}

export function moveCard(
  state: AppState,
  cardId: string,
  newColumn: Card["column"]
): AppState {
  const card = state.cards.find((c) => c.id === cardId);
  if (!card || card.column === newColumn) return state;

  const columnLabels: Record<string, string> = {
    vision: "Vision",
    "in-progress": "In Progress",
    "next-up": "Next Up",
    complete: "Complete",
  };

  const ws = state.workstreams.find((w) => w.id === card.workstreamId);
  const updated = {
    ...state,
    cards: state.cards.map((c) =>
      c.id === cardId
        ? { ...c, column: newColumn, updatedAt: now().split("T")[0] }
        : c
    ),
  };

  return addActivity(
    updated,
    `Moved "${card.title}" from ${columnLabels[card.column]} to ${columnLabels[newColumn]}${ws ? ` (${ws.name})` : ""}`,
    cardId,
    card.workstreamId
  );
}

export function updateCard(
  state: AppState,
  cardId: string,
  updates: Partial<Pick<Card, "title" | "description" | "assignees" | "checkInDate">>
): AppState {
  const card = state.cards.find((c) => c.id === cardId);
  if (!card) return state;

  const changes: string[] = [];
  if (updates.title && updates.title !== card.title)
    changes.push(`title to "${updates.title}"`);
  if (updates.description && updates.description !== card.description)
    changes.push("description");
  if (updates.assignees)
    changes.push(
      `assignees to ${updates.assignees.join(", ") || "none"}`
    );
  if (updates.checkInDate !== undefined)
    changes.push(`check-in date to ${updates.checkInDate || "none"}`);

  const updated = {
    ...state,
    cards: state.cards.map((c) =>
      c.id === cardId
        ? { ...c, ...updates, updatedAt: now().split("T")[0] }
        : c
    ),
  };

  if (changes.length === 0) return updated;

  return addActivity(
    updated,
    `Updated "${card.title}": ${changes.join(", ")}`,
    cardId,
    card.workstreamId
  );
}

export function addCard(
  state: AppState,
  workstreamId: string,
  title: string,
  column: Card["column"] = "next-up"
): AppState {
  const ws = state.workstreams.find((w) => w.id === workstreamId);
  const card: Card = {
    id: generateId(),
    workstreamId,
    title,
    description: "",
    column,
    assignees: [],
    updatedAt: now().split("T")[0],
  };

  const updated = {
    ...state,
    cards: [...state.cards, card],
  };

  return addActivity(
    updated,
    `Added "${title}" to ${ws?.name || workstreamId}`,
    card.id,
    workstreamId
  );
}

export function deleteCard(state: AppState, cardId: string): AppState {
  const card = state.cards.find((c) => c.id === cardId);
  if (!card) return state;

  const updated = {
    ...state,
    cards: state.cards.filter((c) => c.id !== cardId),
  };

  return addActivity(
    updated,
    `Removed "${card.title}"`,
    undefined,
    card.workstreamId
  );
}

export function reorderCard(
  state: AppState,
  cardId: string,
  targetCardId: string
): AppState {
  const card = state.cards.find((c) => c.id === cardId);
  const targetCard = state.cards.find((c) => c.id === targetCardId);
  if (!card || !targetCard || card.id === targetCard.id) return state;

  // Get all cards in the target column, sorted the same way the board displays them
  const columnCards = state.cards
    .filter((c) => c.column === targetCard.column)
    .sort((a, b) => {
      if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder;
      if (a.sortOrder != null) return -1;
      if (b.sortOrder != null) return 1;
      if (a.checkInDate && b.checkInDate)
        return new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime();
      if (a.checkInDate) return -1;
      if (b.checkInDate) return 1;
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });

  // Remove the dragged card from the list if it was in this column
  const withoutDragged = columnCards.filter((c) => c.id !== cardId);

  // Insert the dragged card at the target position
  const targetIndex = withoutDragged.findIndex((c) => c.id === targetCardId);
  withoutDragged.splice(targetIndex, 0, card);

  // Assign sortOrder to every card in the column
  const orderMap = new Map<string, number>();
  withoutDragged.forEach((c, i) => orderMap.set(c.id, i));

  const updated = {
    ...state,
    cards: state.cards.map((c) => {
      if (orderMap.has(c.id)) {
        return { ...c, sortOrder: orderMap.get(c.id)!, column: targetCard.column };
      }
      return c;
    }),
  };

  return addActivity(
    updated,
    `Reordered "${card.title}" in ${targetCard.column}`,
    cardId,
    card.workstreamId
  );
}

export function resetState(): AppState {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STATE_KEY);
  }
  return seedData;
}
