@AGENTS.md

# DiffUSE Right Now -- Project Scoreboard

## What this is

A Next.js web app that serves as a live project dashboard for the DiffUSE project (Astera Institute / Radial). It has a kanban board, workstream detail views, activity feed, team page, and events timeline.

## Tech Stack

- Next.js 16 (App Router), React, TypeScript
- Tailwind CSS (light theme with Astera brand colors)
- @dnd-kit for drag-and-drop
- Vercel KV (Upstash Redis) for persistence in production
- localStorage as fallback for local dev
- Deployed on Vercel

## Commands

```bash
npm run dev    # Start dev server on localhost:3000
npm run build  # Production build (run this to check for errors)
```

## Project Structure

```
src/
  lib/
    types.ts        # All TypeScript interfaces (Card, Workstream, TeamMember, Event, ActivityEntry, AppState)
    seed-data.ts    # Default data -- THE file to edit for bulk content changes
    store.ts        # State management: load, save, add/move/update/delete cards, activity logging
  app/
    page.tsx        # Main page, state management, view routing
    layout.tsx      # Root layout with Vercel Analytics
    globals.css     # Tailwind theme (colors, fonts)
    api/state/
      route.ts      # GET/POST endpoints for Vercel KV persistence
    components/
      Header.tsx       # Navigation, edit toggle, workstream filter chips
      BoardView.tsx    # Kanban columns with drag-and-drop
      CardItem.tsx     # Individual card with dates, staleness, edit mode
      WorkstreamView.tsx  # Drill-down per workstream (Vision/Status/Next panels)
      ActivityFeed.tsx    # Timestamped log with date/workstream filters + export
      TeamView.tsx       # Team roster grouped by affiliation
      EventsView.tsx     # Upcoming/past events timeline
```

## How to bulk-edit content

All seed data lives in `src/lib/seed-data.ts`. This is the single source of truth for initial board state. After editing seed data, the user must hit the **reset button** (in edit mode, the circular arrow icon) to reload from seed, or clear localStorage.

### Workstream IDs

| ID | Display Name |
|---|---|
| `mdx2` | Data Collection and Processing |
| `sampleworks` | Sampleworks |
| `waterflow` | Waterflow |
| `infrastructure` | Compute Infrastructure / Hub |
| `encoding` | Encoding |
| `hiring` | Operations |
| `stacks` | The Stacks / Publishing |

### Adding cards

Add entries to the `cards` array in `seed-data.ts`:

```typescript
{
  id: "unique-id",           // any unique string
  workstreamId: "mdx2",      // must match a workstream ID above
  title: "Card title",
  description: "Details about this task",
  column: "in-progress",     // "vision" | "in-progress" | "next-up" | "complete"
  assignees: ["Steve Meisburger", "Justin Biel"],  // full names from team list
  updatedAt: "2026-04-02",   // YYYY-MM-DD
  checkInDate: "2026-05-01", // optional, YYYY-MM-DD
}
```

### Adding team members

Add entries to the `team` array:

```typescript
{
  id: "first-last",
  name: "First Last",
  affiliation: "Institution Name",
  role: "Role Title",
}
```

### Adding events

Add entries to the `events` array:

```typescript
{
  id: "evt-unique",
  title: "Event name",
  date: "2026-05-15",        // YYYY-MM-DD
  type: "milestone",         // "meeting" | "milestone" | "deadline"
  workstreamId: "stacks",    // optional, links to a workstream
  description: "Details",
}
```

### Updating workstream narratives

Each workstream has three text fields that appear in the Workstream detail view:
- `vision` -- what this workstream is and why it matters
- `statusText` -- current state of work
- `nextText` -- what's coming next

These mirror the Vision / Status / Next panels from the project slides.

## Ingesting content from other sources

When asked to update the board from external sources (meeting notes, slides, Slack messages, emails, documents), follow this process:

1. Read/fetch the source content
2. Identify new tasks, status changes, completed items, new team members, or events
3. Edit `src/lib/seed-data.ts` to reflect the changes
4. Add appropriate activity entries to the `activity` array with timestamps and descriptions
5. Run `npm run build` to verify no errors
6. Remind the user to reset the board in the app (edit mode > reset button) or clear localStorage

### Column mapping guide

When interpreting project updates, map to columns as follows:
- **"vision"** -- long-term goals, not actively being worked on
- **"in-progress"** -- someone is actively working on this right now
- **"next-up"** -- planned work, will start soon but not yet active
- **"complete"** -- finished, shipped, resolved

### Activity entries for ingested content

When bulk-updating from a source, add a summary activity entry:

```typescript
{
  id: "act-" + Date.now(),
  timestamp: new Date().toISOString(),
  description: "Updated board from [source description]",
}
```

Then add individual entries for significant changes (cards moved, new cards added, items completed).

## Important notes

- Cards sort by nearest check-in date first, then by staleness (oldest updated rises to top)
- Cards not updated in 7+ days get amber borders, 14+ orange, 30+ red (only for non-complete cards)
- The activity feed auto-logs every change made through the UI. Manual seed-data edits should include corresponding activity entries.
- After editing seed-data.ts, the user needs to reset the board in the browser to see changes. Edits to component files take effect on next deploy/reload.
- Always use `npm run build` to verify changes compile before pushing.
