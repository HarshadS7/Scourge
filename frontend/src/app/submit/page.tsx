'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Upload, Shield, Database, Zap, CheckCircle2,
  AlertTriangle, Clock, Lock, ArrowRight,
} from 'lucide-react';
import StepIndicator from '@/components/StepIndicator';
import AlertBanner from '@/components/AlertBanner';
import GeoBadge from '@/components/GeoBadge';
import { clsx } from 'clsx';

type Phase = 'collect' | 'encrypt' | 'prove' | 'submit' | 'complete';

const STEPS = [
  { label: 'Collect Data',        sublabel: 'Pull from sources'         },
  { label: 'Encrypt + Upload',    sublabel: 'IPFS encrypted blob'       },
  { label: 'Generate Proofs',     sublabel: 'ZK circuit execution'      },
  { label: 'Submit On-Chain',     sublabel: 'Contract verification'     },
  { label: 'Escrow Released',     sublabel: 'Payment received'          },
];

const PHASE_INDEX: Record<Phase, number> = {
  collect: 0, encrypt: 1, prove: 2, submit: 3, complete: 4,
};

const CAMPAIGN = {
  id: 'c1',
  company: 'AxisBank Analytics',
  title: 'Monthly UPI Spend — Urban India Users',
  attributes: [
    { key: 'age_range',   label: 'Age Range',      constraint: '18–65',    source: 'Bank KYC'  },
    { key: 'region',      label: 'Region',         constraint: 'IN-MH, IN-DL, IN-KA', source: 'Telco SIM' },
    { key: 'upi_spend',   label: 'Monthly UPI Spend', constraint: '> ₹5,000', source: 'UPI Logs'  },
  ],
  duration: '30 days',
  price: '0.045 ETH',
  deadline: 'Mar 15, 2026',
};

