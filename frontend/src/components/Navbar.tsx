'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { clsx } from 'clsx';
import GeoBadge from './GeoBadge';
import { CustomConnectButton } from './WalletConnect';

const CUSTOMER_LINKS = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/submit',      label: 'Submit Data'  },
  { href: '/dashboard',   label: 'Dashboard'    },
  { href: '/identity',    label: 'Identity'     },
];

const COMPANY_LINKS = [
  { href: '/company',     label: 'Dashboard'    },
  { href: '/marketplace', label: 'Marketplace'  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isCompany = pathname.startsWith('/company');
  const NAV_LINKS = isCompany ? COMPANY_LINKS : CUSTOMER_LINKS;
  const toggleHref = isCompany ? '/dashboard' : '/company';
  const toggleLabel = isCompany ? 'Login as Customer' : 'Login as Company';

  return (
    <header className="sticky top-0 z-50 bg-bauhaus-white border-b-3 border-bauhaus-black">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex-shrink-0">
            {/* Bauhaus logo mark: circle + square + triangle */}
            <div className="absolute inset-0 geo-circle bg-bauhaus-red" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-bauhaus-yellow border-2 border-bauhaus-black" />
          </div>
          <span className="font-bold text-xl tracking-[0.12em] uppercase text-bauhaus-black group-hover:text-bauhaus-red transition-colors">
            SCOURGE
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-colors border-3 border-transparent',
                pathname === link.href
                  ? 'bg-bauhaus-black text-bauhaus-white border-bauhaus-black'
                  : 'text-bauhaus-black hover:border-bauhaus-black hover:bg-bauhaus-gray'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={toggleHref}
            className={clsx(
              'px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-colors border-3',
              isCompany
                ? 'border-bauhaus-red bg-bauhaus-red text-bauhaus-white hover:bg-bauhaus-red/90'
                : 'border-bauhaus-blue bg-bauhaus-blue text-bauhaus-white hover:bg-bauhaus-blue/90'
            )}
          >
            {toggleLabel}
          </Link>
        </nav>

        {/* Wallet connect */}
        <div className="hidden md:flex items-center gap-3">
          <GeoBadge color="yellow" shape="circle" size="sm" />
          <CustomConnectButton />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden bauhaus-border p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className={clsx('w-5 h-0.5 bg-bauhaus-black mb-1.5 transition-transform', open && 'rotate-45 translate-y-2')} />
          <div className={clsx('w-5 h-0.5 bg-bauhaus-black mb-1.5 transition-opacity', open && 'opacity-0')} />
          <div className={clsx('w-5 h-0.5 bg-bauhaus-black transition-transform', open && '-rotate-45 -translate-y-2')} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t-3 border-bauhaus-black bg-bauhaus-white">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={clsx(
                'block px-6 py-4 text-sm font-semibold uppercase tracking-widest border-b-3 border-bauhaus-black',
                pathname === link.href
                  ? 'bg-bauhaus-black text-bauhaus-white'
                  : 'hover:bg-bauhaus-gray'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={toggleHref}
            onClick={() => setOpen(false)}
            className={clsx(
              'block px-6 py-4 text-sm font-semibold uppercase tracking-widest border-b-3 border-bauhaus-black',
              isCompany
                ? 'bg-bauhaus-red text-bauhaus-white'
                : 'bg-bauhaus-blue text-bauhaus-white'
            )}
          >
            {toggleLabel}
          </Link>
          <div className="p-4">
            <CustomConnectButton />
          </div>
        </div>
      )}
    </header>
  );
}
