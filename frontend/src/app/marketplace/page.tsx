'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, ArrowRight, ChevronDown } from 'lucide-react';
import CampaignCard from '@/components/CampaignCard';
import GeoBadge from '@/components/GeoBadge';
import { clsx } from 'clsx';
import Link from 'next/link';

const CAMPAIGNS = [
  {
    id: 'c1',
    company: 'AxisBank Analytics',
    title: 'Monthly UPI Spend — Urban India Users',
    attributes: ['Age Range', 'Region', 'Spend > ₹5k/mo'],
    pricePerSubmit: '0.045 ETH',
    budget: '4.5 ETH budget',
    budgetUsed: 24,
    deadline: 'Mar 15',
    status: 'active' as const,
  },
  {
    id: 'c2',
    company: 'Jio Telemetry',
    title: '5G-Enabled Device Attribution — Tier 1 Cities',
    attributes: ['Device Type', 'Network Region', 'App Category'],
    pricePerSubmit: '0.028 ETH',
    budget: '2.8 ETH budget',
    budgetUsed: 71,
    deadline: 'Feb 28',
    status: 'closing' as const,
  },
  {
    id: 'c3',
    company: 'QuantumHealth',
    title: 'Fitness & Sleep Correlation — 30-Day Protocol',
    attributes: ['Age Range', 'Step Count Avg', 'Sleep Score'],
    pricePerSubmit: '0.092 ETH',
    budget: '9.2 ETH budget',
    budgetUsed: 8,
    deadline: 'Apr 01',
    status: 'active' as const,
  },
  {
    id: 'c4',
    company: 'NeoBank X',
    title: 'Credit-Worthy Population — Salaried Segment',
    attributes: ['Income Bracket', 'Employer Type', 'Region'],
    pricePerSubmit: '0.110 ETH',
    budget: '11 ETH budget',
    budgetUsed: 55,
    deadline: 'Mar 30',
    status: 'active' as const,
  },
  {
    id: 'c5',
    company: 'MediaStream Ltd',
    title: 'Content Genre Preferences — 18–35 cohort',
    attributes: ['Age Range', 'Gender', 'Watch Hours/week'],
    pricePerSubmit: '0.018 ETH',
    budget: '1.8 ETH budget',
    budgetUsed: 99,
    deadline: 'Feb 22',
    status: 'filled' as const,
  },
  {
    id: 'c6',
    company: 'RuralFintech DAO',
    title: 'Rural Payment Behaviour — Non-Metro India',
    attributes: ['Region (Rural)', 'Payment Frequency', 'Avg Txn Size'],
    pricePerSubmit: '0.065 ETH',
    budget: '6.5 ETH budget',
    budgetUsed: 34,
    deadline: 'Mar 20',
    status: 'active' as const,
  },
];

const ATTR_FILTERS = ['Age Range', 'Region', 'Income', 'Spend', 'Device', 'Health', 'Media'];
const STATUS_FILTERS = ['all', 'active', 'closing', 'filled'];

