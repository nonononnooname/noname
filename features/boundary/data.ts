/**
 * Atom Boundary Labs page content — sourced from
 * `ThermoRuliad Labs_docs/atomquantum_physics.md`.
 *
 * The source doc brands the physics engine "Atom Quantum" and flags a name
 * collision with the ATQM post-quantum L1 ("Rename if the collision matters").
 * We resolve it here: the rendered product name is **Atom Boundary** (the lab is
 * Atom Boundary Labs). Every figure, citation, and the honest maturity qualifier
 * per stream is kept verbatim from the doc. The portfolio sitting at different
 * maturities is the point of the pitch.
 */

type Stat = { value: string; label: string };

export const HERO = {
  eyebrow: "Physics-native computing & energy",
  primitives: [
    "Neutral-atom arrays",
    "Rydberg blockade",
    "p-bits",
    "Casimir cavities",
  ],
  title: "ATOM Boundary",
  lede: "We let physics do the computing instead of fighting it, and draw the power from space itself.",
  tagline: "The computer is the physics. So is the battery.",
};

export const PROBLEM: {
  intro: string;
  walls: { title: string; body: string }[];
  context: Stat[];
} = {
  intro:
    "For seventy years we have built computers that fight physics, forcing billions of switches to brute-force answers that nature settles for free. A falling drop finds the shortest path down with zero computation; a soap film snaps to its minimal surface area. Nature computes by relaxing into its lowest-energy state. Three walls make the cost concrete.",
  walls: [
    {
      title: "AI's energy wall",
      body: "Training and serving large models grows faster than chip efficiency. Datacenters run in megawatts and sit next to power plants. Moore's law has slowed; demand has not.",
    },
    {
      title: "The optimization wall",
      body: "Logistics, portfolios, scheduling, materials and drug design are NP-hard. Their curse is combinatorial explosion: the problem grows linearly, the option space grows exponentially. Past a point, an honest answer outlasts the age of the universe.",
    },
    {
      title: "The power wall",
      body: "Trillions of sensors, wearables and implants run on batteries that wear out and need recharging. You cannot swap cells in billions of scattered devices. It caps the 'smart' world.",
    },
  ],
  context: [
    { value: "~20 W", label: "Whole-brain compute budget, the efficiency target" },
    { value: "megawatts", label: "Draw of a single AI datacenter today" },
    { value: "NP-hard", label: "Routing, portfolios, scheduling, materials, drug design" },
    { value: "trillions", label: "Battery-bound devices waiting for power that lasts" },
  ],
};

export const THESIS: {
  intro: string;
  letters: { letter: string; word: string; note: string }[];
} = {
  intro:
    "The portfolio rests on one principle: stop fighting physics, let the substrate compute, and let it power itself.",
  letters: [
    {
      letter: "A",
      word: "Atom",
      note: "Neutral-atom arrays are the shared hardware core. Nature makes every atom identical, so you skip nanometre-perfect fabrication.",
    },
    {
      letter: "T",
      word: "Thermodynamics",
      note: "Heat and noise become the engine of probabilistic, brain-efficient compute.",
    },
    {
      letter: "Q",
      word: "Quantum",
      note: "Superposition and entanglement carry the computation; the answer is the system's ground state.",
    },
    {
      letter: "M",
      word: "Many markets",
      note: "One core feeds several products on different horizons, from revenue tomorrow to a breakthrough the day after.",
    },
  ],
};

export const ECOSYSTEM = {
  intro:
    "Atom Boundary is one atomic core feeding several products. The same competencies (single-atom control, nanofabrication, field and quantum-state engineering) open four streams at once. No single bet carries the thesis.",
  core: {
    label: "Atomic core",
    sub: "Neutral-atom arrays · nanofab · field control",
  },
  streams: [
    "Quantum Optimizer",
    "Topological Compute",
    "Thermodynamic Compute",
    "Vacuum Energy",
  ],
};

