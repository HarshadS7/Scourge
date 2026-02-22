'use client';

import { useState } from 'react';
import { ArrowUpRight, TrendingUp, Shield, Lock, CheckCircle2, Clock, XCircle } from 'lucide-react';
import StatCard from '@/components/StatCard';
import GeoBadge from '@/components/GeoBadge';
import { clsx } from 'clsx';
import Link from 'next/link';

const SUBMISSIONS = [
  {
    id: 's1',
    campaign: 'Monthly UPI Spend — Urban India',
    company:  'AxisBank Analytics',
    date:     '2026-02-18',
    payout:   '0.045 ETH',
    status:   'paid'     as const,
    txHash:   '0xabcd…ef91',
  },
  {
    id: 's2',
    campaign: '5G Device Attribution',
    company:  'Jio Telemetry',
    date:     '2026-02-10',
    payout:   '0.028 ETH',
    status:   'paid'     as const,
    txHash:   '0x1f9a…22b3',
  },
  {
    id: 's3',
    campaign: 'Fitness & Sleep Correlation',
    company:  'QuantumHealth',
    date:     '2026-02-22',
    payout:   '0.092 ETH',
    status:   'pending'  as const,
    txHash:   '0x…',
  },
  {
    id: 's4',
    campaign: 'Credit-Worthy Population',
    company:  'NeoBank X',
    date:     '2026-01-30',
    payout:   '0.110 ETH',
    status:   'paid'     as const,
    txHash:   '0xd44e…991f',
  },
  {
    id: 's5',
    campaign: 'Rural Payment Behaviour',
    company:  'RuralFintech DAO',
    date:     '2026-02-05',
    payout:   '0.065 ETH',
    status:   'failed'   as const,
    txHash:   '—',
  },
];

const STATUS_ICON = {
  paid:    <CheckCircle2 size={14} className="text-bauhaus-black" />,
  pending: <Clock        size={14} className="text-bauhaus-yellow" />,
  failed:  <XCircle      size={14} className="text-bauhaus-red"   />,
};
const STATUS_LABEL = {
  paid:    'bg-bauhaus-black text-bauhaus-white',
  pending: 'bg-bauhaus-yellow text-bauhaus-black',
  failed:  'bg-bauhaus-red text-bauhaus-white',
};

