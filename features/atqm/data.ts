/**
 * ATQM page content — sourced verbatim from atqm_docs/ (Areth.md,
 * ATQM_Areth_master_corrected.md, ATQM_Areth_domain_expansion.md).
 * Figures and qualifiers are kept faithful: the master doc insists the honest
 * framing (smoke test != production, FN-DSA = draft FIPS 206, CLOB = roadmap,
 * PQ signature-size trade-off) is a strength of the pitch, not a weakness.
 */

export const HERO = {
  eyebrow: "Post-quantum Layer 1",
  primitives: ["ML-DSA", "ML-KEM", "HotStuff"],
  title: "Atom Quantum",
  lede: "A post-quantum L1 for the world after secp256k1.",
  tagline: "EVM where it counts. New cryptography everywhere else.",
  domain: "areth.network",
};

export const PROBLEM = {
  intro:
    "Every major chain stakes its security on elliptic-curve cryptography that a sufficiently capable quantum computer breaks through Shor's algorithm. The fix isn't a patch on a live network — it's a network designed around the new primitives from genesis.",
  vectors: [
    {
      title: "Harvest now, decrypt later",
      body: "Adversaries already archive today's public chain data and signatures, waiting for a cryptographically relevant quantum computer. Anything signed under ECDSA or wrapped under X25519 today is on the clock — and a blockchain is uniquely exposed: data is public, immutable, and every spent public key is stored forever.",
    },
    {
      title: "BLS validators are fragile",
      body: "Aggregated BLS quorums collapse the moment pairing-based assumptions stop holding. A chain whose finality depends on BLS aggregation has no graceful failure mode.",
    },
    {
      title: "Migration ≠ retrofit",
      body: "Bolting post-quantum crypto onto secp256k1 chains breaks address schemes, finality, and a decade of tooling. The post-quantum stack has to be laid down from the network's genesis block.",
    },
  ],
  context: [
    {
      value: "10–20 yr",
      label: "Conservative CRQC horizon (5–10 yr optimistic)",
    },
    {
      value: "2030 / 2035",
      label: "NIST IR 8547 — deprecate after 2030, disallow after 2035",
    },
    {
      value: "< 1M qubits",
      label: "Gidney 2025 — RSA-2048 estimate, down from ~20M (2019)",
    },
  ],
};

export const ATQM_VS_ARETH = {
  rows: [
    { key: "What it is", atqm: "Umbrella project, ecosystem, brand", areth: "Layer 1 blockchain, the technology core" },
    { key: "Role", atqm: "Protective perimeter over ecosystem projects", areth: "The material the protection is built from" },
    { key: "Audience", atqm: "Investors, community, marketing", areth: "Developers, validators, dApp builders" },
    { key: "Token", atqm: "$ATQM", areth: "Native gas token of the Areth network" },
  ],
  acronym: [
    { letter: "A", word: "Atom", note: "Root brand of the ATOM Group ecosystem." },
    { letter: "T", word: "Technology", note: "NIST-standardized post-quantum primitives (FIPS 203/204; FN-DSA draft FIPS 206)." },
    { letter: "Q", word: "Quantum", note: "Architecture built to stay secure in the post-quantum era." },
    { letter: "M", word: "Mainnet", note: "Production-grade network designed for long-term resilience." },
  ],
};

/**
 * Ecosystem + Products — the consumer-facing surfaces that sit on top of the
 * Areth post-quantum core. Copy here is PLACEHOLDER ("neurslop") to be rewritten
 * by marketing; product set mirrors the Figma `Qvanta` node 16820-45026
 * (DEX, Staking, Bridge, mobile App, web App, + one ecosystem surface).
 */
export const ECOSYSTEM = {
  intro:
    "Areth is the post-quantum core. Everything a user touches — trading, staking, bridging, wallets — settles on the same ML-DSA / ML-KEM spine, so security never depends on the surface in front of it.",
  core: {
    label: "Areth",
    sub: "Post-quantum L1",
  },
};

/**
 * The product surfaces of the ATOM ecosystem. Mirrors the Figma `Qvanta` product
 * frames (node 16820-45026): DEX, Staking, Bridge and the mobile Wallet. `key`
 * maps to both an icon (EcosystemOrbit) and a mock-interface component
 * (ProductShowcase). Order here is the order nodes are placed around the circle.
 */