export const STREAMS: {
  intro: string;
  items: {
    id: string;
    name: string;
    summary: string;
    points: string[];
    maturity: string;
  }[];
} = {
  intro:
    "Four surfaces, one physical spine. We build the hardware once: the optimizer and the topological machine are the same atoms in different modes, and the thermodynamic and vacuum modules share one engineering culture.",
  items: [
    {
      id: "01",
      name: "Quantum Optimizer",
      summary:
        "Solve NP-hard problems with physics instead of brute force. You place atoms as the 'guests' of a problem, and the system relaxes into the best arrangement, the way water finds the lowest point.",
      points: [
        "Maps optimization onto the ground state of an atom array (Rydberg blockade as the constraint)",
        "Returns a spectrum of near-optimal solutions, the range logistics planning needs",
        "Runs on cloud-grade neutral-atom platforms that exist today (QuEra, Pasqal)",
      ],
      maturity:
        "Maturity: commercial cloud hardware exists; we build the product layer on top.",
    },
    {
      id: "02",
      name: "Topological Compute",
      summary:
        "Computation that noise can't kill. You store information like a knot: shake the rope as hard as you like, and the knot stays.",
      points: [
        "Encodes data in global topology (anyons) rather than in individual atoms",
        "Fault tolerance without thousands of redundant error-correction qubits",
        "Runs on the same Rydberg hardware as Stream 01, a proven equivalence",
      ],
      maturity:
        "Maturity: strong theory + first lab demonstrations (2023–2024); a research stream.",
    },
    {
      id: "03",
      name: "Thermodynamic Compute",
      summary:
        "Thermal noise as a free calculator for AI. Throw a thousand dice at once and they 'compute' the distribution for you.",
      points: [
        "Probabilistic bits (p-bits) sample a Gibbs distribution in the device physics itself",
        "Bypasses the matrix-multiply that burns GPUs; generative AI is sampling at heart",
        "Aims at brain-level efficiency, far below a datacenter's draw",
      ],
      maturity:
        "Maturity: the field's pioneers shipped working prototypes in 2025 (Extropic, Normal Computing).",
    },
    {
      id: "04",
      name: "Vacuum Energy",
      summary:
        "A battery that runs without charging, a solar panel that works in the dark. Empty space is a stormy sea of fluctuations; a nanocavity carves a calm lagoon inside it, and the gap drives a current.",
      points: [
        "Engineered asymmetric Casimir cavities rectify vacuum fluctuations into steady DC",
        "Target chip: 5×5 mm, ~1.5 V continuous, no fuel, no charging",
        "Markets from IoT sensors and wearables out toward large-scale power",
      ],
      maturity:
        "Maturity: frontier R&D; measured Casimir physics, a peer-reviewed dynamic-vacuum model, and a funded ex-NASA team in the field.",
    },
  ],
};

export const COMPARISON: {
  intro: string;
  headers: [string, string];
  rows: [string, string][];
} = {
  intro:
    "Classical computing brute-forces answers and burns energy doing it. Atom Boundary lets the physics settle into the answer, and aims to power the device from the vacuum.",
  headers: ["Classical / GPU", "Atom Boundary"],
  rows: [
    ["Brute-force search, step by step", "Relaxes into a physical ground state"],
    [
      "Combinatorial explosion",
      "Native physical encoding of NP-hard structure",
    ],
    [
      "Matrix-multiply on power-hungry GPUs",
      "Probabilistic sampling in-device",
    ],
    [
      "Error-prone; fights noise with redundancy",
      "Designed-in topological protection (Stream 02)",
    ],
    ["Grid + batteries", "Vacuum-energy chip on the roadmap (Stream 04)"],
  ],
};

