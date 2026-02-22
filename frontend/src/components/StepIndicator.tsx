import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  sublabel?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number;
  orientation?: 'horizontal' | 'vertical';
}

export default function StepIndicator({ steps, current, orientation = 'horizontal' }: StepIndicatorProps) {
  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-0">
        {steps.map((step, i) => {
          const done    = i < current;
          const active  = i === current;
          return (
            <div key={i} className="flex gap-4">
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div className={clsx(
                  'w-8 h-8 flex items-center justify-center border-3 border-bauhaus-black flex-shrink-0 font-bold text-sm',
                  done   && 'bg-bauhaus-black text-bauhaus-white',
                  active && 'bg-bauhaus-red text-bauhaus-white',
                  !done && !active && 'bg-bauhaus-white text-bauhaus-black/40'
                )}>
                  {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={clsx(
                    'w-0.5 flex-1 min-h-[2rem] mt-1',
                    done ? 'bg-bauhaus-black' : 'bg-bauhaus-gray'
                  )} />
                )}
              </div>
              {/* Text */}
              <div className="pt-1 pb-6">
                <p className={clsx('text-sm font-semibold uppercase tracking-widest', !active && !done && 'text-bauhaus-black/40')}>{step.label}</p>
                {step.sublabel && <p className="text-[11px] font-mono text-bauhaus-black/40 mt-0.5">{step.sublabel}</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={clsx(
                'w-8 h-8 flex items-center justify-center border-3 border-bauhaus-black font-bold text-sm',
                done   && 'bg-bauhaus-black text-bauhaus-white',
                active && 'bg-bauhaus-red text-bauhaus-white',
                !done && !active && 'bg-bauhaus-white text-bauhaus-black/30'
              )}>
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              <span className={clsx(
                'text-[9px] font-semibold uppercase tracking-widest whitespace-nowrap',
                active ? 'text-bauhaus-red' : done ? 'text-bauhaus-black' : 'text-bauhaus-black/30'
              )}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={clsx('h-0.5 w-8 mx-1 mt-[-10px]', done ? 'bg-bauhaus-black' : 'bg-bauhaus-gray')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
