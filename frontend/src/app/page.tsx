import Link from 'next/link';
import { ArrowRight, Lock, Shield, Zap, Database, Eye, CreditCard } from 'lucide-react';
import GeoBadge from '@/components/GeoBadge';
import StatCard from '@/components/StatCard';

const FEATURES = [
  {
    icon: Shield,
    title: 'Zero Knowledge Proofs',
    desc: 'Prove attributes without revealing raw data. Groth16 circuits verify on-chain in milliseconds.',
    color: 'red' as const,
    shape: 'circle' as const,
  },
  {
    icon: Lock,
    title: 'Atomic Escrow',
    desc: 'Funds locked before data viewed. Decryption key released only on verified proof. No theft possible.',
    color: 'blue' as const,
    shape: 'square' as const,
  },
  {
    icon: Eye,
    title: 'One Human = One Account',
    desc: 'Soulbound NFT + nullifier system. ZK uniqueness proof at registration prevents sybil attacks.',
    color: 'yellow' as const,
    shape: 'triangle' as const,
  },
  {
    icon: Database,
    title: 'Encrypted IPFS Storage',
    desc: 'Raw data never touches the chain. Encrypted client-side, CID stored on-chain, key released on payout.',
    color: 'black' as const,
    shape: 'circle' as const,
  },
  {
    icon: Zap,
    title: 'Auto Payment',
    desc: 'No usefulness condition. No manual approval. Proof verified → escrow released. Instant, trustless.',
    color: 'red' as const,
    shape: 'square' as const,
  },
  {
    icon: CreditCard,
    title: 'Verified Attributes',
    desc: 'Bank API, UPI statements, telco claims. No self-typed values. Attestation from authoritative sources.',
    color: 'blue' as const,
    shape: 'triangle' as const,
  },
];