export const HOW_IT_WORKS: {
  intro: string;
  sharedCore: string;
  rows: { stream: string; detail: string }[];
} = {
  intro:
    "One atomic core, four cargoes. Single-atom control and field engineering stay constant; only the regime changes.",
  sharedCore:
    "Neutral-atom arrays in optical tweezers · nanofabrication · electromagnetic-field & quantum-state control · cryogenic / vacuum engineering",
  rows: [
    {
      stream: "Optimizer",
      detail: "Adiabatic relaxation to the ground state of a problem Hamiltonian",
    },
    {
      stream: "Topological",
      detail: "Braiding of Fibonacci-type anyons on the same blockaded array",
    },
    {
      stream: "Thermodynamic",
      detail: "p-bit lattices sampling a Gibbs distribution",
    },
    {
      stream: "Vacuum energy",
      detail:
        "Asymmetric Casimir nanocavities (separate fab line, shared culture)",
    },
  ],
};

export const SCIENCE: {
  intro: string;
  rows: { stream: string; mechanism: string; anchor: string }[];
} = {
  intro: "Each mechanism, stated precisely, with its published anchor.",
  rows: [
    {
      stream: "Optimizer",
      mechanism:
        "Rydberg blockade encodes Maximum Independent Set in the ground state; NP-hard",
      anchor: "Pichler et al. (2018); Ebadi et al., Science (2022)",
    },
    {
      stream: "Topological",
      mechanism:
        "Blockaded Rydberg chain ≅ Fibonacci anyons (τ × τ = 1 + τ); Temperley–Lieb / Jones polynomial",
      anchor: "Lesanovsky & Katsura, PRA (2012); Nature Physics (2024)",
    },
    {
      stream: "Thermodynamic",
      mechanism: "p-bits sample P ∝ e^(−E/kT); Landauer limit kT·ln2",
      anchor: "Extropic XTR-0/Z1; Normal Computing ASIC (2025)",
    },
    {
      stream: "Vacuum energy",
      mechanism:
        "Static Casimir F/A = −π²ℏc/240·d⁴; dynamical Casimir makes real photons; dynamic-vacuum model",
      anchor:
        "Casimir (1948); Wilson et al., Nature (2011); White et al., Phys. Rev. Research (2026)",
    },
  ],
};

export const MATURITY: {
  intro: string;
  rows: { stream: string; status: string; horizon: string }[];
} = {
  intro:
    "The honest map: streams sit at different stages, and the portfolio is built that way on purpose.",
  rows: [
    {
      stream: "01 Optimizer",
      status: "Commercial cloud hardware exists; we build the product",
      horizon: "Revenue near-term",
    },
    {
      stream: "02 Topological",
      status: "Strong theory + first demonstrations",
      horizon: "Years",
    },
    {
      stream: "03 Thermodynamic",
      status: "Real prototypes (2025), funded field",
      horizon: "Commercial 2026+",
    },
    {
      stream: "04 Vacuum energy",
      status: "Frontier R&D; measured physics + peer-reviewed model + funded team",
      horizon: "Bet on the day after",
    },
  ],
};

export const ROADMAP: {
  steps: { phase: string; when: string; detail: string }[];
} = {
  steps: [
    {
      phase: "Cloud access + first optimization pilots",
      when: "Now",
      detail: "Use existing atom platforms with first clients",
    },
    {
      phase: "Vacuum-chip prototypes",
      when: "Now",
      detail: "With university fab partners",
    },
    {
      phase: "Own atomic stack",
      when: "Upcoming",
      detail: "Optimizer + topological on one machine",
    },
    {
      phase: "Thermodynamic AI accelerator",
      when: "Upcoming",
      detail: "p-bit module for inference/training",
    },
    {
      phase: "Commercial vacuum-energy chip",
      when: "Planned",
      detail: "Multi-layer scaling, die-stacking",
    },
    {
      phase: "Moonshot: Ruliad",
      when: "R&D",
      detail: "Instant communication (separate property)",
    },
  ],
};

export const PITCH = {
  quote:
    "Atom Boundary builds one principle into a portfolio: let physics compute, and let it power itself. On one core sit a Rydberg-atom optimizer and a topological machine; beside them, a thermodynamic accelerator for AI and a vacuum-energy chip, with a civilization-scale moonshot riding on the same hardware.",
  tagline: "The computer is the physics. So is the battery.",
  domain: "atomboundary.tech",
};