export default function MarketplacePage() {
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [attrFilters, setAttrFilters]   = useState<string[]>([]);
  const [sortBy, setSortBy]       = useState('price-desc');
  const [showFilters, setShowFilters] = useState(false);

  const toggleAttr = (attr: string) => {
    setAttrFilters(prev =>
      prev.includes(attr) ? prev.filter(a => a !== attr) : [...prev, attr]
    );
  };

  const filtered = CAMPAIGNS
    .filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.company.toLowerCase().includes(search.toLowerCase())) return false;
      if (attrFilters.length > 0 && !attrFilters.some(f => c.attributes.some(a => a.toLowerCase().includes(f.toLowerCase())))) return false;
      return true;
    })
    .sort((a, b) => {
      const pa = parseFloat(a.pricePerSubmit);
      const pb = parseFloat(b.pricePerSubmit);
      if (sortBy === 'price-desc') return pb - pa;
      if (sortBy === 'price-asc')  return pa - pb;
      if (sortBy === 'budget')     return b.budgetUsed - a.budgetUsed;
      return 0;
    });

  return (
    <div className="min-h-screen bg-bauhaus-white">
      {/* Header */}
      <div className="border-b-3 border-bauhaus-black">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-1 bg-bauhaus-blue" />
                <span className="section-label">Live Campaigns</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight">Campaign<br />Marketplace</h1>
            </div>
            <div className="flex items-end gap-8">
              {[
                { v: CAMPAIGNS.filter(c => c.status === 'active').length,  l: 'Active',  color: 'bg-bauhaus-blue'   },
                { v: CAMPAIGNS.filter(c => c.status === 'closing').length, l: 'Closing', color: 'bg-bauhaus-yellow' },
                { v: CAMPAIGNS.filter(c => c.status === 'filled').length,  l: 'Filled',  color: 'bg-bauhaus-black'  },
              ].map((s) => (
                <div key={s.l} className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <div className={`w-2.5 h-2.5 ${s.color} border-2 border-bauhaus-black`} />
                    <p className="text-2xl font-bold">{s.v}</p>
                  </div>
                  <p className="text-xs font-mono text-bauhaus-black/40 uppercase tracking-widest">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-40 bg-bauhaus-white border-b-3 border-bauhaus-black">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bauhaus-black/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search campaigns…"
              className="bauhaus-input pl-9 py-2 text-sm"
            />
          </div>

          {/* Status pills */}
          <div className="flex gap-0">
            {STATUS_FILTERS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx(
                  'px-4 py-2 text-xs font-semibold uppercase tracking-widest border-3 border-bauhaus-black transition-colors',
                  i > 0 && 'border-l-0',
                  statusFilter === s ? 'bg-bauhaus-black text-bauhaus-white' : 'bg-bauhaus-white hover:bg-bauhaus-gray'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bauhaus-input py-2 pr-8 text-xs appearance-none cursor-pointer"
            >
              <option value="price-desc">Highest Price</option>
              <option value="price-asc">Lowest Price</option>
              <option value="budget">Budget Remaining</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx('btn-outline py-2 px-3 text-xs', showFilters && 'bg-bauhaus-black text-bauhaus-white')}
          >
            <SlidersHorizontal size={12} /> Attributes
          </button>
        </div>

        {/* Attribute filter row */}
        {showFilters && (
          <div className="border-t-3 border-bauhaus-black">
            <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-2">
              {ATTR_FILTERS.map((attr) => (
                <button
                  key={attr}
                  onClick={() => toggleAttr(attr)}
                  className={clsx(
                    'px-3 py-1.5 text-xs font-semibold uppercase tracking-widest border-3 border-bauhaus-black transition-colors',
                    attrFilters.includes(attr) ? 'bg-bauhaus-red text-bauhaus-white' : 'bg-bauhaus-white hover:bg-bauhaus-gray'
                  )}
                >
                  {attr}
                </button>
              ))}
              {attrFilters.length > 0 && (
                <button onClick={() => setAttrFilters([])} className="px-3 py-1.5 text-xs font-mono text-bauhaus-black/50 hover:text-bauhaus-red">
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="bauhaus-card p-16 text-center">
            <GeoBadge shape="triangle" color="yellow" size="xl" className="mx-auto mb-6" />
            <p className="font-bold text-lg uppercase tracking-wide">No campaigns match</p>
            <p className="text-sm font-mono text-bauhaus-black/50 mt-2">Adjust filters or clear search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0">
            {filtered.map((c, i) => (
              <div
                key={c.id}
                style={{
                  borderRight:  (i + 1) % 3 === 0 ? 'none' : undefined,
                  borderBottom: Math.floor(i / 3) < Math.floor((filtered.length - 1) / 3) ? 'none' : undefined,
                }}
              >
                <Link href={`/submit?campaign=${c.id}`}>
                  <CampaignCard {...c} />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Post campaign CTA */}
        <div className="mt-16 border-3 border-bauhaus-black p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-bauhaus-black text-bauhaus-white">
          <div className="flex items-center gap-6">
            <GeoBadge shape="circle" color="yellow" size="lg" />
            <div>
              <p className="font-bold text-lg uppercase tracking-wide">Are you a company?</p>
              <p className="text-bauhaus-white/50 font-mono text-sm mt-1">Post a campaign, deposit escrow, receive ZK-verified attribute data.</p>
            </div>
          </div>
          <Link href="/create-campaign" className="btn-yellow flex-shrink-0">
            Create Campaign <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
