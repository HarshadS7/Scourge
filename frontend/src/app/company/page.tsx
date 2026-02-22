'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowUpRight,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  Eye,
  ChevronDown,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import GeoBadge from '@/components/GeoBadge';
import { clsx } from 'clsx';
import Link from 'next/link';

/* ── mock campaigns posted by this company ── */
const MY_CAMPAIGNS = [
  {
    id: 'mc1',
    title: 'Monthly UPI Spend — Urban India',
    status: 'active' as const,
    budget: '4.5 ETH',
    spent: '1.08 ETH',
    pricePerSubmit: '0.045 ETH',
    submissions: 24,
    maxSubmissions: 100,
    deadline: '2026-03-15',
    attributes: ['Age Range', 'Region', 'Spend > ₹5k/mo'],
  },
  {
    id: 'mc2',
    title: 'Credit-Worthy Population — Salaried Segment',
    status: 'active' as const,
    budget: '11 ETH',
    spent: '6.05 ETH',
    pricePerSubmit: '0.110 ETH',
    submissions: 55,
    maxSubmissions: 100,
    deadline: '2026-03-30',
    attributes: ['Income Bracket', 'Employer Type', 'Region'],
  },
  {
    id: 'mc3',
    title: 'Rural Payment Behaviour — Non-Metro India',
    status: 'closing' as const,
    budget: '6.5 ETH',
    spent: '2.21 ETH',
    pricePerSubmit: '0.065 ETH',
    submissions: 34,
    maxSubmissions: 100,
    deadline: '2026-03-20',
    attributes: ['Region (Rural)', 'Payment Frequency', 'Avg Txn Size'],
  },
  {
    id: 'mc4',
    title: 'Content Genre Preferences — 18–35 cohort',
    status: 'filled' as const,
    budget: '1.8 ETH',
    spent: '1.8 ETH',
    pricePerSubmit: '0.018 ETH',
    submissions: 100,
    maxSubmissions: 100,
    deadline: '2026-02-22',
    attributes: ['Age Range', 'Gender', 'Watch Hours/week'],
  },
];

const STATUS_COLOR = {
  active: 'bg-bauhaus-blue text-bauhaus-white',
  closing: 'bg-bauhaus-yellow text-bauhaus-black',
  filled: 'bg-bauhaus-black text-bauhaus-white',
};

/* ── attribute options for new campaign form ── */
const ATTRIBUTE_OPTIONS = [
  'Age Range',
  'Region',
  'Monthly Spend',
  'Device Type',
  'Income Bracket',
  'Sleep Score',
  'Step Count',
  'Watch Hours',
  'Payment Frequency',
  'Employer Type',
];

type ConstraintType = 'range' | 'membership' | 'threshold';

interface Constraint {
  id: string;
  attribute: string;
  type: ConstraintType;
  value: string;
}

