'use client';

import { Clock } from 'lucide-react';

interface TimerNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimerNotificationModal = ({ isOpen, onClose }: TimerNotificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md relative animate-bounce">
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="text-6xl text-blue-500">
              <Clock />
            </div>
            <div className="text-3xl font-bold text-white">
              Time's Up!
            </div>
            <div className="text-xl text-gray-300">
              Your timer has finished
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerNotificationModal; 