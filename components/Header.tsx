'use client';

import Link from 'next/link';
import { Moon, Settings, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const Header = () => {
  return (
    <header className="h-14 bg-zinc-900 flex items-center justify-between px-4 border-b border-zinc-800">
      <Link 
        href="/" 
        className="text-2xl font-semibold text-white hover:text-white/90 transition-colors"
      >
        vClock
      </Link>
      
      <div className="flex items-center gap-6">
        <Link 
          href="/holidays" 
          className="text-white hover:text-white/90 transition-colors"
        >
          Holidays
        </Link>
        
        <div className="relative group">
          <button 
            className="flex items-center gap-1 text-white hover:text-white/90 transition-colors"
            aria-label="Tools menu"
          >
            Tools
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 text-white/90 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            <Moon size={20} />
          </button>
          <button
            className="p-2 text-white/90 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 