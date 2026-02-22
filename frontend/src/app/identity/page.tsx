'use client';

import { useState } from 'react';
import { Shield, Fingerprint, CheckCircle2, ArrowRight, ExternalLink, Lock } from 'lucide-react';
import StepIndicator from '@/components/StepIndicator';
import AlertBanner from '@/components/AlertBanner';
import GeoBadge from '@/components/GeoBadge';
import { clsx } from 'clsx';

const STEPS = [
  { label: 'Connect Wallet',   sublabel: 'EVM-compatible' },
  { label: 'Choose Attester',  sublabel: 'Credential source' },
  { label: 'Generate ZK Proof',sublabel: 'In-browser circuit' },
  { label: 'Mint Identity NFT',sublabel: 'Soulbound ERC-721' },
];

const ATTESTERS = [
  { id: 'bank',   name: 'Bank / Fintech',      desc: 'Connects to bank API or UPI statement for financial proofs.',   color: 'bg-bauhaus-blue',   shape: 'square'   as const },
  { id: 'telco',  name: 'Telecom Provider',    desc: 'Region and SIM ownership verification via carrier.',            color: 'bg-bauhaus-red',    shape: 'circle'   as const },
  { id: 'gov',    name: 'Government / eID',    desc: 'National identity document or Aadhaar-style credential.',       color: 'bg-bauhaus-black',  shape: 'triangle' as const },
  { id: 'kyc',    name: 'KYC Provider',        desc: 'Third-party KYC attestation (Synaps, Fractal, etc.).',          color: 'bg-bauhaus-yellow', shape: 'square'   as const },
];