export default function DashboardPage() {
  const [tab, setTab] = useState<'overview' | 'submissions' | 'identity'>('overview');

  const totalETH = SUBMISSIONS
    .filter(s => s.status === 'paid')
    .reduce((acc, s) => acc + parseFloat(s.payout), 0)
    .toFixed(3);

  return (
    <div className="min-h-screen bg-bauhaus-white">
      {/* Header */}
      <div className="border-b-3 border-bauhaus-black">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-1 bg-bauhaus-yellow" />
                <span className="section-label">User Dashboard</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight">0x3f2A…8d1C</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2.5 h-2.5 bg-bauhaus-blue border-2 border-bauhaus-black" />
                <span className="text-sm font-mono text-bauhaus-black/50">Identity NFT #1 · Verified</span>
              </div>
            </div>
            <Link href="/marketplace" className="btn-primary flex-shrink-0">
              Browse Campaigns <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-3 border-bauhaus-black bg-bauhaus-white">
        <div className="max-w-7xl mx-auto px-6 flex">
          {(['overview', 'submissions', 'identity'] as const).map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-6 py-4 text-sm font-semibold uppercase tracking-widest border-r-3 border-bauhaus-black transition-colors',
                i === 0 && 'border-l-0',
                tab === t ? 'bg-bauhaus-black text-bauhaus-white' : 'hover:bg-bauhaus-gray'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {[
                { label: 'Total Earned',     value: `${totalETH} ETH`, sub: `${SUBMISSIONS.filter(s=>s.status==='paid').length} submissions`, accent: 'red'  as const },
                { label: 'Pending',          value: '0.092 ETH', sub: '1 under review', accent: 'yellow' as const },
                { label: 'Campaigns Joined', value: `${SUBMISSIONS.length}`,   sub: 'lifetime',   accent: 'blue'  as const },
                { label: 'Data Privacy',     value: '100%',             sub: 'ZK proofs only', accent: 'black' as const },
              ].map((s, i) => (
                <div key={s.label} className={clsx(i < 3 && 'border-r-0')}>
                  <StatCard {...s} />
                </div>
              ))}
            </div>

            {/* Earnings chart (bauhaus bar chart) */}
            <div className="bauhaus-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray flex items-center justify-between">
                <span className="font-semibold text-sm uppercase tracking-widest">Earnings History</span>
                <TrendingUp size={16} className="text-bauhaus-black/40" />
              </div>
              <div className="p-8">
                {/* Manual bar chart with Bauhaus color scheme */}
                <div className="flex items-end gap-3 h-40">
                  {[
                    { month: 'Oct', eth: 0.032, color: 'bg-bauhaus-blue'   },
                    { month: 'Nov', eth: 0.071, color: 'bg-bauhaus-red'    },
                    { month: 'Dec', eth: 0.045, color: 'bg-bauhaus-blue'   },
                    { month: 'Jan', eth: 0.155, color: 'bg-bauhaus-red'    },
                    { month: 'Feb', eth: 0.183, color: 'bg-bauhaus-yellow text-bauhaus-black' },
                  ].map((b) => {
                    const maxEth = 0.183;
                    const heightPct = (b.eth / maxEth) * 100;
                    return (
                      <div key={b.month} className="flex-1 flex flex-col items-center gap-2">
                        <span className="font-mono text-[10px] text-bauhaus-black/40">{b.eth}</span>
                        <div
                          className={clsx('w-full border-3 border-bauhaus-black', b.color)}
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="font-mono text-[10px] text-bauhaus-black/50 uppercase">{b.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bauhaus-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray">
                <span className="font-semibold text-sm uppercase tracking-widest">Recent Submissions</span>
              </div>
              <div>
                {SUBMISSIONS.slice(0, 3).map((s, i) => (
                  <div
                    key={s.id}
                    className={clsx('flex items-center gap-4 px-6 py-4 border-b-3 border-bauhaus-black', i === 2 && 'border-b-0')}
                  >
                    <div>{STATUS_ICON[s.status]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{s.campaign}</p>
                      <p className="text-xs font-mono text-bauhaus-black/40">{s.company}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm">{s.payout}</p>
                      <span className={clsx('text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-bauhaus-black', STATUS_LABEL[s.status])}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t-3 border-bauhaus-black">
                <button onClick={() => setTab('submissions')} className="text-xs font-semibold uppercase tracking-widest hover:text-bauhaus-red transition-colors">
                  View all submissions →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SUBMISSIONS TAB ── */}
        {tab === 'submissions' && (
          <div className="bauhaus-card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray flex items-center justify-between">
              <span className="font-semibold text-sm uppercase tracking-widest">All Submissions</span>
              <span className="font-mono text-xs text-bauhaus-black/50">{SUBMISSIONS.length} total</span>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-3 border-bauhaus-black bg-bauhaus-black text-bauhaus-white">
                    {['Campaign', 'Company', 'Date', 'Payout', 'Status', 'Tx'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest border-r-3 border-bauhaus-white/10 last:border-r-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SUBMISSIONS.map((s, i) => (
                    <tr key={s.id} className={clsx('border-b-3 border-bauhaus-black hover:bg-bauhaus-gray transition-colors', i === SUBMISSIONS.length - 1 && 'border-b-0')}>
                      <td className="px-5 py-4 font-semibold max-w-[220px] truncate">{s.campaign}</td>
                      <td className="px-5 py-4 font-mono text-xs text-bauhaus-black/50">{s.company}</td>
                      <td className="px-5 py-4 font-mono text-xs">{s.date}</td>
                      <td className="px-5 py-4 font-bold">{s.payout}</td>
                      <td className="px-5 py-4">
                        <span className={clsx('text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-bauhaus-black', STATUS_LABEL[s.status])}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-bauhaus-black/40">{s.txHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── IDENTITY TAB ── */}
        {tab === 'identity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* NFT display */}
            <div className="border-3 border-bauhaus-black border-r-0">
              {/* Bauhaus NFT art */}
              <div className="relative aspect-square bg-bauhaus-black overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-bauhaus-red" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-bauhaus-blue" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-bauhaus-yellow" />
                {/* Geometric overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-bauhaus-white border-3 border-bauhaus-black flex items-center justify-center">
                    <div className="text-center">
                      <span className="font-bold text-4xl text-bauhaus-black block">#1</span>
                      <span className="font-mono text-[10px] text-bauhaus-black/50 uppercase">Identity</span>
                    </div>
                  </div>
                </div>
                {/* Corner geometry */}
                <div className="absolute top-4 left-4 w-8 h-8 border-3 border-bauhaus-white opacity-40" />
                <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full border-3 border-bauhaus-black opacity-40" />
              </div>
              <div className="p-5 border-t-3 border-bauhaus-black bg-bauhaus-black text-bauhaus-white">
                <p className="font-bold text-sm uppercase tracking-widest">SCOURGE IDENTITY #1</p>
                <p className="font-mono text-xs text-bauhaus-white/40 mt-1">Soulbound · Non-transferable ERC-721</p>
              </div>
            </div>

            {/* Identity details */}
            <div className="border-3 border-bauhaus-black">
              <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray">
                <span className="font-semibold text-sm uppercase tracking-widest">Identity Details</span>
              </div>
              <div className="p-6 space-y-0">
                {[
                  { label: 'Wallet',       value: '0x3f2A8d1C…', color: 'bg-bauhaus-blue'   },
                  { label: 'Token ID',     value: '#1',            color: 'bg-bauhaus-red'    },
                  { label: 'Attester',     value: 'Bank / Fintech', color: 'bg-bauhaus-black' },
                  { label: 'Registered',  value: '2026-01-12',    color: 'bg-bauhaus-yellow' },
                  { label: 'Nullifier',   value: '0x7a3f…b91c',  color: 'bg-bauhaus-black'  },
                  { label: 'Status',       value: 'Active ✓',     color: 'bg-bauhaus-red'    },
                ].map((row) => (
                  <div key={row.label} className="flex border-b-3 border-bauhaus-black last:border-b-0">
                    <div className={clsx('w-2 flex-shrink-0', row.color)} />
                    <div className="flex flex-col sm:flex-row sm:items-center flex-1 px-4 py-3 gap-1 sm:gap-0">
                      <span className="text-xs font-mono text-bauhaus-black/40 uppercase tracking-widest sm:w-32 flex-shrink-0">{row.label}</span>
                      <span className="font-semibold text-sm font-mono">{row.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ZK Proofs section */}
              <div className="border-t-3 border-bauhaus-black px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={14} className="text-bauhaus-blue" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Proofs Generated</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['Identity Proof', 'Region Proof', 'Age Range Proof', 'Spend Threshold'].map(p => (
                    <span key={p} className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 border-2 border-bauhaus-black bg-bauhaus-white">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t-3 border-bauhaus-black p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={14} className="text-bauhaus-black/40" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-bauhaus-black/50">Privacy Status</span>
                </div>
                <p className="text-xs font-mono text-bauhaus-black/40 leading-relaxed">
                  No raw personal data stored on-chain. All proofs computed locally. Credential never exposed. Nullifier prevents sybil reuse.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
