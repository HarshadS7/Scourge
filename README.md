<div align="center">

<!-- Logo / Hero -->
<img src="https://img.shields.io/badge/■-D62828?style=for-the-badge" height="20"/>
<img src="https://img.shields.io/badge/●-1A3AFF?style=for-the-badge" height="20"/>
<img src="https://img.shields.io/badge/▲-F7B731?style=for-the-badge" height="20"/>

# ⬛ SCOURGE

### Privacy-First Data Marketplace on Monad

*Monetize real behavioral data with zero-knowledge proofs.*
*Companies get verified attributes. You keep your privacy.*

<br/>

[![Built on Monad](https://img.shields.io/badge/Built%20on-Monad-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)](https://monad.xyz)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![ZK Proofs](https://img.shields.io/badge/ZK-Groth16-1A3AFF?style=for-the-badge)](https://docs.circom.io)

<br/>

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   YOUR DATA.  YOUR TERMS.  YOUR MONEY.                   │
│                                                          │
│   ■ ZK-Verified    ● Non-Custodial    ▲ Atomic Escrow   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

</div>

---

<br/>

## 🔴 What is SCOURGE?

**SCOURGE** is a decentralized data marketplace where individuals sell verified behavioral data — bank statements, UPI spend, fitness metrics, telecom usage — to companies, **without ever exposing raw information**.

Users prove data attributes through **Groth16 zero-knowledge proofs**. Companies post campaigns specifying what they need. Payments are **fully automated** through on-chain escrow — no middlemen, no manual approval, no trust required.

<br/>

<div align="center">

```
  ┌─────────────┐          ┌──────────────┐          ┌──────────────┐
  │             │          │              │          │              │
  │    USER     │───ZK───▶│   ON-CHAIN   │◀──ETH───│   COMPANY    │
  │             │  Proof   │   VERIFIER   │  Escrow  │              │
  └─────────────┘          └──────┬───────┘          └──────────────┘
                                  │
                           ┌──────▼───────┐
                           │              │
                           │  AUTO-PAYOUT │
                           │   (Escrow)   │
                           │              │
                           └──────────────┘
```

</div>

<br/>

## 🟡 How It Works

<table>
<tr>
<td width="60" align="center"><h3>01</h3></td>
<td><b>Register Identity</b><br/>ZK proof + attested credential → Soulbound NFT minted. One human = one account.</td>
</tr>
<tr>
<td align="center"><h3>02</h3></td>
<td><b>Browse Campaigns</b><br/>Companies post data requests with attribute requirements + budget locked in escrow.</td>
</tr>
<tr>
<td align="center"><h3>03</h3></td>
<td><b>Collect & Prove</b><br/>Verified data from trusted sources. Circom circuits generate identity + constraint proofs locally.</td>
</tr>
<tr>
<td align="center"><h3>04</h3></td>
<td><b>Submit & Earn</b><br/>Proofs verified on-chain → escrow released instantly. No approval gate. No middleman.</td>
</tr>
</table>

<br/>

## 🔵 Architecture

```
scourge/
├── contracts/               # Solidity smart contracts (Foundry)
│   ├── src/
│   │   ├── CampaignManager.sol      # Campaign creation & management
│   │   ├── Escrow.sol               # Atomic escrow with auto-release
│   │   ├── IdentityNFT.sol          # Soulbound ERC-721 identity tokens
│   │   ├── IdentityRegistry.sol     # ZK-verified identity registry
│   │   ├── SubmissionVerifier.sol   # Groth16 proof verification
│   │   └── MockGroth16Verifier.sol  # Test verifier
│   ├── circuits/
│   │   ├── identityProof.circom         # Identity ZK circuit
│   │   └── campaignSubmissionProof.circom  # Submission ZK circuit
│   ├── test/                # Foundry tests
│   └── script/              # Deploy & interaction scripts
│
├── frontend/                # Next.js 14 + Tailwind CSS
│   └── src/
│       ├── app/             # App router pages
│       │   ├── marketplace/     # Campaign browsing
│       │   ├── dashboard/       # User earnings & submissions
│       │   ├── company/         # Company portal & campaign posting
│       │   ├── identity/        # Identity registration
│       │   ├── submit/          # Data submission flow
│       │   └── create-campaign/ # Campaign creation wizard
│       ├── components/      # Reusable UI components
│       └── lib/             # Contract ABIs, addresses, utilities
│
└── backend/                 # Backend services (planned)
```

<br/>

## ⬛ Smart Contracts

<div align="center">

| Contract | Description | Key Functions |
|:---|:---|:---|
| **`CampaignManager`** | Campaign lifecycle management | `createCampaign()` · `getCampaign()` · `isCampaignActive()` |
| **`Escrow`** | Trustless payment escrow | `deposit()` · `release()` · `getRemainingBudget()` |
| **`IdentityNFT`** | Soulbound ERC-721 tokens | `mint()` — non-transferable identity |
| **`IdentityRegistry`** | ZK identity verification | `registerIdentity()` · `hasVerifiedIdentity()` |
| **`SubmissionVerifier`** | Groth16 proof validation | `submitProof()` — verify & trigger payout |

</div>

### Contract Flow

```
Company                          User                           Contracts
   │                               │                               │
   │──── createCampaign() ────────▶│                               │
   │     + lock ETH in escrow      │                               │
   │                               │                               │
   │                               │◀── browse campaigns ──────────│
   │                               │                               │
   │                               │── generate ZK proof locally ──│
   │                               │                               │
   │                               │──── submitProof() ───────────▶│
   │                               │                               │── verify Groth16
   │                               │                               │── release escrow
   │                               │◀──── ETH auto-payout ────────│
   │                               │                               │
```

<br/>

## 🟡 Frontend

The UI follows a **Bauhaus-inspired design system** — bold geometry, primary colors (🔴 red · 🔵 blue · 🟡 yellow · ⬛ black), and strong typographic hierarchy.

### Pages

| Route | Description |
|:---|:---|
| `/` | Landing page with project overview and stats |
| `/marketplace` | Browse active data campaigns with filters & search |
| `/dashboard` | User earnings, submission history, identity NFT |
| `/company` | Company portal — manage campaigns, post new ones |
| `/identity` | Identity registration with ZK proof |
| `/submit` | Data submission flow with proof generation |
| `/create-campaign` | Campaign creation wizard for companies |

### Dual-Role System

The platform supports **two user roles** with seamless switching:

- **Customer (Data Provider)** — Browse campaigns, submit data, earn crypto
- **Company (Data Buyer)** — Post campaigns, fund escrow, receive verified attributes

A persistent **role toggle** in the navbar lets users switch between `Login as Company` ↔ `Login as Customer`.

<br/>

## 🔴 Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| **Blockchain** | Monad (EVM-compatible L1) |
| **Smart Contracts** | Solidity ^0.8.24 · Foundry |
| **ZK Proofs** | Circom · Groth16 · SnarkJS |
| **Frontend** | Next.js 14 · React 18 · TypeScript |
| **Styling** | Tailwind CSS · Custom Bauhaus design system |
| **Storage** | Filecoin / IPFS (encrypted metadata) |
| **Wallet** | RainbowKit · wagmi · viem |

</div>

<br/>

## 🔵 Getting Started

### Prerequisites

- Node.js ≥ 18
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for contracts)
- Git

### Contracts

```bash
cd contracts
forge install
forge build
forge test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy Contracts (Monad Testnet)

```bash
cd contracts
cp .env.example .env   # Add your private key & RPC URL
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

<br/>

## ⬛ Privacy Guarantees

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ✓  No raw data stored on-chain — only ZK proofs              │
│  ✓  All proofs computed locally on the user's device           │
│  ✓  Credentials never exposed to companies or contracts        │
│  ✓  Nullifier system prevents sybil/duplicate submissions      │
│  ✓  Encrypted data on IPFS — decryption key released           │
│     atomically through escrow only on verified proof            │
│  ✓  Soulbound NFT — non-transferable, one per human           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

<br/>

## 🟡 Categories

`Privacy` · `ZK` · `Data Marketplace` · `DePIN` · `Identity` · `Soulbound` · `DeFi (Escrow)`

<br/>

---

<div align="center">

**Built for [Monad Blitz Mumbai](https://monad.xyz)**

<img src="https://img.shields.io/badge/■-D62828?style=flat-square" height="12"/>
<img src="https://img.shields.io/badge/●-1A3AFF?style=flat-square" height="12"/>
<img src="https://img.shields.io/badge/▲-F7B731?style=flat-square" height="12"/>

*Your data. Your terms. Your money.*

</div>