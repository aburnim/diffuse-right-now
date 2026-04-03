import {
  LayoutGrid,
  Layers,
  Activity,
  Users,
  Calendar,
  Pencil,
  Clock,
  CalendarClock,
} from "lucide-react";

export default function AboutView() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          About This Board
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          <strong className="text-foreground">DiffUSE Right Now</strong> is a
          live project health dashboard for the{" "}
          <a
            href="https://radial.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            DiffUSE project
          </a>{" "}
          at Astera Institute / Radial. It gives anyone curious about the
          project a quick snapshot of what is happening, what is coming next, and
          what has been completed.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">
          How It Works
        </h3>
        <div className="space-y-3 text-sm text-muted leading-relaxed">
          <p>
            The project manager owns and maintains this board as a high-level
            health registry. Each card represents a meaningful goal or
            deliverable, not a granular task.
          </p>
          <p>
            The more granular tasks needed to reach each goal are owned and
            tracked by the person or people assigned to that card. Think of the
            board as the "what and how things are going" and the individual
            work as the "how to get there."
          </p>
          <p>
            If you are a collaborator, stakeholder, or just curious, this board
            is meant to answer:{" "}
            <span className="text-foreground font-medium">
              what is the DiffUSE project working on right now?
            </span>
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">
          Reading the Board
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3 text-sm">
            <LayoutGrid size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Board</span>
              <span className="text-muted">
                {" "}&mdash; Kanban view with three columns: In Progress, Next Up, and
                Complete. Cards sort by nearest check-in date, then by staleness.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Layers size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Workstreams</span>
              <span className="text-muted">
                {" "}&mdash; Drill into each workstream to see its vision, current
                status, and what is coming next.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Activity size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Activity</span>
              <span className="text-muted">
                {" "}&mdash; Timestamped log of every change made to the board.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Users size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Team</span>
              <span className="text-muted">
                {" "}&mdash; Who is involved and where they are from.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Calendar size={16} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Events</span>
              <span className="text-muted">
                {" "}&mdash; Upcoming and past milestones, meetings, and deadlines.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">
          Card Indicators
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3 text-sm">
            <Clock size={16} className="text-muted mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Staleness borders</span>
              <span className="text-muted">
                {" "}&mdash; Cards not updated recently get colored borders:{" "}
              </span>
              <span className="text-amber-500 font-medium">amber</span>
              <span className="text-muted"> (7+ days), </span>
              <span className="text-orange-500 font-medium">orange</span>
              <span className="text-muted"> (14+ days), </span>
              <span className="text-red-500 font-medium">red</span>
              <span className="text-muted"> (30+ days).</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <CalendarClock size={16} className="text-muted mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Check-in dates</span>
              <span className="text-muted">
                {" "}&mdash; Some cards have a next check-in date. Overdue check-ins
                appear in red.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Pencil size={16} className="text-muted mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">Edit mode</span>
              <span className="text-muted">
                {" "}&mdash; Used by the project manager to update cards, reassign
                people, and drag cards between columns.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
