import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: 'red' | 'blue' | 'yellow' | 'black';
}

const ACCENT_BG: Record<string, string> = {
  red:    'bg-bauhaus-red',
  blue:   'bg-bauhaus-blue',
  yellow: 'bg-bauhaus-yellow',
  black:  'bg-bauhaus-black',
};

const ACCENT_TEXT: Record<string, string> = {
  red:    'text-bauhaus-white',
  blue:   'text-bauhaus-white',
  yellow: 'text-bauhaus-black',
  black:  'text-bauhaus-white',
};

export default function StatCard({ label, value, sub, accent = 'black' }: StatCardProps) {
  return (
    <div className="bauhaus-card p-0 overflow-hidden">
      <div className={clsx('px-5 pt-4 pb-3', ACCENT_BG[accent])}>
        <span className={clsx('text-xs font-semibold uppercase tracking-[0.2em] opacity-80', ACCENT_TEXT[accent])}>
          {label}
        </span>
      </div>
      <div className="px-5 py-4 bg-bauhaus-white">
        <p className="text-3xl font-bold tracking-tight leading-none">{value}</p>
        {sub && <p className="mt-1 text-xs text-bauhaus-black/50 font-mono">{sub}</p>}
      </div>
    </div>
  );
}