export type Product = {
  key: "dex" | "staking" | "bridge" | "wallet";
  name: string;
  tagline: string;
  body: string;
  features: string[];
};

export const PRODUCTS: { intro: string; items: Product[] } = {
  intro:
    "Four surfaces, one post-quantum spine. No product re-implements its own cryptography — DEX, Staking, Bridge and the Wallet all ship against the same audited Areth core.",
  items: [
    {
      key: "dex",
      name: "DEX",
      tagline: "Swap & trade",
      body: "Trade any ecosystem asset with settlement you can trust. Every order is authorized with an ML-DSA signature and clears against the same block-bound finality as the chain itself.",
      features: [
        "One-click swaps with live, PQ-signed quotes",
        "Slippage, rate and gas shown before you sign",
        "Clean EIP-1559 fees — no blob theatre",
      ],
    },
    {
      key: "staking",
      name: "Staking",
      tagline: "Stake & earn",
      body: "Stake QANT to help secure HotStuff finality and earn protocol rewards. Validator and delegator signatures are pure ML-DSA — no BLS aggregation, no pairing-based assumptions to break.",
      features: [
        "Live APR, max-slashing and balance at a glance",
        "Transparent cooldown before you unstake",
        "Rewards accrue against finalized blocks",
      ],
    },
    {
      key: "bridge",
      name: "Bridge",
      tagline: "Cross-chain",
      body: "Move assets between Areth and the chains you already use. Cross-chain messages are anchored to finalized blocks and verified end to end with post-quantum signatures.",
      features: [
        "Pick source and destination chain in one view",
        "Quoted amount, fees and address upfront",
        "Crosschain routing backed by PQ proofs",
      ],
    },
    {
      key: "wallet",
      name: "Wallet",
      tagline: "Mobile · iOS & Android",
      body: "A consumer-grade wallet where the post-quantum key lives in the Secure Enclave / StrongBox and never leaves in cleartext. Track balances, send and stake — all signed on device.",
      features: [
        "Face ID unlocks; the device signs",
        "Portfolio, NFTs and qubit assets in one view",
        "Threshold-of-N accounts across devices",
      ],
    },
  ],
};

export const SUBSTRATE = {
  intro:
    "Areth is a fork-descendant of Reth — not Reth with PQ patches. We kept Reth's mature execution, storage, and trie. We replaced every place where Ethereum's cryptographic assumptions live.",
  kept: [
    "MDBX storage provider",
    "Merkle-Patricia trie",
    "REVM execution engine",
    "Transaction pool & fetcher",
    "Payload builder",
    "Snap-style state sync",
    "Node runtime & RPC server",
  ],
  replaced: [
    ["Gasper consensus", "HotStuff (deterministic finality)"],
    ["devp2p transport", "PQ secure session"],
    ["ECDSA tx auth", "ML-DSA / FN-DSA"],
    ["ENR node identity", "ArethNodeId"],
    ["X25519 key exchange", "ML-KEM-768"],
    ["eth_* RPC namespace", "areth_*"],
    ["Probabilistic finality", "Block-bound finality"],
  ] as [string, string][],
};

export const ARCHITECTURE = {
  intro:
    "Every node speaks the same encrypted, ML-KEM-derived transport. What changes is the cargo.",
  roles: [
    { name: "Discovery", body: "ANR records and peer discovery. No validator state, no execution data." },
    { name: "Public Execution", body: "Finalized block sync, transaction gossip, snap-style state distribution." },
    { name: "Validator", body: "HotStuff proposals, votes, quorum certificates, commits, and finality certificates." },
  ],
  transport: "ML-KEM-768  +  AES-GCM  +  ML-DSA transcript binding",
  transportNotes: [
    "ML-KEM-768 derives the session key.",
    "AES-GCM provides AEAD with replay protection and epoch rekeying.",
    "ML-DSA signs the handshake transcript, blocking downgrade attacks.",
  ],
};

