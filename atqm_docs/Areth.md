# ARETH

**A post-quantum L1 for the world after secp256k1.**
*EVM where it counts. New cryptography everywhere else.*

`ML-DSA · ML-KEM · HotStuff`

---

## Table of contents

1. [The problem](#1-the-problem)
2. [Introducing Areth](#2-introducing-areth)
3. [The substrate — kept vs replaced](#3-the-substrate--kept-vs-replaced)
4. [Architecture — three roles, one transport](#4-architecture--three-roles-one-transport)
5. [Engineering scope — the `areth-*` crate map](#5-engineering-scope--the-areth--crate-map)
6. [Consensus — HotStuff finality, signed in ML-DSA](#6-consensus--hotstuff-finality-signed-in-ml-dsa)
7. [Post-quantum primitives](#7-post-quantum-primitives)
8. [Transaction model](#8-transaction-model)
9. [Performance](#9-performance)
10. [Capabilities — what ships today](#10-capabilities--what-ships-today)
11. [Roadmap — on-chain trading](#11-roadmap--on-chain-trading)
12. [Trading stack](#12-trading-stack)
13. [Post-quantum wallets](#13-post-quantum-wallets)
14. [Why this is a UX upgrade](#14-why-this-is-a-ux-upgrade)
15. [The pitch](#15-the-pitch)
16. [Appendix — quick reference](#16-appendix--quick-reference)

---

## 1. The problem

### secp256k1 and BLS are no longer safe assumptions.

Every major chain stakes its security on elliptic-curve cryptography that a sufficiently capable quantum adversary breaks. The fix isn't a patch on a live network — it's a network designed around the new primitives from day one.

**Harvest-now, decrypt-later.** Adversaries archive today's signatures and ciphertext, waiting for the day curve-DLP falls. Anything signed under ECDSA or wrapped under X25519 today is on the clock.

**Validator BLS is fragile.** Aggregated BLS quorums collapse the moment pairing-based assumptions stop holding. A chain whose finality depends on BLS aggregation has no graceful failure mode.

**Migration ≠ retrofit.** Bolting PQ onto secp256k1 chains breaks address schemes, finality, and a decade of tooling. The "soft upgrade" path is a fiction. PQ has to be the network from genesis.

---

## 2. Introducing Areth

### A post-quantum L1 built on battle-tested plumbing.

Areth is a fork-descendant of Reth — but it is not Reth with PQ patches. We kept Reth's mature execution, storage, trie, txpool, and node-runtime. We replaced every Ethereum protocol surface — consensus, validator transport, transaction auth, RPC, sync, finality — with PQ-secure equivalents.

### Three pillars

- **Quantum-safe by construction.** Every signature, key exchange, and consensus message uses NIST-standardized PQ primitives.
- **EVM where it counts.** Solidity, tooling, audit lineage, and 20-byte addresses all carry over unchanged.
- **HotStuff finality, not Gasper.** Sub-second deterministic finality. No reorgs, no proposer-boost games, no waiting.

---

## 3. The substrate — kept vs replaced

> We don't reinvent storage, the EVM, or the trie. We reinvent every place where Ethereum's cryptographic assumptions live.

| Kept (from Reth) | Replaced (PQ-secure equivalent) |
|---|---|
| MDBX storage provider | Consensus (Gasper → HotStuff) |
| Merkle-Patricia trie | Validator transport (devp2p → PQ session) |
| REVM execution engine | Transaction auth (ECDSA → ML-DSA / FN-DSA) |
| Transaction pool & fetcher | Node identity (ENR → ArethNodeId) |
| Payload builder | Key exchange (X25519 → ML-KEM-768) |
| Snap-style state sync | RPC surface (`eth_*` → `areth_*`) |
| Node runtime & RPC server | Finality (probabilistic → block-bound) |

The dividing line is simple: anything whose security reduces to an elliptic-curve or pairing assumption was replaced. Anything else — the parts that make Reth fast and correct — stayed.

---

## 4. Architecture — three roles, one transport

### Three roles. One PQ secure-session transport.

> Every node speaks the same encrypted, ML-KEM-derived transport. What changes is the cargo.

- **Discovery.** ANR records and peer discovery — no validator state, no execution data.
- **Public execution.** Finalized block sync, transaction gossip, snap-style state distribution.
- **Validator.** HotStuff proposals, votes, QCs, commits, and finality certificates.

### PQ secure-session transport plane

```
ML-KEM-768  +  AES-GCM  +  ML-DSA transcript binding
```

Every connection between nodes runs over the same encrypted session. ML-KEM-768 derives the session key, AES-GCM provides AEAD with replay protection and epoch rekeying, and ML-DSA signatures bind the handshake transcript so a downgrade attack can't smuggle in a weaker primitive.

---

## 5. Engineering scope — the `areth-*` crate map

| Crate | Responsibility |
|---|---|
| `areth-crypto` | ML-DSA, FN-DSA, ML-KEM-512/768/1024, encrypted keystores |
| `areth-primitives` | `ArethTransaction` with PQ auth, EIP-1559, EIP-2718 envelopes |
| `areth-consensus` | HotStuff rounds, leader schedule, safety, slashing evidence |
| `areth-network` | ML-KEM session codec, AEAD framing, role-aware peer manager |
| `areth-storage` | Reth-provider extensions for HotStuff metadata and finality |
| `areth-node` | Validator/full-client launch, pacemaker, proposal builder |
| `areth-revm` | Areth-owned EVM execution surface |
| `areth-payload` | Payload builder with PQ-auth verification |
| `areth-txpool` | Transaction pool tuned for PQ signature sizes |

Each crate is a focused replacement of one Ethereum protocol surface, with Reth's runtime and storage doing the heavy lifting underneath.

---

## 6. Consensus — HotStuff finality, signed in ML-DSA

A 2-chain Jolteon-style HotStuff path — proposal, QC, commit-vote, commit certificate, finality. Block-bound and deterministic, never probabilistic.

```
PROPOSAL  →  QC  →  COMMIT-VOTE  →  COMMIT CERT  →  FINALITY
```

| Stat | Value |
|---|---|
| ML-DSA quorum | `⌊2/3⌋ + 1` |
| Initial round timeout | 1.0 s |
| Payload wait, then fallback | ~750 ms |
| Reorgs once finalized | 0 |

Every consensus message is an ML-DSA signature — there is no BLS, no aggregation, and no place in the protocol where pairing-based security re-enters through a back door. The pacemaker handles network stalls by extending timeouts, but only when the network is genuinely stalled — never as a normal pacing tax.

---

## 7. Post-quantum primitives

> NIST-standardized, top to bottom.

| Layer | Primitive |
|---|---|
| Transaction authentication | ML-DSA / FN-DSA — single-key or threshold-of-N |
| Validator consensus signatures | ML-DSA — no BLS, no aggregation |
| Transport key exchange | ML-KEM-768 |
| Transport AEAD | AES-GCM with replay protection and epoch rekeying |
| Node identity | ML-DSA node key + ML-KEM transport key, bound in `ArethNodeId` |

*Threshold accounts are first-class today — positional verification now, bitmap and script policies on the roadmap.*

### Defaults

- **ML-DSA-65** is the default signature scheme.
- **FN-DSA-512** is available for compact signatures.
- **ML-KEM-768** for all transport key exchange; ML-KEM-512 and ML-KEM-1024 are also available in `areth-crypto` for callers that need a different security level.

---

## 8. Transaction model

### Same EVM. Different signature. Cleaner surface.

- **EVM-compatible.** Nonce, chain id, gas, EIP-1559 fees, access lists, EIP-2718 envelopes, RLP encoding. Solidity tooling carries over.
- **PQ-derived sender.** Addresses come from `keccak(domain || prefixed_key)[12..]` — not secp256k1 recovery. Still 20 bytes, still EVM-native.
- **Threshold accounts.** Threshold-of-N is a first-class auth mode. One account, many devices — no contract gymnastics required.
- **No blob theatre.** Blob transactions and KZG are rejected at the pool boundary. We don't carry data-availability baggage we never agreed to.

The deliberate consequence: a Solidity contract that compiled and ran on Ethereum, compiles and runs on Areth. The address surface is identical to wallets and explorers — the signing layer underneath is the only thing that changed.

---

## 9. Performance

### How fast is finalized?

**< 1 s** — deterministic finality on a healthy network.

| | |
|---|---|
| 300+ | blocks finalized end-to-end in smoke runs |
| 4 | validators + full-client topology, verified |
| 0 | probabilistic confirmations to wait through |

### The fair comparison

Round timeout is not block interval. Finality is gated on real network and execution time: payload build, proposal, vote quorum, QC, commit-vote quorum, and persistence.

The pacemaker backs off to 30 s only when the network is genuinely stalled — never as a normal pacing tax. In steady state, the path from a submitted transaction to a finalized block is bounded by the time it takes to gather a `⌊2/3⌋ + 1` ML-DSA quorum and persist the commit certificate.

---

## 10. Capabilities — what ships today

- **EVM smart contracts.** Solidity tooling and audit lineage carry over from day one.
- **PQ wallets, single or threshold.** Single-key, threshold-of-N, encrypted keystore — all first-class.
- **Snap-style state sync.** `areth/snap/1` fast onboarding from a trusted finalized checkpoint.
- **Finality-gated RPC.** Public clients only serve state proven by a HotStuff finality bundle.
- **Delegated staking.** BSC-inspired economics: commission, unbonding, rewards, slashing exposure.
- **PQ-signed slashing.** Double-vote and double-commit-vote evidence with ML-DSA signatures.

---

## 11. Roadmap — on-chain trading

### From PQ L1 to on-chain Hyperliquid.

> Hyperliquid proved that the bottleneck on on-chain trading isn't VMs — it's **finality, fairness, and a sequencer you have to trust**. Areth dissolves all three.

- **Sub-second finality.** Filled orders are filled. No 12-block waits, no reorg risk, no optimistic-head confusion.
- **Validators ARE the sequencer set.** Round-leader fan-out. Censorship-resistant via timeout certificates. Slashable for safety violations.
- **PQ all the way down.** Validator-signed oracles. PQ-signed market data. Verifiable trade tickets from wire to fill.

The conventional on-chain DEX story trades correctness for latency by offloading sequencing to a single party. Areth's HotStuff round leadership and PQ message signing make that trade unnecessary — every order is signed, every match is finalized in the block that produced it.

---

## 12. Trading stack

### A native CLOB, not a contract straining at gas.

| Layer | Shape | Built on |
|---|---|---|
| Matching engine | Native precompile. Price-time-priority CLOB per market. | `areth-revm` |
| Order transactions | EIP-2718 envelope for orders. PQ-signed end-to-end. | `ARETH_TX_ORDER_PQ_TYPE` |
| Markets | Perps, spot, dated futures. Validator-signed oracle quorum. | HotStuff quorum |
| Risk engine | Cross/isolated margin, ADL, insurance fund. Solidity-readable. | `areth-storage` |
| Settlement | Trades settle in the same finalized block that matched them. | Block-bound finality |

Orders are first-class transactions, not method calls on a heavy contract. The matching engine lives as a precompile inside `areth-revm`, which means it runs at native speed but every fill is still a tx-level, auditable event that Solidity contracts can read.

---

## 13. Post-quantum wallets

### Post-quantum wallets that feel like consumer apps.

A PQ L1 only matters if a normal user can hold and sign on one. Three surfaces, one cryptographic core.

- **iOS & Android.** FaceID / fingerprint unlocks a Secure Enclave / StrongBox-isolated worker. The PQ key never leaves cleartext.
- **Browser extension.** MetaMask-shaped EIP-1193 provider plus a native `areth_*` surface for PQ signing and order types.
- **Hardware path.** Paired-mobile QR handoff today; native ML-DSA firmware on Ledger / Trezor when vendors ship it.

### Cryptographic core

ML-DSA-65 default. FN-DSA-512 for compact signatures. Threshold-of-N is first-class. Addresses are still 20 bytes — same UX everywhere.

---

## 14. Why this is a UX upgrade

### Not a PQ patch — a new consumer experience.

```
✓  Filled · finalized in 1.2 s        not "pending… 12 confirmations"
```

**01 — Confirmations feel like a payment app.** HotStuff finality plus finality-gated RPC removes the "is it confirmed yet?" anxiety entirely.

**02 — Same address everywhere.** Wallet, dApp, trading UI, explorer — all key off one 20-byte address. No "Areth vs. Ethereum" mental tax.

**03 — Quantum-safe from day one.** There is no "we'll migrate later." The migration is the network.

---

## 15. The pitch

> Areth is what Ethereum's execution stack would look like
> if you replaced every signature, key exchange, and consensus message
> **with NIST-standardized post-quantum primitives —**
> and bolted it onto HotStuff finality instead of Gasper —
> **without throwing away a decade of Reth engineering.**

*EVM where it counts. New cryptography everywhere else.*

`areth.network`

---

## 16. Appendix — quick reference

### Cryptographic primitives at a glance

| Use | Algorithm | Notes |
|---|---|---|
| Tx auth | ML-DSA / FN-DSA | Single-key or threshold-of-N |
| Validator sigs | ML-DSA | No BLS, no aggregation |
| Key exchange | ML-KEM-768 | All node-to-node transport |
| AEAD | AES-GCM | Replay protection + epoch rekeying |
| Address derivation | `keccak(domain ‖ prefixed_key)[12..]` | 20-byte, EVM-native |
| Node identity | ML-DSA node key + ML-KEM transport key | Bound in `ArethNodeId` |

### Consensus timing reference

| Parameter | Value |
|---|---|
| Quorum | `⌊2/3⌋ + 1` ML-DSA sigs |
| Initial round timeout | 1.0 s |
| Payload wait | ~750 ms |
| Pacemaker max backoff | 30 s (stall only) |
| Finality kind | Block-bound, deterministic |
| Reorgs after finality | 0 |

### What we don't carry from Ethereum

- Probabilistic finality
- Gasper / LMD-GHOST
- secp256k1 transaction auth
- ECDSA address recovery
- BLS validator aggregation
- ENR identity records
- devp2p transport
- X25519 key exchange
- `eth_*` RPC namespace (replaced by `areth_*`)
- Blob transactions / KZG

### What we kept from Reth

- MDBX storage provider
- Merkle-Patricia trie
- REVM execution engine
- Transaction pool & fetcher
- Payload builder
- Snap-style state sync
- Node runtime & RPC server

### Crate map at a glance

```
areth-crypto        ML-DSA, FN-DSA, ML-KEM-{512,768,1024}, keystores
areth-primitives    ArethTransaction (PQ auth), EIP-1559, EIP-2718
areth-consensus     HotStuff rounds, leader schedule, slashing
areth-network       ML-KEM session codec, AEAD, peer manager
areth-storage       Reth-provider extensions, HotStuff metadata
areth-node          Validator/full-client launch, pacemaker
areth-revm          Areth-owned EVM execution surface
areth-payload       Payload builder + PQ-auth verification
areth-txpool        Tx pool tuned for PQ signature sizes
```

### Trading stack at a glance

```
Matching engine     Native precompile, price-time-priority CLOB
Order transactions  EIP-2718 envelope, PQ-signed end-to-end
Markets             Perps, spot, dated futures, validator oracle
Risk engine         Cross/isolated margin, ADL, insurance fund
Settlement          Same finalized block as the match
```

### Wallets

```
iOS / Android       Secure Enclave / StrongBox worker, biometric unlock
Browser extension   EIP-1193 + native areth_* surface
Hardware            Paired-mobile QR today, native ML-DSA firmware later
```

---

**ARETH · POST-QUANTUM L1 · 2026**
`areth.network`