function SubmitContent() {
  const params   = useSearchParams();
  const _id      = params.get('campaign') ?? CAMPAIGN.id;
  const [phase, setPhase] = useState<Phase>('collect');
  const [logs, setLogs] = useState<string[]>([]);
  const [dataReady, setDataReady]   = useState(false);
  const [ipfsCid, setIpfsCid]       = useState('');
  const [proofReady, setProofReady] = useState(false);
  const [txHash, setTxHash]         = useState('');

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const collectData = async () => {
    addLog('Connecting to UPI API…');
    await sleep(600);
    addLog('Fetching 30-day transaction logs…');
    await sleep(700);
    addLog('Fetching Bank KYC credential…');
    await sleep(500);
    addLog('Verifying telco SIM region claim…');
    await sleep(600);
    addLog('All data sources verified ✓');
    setDataReady(true);
    setPhase('encrypt');
  };

  const encryptAndUpload = async () => {
    addLog('Encrypting dataset with AES-256-GCM…');
    await sleep(700);
    addLog('Uploading encrypted blob to IPFS…');
    await sleep(900);
    const cid = 'bafybeig3kz7…c9f1e2';
    setIpfsCid(cid);
    addLog(`IPFS CID: ${cid} ✓`);
    addLog('Hash commitment computed for on-chain storage');
    setPhase('prove');
  };

  const generateProofs = async () => {
    addLog('Building identity witness…');
    await sleep(500);
    addLog('Running IdentityProof.circom (Groth16)…');
    await sleep(900);
    addLog('Building data constraint witness…');
    await sleep(700);
    addLog('Running DataConstraint.circom (range + region)…');
    await sleep(1000);
    addLog('Generating campaign nullifier: hash(secret + campaign_id)…');
    await sleep(400);
    addLog('All proofs valid ✓');
    setProofReady(true);
    setPhase('submit');
  };

  const submitOnChain = async () => {
    addLog('Submitting proofs + CID + nullifier to SubmissionVerifier.sol…');
    await sleep(800);
    addLog('Contract: verifying identity proof…');
    await sleep(600);
    addLog('Contract: nullifier unused ✓');
    await sleep(400);
    addLog('Contract: verifying data constraint proof…');
    await sleep(700);
    addLog('Contract: budget available ✓');
    await sleep(300);
    addLog('Contract: marking nullifier used');
    await sleep(400);
    addLog('Contract: releasing escrow → 0.045 ETH');
    await sleep(500);
    addLog('Decryption key emitted in event (atomic)');
    await sleep(400);
    const tx = '0xabcd…ef91';
    setTxHash(tx);
    addLog(`Tx confirmed: ${tx} ✓`);
    setPhase('complete');
  };

  const currentStep = PHASE_INDEX[phase];

  return (
    <div className="min-h-screen bg-bauhaus-white">
      {/* Header */}
      <div className="border-b-3 border-bauhaus-black bg-bauhaus-red text-bauhaus-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-bauhaus-white/40" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bauhaus-white/60">Submit Data</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">{CAMPAIGN.title}</h1>
            <p className="mt-1 font-mono text-bauhaus-white/60 text-sm">{CAMPAIGN.company}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-4xl font-bold">{CAMPAIGN.price}</p>
            <p className="font-mono text-bauhaus-white/50 text-xs uppercase tracking-widest">per valid submission</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Progress */}
            <div className="bauhaus-card p-6">
              <p className="section-label mb-6">Submission Steps</p>
              <StepIndicator steps={STEPS} current={currentStep} orientation="vertical" />
            </div>

            {/* Campaign details */}
            <div className="bauhaus-card p-6">
              <p className="section-label mb-4">Required Attributes</p>
              <div className="space-y-3">
                {CAMPAIGN.attributes.map((attr) => (
                  <div key={attr.key} className="border-3 border-bauhaus-black p-3">
                    <p className="font-bold text-xs uppercase tracking-widest">{attr.label}</p>
                    <p className="font-mono text-xs text-bauhaus-black/50 mt-1">{attr.constraint}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-1.5 h-1.5 bg-bauhaus-blue" />
                      <span className="text-[10px] font-mono text-bauhaus-black/40">{attr.source}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t-3 border-bauhaus-black space-y-2 text-xs font-mono">
                {[
                  ['Duration',  CAMPAIGN.duration],
                  ['Deadline',  CAMPAIGN.deadline],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-bauhaus-black/40 uppercase">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow protection */}
            <div className="bauhaus-card p-6 bg-bauhaus-black text-bauhaus-white">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={14} className="text-bauhaus-yellow" />
                <span className="text-xs font-semibold uppercase tracking-widest text-bauhaus-white/60">Atomic Guarantee</span>
              </div>
              <ul className="space-y-2 text-xs font-mono text-bauhaus-white/60">
                {[
                  'Escrow locked before any viewing',
                  'Decrypt key released atomically with payment',
                  'Company cannot refuse after valid proof',
                  'No manual approval stage',
                ].map(t => (
                  <li key={t} className="flex gap-2">
                    <span className="text-bauhaus-red flex-shrink-0">■</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main panel */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* ── Phase: Collect Data ── */}
            <PhasePanel
              idx={0}
              current={currentStep}
              icon={Database}
              title="Collect & Verify Data"
              accentColor="blue"
            >
              {currentStep === 0 && (
                <>
                  <p className="text-sm text-bauhaus-black/60 mb-6 font-mono">
                    Pull verified data from authoritative sources. You cannot self-type values. All data is collected locally — nothing sent to servers yet.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 mb-6">
                    {CAMPAIGN.attributes.map((attr, i) => (
                      <div
                        key={attr.key}
                        className={clsx(
                          'border-3 border-bauhaus-black p-4',
                          i < CAMPAIGN.attributes.length - 1 && 'border-r-0',
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-bauhaus-blue border-2 border-bauhaus-black" />
                          <span className="text-[10px] font-mono text-bauhaus-black/50 uppercase">{attr.source}</span>
                        </div>
                        <p className="font-bold text-sm">{attr.label}</p>
                        <p className="text-xs font-mono text-bauhaus-black/40 mt-1">{attr.constraint}</p>
                      </div>
                    ))}
                  </div>
                  <AlertBanner variant="info" title="Data stays local" message="Raw data is only stored on your device. It will be encrypted before any upload." className="mb-6" />
                  <button onClick={collectData} className="btn-blue">
                    <Database size={16} /> Collect Verified Data
                  </button>
                </>
              )}
              {currentStep > 0 && dataReady && (
                <AlertBanner variant="success" title="Data collected from all sources" message="Age range, region, and UPI spend verified." />
              )}
            </PhasePanel>

            {/* ── Phase: Encrypt + Upload ── */}
            <PhasePanel
              idx={1}
              current={currentStep}
              icon={Upload}
              title="Encrypt & Upload to IPFS"
              accentColor="yellow"
            >
              {currentStep === 1 && (
                <>
                  <p className="text-sm text-bauhaus-black/60 mb-4 font-mono">
                    Encrypt the dataset client-side using AES-256-GCM. Upload the encrypted blob to IPFS. The CID and hash commitment are stored on-chain; the decryption key is withheld until escrow releases.
                  </p>
                  <div className="bg-bauhaus-black text-bauhaus-white p-4 font-mono text-xs mb-6">
                    <div className="text-bauhaus-white/40 mb-2 uppercase tracking-widest text-[10px]">Flow</div>
                    {[
                      'dataset.json  →  AES-256-GCM  →  blob.enc',
                      'blob.enc      →  IPFS          →  CID',
                      'CID + hash(blob.enc) → on-chain commitment',
                      'decryptionKey → withheld until proof verified',
                    ].map(l => <div key={l} className="text-bauhaus-white/60 mb-1">{l}</div>)}
                  </div>
                  <button onClick={encryptAndUpload} className="btn-yellow">
                    <Upload size={16} /> Encrypt & Upload
                  </button>
                </>
              )}
              {currentStep > 1 && ipfsCid && (
                <AlertBanner variant="success" title="Encrypted blob uploaded" message={`IPFS CID: ${ipfsCid}`} />
              )}
            </PhasePanel>

            {/* ── Phase: Generate Proofs ── */}
            <PhasePanel
              idx={2}
              current={currentStep}
              icon={Shield}
              title="Generate ZK Proofs"
              accentColor="red"
            >
              {currentStep === 2 && (
                <>
                  <p className="text-sm text-bauhaus-black/60 mb-4 font-mono">
                    Two Groth16 proofs are generated in-browser: one for your identity (nullifier, credential validity), one for data constraints (age range, region, spend threshold).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-6">
                    {[
                      { title: 'Identity Proof',       circuit: 'IdentityProof.circom',        proves: ['Valid credential', 'Nullifier unused'] },
                      { title: 'Data Constraint Proof', circuit: 'DataConstraint.circom', proves: ['Age 18-65', 'Region IN-MH/DL/KA', 'Spend > ₹5k'] },
                    ].map((p, i) => (
                      <div key={p.title} className={clsx('border-3 border-bauhaus-black p-5', i === 0 && 'border-r-0')}>
                        <p className="font-bold text-sm uppercase tracking-wide mb-2">{p.title}</p>
                        <p className="font-mono text-xs text-bauhaus-black/40 mb-3">{p.circuit}</p>
                        {p.proves.map(pr => (
                          <div key={pr} className="flex items-center gap-2 text-xs font-mono mb-1.5">
                            <div className="w-1.5 h-1.5 bg-bauhaus-red rounded-full" />
                            {pr}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <button onClick={generateProofs} className="btn-red">
                    <Shield size={16} /> Generate ZK Proofs
                  </button>
                </>
              )}
              {currentStep > 2 && proofReady && (
                <AlertBanner variant="success" title="All ZK proofs generated" message="Identity proof + data constraint proof computed. Campaign nullifier set." />
              )}
            </PhasePanel>

            {/* ── Phase: Submit ── */}
            <PhasePanel
              idx={3}
              current={currentStep}
              icon={Zap}
              title="Submit On-Chain"
              accentColor="black"
            >
              {currentStep === 3 && (
                <>
                  <p className="text-sm text-bauhaus-black/60 mb-4 font-mono">
                    Submit proofs, IPFS CID, and campaign nullifier to SubmissionVerifier.sol. Contract verifies everything atomically — escrow releases in the same transaction.
                  </p>
                  <AlertBanner
                    variant="warning"
                    title="Irreversible action"
                    message="Once submitted, nullifier is marked used. This cannot be undone."
                    className="mb-6"
                  />
                  <div className="space-y-1.5 font-mono text-xs mb-6">
                    {[
                      ['Identity Proof',   '✓ Ready'],
                      ['Data Proof',       '✓ Ready'],
                      ['Campaign Nullifier','✓ Computed'],
                      ['IPFS CID',         ipfsCid],
                      ['Payout',           CAMPAIGN.price],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-bauhaus-black/10">
                        <span className="text-bauhaus-black/40 uppercase">{k}</span>
                        <span className="font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={submitOnChain} className="btn-primary">
                    <Zap size={16} /> Submit & Claim Escrow
                  </button>
                </>
              )}
              {currentStep > 3 && txHash && (
                <AlertBanner variant="success" title="Submitted and verified on-chain" message={`Tx: ${txHash}`} />
              )}
            </PhasePanel>

            {/* ── Phase: Complete ── */}
            {phase === 'complete' && (
              <div className="bauhaus-card overflow-hidden">
                <div className="bg-bauhaus-black px-6 py-8 text-bauhaus-white flex flex-col items-center text-center">
                  <GeoBadge shape="circle" color="yellow" size="lg" className="mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Payment Received</h2>
                  <p className="text-bauhaus-white/50 font-mono text-sm">Escrow released atomically. Decryption key emitted.</p>
                </div>
                <div className="p-6 grid grid-cols-2 gap-0">
                  {[
                    { l: 'Amount',    v: CAMPAIGN.price,   bg: 'bg-bauhaus-yellow text-bauhaus-black' },
                    { l: 'Tx Hash',   v: txHash,           bg: 'bg-bauhaus-white'                    },
                    { l: 'Nullifier', v: 'Marked used',    bg: 'bg-bauhaus-red text-bauhaus-white'    },
                    { l: 'CID',       v: ipfsCid,          bg: 'bg-bauhaus-white'                    },
                  ].map((s, i) => (
                    <div key={s.l} className={clsx('border-3 border-bauhaus-black p-4', i % 2 === 0 && 'border-r-0', i < 2 && 'border-b-0', s.bg)}>
                      <p className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-1">{s.l}</p>
                      <p className="font-bold text-sm font-mono truncate">{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t-3 border-bauhaus-black flex gap-4">
                  <a href="/dashboard" className="btn-primary">
                    View Dashboard <ArrowRight size={16} />
                  </a>
                  <a href="/marketplace" className="btn-outline">
                    Browse More Campaigns
                  </a>
                </div>
              </div>
            )}

            {/* Live log */}
            {logs.length > 0 && (
              <div className="bauhaus-card p-0 overflow-hidden">
                <div className="px-4 py-2 border-b-3 border-bauhaus-black bg-bauhaus-black flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-bauhaus-yellow animate-pulse" />
                  <span className="font-mono text-xs text-bauhaus-white/60 uppercase tracking-widest">Activity Log</span>
                </div>
                <div className="p-4 font-mono text-xs space-y-1 bg-bauhaus-black max-h-40 overflow-y-auto">
                  {logs.map((l, i) => (
                    <div key={i} className="text-bauhaus-white/60">{l}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhasePanel({
  idx, current, icon: Icon, title, accentColor, children,
}: {
  idx: number;
  current: number;
  icon: React.ElementType;
  title: string;
  accentColor: 'red' | 'blue' | 'yellow' | 'black';
  children: React.ReactNode;
}) {
  const done   = idx < current;
  const active = idx === current;
  const locked = idx > current;

  const ACCENT_STYLE: Record<string, string> = {
    red:    'bg-bauhaus-red text-bauhaus-white',
    blue:   'bg-bauhaus-blue text-bauhaus-white',
    yellow: 'bg-bauhaus-yellow text-bauhaus-black',
    black:  'bg-bauhaus-black text-bauhaus-white',
  };

  return (
    <div className={clsx('bauhaus-card overflow-hidden', locked && 'opacity-30 pointer-events-none')}>
      <div className={clsx('flex items-center justify-between px-6 py-4 border-b-3 border-bauhaus-black', active ? ACCENT_STYLE[accentColor] : 'bg-bauhaus-gray')}>
        <div className="flex items-center gap-3">
          {done
            ? <CheckCircle2 size={18} className={active ? '' : 'text-bauhaus-black'} />
            : locked
            ? <Clock size={18} className="text-bauhaus-black/30" />
            : <Icon size={18} />
          }
          <span className="font-semibold text-sm uppercase tracking-widest">{title}</span>
        </div>
        <div className={clsx(
          'w-6 h-6 flex items-center justify-center border-3 text-xs font-bold',
          active  ? 'border-current bg-bauhaus-white text-bauhaus-black' : 'border-bauhaus-black',
          done    ? 'bg-bauhaus-black text-bauhaus-white border-bauhaus-black' : '',
          locked  ? 'bg-bauhaus-white/30' : '',
        )}>
          {done ? '✓' : idx + 1}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export default function SubmitPage() {
  return (
    <Suspense>
      <SubmitContent />
    </Suspense>
  );
}