const FLOW_STEPS = [
  { n: '01', label: 'Register Identity', desc: 'ZK proof + attested credential → Soulbound NFT minted.' },
  { n: '02', label: 'Browse Campaigns',  desc: 'Companies post attribute requirements + budget.' },
  { n: '03', label: 'Collect Data',      desc: 'Verified data aggregated from trusted sources locally.' },
  { n: '04', label: 'Generate Proofs',   desc: 'Circom circuits produce identity + constraint proofs.' },
  { n: '05', label: 'Submit & Earn',     desc: 'Proofs verified on-chain → escrow released instantly.' },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center border-b-3 border-bauhaus-black overflow-hidden">
        {/* Bauhaus geometric background */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Large red circle – top right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-bauhaus-red border-3 border-bauhaus-black opacity-90" />
          {/* Yellow square – bottom left */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-bauhaus-yellow border-3 border-bauhaus-black" />
          {/* Blue rectangle stripe */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-48 bg-bauhaus-blue" />
          {/* Small black triangle */}
          <div
            className="absolute bottom-24 right-48 w-0 h-0"
            style={{ borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '70px solid #0D0D0D' }}
          />
          {/* Grid dots */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #0D0D0D 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left content */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-3 bg-bauhaus-red border-2 border-bauhaus-black" />
                <span className="section-label">Private Data Marketplace</span>
                <div className="w-3 h-3 rounded-full bg-bauhaus-blue border-2 border-bauhaus-black" />
              </div>

              <h1 className="text-7xl md:text-8xl font-bold leading-[0.9] tracking-tighter mb-6 text-bauhaus-black">
                YOUR<br />
                <span className="text-bauhaus-red">DATA.</span><br />
                YOUR<br />
                <span className="text-bauhaus-blue">TERMS.</span>
              </h1>

              <p className="text-lg text-bauhaus-black/60 max-w-xl mb-10 font-light leading-relaxed">
                Monetize real behavioral data with zero-knowledge proofs.
                Companies receive only requested attributes. You keep your privacy.
                Payment is fully automated — no middlemen, no manual approval.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/identity" className="btn-red text-sm">
                  Register Identity
                  <ArrowRight size={16} />
                </Link>
                <Link href="/marketplace" className="btn-outline text-sm">
                  Browse Campaigns
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t-3 border-bauhaus-black">
                {[
                  { label: 'ZK-Verified',     color: 'bg-bauhaus-red'    },
                  { label: 'Non-Custodial',    color: 'bg-bauhaus-blue'   },
                  { label: 'Soulbound ID',     color: 'bg-bauhaus-yellow' },
                  { label: 'Atomic Escrow',    color: 'bg-bauhaus-black'  },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 ${b.color} border-2 border-bauhaus-black`} />
                    <span className="text-xs font-semibold uppercase tracking-widest">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Bauhaus compositional panel */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="bauhaus-card p-0 overflow-hidden bg-bauhaus-black">
                  {/* Red header */}
                  <div className="bg-bauhaus-red px-6 py-4 border-b-3 border-bauhaus-black flex items-center justify-between">
                    <span className="text-bauhaus-white font-mono text-xs uppercase tracking-widest font-semibold">ZK Proof Verified</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-bauhaus-yellow border-2 border-bauhaus-black" />
                      <div className="w-2.5 h-2.5 bg-bauhaus-white border-2 border-bauhaus-black" />
                    </div>
                  </div>
                  <div className="p-6 font-mono text-xs text-bauhaus-white/80 space-y-1.5">
                    {[
                      ['proof.identity_valid',    'true'],
                      ['proof.nullifier_unused',  'true'],
                      ['proof.age_in_range',      'true  // [18, 65]'],
                      ['proof.region_match',      'true  // "IN-MH"'],
                      ['proof.spend_threshold',   'true  // > ₹5000/mo'],
                      ['escrow.amount',           '0.045 ETH'],
                      ['escrow.status',           '"RELEASING"'],
                      ['tx.decryption_key',       '"0x7a3f...b91c"'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <span className="text-bauhaus-blue/80 flex-shrink-0">{k}</span>
                        <span className="text-bauhaus-yellow">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-4 border-t-3 border-bauhaus-black bg-bauhaus-blue/20 flex items-center justify-between">
                    <span className="text-bauhaus-white/60 font-mono text-[10px] uppercase tracking-widest">Gas used: 142,340</span>
                    <span className="text-bauhaus-yellow font-mono text-[10px] font-semibold uppercase">✓ Block confirmed</span>
                  </div>
                </div>

                {/* Decorative geo shapes */}
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-bauhaus-yellow border-3 border-bauhaus-black z-10" />
                <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-bauhaus-red border-3 border-bauhaus-black z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b-3 border-bauhaus-black bg-bauhaus-black text-bauhaus-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x-3 divide-bauhaus-white/20">
            {[
              { label: 'Active Campaigns',  value: '47'       },
              { label: 'Total Paid Out',    value: '$184K'    },
              { label: 'Verified Users',    value: '12,300+'  },
              { label: 'Avg per Submission', value: '$14.20'  },
            ].map((s) => (
              <div key={s.label} className="px-6 first:pl-0 last:pr-0 py-2">
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-xs font-mono text-bauhaus-white/40 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-b-3 border-bauhaus-black py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-1 bg-bauhaus-red" />
                <span className="section-label">Process</span>
              </div>
              <h2 className="text-5xl font-bold tracking-tight">How It Works</h2>
            </div>
            <GeoBadge shape="circle" color="yellow" size="xl" spin />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {FLOW_STEPS.map((step, i) => (
              <div
                key={step.n}
                className="border-3 border-bauhaus-black p-6 flex flex-col gap-3 hover:bg-bauhaus-black hover:text-bauhaus-white transition-colors group"
                style={{ borderRight: i < FLOW_STEPS.length - 1 ? 'none' : undefined }}
              >
                <span className="text-4xl font-bold text-bauhaus-black/10 group-hover:text-bauhaus-white/10 font-mono">
                  {step.n}
                </span>
                <div className={`w-3 h-3 ${i % 3 === 0 ? 'bg-bauhaus-red rounded-full' : i % 3 === 1 ? 'bg-bauhaus-blue' : 'bg-bauhaus-yellow geo-triangle'} border-2 border-bauhaus-black group-hover:border-bauhaus-white`} />
                <p className="font-bold text-sm uppercase tracking-wider">{step.label}</p>
                <p className="text-xs text-bauhaus-black/50 group-hover:text-bauhaus-white/50 font-mono leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="border-b-3 border-bauhaus-black py-24 bg-bauhaus-gray">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-bauhaus-blue" />
              <span className="section-label">Architecture</span>
            </div>
            <h2 className="text-5xl font-bold tracking-tight">Built Different</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="border-3 border-bauhaus-black p-8 bg-bauhaus-white hover:bg-bauhaus-black hover:text-bauhaus-white transition-colors group flex flex-col gap-4"
                style={{
                  borderRight:  (i + 1) % 3 === 0 ? undefined : 'none',
                  borderBottom: i < 3 ? 'none' : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <f.icon size={24} className="group-hover:stroke-bauhaus-white" />
                  <GeoBadge shape={f.shape} color={f.color} size="sm" />
                </div>
                <h3 className="text-base font-bold uppercase tracking-wide">{f.title}</h3>
                <p className="text-sm text-bauhaus-black/50 group-hover:text-bauhaus-white/50 font-mono leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREAT MODEL ── */}
      <section className="border-b-3 border-bauhaus-black py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-1 bg-bauhaus-yellow" />
                <span className="section-label">Security Model</span>
              </div>
              <h2 className="text-5xl font-bold tracking-tight mb-8">Attack Vectors<br />Engineered Out</h2>

              <div className="space-y-0">
                {[
                  { threat: 'Sybil attacks',            mitigation: 'ZK uniqueness + nullifiers + Soulbound NFT' },
                  { threat: 'Data theft before payment', mitigation: 'Atomic escrow + encrypted IPFS'            },
                  { threat: 'Fake / self-typed data',   mitigation: 'Attested sources only, device binding'     },
                  { threat: 'Double submission',        mitigation: 'Campaign nullifiers'                       },
                  { threat: 'Deanonymization',          mitigation: 'Query caps + attribute thresholds'         },
                  { threat: 'Subjective refusal',       mitigation: 'No usefulness condition — proof = payment' },
                ].map((row, i) => (
                  <div key={i} className="flex items-stretch border-3 border-bauhaus-black" style={{ borderBottom: 'none' }}>
                    <div className="w-1 flex-shrink-0 bg-bauhaus-red" />
                    <div className="flex flex-col md:flex-row flex-1">
                      <div className="flex-1 px-4 py-3 border-r-0 md:border-r-3 md:border-bauhaus-black bg-bauhaus-white">
                        <p className="text-xs font-mono text-bauhaus-black/50 uppercase tracking-widest mb-0.5">Attack</p>
                        <p className="text-sm font-semibold">{row.threat}</p>
                      </div>
                      <div className="flex-1 px-4 py-3 bg-bauhaus-black text-bauhaus-white">
                        <p className="text-xs font-mono text-bauhaus-white/40 uppercase tracking-widest mb-0.5">Defense</p>
                        <p className="text-sm font-semibold">{row.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-3 border-bauhaus-black border-t-3" />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <StatCard label="Proof Verification Cost" value="~142K gas"  sub="Groth16 on-chain" accent="red"    />
              <StatCard label="Data Exposure"           value="Zero"       sub="Only ZK proofs on-chain"  accent="blue"   />
              <StatCard label="Nullifier Collision Prob" value="< 2⁻¹²⁸" sub="Poseidon hash"     accent="yellow" />
              <StatCard label="Payment Delay"           value="1 block"    sub="After proof verified"     accent="black"  />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="bg-bauhaus-black text-bauhaus-white py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-bauhaus-red opacity-20 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-bauhaus-blue opacity-20 -translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <GeoBadge shape="square"  color="red"    size="md" />
            <GeoBadge shape="circle"  color="yellow" size="md" />
            <GeoBadge shape="triangle" color="blue"  size="md" />
          </div>
          <h2 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            OWN YOUR<br />
            <span className="text-bauhaus-yellow">SIGNAL.</span>
          </h2>
          <p className="text-bauhaus-white/50 mb-10 max-w-lg mx-auto font-mono text-sm">
            Your behavioral data is worth more than you think. Prove it — without revealing it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/identity" className="btn-red">
              Get Your Identity NFT <ArrowRight size={16} />
            </Link>
            <Link href="/marketplace" className="btn-outline">
              View Campaigns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
