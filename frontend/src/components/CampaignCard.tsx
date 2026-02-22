import { clsx } from 'clsx';

interface CampaignCardProps {
  id: string;
  company: string;
  title: string;
  attributes: string[];
  pricePerSubmit: string;
  budget: string;
  budgetUsed: number; // 0-100 percent
  deadline: string;
  status: 'active' | 'closing' | 'filled';
  onClick?: () => void;
}

const STATUS_STYLE: Record<string, string> = {
  active:  'bg-bauhaus-blue text-bauhaus-white',
  closing: 'bg-bauhaus-yellow text-bauhaus-black',
  filled:  'bg-bauhaus-black text-bauhaus-white',
};

export default function CampaignCard({
  company, title, attributes, pricePerSubmit, budget, budgetUsed, deadline, status, onClick
}: CampaignCardProps) {
  return (
    <div
      className="bauhaus-card flex flex-col cursor-pointer group p-0 overflow-hidden"
      onClick={onClick}
    >
      {/* Header stripe */}
      <div className="flex items-center justify-between px-5 py-3 bg-bauhaus-gray border-b-3 border-bauhaus-black">
        <span className="text-xs font-mono uppercase tracking-widest text-bauhaus-black/60">{company}</span>
        <span className={clsx('text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-bauhaus-black', STATUS_STYLE[status])}>
          {status}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-2 flex-1">
        <h3 className="text-base font-bold leading-tight mb-3">{title}</h3>

        {/* Attributes */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {attributes.map((attr) => (
            <span
              key={attr}
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 border-2 border-bauhaus-black bg-bauhaus-white"
            >
              {attr}
            </span>
          ))}
        </div>

        {/* Budget bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] font-mono mb-1 text-bauhaus-black/60">
            <span>Budget used</span>
            <span>{budgetUsed}%</span>
          </div>
          <div className="w-full h-2 bg-bauhaus-gray border-2 border-bauhaus-black overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-500',
                budgetUsed > 80 ? 'bg-bauhaus-red' : budgetUsed > 50 ? 'bg-bauhaus-yellow' : 'bg-bauhaus-blue'
              )}
              style={{ width: `${budgetUsed}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t-3 border-bauhaus-black bg-bauhaus-white group-hover:bg-bauhaus-black group-hover:text-bauhaus-white transition-colors">
        <div>
          <p className="text-lg font-bold">{pricePerSubmit}</p>
          <p className="text-[10px] font-mono text-bauhaus-black/40 group-hover:text-bauhaus-white/40">per submission</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold">{budget}</p>
          <p className="text-[10px] font-mono text-bauhaus-black/40 group-hover:text-bauhaus-white/40">
            Deadline: {deadline}
          </p>
        </div>
      </div>
    </div>
  );
}
