'use client';

import { useState } from 'react';
import { Moon, Settings, ChevronDown } from 'lucide-react';
import DigitalClock from './DigitalClock';
import Timer from './Timer';

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
    { id: 'alarm', label: 'Alarm Clock', icon: '⏰' },
    { id: 'timer', label: 'Timer', icon: '⏲️' },
    { id: 'stopwatch', label: 'Stopwatch', icon: '⏱️' },
    { id: 'time', label: 'Time', icon: '🕐' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'timer':
        return <Timer />;
      default:
        return <DigitalClock />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/75">
        <div className="text-2xl font-bold text-white">vClock</div>
        
        <div className="flex items-center space-x-6">
          <button className="text-gray-300 hover:text-white transition-colors">
            Holidays
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              onClick={handleToolsClick}
            >
              <span>Tools</span>
              <ChevronDown size={16} className={`transform transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isToolsOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl">
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Option 1
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Option 2
                </a>
              </div>
            )}
          </div>
          
          <button className="text-gray-300 hover:text-white transition-colors">
            <Moon size={20} />
          </button>
          
          <button className="text-gray-300 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/75">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full py-4 flex flex-col items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors ${
              activeView === item.id ? 'bg-gray-700/50 text-white' : ''
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="pt-16 pl-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default Layout; 