'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Sparkles, Layers, FileSpreadsheet, PlusCircle, LayoutDashboard, Database, Settings, LogOut } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v1.0 SaaS
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/jobs/new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Process Product</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Job', href: '/jobs/new', icon: PlusCircle },
    { name: 'Bulk Processing', href: '/bulk', icon: Layers },
    { name: 'Exports & Downloads', href: '/exports', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 p-4 flex flex-col justify-between hidden md:flex h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/60">
        <div className="px-3 py-3 rounded-xl bg-slate-900/40 border border-slate-800/40 mb-3">
          <p className="text-xs font-medium text-slate-300">Active Engine</p>
          <p className="text-xs text-indigo-400 font-mono mt-0.5">Dual AI (Live / Synthetic)</p>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
