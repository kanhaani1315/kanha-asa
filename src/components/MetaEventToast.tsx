import React, { useState, useEffect } from 'react';
import { MetaEvent } from '../types';
import { subscribeToMetaEvents } from '../utils/metaTracker';
import { Zap, CheckCircle2 } from 'lucide-react';

export const MetaEventToast: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<MetaEvent | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMetaEvents((event) => {
      setActiveEvent(event);
      const timer = setTimeout(() => {
        setActiveEvent(null);
      }, 3500);
      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!activeEvent) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-right duration-200">
      <div className="bg-stone-900 border border-emerald-500/60 shadow-xl rounded-lg p-3 text-stone-100 flex items-center gap-3 max-w-sm backdrop-blur-md">
        <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
            <span>Meta Pixel Event Fired:</span>
            <span className="font-mono text-white bg-stone-800 px-1.5 py-0.5 rounded text-[11px]">
              {activeEvent.eventName}
            </span>
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5 truncate">
            {activeEvent.payload?.content_name || activeEvent.payload?.concern || 'Event logged successfully'}
          </p>
        </div>
      </div>
    </div>
  );
};
