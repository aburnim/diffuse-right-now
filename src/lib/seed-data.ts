import { AppState } from "./types";

export const seedData: AppState = {
  workstreams: [
    {
      id: "mdx2",
      name: "Data Collection and Processing",
      color: "#F39C12",
      vision:
        "DiffUSE's \"front door\": raw crystal data in, clean datasets out. mdx2 automates diffuse scattering extraction from beamlines. Goal: any synchrotron user can process diffuse data, not just experts. Expanding beyond lysozyme to real biological questions.",
      statusText:
        "Justin + Joseph drafting Hub data registration proposal. Mac1 ADP-ribose processing underway. Steve's next priorities are DHFR.",
      nextText:
        "A public example dataset showing the power of the DiffUSE Hub's organization and data governance. Possible DIALS-only workflow automation and auto logbook templates. New samples for method validation beyond lysozyme.",
    },
    {
      id: "sampleworks",
      name: "Sampleworks",
      color: "#9B59B6",
      vision:
        "Sampleworks flexibly joins experimental data and deep learning methods to build models that better reflect reality. Uses experimental data as a \"guide\" to steer AI models toward ensemble prediction. Inputs: AI-based protein structure prediction models and experimental data. Outputs: estimation of ensemble.",
      statusText:
        "First public release is live: repo on DiffUSE GitHub org, blog post published. Infrastructure on hub functions: GPU CI via self-hosted runners, CLI. Initial benchmarking complete, larger round underway. Paper in active drafting and figure development.",
      nextText:
        "Paper finalized and posted. Data registration hierarchy determined and integration with diffuse hub. External collaboration interest from Lauren Porter and Alex Bronstein.",
    },
    {
      id: "waterflow",
      name: "Waterflow",
      color: "#3498DB",
      vision:
        "Waterflow uses graph neural network (GNN) with flow matching to predict where water molecules should be placed around a protein structure. Inputs: protein structure (from PDB/PDB-Redo). Outputs: predicted water positions with confidence scores, benchmarked against known ground truth waters.",
      statusText:
        "Repo on DiffUSE GitHub org (diff-use/WaterFlow); CodeRabbit automated PR reviews enabled. Doris conducting data analysis on 66 lysozyme structures: clustering water positions, examining conservedness vs. EDIA/B-factor, and identifying precision-coverage tradeoff. CI/CD and testing infrastructure ongoing.",
      nextText:
        "Resolve \"ground truth\" problem: determine which waters are real vs. noise using EDIA filtering, conservedness clustering, and manual inspection. Scale training runs on Voltage Park GPU infrastructure. Implement WaterFlow's own confidence model. Expand training data experiments. Integrate ligand/het-atom encoding.",
    },
    {
      id: "infrastructure",
      name: "Compute Infrastructure / Hub",
      color: "#1ABC9C",
      vision:
        "Shared backbone powering all DiffUSE science workstreams. GPU clusters (k3s on Voltage Park) for heavy compute, CPUs on AWS for parallelized work (like molecular dynamics). Scientists run experiments via CLI/Hub, not SSH and YAML. Data governance principles baked in to register experiments for reproducibility.",
      statusText:
        "JupyterHub deployed on K8s with GPU profiles + GitHub OAuth. VP control plane, scheduling, and credential mgmt all complete. PR preview environments in progress (Moody, high priority). CUDA driver mismatch resolved this week (Abbas).",
      nextText:
        "Stacks platform integration (~May target). AWS cost optimization via committed use discounts. Security assessment: threat model, DevSecOps, hardening. Data governance and metadata revamp for broad utility.",
    },
    {
      id: "encoding",
      name: "Encoding",
      color: "#E74C3C",
      vision:
        "The \"Rosetta Stone\" between DiffUSE outputs and the PDB ecosystem. Defines how protein dynamics get stored in standard mmCIF format. Without this, DiffUSE results can't be shared or reused by the field. Build tooling to convert MD simulations to multiconformer models. Bridge DiffUSE outputs with community structural biology standards.",
      statusText:
        "mmCIF working group met, in active conversation. Martin Maly (MRC LMB) reached out asking for updates (Mar 31).",
      nextText:
        "Hiring will fill ML/math/theory gap. Identify project owner. Confirm project task list and core library plan.",
    },
    {
      id: "hiring",
      name: "Operations",
      color: "#95A5A6",
      vision:
        "Fill critical science gaps: ML modeling, validation, biology. ML modeler for Sampleworks/Water; postdoc for data collection. All roles require PhD + bio background + open science alignment.",
      statusText:
        "5 ML modeling candidates interviewed in 2 weeks. Postdoc + intern needed to assist continued data collection (led by Steve + Nozomi).",
      nextText:
        "Complete ML modeling screens and advance top candidates.",
    },
    {
      id: "stacks",
      name: "The Stacks / Publishing",
      color: "#E67E22",
      vision:
        "DOI-minted open publishing platform for DiffUSE outputs. Google Docs import; Stacks team handles formatting + markup. Bridge blog posts into citable, discoverable publications.",
      statusText:
        "Platform confirmed ready; DOI minting via Radial URL resolved. Publication approach and paper pipeline docs in progress (Andy).",
      nextText:
        "Publish Sampleworks paper as first Stacks publication (May 1 earliest). Cross-post DiffUSE.science blog posts as tagged Stacks pubs. DiffUSE Hub description paper so hub gets DOI via paper (Justin).",
    },
  ],

  cards: [
    // --- Mdx2 ---
    {
      id: "mdx2-1",
      workstreamId: "mdx2",
      title: "Hub data registration proposal",
      description: "Justin + Joseph drafting Hub data registration proposal",
      column: "in-progress",
      assignees: ["Justin Biel", "Joseph"],
      updatedAt: "2026-04-01",
    },
    {
      id: "mdx2-2",
      workstreamId: "mdx2",
      title: "Mac1 ADP-ribose processing",
      description: "Processing Mac1 ADP-ribose data through mdx2 pipeline",
      column: "in-progress",
      assignees: ["Steve Meisburger"],
      updatedAt: "2026-04-01",
    },
    {
      id: "mdx2-3",
      workstreamId: "mdx2",
      title: "DHFR data collection",
      description: "Steve's next priority: DHFR dataset processing",
      column: "next-up",
      assignees: ["Steve Meisburger"],
      updatedAt: "2026-04-01",
    },
    {
      id: "mdx2-4",
      workstreamId: "mdx2",
      title: "Public example dataset",
      description:
        "A public example dataset showing the power of the DiffUSE Hub's organization and data governance",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "mdx2-5",
      workstreamId: "mdx2",
      title: "DIALS-only workflow automation",
      description:
        "Possible DIALS-only workflow automation and auto logbook templates",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
    },

    // --- Sampleworks ---
    {
      id: "sw-1",
      workstreamId: "sampleworks",
      title: "First public release",
      description:
        "Repo on DiffUSE GitHub org, blog post published",
      column: "complete",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "sw-2",
      workstreamId: "sampleworks",
      title: "GPU CI + CLI infrastructure",
      description:
        "GPU CI via self-hosted runners, CLI ('diffuse run sampleworks [...]')",
      column: "in-progress",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "sw-3",
      workstreamId: "sampleworks",
      title: "Large-scale benchmarking",
      description:
        "Larger round of experiments across all models and guidance strengths",
      column: "in-progress",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "sw-4",
      workstreamId: "sampleworks",
      title: "Sampleworks paper",
      description:
        "Paper finalized and posted. Dependent on: expanded benchmarking, result order, and figures finalized.",
      column: "in-progress",
      assignees: [],
      updatedAt: "2026-04-01",
      checkInDate: "2026-05-01",
    },
    {
      id: "sw-5",
      workstreamId: "sampleworks",
      title: "Data registration + hub integration",
      description:
        "Data registration hierarchy determined and integration with diffuse hub",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "sw-6",
      workstreamId: "sampleworks",
      title: "External collaborations",
      description:
        "Collaboration interest from Lauren Porter and Alex Bronstein",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
    },

    // --- Waterflow ---
    {
      id: "wf-1",
      workstreamId: "waterflow",
      title: "Repo + CodeRabbit setup",
      description:
        "Repo on DiffUSE GitHub org; CodeRabbit automated PR reviews enabled",
      column: "complete",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "wf-2",
      workstreamId: "waterflow",
      title: "Lysozyme water analysis",
      description:
        "Doris analyzing 66 lysozyme structures: clustering water positions, examining conservedness vs. EDIA/B-factor, precision-coverage tradeoff",
      column: "in-progress",
      assignees: ["Doris"],
      updatedAt: "2026-04-01",
    },
    {
      id: "wf-3",
      workstreamId: "waterflow",
      title: "CI/CD and testing",
      description: "CI/CD and testing infrastructure ongoing",
      column: "in-progress",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "wf-4",
      workstreamId: "waterflow",
      title: "Ground truth resolution",
      description:
        "Determine which waters are real vs. noise using EDIA filtering, conservedness clustering, and manual inspection in Coot",
      column: "next-up",
      assignees: ["Doris"],
      updatedAt: "2026-04-01",
    },
    {
      id: "wf-5",
      workstreamId: "waterflow",
      title: "Scale training on Voltage Park",
      description: "Scale training runs on Voltage Park GPU infrastructure",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "wf-6",
      workstreamId: "waterflow",
      title: "Confidence model",
      description:
        "Implement and evaluate WaterFlow's own confidence model (separate from SuperWater's)",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
    },

    // --- Infrastructure ---
    {
      id: "infra-1",
      workstreamId: "infrastructure",
      title: "VP control plane + scheduling",
      description:
        "Voltage Park control plane, scheduling, and credential management all complete",
      column: "complete",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "infra-2",
      workstreamId: "infrastructure",
      title: "CUDA driver mismatch fix",
      description: "CUDA driver mismatch resolved this week by Abbas",
      column: "complete",
      assignees: ["Abbas"],
      updatedAt: "2026-04-01",
    },
    {
      id: "infra-3",
      workstreamId: "infrastructure",
      title: "JupyterHub on K8s",
      description:
        "JupyterHub deployed on K8s with GPU profiles + GitHub OAuth",
      column: "complete",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "infra-4",
      workstreamId: "infrastructure",
      title: "PR preview environments",
      description: "PR preview environments in progress (high priority)",
      column: "in-progress",
      assignees: ["Moody"],
      updatedAt: "2026-04-01",
    },
    {
      id: "infra-5",
      workstreamId: "infrastructure",
      title: "Stacks platform integration",
      description: "Stacks platform integration (~May target)",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
      checkInDate: "2026-05-01",
    },
    {
      id: "infra-6",
      workstreamId: "infrastructure",
      title: "AWS cost optimization",
      description: "AWS cost optimization via committed use discounts",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
    },

    // --- Encoding ---
    {
      id: "enc-1",
      workstreamId: "encoding",
      title: "mmCIF working group",
      description:
        "mmCIF working group met, in active conversation. Martin Maly (MRC LMB) reached out asking for updates.",
      column: "in-progress",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "enc-2",
      workstreamId: "encoding",
      title: "Identify project owner",
      description: "Identify project owner for encoding workstream",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "enc-3",
      workstreamId: "encoding",
      title: "Core library plan",
      description: "Confirm project task list and core library plan",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
    },

    // --- Hiring ---
    {
      id: "hire-1",
      workstreamId: "hiring",
      title: "ML modeling interviews",
      description: "5 ML modeling candidates interviewed in 2 weeks",
      column: "in-progress",
      assignees: [],
      updatedAt: "2026-04-01",
      checkInDate: "2026-04-15",
    },
    {
      id: "hire-2",
      workstreamId: "hiring",
      title: "Postdoc + intern search",
      description:
        "Postdoc + intern needed to assist continued data collection (led by Steve + Nozomi)",
      column: "next-up",
      assignees: ["Steve Meisburger", "Nozomi Ando"],
      updatedAt: "2026-04-01",
    },

    // --- Stacks ---
    {
      id: "stacks-1",
      workstreamId: "stacks",
      title: "DOI minting resolved",
      description: "Platform confirmed ready; DOI minting via Radial URL resolved",
      column: "complete",
      assignees: [],
      updatedAt: "2026-04-01",
    },
    {
      id: "stacks-2",
      workstreamId: "stacks",
      title: "Publication pipeline docs",
      description:
        "Publication approach and paper pipeline docs in progress",
      column: "in-progress",
      assignees: ["Andy Burnim"],
      updatedAt: "2026-04-01",
    },
    {
      id: "stacks-3",
      workstreamId: "stacks",
      title: "Sampleworks paper on Stacks",
      description:
        "Publish Sampleworks paper as first Stacks publication (May 1 earliest)",
      column: "next-up",
      assignees: [],
      updatedAt: "2026-04-01",
      checkInDate: "2026-05-01",
    },
    {
      id: "stacks-4",
      workstreamId: "stacks",
      title: "Hub description paper",
      description:
        "DiffUSE Hub description paper so hub gets DOI via paper",
      column: "next-up",
      assignees: ["Justin Biel"],
      updatedAt: "2026-04-01",
    },
  ],

  team: [
    {
      id: "nozomi-ando",
      name: "Nozomi Ando",
      affiliation: "Cornell",
      role: "Professor, Chemistry & Chemical Biology",
    },
    {
      id: "justin-biel",
      name: "Justin Biel",
      affiliation: "DiffUSE",
      role: "Software Engineer",
    },
    {
      id: "andy-burnim",
      name: "Andy Burnim",
      affiliation: "DiffUSE",
      role: "Project Manager",
    },
    {
      id: "james-fraser",
      name: "James Fraser",
      affiliation: "UCSF",
      role: "Professor, Bioengineering",
    },
    {
      id: "james-holton",
      name: "James Holton",
      affiliation: "LBNL / UCSF",
      role: "Beamline Scientist / Full Adjunct Professor",
    },
    {
      id: "steve-meisburger",
      name: "Steve Meisburger",
      affiliation: "Cornell",
      role: "Staff Scientist",
    },
    {
      id: "michael-wall",
      name: "Michael Wall",
      affiliation: "Los Alamos National Laboratory",
      role: "Senior Scientist",
    },
    {
      id: "stephanie-wankowicz",
      name: "Stephanie Wankowicz",
      affiliation: "DiffUSE",
      role: "Lead",
    },
    {
      id: "abbas",
      name: "Abbas",
      affiliation: "Ptown",
      role: "Infrastructure Engineer",
    },
    {
      id: "moody",
      name: "Moody",
      affiliation: "Ptown",
      role: "Infrastructure Engineer",
    },
    {
      id: "michael-ptown",
      name: "Michael",
      affiliation: "Ptown",
      role: "Infrastructure Engineer",
    },
    {
      id: "doris",
      name: "Doris",
      affiliation: "DiffUSE",
      role: "Research Scientist",
    },
    {
      id: "joseph",
      name: "Joseph",
      affiliation: "DiffUSE",
      role: "Data Engineer",
    },
    {
      id: "kara-zielinski",
      name: "Kara Zielinski",
      affiliation: "DiffUSE",
      role: "Researcher",
    },
    {
      id: "karson-chrispens",
      name: "Karson Chrispens",
      affiliation: "DiffUSE",
      role: "Researcher",
    },
    {
      id: "marcus-collins",
      name: "Marcus Collins",
      affiliation: "DiffUSE",
      role: "Senior ML Researcher",
    },
    {
      id: "Vratin-Srivastava",
      name: "Vratin Srivastava",
      affiliation: "DiffUSE",
      role: "Researcher",
    },

  ],

  events: [
    {
      id: "evt-1",
      title: "Stacks platform integration target",
      date: "2026-05-01",
      type: "milestone",
      workstreamId: "infrastructure",
      description: "Target date for Stacks platform integration with hub",
    },
    {
      id: "evt-2",
      title: "Sampleworks paper on Stacks",
      date: "2026-05-01",
      type: "milestone",
      workstreamId: "stacks",
      description:
        "Earliest date for Sampleworks paper as first Stacks publication",
    },
    {
      id: "evt-3",
      title: "ML modeling candidate screens",
      date: "2026-04-15",
      type: "deadline",
      workstreamId: "hiring",
      description: "Complete ML modeling screens and advance top candidates",
    },
    {
      id: "evt-4",
      title: "Project status update (slides posted)",
      date: "2026-04-01",
      type: "meeting",
      description: "Project Status Overview slides shared across all workstreams",
    },
  ],

  activity: [
    {
      id: "act-1",
      timestamp: "2026-04-01T12:00:00Z",
      description: "Board initialized from Project Status Overview slides",
    },
    {
      id: "act-2",
      timestamp: "2026-04-01T12:01:00Z",
      description:
        "Added 7 workstreams: Mdx2, Sampleworks, Waterflow, Infrastructure, Encoding, Hiring, Stacks",
      workstreamId: undefined,
    },
    {
      id: "act-3",
      timestamp: "2026-04-01T12:02:00Z",
      description: "CUDA driver mismatch marked complete (Abbas)",
      cardId: "infra-2",
      workstreamId: "infrastructure",
    },
    {
      id: "act-4",
      timestamp: "2026-04-01T12:03:00Z",
      description: "Sampleworks first public release marked complete",
      cardId: "sw-1",
      workstreamId: "sampleworks",
    },
  ],
};
