import { clsx } from 'clsx';

type Shape = 'circle' | 'square' | 'triangle';
type Color = 'red' | 'yellow' | 'blue' | 'black' | 'white';
type Size  = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface GeoBadgeProps {
  shape?: Shape;
  color?: Color;
  size?:  Size;
  border?: boolean;
  className?: string;
  spin?: boolean;
}

const SIZE_MAP: Record<Size, string> = {
  sm:  'w-4  h-4',
  md:  'w-8  h-8',
  lg:  'w-16 h-16',
  xl:  'w-24 h-24',
  '2xl': 'w-40 h-40',
};

const COLOR_BG: Record<Color, string> = {
  red:    'bg-bauhaus-red',
  yellow: 'bg-bauhaus-yellow',
  blue:   'bg-bauhaus-blue',
  black:  'bg-bauhaus-black',
  white:  'bg-bauhaus-white',
};

export default function GeoBadge({
  shape   = 'square',
  color   = 'red',
  size    = 'md',
  border  = true,
  className,
  spin    = false,
}: GeoBadgeProps) {
  const base = clsx(
    SIZE_MAP[size],
    COLOR_BG[color],
    border && 'border-3 border-bauhaus-black',
    spin && 'animate-spin-slow',
    shape === 'circle' && 'rounded-full',
    shape === 'triangle' && 'geo-triangle border-0',
    className
  );

  return <div className={base} aria-hidden="true" />;
}
