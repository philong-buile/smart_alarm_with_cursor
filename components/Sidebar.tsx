'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlarmClock, Timer, Clock, Watch, Share2, Minus, Plus, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';

const sidebarItems = [
  {
    name: 'Alarm Clock',
    icon: AlarmClock,
    href: '/',
  },
  {
    name: 'Timer',
    icon: Timer,
    href: '/timer',
  },
  {
    name: 'Stopwatch',
    icon: Watch,
    href: '/stopwatch',
  },
  {
    name: 'Time',
    icon: Clock,
    href: '/time',
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav 
      className="flex flex-col h-[calc(100vh-3.5rem)] bg-zinc-800"
      aria-label="Main navigation"
    >
      <div className="flex-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative w-[80px] h-[80px] flex flex-col items-center justify-center text-center gap-2',
                'transition-all duration-200',
                isActive ? 'bg-zinc-300 text-zinc-900' : 'text-zinc-400 hover:bg-zinc-700/50'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                <item.icon size={24} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap w-[80px] p-2 gap-1 border-t border-zinc-700">
        <button
          className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded transition-colors"
          aria-label="Share"
        >
          <Share2 size={18} />
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded transition-colors"
          aria-label="Zoom out"
        >
          <Minus size={18} />
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded transition-colors"
          aria-label="Zoom in"
        >
          <Plus size={18} />
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded transition-colors"
          aria-label="Full screen"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Sidebar; 