export default function IdentityPage() {
  const [step, setStep]             = useState(0);
  const [wallet, setWallet]         = useState('');
  const [attester, setAttester]     = useState('');
  const [proofState, setProofState] = useState<'idle' | 'generating' | 'done'>('idle');
  const [minting, setMinting]       = useState(false);
  const [minted, setMinted]         = useState(false);

  const connectWallet = async () => {
    // Mock: simulate wallet connect
    await new Promise(r => setTimeout(r, 800));
    setWallet('0x3f2A…8d1C');
    setStep(1);
  };

  const selectAttester = (id: string) => {
    setAttester(id);
    setStep(2);
  };

  const generateProof = async () => {
    setProofState('generating');
    await new Promise(r => setTimeout(r, 2400));
    setProofState('done');
    setStep(3);
  };

  const mintNFT = async () => {
    setMinting(true);
    await new Promise(r => setTimeout(r, 1800));
    setMinting(false);
    setMinted(true);
  };

  return (
    <div className="min-h-screen bg-bauhaus-white">
      {/* Page header */}
      <div className="border-b-3 border-bauhaus-black bg-bauhaus-black text-bauhaus-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-bauhaus-red" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bauhaus-white/50">Step 0 of 1</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Identity<br />Registration</h1>
          </div>
          <div className="flex items-center gap-4">
            <GeoBadge shape="circle"  color="red"    size="lg" />
            <GeoBadge shape="square"  color="yellow" size="md" />
            <GeoBadge shape="triangle" color="blue"  size="md" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: steps + info */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bauhaus-card p-6 mb-6">
              <p className="section-label mb-6">Progress</p>
              <StepIndicator steps={STEPS} current={step} orientation="vertical" />
            </div>

            {/* ZK Info */}
            <div className="bauhaus-card p-6 bg-bauhaus-black text-bauhaus-white">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={14} className="text-bauhaus-yellow" />
                <span className="text-xs font-semibold uppercase tracking-widest text-bauhaus-white/60">Privacy Guarantee</span>
              </div>
              <ul className="space-y-3 text-xs font-mono text-bauhaus-white/70 leading-relaxed">
                {[
                  'Credential never leaves your browser',
                  'ZK proof generated locally (Groth16)',
                  'Nullifier computed from identity secret',
                  'Contract receives proof only — not credential',
                  'Soulbound NFT non-transferable',
                  'One account per human enforced on-chain',
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-bauhaus-yellow flex-shrink-0">→</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: step panels */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* ── STEP 0: Connect Wallet ── */}
            <div className={clsx('bauhaus-card overflow-hidden', step > 0 && 'opacity-60')}>
              <div className="flex items-center justify-between px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray">
                <div className="flex items-center gap-3">
                  <div className={clsx('w-6 h-6 flex items-center justify-center border-3 border-bauhaus-black font-bold text-xs', step >= 1 ? 'bg-bauhaus-black text-bauhaus-white' : 'bg-bauhaus-white')}>
                    {step >= 1 ? '✓' : '1'}
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-widest">Connect Wallet</span>
                </div>
                {wallet && <span className="font-mono text-xs text-bauhaus-black/50">{wallet}</span>}
              </div>
              <div className="p-6">
                {wallet ? (
                  <AlertBanner variant="success" title="Wallet connected" message={`Address: ${wallet}`} />
                ) : (
                  <>
                    <p className="text-sm text-bauhaus-black/60 mb-6 font-mono">
                      Connect an EVM-compatible wallet to begin. Your address will be used to mint your Soulbound Identity NFT.
                    </p>
                    <button onClick={connectWallet} className="btn-primary">
                      <Fingerprint size={16} /> Connect Wallet
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── STEP 1: Choose Attester ── */}
            <div className={clsx('bauhaus-card overflow-hidden', step < 1 && 'opacity-30 pointer-events-none')}>
              <div className="flex items-center gap-3 px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray">
                <div className={clsx('w-6 h-6 flex items-center justify-center border-3 border-bauhaus-black font-bold text-xs', step >= 2 ? 'bg-bauhaus-black text-bauhaus-white' : step === 1 ? 'bg-bauhaus-red text-bauhaus-white' : 'bg-bauhaus-white')}>
                  {step >= 2 ? '✓' : '2'}
                </div>
                <span className="font-semibold text-sm uppercase tracking-widest">Choose Credential Attester</span>
              </div>
              <div className="p-6">
                <p className="text-sm text-bauhaus-black/60 mb-6 font-mono">
                  Select the authoritative source for your identity credential. This attester signs your verifiable credential — you will generate a ZK proof of its validity without revealing the credential itself.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                  {ATTESTERS.map((a, i) => (
                    <button
                      key={a.id}
                      onClick={() => step >= 1 && selectAttester(a.id)}
                      className={clsx(
                        'text-left p-5 border-3 border-bauhaus-black transition-all group',
                        'hover:bg-bauhaus-black hover:text-bauhaus-white',
                        attester === a.id && 'bg-bauhaus-black text-bauhaus-white',
                        i % 2 === 0 && 'border-r-0',
                        i < 2 && 'border-b-0',
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={clsx('w-4 h-4 flex-shrink-0 border-2 border-bauhaus-black group-hover:border-bauhaus-white', a.color,
                          a.shape === 'circle' ? 'rounded-full' : a.shape === 'triangle' ? 'geo-triangle border-0' : ''
                        )} />
                        {attester === a.id && <CheckCircle2 size={14} className="text-bauhaus-yellow" />}
                      </div>
                      <p className="font-bold text-sm uppercase tracking-wide mb-1">{a.name}</p>
                      <p className="text-xs font-mono opacity-50">{a.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── STEP 2: Generate Proof ── */}
            <div className={clsx('bauhaus-card overflow-hidden', step < 2 && 'opacity-30 pointer-events-none')}>
              <div className="flex items-center gap-3 px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray">
                <div className={clsx('w-6 h-6 flex items-center justify-center border-3 border-bauhaus-black font-bold text-xs', step >= 3 ? 'bg-bauhaus-black text-bauhaus-white' : step === 2 ? 'bg-bauhaus-blue text-bauhaus-white' : 'bg-bauhaus-white')}>
                  {step >= 3 ? '✓' : '3'}
                </div>
                <span className="font-semibold text-sm uppercase tracking-widest">Generate ZK Proof</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-bauhaus-black/60 mb-4 font-mono">
                      A Groth16 ZK proof will be computed entirely in your browser. This proves your credential is valid and unique without exposing it.
                    </p>
                    <div className="space-y-2 text-xs font-mono">
                      {[
                        ['Circuit',    'IdentityProof.circom'],
                        ['Scheme',     'Groth16 (BN128)'],
                        ['Nullifier',  'Hash(identity_secret)'],
                        ['Constraint', '~14,000 R1CS constraints'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-2 border-b border-bauhaus-black/10">
                          <span className="text-bauhaus-black/40 uppercase">{k}</span>
                          <span className="font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Proof visualiser */}
                  <div className="bauhaus-card bg-bauhaus-black text-bauhaus-white p-4 font-mono text-xs">
                    <div className="text-bauhaus-white/40 mb-3 uppercase tracking-widest text-[10px]">Proof Output</div>
                    {proofState === 'idle' && (
                      <span className="text-bauhaus-white/20">Awaiting generation…</span>
                    )}
                    {proofState === 'generating' && (
                      <div className="space-y-1.5">
                        <div className="flex gap-2 items-center">
                          <div className="w-2 h-2 bg-bauhaus-yellow animate-pulse" />
                          <span className="text-bauhaus-yellow">Computing witness…</span>
                        </div>
                        <div className="flex gap-2 items-center opacity-50">
                          <div className="w-2 h-2 bg-bauhaus-white/20" />
                          <span>Running Groth16 prover…</span>
                        </div>
                      </div>
                    )}
                    {proofState === 'done' && (
                      <div className="space-y-1">
                        {['π_a: ["0x1c3d…", "0xae82…"]', 'π_b: [["0x72f1…"], …]', 'π_c: ["0xb540…", "0x09f3…"]', 'publicSignals: ["0x00…nullifier"]'].map(l => (
                          <div key={l} className="text-bauhaus-white/60 text-[10px]">{l}</div>
                        ))}
                        <div className="mt-2 text-bauhaus-yellow font-semibold">✓ Proof valid (254ms)</div>
                      </div>
                    )}
                  </div>
                </div>

                {proofState !== 'done' ? (
                  <button
                    onClick={() => step >= 2 && generateProof()}
                    disabled={proofState === 'generating'}
                    className={clsx('btn-blue', proofState === 'generating' && 'opacity-50 cursor-wait')}
                  >
                    <Shield size={16} />
                    {proofState === 'generating' ? 'Generating…' : 'Generate Proof'}
                  </button>
                ) : (
                  <AlertBanner variant="success" title="ZK Proof generated successfully" message="Identity proof + nullifier computed. Ready to submit to contract." />
                )}
              </div>
            </div>

            {/* ── STEP 3: Mint NFT ── */}
            <div className={clsx('bauhaus-card overflow-hidden', step < 3 && 'opacity-30 pointer-events-none')}>
              <div className="flex items-center gap-3 px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray">
                <div className={clsx('w-6 h-6 flex items-center justify-center border-3 border-bauhaus-black font-bold text-xs', minted ? 'bg-bauhaus-black text-bauhaus-white' : step === 3 ? 'bg-bauhaus-yellow text-bauhaus-black' : 'bg-bauhaus-white')}>
                  {minted ? '✓' : '4'}
                </div>
                <span className="font-semibold text-sm uppercase tracking-widest">Mint Soulbound Identity NFT</span>
              </div>

              {minted ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* NFT Card */}
                    <div className="bauhaus-card p-0 overflow-hidden bg-bauhaus-black text-bauhaus-white">
                      {/* NFT Art: Bauhaus pattern */}
                      <div className="relative w-full aspect-square bg-bauhaus-black flex items-center justify-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-bauhaus-red opacity-90" />
                        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-bauhaus-blue" />
                        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-bauhaus-yellow" />
                        <div className="relative z-10 w-24 h-24 rounded-full bg-bauhaus-white border-3 border-bauhaus-black flex items-center justify-center">
                          <span className="font-bold text-2xl text-bauhaus-black">#1</span>
                        </div>
                      </div>
                      <div className="px-4 py-3 border-t-3 border-bauhaus-black">
                        <p className="font-bold text-sm uppercase tracking-widest">SCOURGE IDENTITY #1</p>
                        <p className="text-bauhaus-white/40 font-mono text-xs mt-0.5">Soulbound · Non-transferable</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <AlertBanner variant="success" title="Identity NFT minted!" message="Token #1 issued to 0x3f2A…8d1C" />
                      <div className="space-y-2 text-xs font-mono">
                        {[
                          ['Token ID',   '#1'],
                          ['Contract',   'IdentityNFT.sol'],
                          ['Standard',   'ERC-721 (non-transferable)'],
                          ['Nullifier',  '0x7a3f…b91c (stored)'],
                          ['Attester',   ATTESTERS.find(a => a.id === attester)?.name ?? '—'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between py-2 border-b border-bauhaus-black/10">
                            <span className="text-bauhaus-black/40 uppercase">{k}</span>
                            <span className="font-semibold">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <a href="#" className="btn-outline text-xs py-2 px-3">
                          <ExternalLink size={12} /> View on Explorer
                        </a>
                        <a href="/marketplace" className="btn-primary text-xs py-2 px-3">
                          Browse Campaigns <ArrowRight size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <p className="text-sm text-bauhaus-black/60 mb-6 font-mono">
                    Submit your ZK proof to the IdentityRegistry contract. A non-transferable Soulbound NFT will be minted to your address. This NFT is required for all campaign participation.
                  </p>
                  <AlertBanner
                    variant="info"
                    title="On-chain transaction required"
                    message="IdentityRegistry.sol → verifyIdentityProof() → mintIdentityNFT()"
                    className="mb-6"
                  />
                  <button
                    onClick={() => step >= 3 && mintNFT()}
                    disabled={minting}
                    className={clsx('btn-yellow', minting && 'opacity-50 cursor-wait')}
                  >
                    <Fingerprint size={16} />
                    {minting ? 'Minting…' : 'Mint Identity NFT'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