export const CRATES: { key: string; value: string }[] = [
  { key: "areth-crypto", value: "ML-DSA, FN-DSA, ML-KEM-512/768/1024, encrypted keystores" },
  { key: "areth-primitives", value: "ArethTransaction with PQ auth, EIP-1559, EIP-2718 envelopes" },
  { key: "areth-consensus", value: "HotStuff rounds, leader schedule, safety, slashing evidence" },
  { key: "areth-network", value: "ML-KEM session codec, AEAD framing, role-aware peer manager" },
  { key: "areth-storage", value: "Reth-provider extensions for HotStuff metadata and finality" },
  { key: "areth-node", value: "Validator / full-client launch, pacemaker, proposal builder" },
  { key: "areth-revm", value: "Areth-owned EVM execution surface" },
  { key: "areth-payload", value: "Payload builder with PQ-auth verification" },
  { key: "areth-txpool", value: "Transaction pool tuned for PQ signature sizes" },
];

export const CONSENSUS = {
  intro:
    "A 2-chain Jolteon-style HotStuff path: block-bound and deterministic, never probabilistic. Every consensus message is an ML-DSA signature — no BLS, no aggregation, no back door for pairing-based security.",
  pipeline: ["PROPOSAL", "QC", "COMMIT-VOTE", "COMMIT CERT", "FINALITY"],
  stats: [
    { key: "ML-DSA quorum", value: "⌊2/3⌋ + 1" },
    { key: "Initial round timeout", value: "1.0 s" },
    { key: "Payload wait, then fallback", value: "~750 ms" },
    { key: "Reorgs once finalized", value: "0" },
  ],
  caveat:
    "Honest trade-off: \"0 reorgs\" is a post-finality property — before the commit certificate, pre-finality forks are possible, as in any BFT protocol. And without aggregation each validator vote is a separate ML-DSA signature (~3,309 bytes for ML-DSA-65), so a quorum certificate grows linearly with validator count — unlike a single ~96-byte BLS aggregate. This is a real bandwidth/storage cost at scale, named on purpose.",
};

export const PRIMITIVES = {
  intro:
    "NIST-standardized where it counts — stated precisely, not top-to-bottom marketing.",
  rows: [
    { layer: "Transaction authentication", primitive: "ML-DSA / FN-DSA", status: "single-key or threshold-of-N" },
    { layer: "Validator consensus signatures", primitive: "ML-DSA", status: "no BLS, no aggregation" },
    { layer: "Transport key exchange", primitive: "ML-KEM-768", status: "all node-to-node transport" },
    { layer: "Transport AEAD", primitive: "AES-GCM", status: "replay protection + epoch rekeying" },
    { layer: "Node identity", primitive: "ML-DSA + ML-KEM keys", status: "bound in ArethNodeId" },
  ],
  standards: [
    { name: "ML-KEM-768", fips: "FIPS 203", final: true, note: "All key exchange. Formerly CRYSTALS-Kyber." },
    { name: "ML-DSA-65", fips: "FIPS 204", final: true, note: "Default signature scheme. Formerly CRYSTALS-Dilithium." },
    { name: "FN-DSA-512", fips: "FIPS 206", final: false, note: "Compact signatures. Falcon-based — still a draft standard." },
  ],
};

export const TRANSACTIONS = {
  intro:
    "Same EVM. Different signature. Cleaner surface. A Solidity contract that compiled and ran on Ethereum compiles and runs on Areth — only the signing layer underneath changed.",
  features: [
    { title: "EVM-compatible", body: "Nonce, chain id, gas, EIP-1559 fees, access lists, EIP-2718 envelopes, RLP. Solidity tooling carries over." },
    { title: "PQ-derived sender", body: "Addresses come from keccak(domain ‖ prefixed_key)[12..] — not secp256k1 recovery. Still 20 bytes, still EVM-native." },
    { title: "Threshold accounts", body: "Threshold-of-N is a first-class auth mode. One account, many devices — no contract gymnastics." },
    { title: "No blob theatre", body: "Blob transactions and KZG are rejected at the pool boundary. No data-availability baggage." },
  ],
  sizes: [
    { algo: "ECDSA", sig: "64 B" },
    { algo: "FN-DSA-512 (Falcon)", sig: "~666 B" },
    { algo: "ML-DSA-65", sig: "3,309 B" },
  ],
  sizeNote:
    "PQ signatures are ~10–50× larger than ECDSA — which is exactly why areth-txpool is tuned for PQ signature sizes. Contract-level EVM compatibility is preserved, but transaction economics (calldata, bandwidth, storage) change.",
};

