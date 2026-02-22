import { clsx } from 'clsx';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

type Variant = 'info' | 'success' | 'warning' | 'error';

interface AlertBannerProps {
  variant?: Variant;
  title: string;
  message?: string;
  className?: string;
}

const CONFIG: Record<Variant, { icon: React.ElementType; bg: string; border: string; iconColor: string }> = {
  info:    { icon: Info,          bg: 'bg-bauhaus-blue/10',   border: 'border-bauhaus-blue',   iconColor: 'text-bauhaus-blue'  },
  success: { icon: CheckCircle2,  bg: 'bg-bauhaus-blue/5',    border: 'border-bauhaus-black',  iconColor: 'text-bauhaus-black' },
  warning: { icon: AlertTriangle, bg: 'bg-bauhaus-yellow/30', border: 'border-bauhaus-yellow', iconColor: 'text-bauhaus-black' },
  error:   { icon: XCircle,       bg: 'bg-bauhaus-red/10',    border: 'border-bauhaus-red',    iconColor: 'text-bauhaus-red'   },
};

export default function AlertBanner({ variant = 'info', title, message, className }: AlertBannerProps) {
  const { icon: Icon, bg, border, iconColor } = CONFIG[variant];
  return (
    <div className={clsx('flex gap-3 p-4 border-3', bg, border, className)}>
      <Icon size={18} className={clsx('flex-shrink-0 mt-0.5', iconColor)} />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {message && <p className="text-xs text-bauhaus-black/60 mt-0.5 font-mono">{message}</p>}
      </div>
    </div>
  );
}
