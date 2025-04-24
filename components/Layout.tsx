'use client';

import { useState } from 'react';
import { Moon, Settings, ChevronDown } from 'lucide-react';
import DigitalClock from './DigitalClock';
import Timer from './Timer';
import Stopwatch from './Stopwatch';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [activeView, setActiveView] = useState('clock');

  const handleToolsClick = () => {
    setIsToolsOpen(!isToolsOpen);
  };

  const sidebarItems = [
    { id: 'clock', label: 'Digital Clock', icon: '🕐' },
    { id: 'timer', label: 'Timer', icon: '⏲️' },
    { id: 'stopwatch', label: 'Stopwatch', icon: '⏱️' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'timer':
        return <Timer />;
      case 'stopwatch':
        return <Stopwatch />;
      default:
        return <DigitalClock />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/75">
        <div className="text-2xl font-bold text-white">Hi Clock</div>
        
        {/* View Switcher */}
        <div className="flex items-center space-x-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === item.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              aria-label={`Switch to ${item.label}`}
            >
              <span>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Button */}
        <button
          onClick={handleToolsClick}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default Layout; 