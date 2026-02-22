'use client';

import { useState } from 'react';
import { Plus, Trash2, ArrowRight, Info } from 'lucide-react';
import AlertBanner from '@/components/AlertBanner';
import GeoBadge from '@/components/GeoBadge';
import { clsx } from 'clsx';

type ConstraintType = 'range' | 'membership' | 'threshold';

interface Constraint {
  id: string;
  attribute: string;
  type: ConstraintType;
  value: string;
}

const ATTRIBUTE_OPTIONS = [
  'Age Range', 'Region', 'Monthly Spend', 'Device Type',
  'Income Bracket', 'Sleep Score', 'Step Count', 'Watch Hours',
  'Payment Frequency', 'Employer Type',
];

export default function CreateCampaignPage() {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    budget:      '',
    price:       '',
    duration:    '30',
    deadline:    '',
  });
  const [constraints, setConstraints] = useState<Constraint[]>([
    { id: '1', attribute: 'Age Range', type: 'range', value: '18-65' },
  ]);
  const [step, setStep] = useState<'form' | 'review' | 'deploy'>('form');
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [txHash, setTxHash] = useState('');

  const addConstraint = () => {
    const id = Date.now().toString();
    setConstraints(prev => [...prev, { id, attribute: 'Region', type: 'membership', value: '' }]);
  };

  const removeConstraint = (id: string) => {
    setConstraints(prev => prev.filter(c => c.id !== id));
  };

  const updateConstraint = (id: string, field: keyof Constraint, value: string) => {
    setConstraints(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deploy = async () => {
    setDeploying(true);
    await sleep(800);
    await sleep(700);
    await sleep(900);
    const tx = '0xf1c2…aa73';
    setTxHash(tx);
    setDeploying(false);
    setDeployed(true);
  };

  return (
    <div className="min-h-screen bg-bauhaus-white">
      {/* Header */}
      <div className="border-b-3 border-bauhaus-black bg-bauhaus-blue text-bauhaus-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-bauhaus-white/40" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bauhaus-white/60">For Companies</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Create<br />Campaign</h1>
          </div>
          <div className="flex items-center gap-4">
            <GeoBadge shape="square"  color="yellow" size="lg" />
            <GeoBadge shape="circle"  color="red"    size="md" />
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="border-b-3 border-bauhaus-black">
        <div className="max-w-7xl mx-auto px-6 flex">
          {(['form', 'review', 'deploy'] as const).map((s, i) => (
            <button
              key={s}
              onClick={() => step !== 'deploy' && s !== 'deploy' && setStep(s)}
              className={clsx(
                'px-6 py-4 text-sm font-semibold uppercase tracking-widest border-r-3 border-bauhaus-black transition-colors',
                i === 0 && 'border-l-0',
                step === s ? 'bg-bauhaus-black text-bauhaus-white' : 'hover:bg-bauhaus-gray text-bauhaus-black/40'
              )}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Info sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bauhaus-card p-6 bg-bauhaus-black text-bauhaus-white">
              <div className="flex items-center gap-2 mb-4">
                <Info size={14} className="text-bauhaus-yellow" />
                <span className="text-xs font-semibold uppercase tracking-widest text-bauhaus-white/60">Campaign Rules</span>
              </div>
              <ul className="space-y-3 text-xs font-mono text-bauhaus-white/60 leading-relaxed">
                {[
                  'Escrow locked before any data viewed',
                  'Payment auto-released on valid zk proof',
                  'No manual approval or usefulness gate',
                  'Constraints defined at deploy time — immutable',
                  'Budget set upfront — no post-hoc rejection',
                  'Encrypted data decryption key released atomically',
                  'Campaign nullifiers prevent duplicate submission',
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-bauhaus-blue flex-shrink-0">→</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bauhaus-card p-6">
              <p className="section-label mb-4">Constraint Types</p>
              <div className="space-y-3">
                {[
                  { type: 'Range',      desc: 'Numeric range, e.g. age 18–65',          color: 'bg-bauhaus-red'    },
                  { type: 'Membership', desc: 'Set membership, e.g. region IN-MH',      color: 'bg-bauhaus-blue'   },
                  { type: 'Threshold',  desc: 'Min/max value, e.g. spend > ₹5,000',     color: 'bg-bauhaus-yellow' },
                ].map((c) => (
                  <div key={c.type} className="flex gap-3">
                    <div className={clsx('w-2 mt-1.5 h-2 flex-shrink-0 border-2 border-bauhaus-black', c.color)} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide">{c.type}</p>
                      <p className="text-xs font-mono text-bauhaus-black/50">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="lg:col-span-8 xl:col-span-9">
            {step === 'form' && (
              <div className="space-y-6">
                {/* Basic details */}
                <div className="bauhaus-card p-0 overflow-hidden">
                  <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-blue text-bauhaus-white">
                    <span className="font-semibold text-sm uppercase tracking-widest">Campaign Details</span>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="section-label block mb-2">Campaign Title</label>
                      <input
                        className="bauhaus-input"
                        placeholder="e.g. Urban UPI Spend — 30-day cohort"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="section-label block mb-2">Description</label>
                      <textarea
                        rows={3}
                        className="bauhaus-input resize-none"
                        placeholder="What data are you collecting and why?"
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="section-label block mb-2">Price per Submission (ETH)</label>
                      <input
                        type="number"
                        step="0.001"
                        className="bauhaus-input"
                        placeholder="0.045"
                        value={form.price}
                        onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="section-label block mb-2">Total Budget (ETH)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="bauhaus-input"
                        placeholder="4.5"
                        value={form.budget}
                        onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="section-label block mb-2">Collection Duration (days)</label>
                      <select
                        className="bauhaus-input"
                        value={form.duration}
                        onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                      >
                        {['7', '14', '30', '60', '90'].map(d => (
                          <option key={d} value={d}>{d} days</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="section-label block mb-2">Deadline</label>
                      <input
                        type="date"
                        className="bauhaus-input"
                        value={form.deadline}
                        onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Constraints */}
                <div className="bauhaus-card p-0 overflow-hidden">
                  <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-gray flex items-center justify-between">
                    <span className="font-semibold text-sm uppercase tracking-widest">Data Constraints</span>
                    <button onClick={addConstraint} className="btn-outline py-1.5 px-3 text-xs">
                      <Plus size={12} /> Add Constraint
                    </button>
                  </div>
                  <div>
                    {constraints.map((c, i) => (
                      <div
                        key={c.id}
                        className={clsx('flex flex-col md:flex-row gap-3 p-5 border-b-3 border-bauhaus-black last:border-b-0')}
                      >
                        <div className="flex items-start gap-2 flex-shrink-0">
                          <div className={clsx(
                            'w-3 h-3 mt-3.5 border-2 border-bauhaus-black',
                            i % 3 === 0 ? 'bg-bauhaus-red' : i % 3 === 1 ? 'bg-bauhaus-blue rounded-full' : 'bg-bauhaus-yellow geo-triangle border-0'
                          )} />
                          <span className="font-mono text-xs text-bauhaus-black/30 mt-3.5 w-4">{String(i+1).padStart(2,'0')}</span>
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="section-label block mb-1">Attribute</label>
                            <select
                              className="bauhaus-input text-sm py-2"
                              value={c.attribute}
                              onChange={e => updateConstraint(c.id, 'attribute', e.target.value)}
                            >
                              {ATTRIBUTE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="section-label block mb-1">Constraint Type</label>
                            <select
                              className="bauhaus-input text-sm py-2"
                              value={c.type}
                              onChange={e => updateConstraint(c.id, 'type', e.target.value as ConstraintType)}
                            >
                              <option value="range">Range</option>
                              <option value="membership">Membership</option>
                              <option value="threshold">Threshold</option>
                            </select>
                          </div>
                          <div>
                            <label className="section-label block mb-1">Value / Definition</label>
                            <input
                              className="bauhaus-input text-sm py-2"
                              placeholder={c.type === 'range' ? 'e.g. 18-65' : c.type === 'membership' ? 'e.g. IN-MH,IN-DL' : 'e.g. > 5000'}
                              value={c.value}
                              onChange={e => updateConstraint(c.id, 'value', e.target.value)}
                            />
                          </div>
                        </div>
                        {constraints.length > 1 && (
                          <button
                            onClick={() => removeConstraint(c.id)}
                            className="flex-shrink-0 p-2 hover:text-bauhaus-red transition-colors mt-5 self-center"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep('review')}
                    disabled={!form.title || !form.price || !form.budget}
                    className="btn-blue disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Review Campaign <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── REVIEW ── */}
            {step === 'review' && (
              <div className="space-y-6">
                <div className="bauhaus-card p-0 overflow-hidden">
                  <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-black text-bauhaus-white">
                    <span className="font-semibold text-sm uppercase tracking-widest">Review Campaign</span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">{form.title || 'Untitled Campaign'}</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-6">
                      {[
                        { l: 'Price / Submit', v: `${form.price || '—'} ETH`, bg: 'bg-bauhaus-red text-bauhaus-white' },
                        { l: 'Total Budget',   v: `${form.budget || '—'} ETH`, bg: 'bg-bauhaus-blue text-bauhaus-white' },
                        { l: 'Duration',       v: `${form.duration}d`,         bg: 'bg-bauhaus-yellow text-bauhaus-black' },
                        { l: 'Max Submitters', v: form.price && form.budget ? Math.floor(parseFloat(form.budget) / parseFloat(form.price)).toString() : '—', bg: 'bg-bauhaus-black text-bauhaus-white' },
                      ].map((s, i) => (
                        <div key={s.l} className={clsx('border-3 border-bauhaus-black p-4', i < 3 && 'border-r-0', s.bg)}>
                          <p className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-1">{s.l}</p>
                          <p className="text-2xl font-bold">{s.v}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <p className="section-label mb-3">Constraints Hash Preview</p>
                      <div className="bg-bauhaus-black p-4 font-mono text-xs text-bauhaus-white/60">
                        {constraints.map((c) => (
                          <div key={c.id} className="mb-1">
                            <span className="text-bauhaus-blue">{c.attribute}</span>
                            {' → '}
                            <span className="text-bauhaus-yellow">{c.type}</span>
                            {' → '}
                            <span className="text-bauhaus-white/80">{c.value}</span>
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-bauhaus-white/10 text-bauhaus-white/30">
                          constraintsHash: 0x{Math.random().toString(16).substr(2, 64)}
                        </div>
                      </div>
                    </div>

                    <AlertBanner
                      variant="warning"
                      title="Immutable after deployment"
                      message="Campaign constraints and price cannot be modified after the contract is deployed."
                      className="mb-6"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep('form')} className="btn-outline">
                    ← Edit
                  </button>
                  <button onClick={() => setStep('deploy')} className="btn-primary">
                    Deploy Campaign <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── DEPLOY ── */}
            {step === 'deploy' && (
              <div className="space-y-6">
                {!deployed ? (
                  <div className="bauhaus-card p-0 overflow-hidden">
                    <div className="px-6 py-4 border-b-3 border-bauhaus-black bg-bauhaus-yellow">
                      <span className="font-semibold text-sm uppercase tracking-widest">Deploy & Deposit Escrow</span>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-bauhaus-black/60 mb-6 font-mono">
                        Deploying campaign to CampaignManager.sol and depositing {form.budget} ETH escrow. Once deployed, the campaign is live and submissions can begin.
                      </p>
                      <div className="space-y-2 font-mono text-xs mb-6">
                        {[
                          ['Contract',        'CampaignManager.sol'],
                          ['Function',        'createCampaign() + depositEscrow()'],
                          ['Escrow Amount',   `${form.budget} ETH`],
                          ['Constraints Hash','0x8f3a…c712'],
                          ['Price/Submit',    `${form.price} ETH`],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between py-2 border-b border-bauhaus-black/10">
                            <span className="text-bauhaus-black/40 uppercase">{k}</span>
                            <span className="font-semibold">{v}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={deploy}
                        disabled={deploying}
                        className={clsx('btn-yellow', deploying && 'opacity-50 cursor-wait')}
                      >
                        {deploying ? 'Deploying…' : 'Deploy & Deposit Escrow'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bauhaus-card p-0 overflow-hidden">
                    <div className="bg-bauhaus-black px-6 py-8 text-bauhaus-white flex flex-col items-center text-center">
                      <GeoBadge shape="square" color="yellow" size="lg" className="mb-4" />
                      <h2 className="text-3xl font-bold mb-2">Campaign Live</h2>
                      <p className="text-bauhaus-white/50 font-mono text-sm">Escrow deposited. Submissions open.</p>
                    </div>
                    <div className="p-6 space-y-2 font-mono text-xs">
                      {[
                        ['Campaign ID',  '#47'],
                        ['Tx Hash',      txHash],
                        ['Escrow',       `${form.budget} ETH locked`],
                        ['Status',       'Active'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-2 border-b border-bauhaus-black/10">
                          <span className="text-bauhaus-black/40 uppercase">{k}</span>
                          <span className="font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 pb-6">
                      <a href="/marketplace" className="btn-primary">
                        View in Marketplace <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
