export interface TeamMember {
  id: string;
  name: string;
  affiliation: string;
  role: string;
}

export interface Card {
  id: string;
  workstreamId: string;
  title: string;
  description: string;
  column: "vision" | "in-progress" | "next-up" | "complete";
  assignees: string[];
  updatedAt: string;
  checkInDate?: string;
}

export interface Workstream {
  id: string;
  name: string;
  color: string;
  vision: string;
  statusText: string;
  nextText: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: "meeting" | "milestone" | "deadline";
  workstreamId?: string;
  description: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  description: string;
  cardId?: string;
  workstreamId?: string;
}

export interface AppState {
  workstreams: Workstream[];
  cards: Card[];
  team: TeamMember[];
  events: Event[];
  activity: ActivityEntry[];
}