export const PERFORMANCE = {
  headline: "< 1 s",
  headlineLabel: "Deterministic finality on a healthy network",
  stats: [
    { value: "300+", label: "Blocks finalized end-to-end in smoke runs" },
    { value: "4", label: "Validators + full-client topology, verified" },
    { value: "0", label: "Probabilistic confirmations to wait through" },
  ],
  caveat:
    "Honest qualification: a 4-validator smoke run is a code-correctness signal, not a production benchmark. Behaviour at production scale (50+ validators, real geography, ML-DSA quorums without aggregation) is still to be tested. Round timeout is not block interval — finality is gated on real payload-build, proposal, vote-quorum, QC, commit-vote-quorum, and persistence time.",
};

export const EXPANSION = {
  intro:
    "A post-quantum blockchain is not post-quantum protection for everything. The honest move is to ship four independently sellable modules for four different jobs — segmentation that survives due diligence.",
  modules: [
    { id: "M1", name: "Areth Chain (L1)", body: "PQ-EVM network: ML-DSA/FN-DSA tx signatures, ML-KEM-768 transport, HotStuff finality, 20-byte addresses, threshold-of-N, finality-gated RPC.", maturity: "Testnet → mainnet after external audit." },
    { id: "M2", name: "Areth PQ-SDK", body: "The areth-crypto crate productized: ML-DSA, FN-DSA, ML-KEM, keystores, threshold signing — embeddable in other systems. We compete on integration, not uniqueness.", maturity: "Eval-SDK now, after a crate audit." },
    { id: "M3", name: "Anchoring & Notary", body: "PQ-signed proof of time plus hash/attestation anchoring into a finalized block. Data stays off-chain — only the cryptographic commitment is on-chain. The engine of expansion.", maturity: "PoC now; service after mainnet." },
    { id: "M4", name: "PQ Wallet & Identity", body: "Mobile (Secure Enclave / StrongBox) and browser wallet, threshold accounts, a base for DID / verifiable credentials.", maturity: "Beta now." },
  ],
  tiers: [
    { tier: "A", label: "Native fit — blockchain is the product", example: "Digital assets, custody, tokenized RWA, registries, gaming assets" },
    { tier: "B", label: "Integrity layer — anchor hashes, data stays with the client", example: "Legal/notary, code-signing & SBOM transparency, IP & media provenance" },
    { tier: "C", label: "PQC/SDK only — migrate someone else's protocols", example: "PQ-TLS, KMS, VPN, PKI — a competitive field" },
    { tier: "D", label: "Not our fit — real-time / safety-critical", example: "Reactors, avionics, weapons C2, infusion pumps — never sell blockchain here" },
  ],
  driver:
    "Demand is driven by regulatory deadlines with budgets (NIST IR 8547, NSA CNSA 2.0), not by fear marketing.",
};

export const ROADMAP = {
  steps: [
    { phase: "Areth crate development", when: "Q1–Q2 2026", status: "Done" },
    { phase: "Smoke runs — 300+ blocks, 4 validators", when: "Q1 2026", status: "Done (code-correctness signal)" },
    { phase: "Production-scale testing — 50+ validators", when: "—", status: "Upcoming" },
    { phase: "Testnet", when: "June 2026", status: "Launch" },
    { phase: "External crypto / security audit", when: "Before mainnet", status: "Mainnet precondition" },
    { phase: "Mainnet", when: "After testnet + audit", status: "Planned" },
    { phase: "Native CLOB trading", when: "Post-mainnet", status: "R&D / design phase" },
  ],
  wallets: [
    { platform: "iOS & Android", body: "FaceID / fingerprint unlocks a Secure Enclave / StrongBox-isolated worker. The PQ key never leaves cleartext." },
    { platform: "Browser extension", body: "MetaMask-shaped EIP-1193 provider plus a native areth_* surface for PQ signing and order types." },
    { platform: "Hardware path", body: "Paired-mobile QR handoff today; native ML-DSA firmware on Ledger / Trezor when vendors ship it." },
  ],
};

export const PITCH = {
  quote:
    "Areth is what Ethereum's execution stack would look like if you replaced every signature, key exchange, and consensus message with NIST-standardized post-quantum primitives — and bolted it onto HotStuff finality instead of Gasper — without throwing away a decade of Reth engineering.",
  tagline: "EVM where it counts. New cryptography everywhere else.",
  domain: "areth.network",
};