export default function CompanyPage() {
  const [tab, setTab] = useState<'overview' | 'campaigns' | 'new'>('overview');
  const [walletConnected, setWalletConnected] = useState(false);

  /* ── new campaign form state ── */
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    price: '',
    deadline: '',
  });
  const [constraints, setConstraints] = useState<Constraint[]>([
    { id: '1', attribute: 'Age Range', type: 'range', value: '18-65' },
  ]);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [txHash, setTxHash] = useState('');

  const addConstraint = () => {
    const id = Date.now().toString();
    setConstraints((prev) => [
      ...prev,
      { id, attribute: 'Region', type: 'membership', value: '' },
    ]);
  };

  const removeConstraint = (id: string) => {
    setConstraints((prev) => prev.filter((c) => c.id !== id));
  };

  const updateConstraint = (
    id: string,
    field: keyof Constraint,
    value: string,
  ) => {
    setConstraints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  const handlePost = async () => {
    setPosting(true);
    await new Promise((r) => setTimeout(r, 2200));
    setTxHash('0xe7b1…c48d');
    setPosting(false);
    setPosted(true);
  };

  const resetForm = () => {
    setForm({ title: '', description: '', budget: '', price: '', deadline: '' });
    setConstraints([{ id: '1', attribute: 'Age Range', type: 'range', value: '18-65' }]);
    setPosted(false);
    setTxHash('');
  };

  /* ── wallet connection (mock) ── */
  const connectWallet = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setWalletConnected(true);
  };

  /* ── stats ── */
  const totalSpent = MY_CAMPAIGNS.reduce(
    (a, c) => a + parseFloat(c.spent),
    0,
  ).toFixed(2);
  const totalSubs = MY_CAMPAIGNS.reduce((a, c) => a + c.submissions, 0);

  /* ── Not connected state ── */
  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-bauhaus-white flex items-center justify-center">
        <div className="max-w-md w-full mx-6">
          <div className="bauhaus-card p-0 overflow-hidden">
            {/* Header */}
            <div className="bg-bauhaus-blue px-8 py-6 border-b-3 border-bauhaus-black flex items-center gap-4">
              <Briefcase size={24} className="text-bauhaus-white" />
              <div>
                <h2 className="text-xl font-bold text-bauhaus-white uppercase tracking-widest">
                  Company Portal
                </h2>
                <p className="text-xs text-bauhaus-white/60 font-mono mt-1">
                  Connect wallet to manage campaigns
                </p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 border-3 border-bauhaus-black bg-bauhaus-gray">
                  <Briefcase size={32} className="text-bauhaus-black/40" />
                </div>
                <p className="text-sm text-bauhaus-black/60">
                  Connect your company wallet to post data campaigns, manage
                  submissions, and release payments to verified users.
                </p>
              </div>
              <button onClick={connectWallet} className="btn-blue w-full justify-center">
                Connect Company Wallet
              </button>
              <Link
                href="/dashboard"
                className="block text-center text-xs font-semibold uppercase tracking-widest text-bauhaus-black/40 hover:text-bauhaus-red transition-colors"
              >
                ← Login as Customer
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bauhaus-white">
      {/* ── Header ── */}
      <div className="border-b-3 border-bauhaus-black bg-bauhaus-blue text-bauhaus-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-1 bg-bauhaus-white/40" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bauhaus-white/60">
                  Company Dashboard
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight">
                0xC0mp…4nY1
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2.5 h-2.5 bg-bauhaus-yellow border-2 border-bauhaus-black" />
                <span className="text-sm font-mono text-bauhaus-white/50">
                  Company Account · Verified
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="btn-outline border-bauhaus-white text-bauhaus-white hover:bg-bauhaus-white hover:text-bauhaus-black text-xs py-2 px-4">
                Login as Customer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="border-b-3 border-bauhaus-black bg-bauhaus-white">
        <div className="max-w-7xl mx-auto px-6 flex">
          {(['overview', 'campaigns', 'new'] as const).map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-6 py-4 text-sm font-semibold uppercase tracking-widest border-r-3 border-bauhaus-black transition-colors',
                i === 0 && 'border-l-0',
                tab === t
                  ? 'bg-bauhaus-black text-bauhaus-white'
                  : 'hover:bg-bauhaus-gray',
              )}
            >
              {t === 'new' ? '+ New Campaign' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ═══════ OVERVIEW TAB ═══════ */}
        {tab === 'overview' && (
          <div className="space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {[
                {
                  label: 'Total Spent',
                  value: `${totalSpent} ETH`,
                  sub: `${MY_CAMPAIGNS.length} campaigns`,
                  accent: 'blue' as const,
                },
                {
                  label: 'Submissions',
                  value: `${totalSubs}`,
                  sub: 'verified proofs',
                  accent: 'red' as const,
                },
                {
                  label: 'Active',
                  value: `${MY_CAMPAIGNS.filter((c) => c.status === 'active').length}`,
                  sub: 'live campaigns',
                  accent: 'yellow' as const,
                },
                {
                  label: 'Fill Rate',
                  value: `${Math.round(
                    (totalSubs /
                      MY_CAMPAIGNS.reduce((a, c) => a + c.maxSubmissions, 0)) *
                      100,
                  )}%`,
                  sub: 'avg completion',
                  accent: 'black' as const,
                },
              ].map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            {/* Recent campaigns overview */}
            <div className="bauhaus-card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray flex items-center justify-between">
                <span className="font-semibold text-sm uppercase tracking-widest">
                  Your Campaigns
                </span>
                <TrendingUp
                  size={16}
                  className="text-bauhaus-black/40"
                />
              </div>
              <div>
                {MY_CAMPAIGNS.slice(0, 3).map((c, i) => (
                  <div
                    key={c.id}
                    className={clsx(
                      'flex items-center gap-4 px-6 py-4 border-b-3 border-bauhaus-black',
                      i === 2 && 'border-b-0',
                    )}
                  >
                    <div
                      className={clsx(
                        'w-2 h-2 flex-shrink-0 border-2 border-bauhaus-black',
                        c.status === 'active'
                          ? 'bg-bauhaus-blue'
                          : c.status === 'closing'
                            ? 'bg-bauhaus-yellow'
                            : 'bg-bauhaus-black',
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{c.title}</p>
                      <p className="text-xs font-mono text-bauhaus-black/40">
                        {c.submissions}/{c.maxSubmissions} submissions · {c.spent}{' '}
                        spent
                      </p>
                    </div>
                    <span
                      className={clsx(
                        'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-bauhaus-black',
                        STATUS_COLOR[c.status],
                      )}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t-3 border-bauhaus-black">
                <button
                  onClick={() => setTab('campaigns')}
                  className="text-xs font-semibold uppercase tracking-widest hover:text-bauhaus-blue transition-colors"
                >
                  View all campaigns →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ CAMPAIGNS TAB ═══════ */}
        {tab === 'campaigns' && (
          <div className="bauhaus-card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray flex items-center justify-between">
              <span className="font-semibold text-sm uppercase tracking-widest">
                All Campaigns
              </span>
              <span className="font-mono text-xs text-bauhaus-black/50">
                {MY_CAMPAIGNS.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-3 border-bauhaus-black bg-bauhaus-black text-bauhaus-white">
                    {[
                      'Campaign',
                      'Status',
                      'Budget',
                      'Spent',
                      'Per Submit',
                      'Submissions',
                      'Deadline',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest border-r-3 border-bauhaus-white/10 last:border-r-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MY_CAMPAIGNS.map((c, i) => (
                    <tr
                      key={c.id}
                      className={clsx(
                        'border-b-3 border-bauhaus-black hover:bg-bauhaus-gray transition-colors',
                        i === MY_CAMPAIGNS.length - 1 && 'border-b-0',
                      )}
                    >
                      <td className="px-5 py-4 font-semibold max-w-[220px] truncate">
                        {c.title}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={clsx(
                            'text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-bauhaus-black',
                            STATUS_COLOR[c.status],
                          )}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold">{c.budget}</td>
                      <td className="px-5 py-4 font-mono text-xs">
                        {c.spent}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs">
                        {c.pricePerSubmit}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">
                            {c.submissions}/{c.maxSubmissions}
                          </span>
                          <div className="w-16 h-1.5 bg-bauhaus-gray border border-bauhaus-black overflow-hidden">
                            <div
                              className={clsx(
                                'h-full',
                                c.submissions / c.maxSubmissions > 0.8
                                  ? 'bg-bauhaus-red'
                                  : 'bg-bauhaus-blue',
                              )}
                              style={{
                                width: `${(c.submissions / c.maxSubmissions) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs">
                        {c.deadline}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════ NEW CAMPAIGN TAB ═══════ */}
        {tab === 'new' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-6">
              <div className="bauhaus-card p-6 bg-bauhaus-black text-bauhaus-white">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={14} className="text-bauhaus-yellow" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-bauhaus-white/60">
                    How it works
                  </span>
                </div>
                <ul className="space-y-3 text-xs font-mono text-bauhaus-white/60 leading-relaxed">
                  {[
                    'Define the data attributes you need',
                    'Set price per submission and total budget',
                    'Budget is locked in escrow on-chain',
                    'Users submit ZK proofs matching your criteria',
                    'Verified proofs auto-release payment',
                    'Encrypted data decrypted only on payout',
                    'No manual approval needed',
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-bauhaus-blue flex-shrink-0">→</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-8 xl:col-span-9">
              {posted ? (
                /* Success state */
                <div className="bauhaus-card p-0 overflow-hidden">
                  <div className="bg-bauhaus-blue px-8 py-6 border-b-3 border-bauhaus-black text-bauhaus-white text-center">
                    <CheckCircle2 size={48} className="mx-auto mb-4" />
                    <h2 className="text-2xl font-bold uppercase tracking-widest">
                      Campaign Posted!
                    </h2>
                    <p className="text-sm text-bauhaus-white/60 font-mono mt-2">
                      Transaction: {txHash}
                    </p>
                  </div>
                  <div className="p-8 text-center space-y-6">
                    <p className="text-sm text-bauhaus-black/60">
                      Your campaign is now live on the marketplace. Users
                      matching your criteria can submit ZK proofs and earn
                      rewards.
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          resetForm();
                          setTab('campaigns');
                        }}
                        className="btn-primary text-xs"
                      >
                        View Campaigns
                      </button>
                      <button
                        onClick={resetForm}
                        className="btn-outline text-xs"
                      >
                        Post Another
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Campaign details */}
                  <div className="bauhaus-card p-0 overflow-hidden">
                    <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-blue text-bauhaus-white">
                      <span className="font-semibold text-sm uppercase tracking-widest">
                        Campaign Details
                      </span>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="section-label block mb-2">
                          Campaign Title
                        </label>
                        <input
                          className="bauhaus-input"
                          placeholder="e.g. Urban UPI Spend — 30-day cohort"
                          value={form.title}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, title: e.target.value }))
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="section-label block mb-2">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          className="bauhaus-input resize-none"
                          placeholder="What data are you collecting and why? Describe your requirements clearly."
                          value={form.description}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="section-label block mb-2">
                          Price per Submission (ETH)
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          className="bauhaus-input"
                          placeholder="0.045"
                          value={form.price}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, price: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className="section-label block mb-2">
                          Total Budget (ETH)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="bauhaus-input"
                          placeholder="4.5"
                          value={form.budget}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, budget: e.target.value }))
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="section-label block mb-2">
                          Deadline
                        </label>
                        <input
                          type="date"
                          className="bauhaus-input"
                          value={form.deadline}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              deadline: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Data constraints */}
                  <div className="bauhaus-card p-0 overflow-hidden">
                    <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-red text-bauhaus-white flex items-center justify-between">
                      <span className="font-semibold text-sm uppercase tracking-widest">
                        Data Requirements
                      </span>
                      <button
                        onClick={addConstraint}
                        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-bauhaus-white/80 hover:text-bauhaus-white"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>
                    <div className="divide-y-3 divide-bauhaus-black">
                      {constraints.map((c) => (
                        <div
                          key={c.id}
                          className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                        >
                          <div className="md:col-span-4">
                            <label className="section-label block mb-2">
                              Attribute
                            </label>
                            <select
                              className="bauhaus-input appearance-none"
                              value={c.attribute}
                              onChange={(e) =>
                                updateConstraint(
                                  c.id,
                                  'attribute',
                                  e.target.value,
                                )
                              }
                            >
                              {ATTRIBUTE_OPTIONS.map((a) => (
                                <option key={a} value={a}>
                                  {a}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-3">
                            <label className="section-label block mb-2">
                              Type
                            </label>
                            <select
                              className="bauhaus-input appearance-none"
                              value={c.type}
                              onChange={(e) =>
                                updateConstraint(
                                  c.id,
                                  'type',
                                  e.target.value,
                                )
                              }
                            >
                              <option value="range">Range</option>
                              <option value="membership">Membership</option>
                              <option value="threshold">Threshold</option>
                            </select>
                          </div>
                          <div className="md:col-span-4">
                            <label className="section-label block mb-2">
                              Value
                            </label>
                            <input
                              className="bauhaus-input"
                              placeholder={
                                c.type === 'range'
                                  ? '18-65'
                                  : c.type === 'threshold'
                                    ? '> 5000'
                                    : 'IN-MH, IN-KA'
                              }
                              value={c.value}
                              onChange={(e) =>
                                updateConstraint(
                                  c.id,
                                  'value',
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <button
                              onClick={() => removeConstraint(c.id)}
                              className="border-3 border-bauhaus-black p-2.5 hover:bg-bauhaus-red hover:text-bauhaus-white transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePost}
                      disabled={
                        posting ||
                        !form.title ||
                        !form.budget ||
                        !form.price
                      }
                      className={clsx(
                        'btn-blue text-sm',
                        (posting || !form.title || !form.budget || !form.price) &&
                          'opacity-50 cursor-not-allowed',
                      )}
                    >
                      {posting ? (
                        <>
                          <Clock size={14} className="animate-spin" />{' '}
                          Deploying…
                        </>
                      ) : (
                        <>
                          Post Campaign{' '}
                          <ArrowUpRight size={16} />
                        </>
                      )}
                    </button>
                    <span className="text-xs font-mono text-bauhaus-black/40">
                      Budget will be locked in escrow on-chain
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
