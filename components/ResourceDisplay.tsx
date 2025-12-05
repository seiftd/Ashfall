import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ResourceDisplayProps {
  type: string;
  value: number;
  cap: number;
  icon: any;
  color: string;
  trend: number;
  t: any;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ type, value, cap, icon: Icon, color, trend, t }) => {
  const isFull = value >= cap;
  
  return (
    <div className={`flex flex-col bg-slate-900/90 border p-2 rounded relative overflow-hidden group transition-all duration-300 ${
      isFull 
        ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
        : 'border-slate-800'
    }`}>
      {/* Background Pulse for Full State */}
      {isFull && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>}
      
      <div className={`absolute top-0 left-0 w-1 h-full ${color} opacity-20`}></div>
      
      <div className="flex justify-between items-center mb-1 relative z-10">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${isFull ? 'text-red-500' : color.replace('bg-', 'text-')}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">{type}</span>
        </div>
        {isFull ? (
           <div className="flex items-center gap-1 text-red-500 animate-bounce">
             <AlertTriangle size={10} />
           </div>
        ) : (
           <span className={`text-[10px] font-mono ${trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : 'text-slate-600'}`} dir="ltr">
             {trend > 0 ? '+' : ''}{trend}/s
           </span>
        )}
      </div>
      
      <div className="flex items-end justify-between relative z-10">
        <span className={`text-xl font-mono leading-none ${isFull ? 'text-red-500' : 'text-white'}`}>{Math.floor(value)}</span>
        <span className="text-[10px] text-slate-500 font-mono" dir="ltr">/{cap}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full mt-1">
        <div 
          className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : color}`} 
          style={{ width: `${Math.min(100, (value / cap) * 100)}%` }}
        ></div>
      </div>
      
      {/* Max Badge */}
      {isFull && (
        <div className="absolute top-1 right-1 rtl:right-auto rtl:left-1 text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider shadow-sm z-20">
          {t.max_cap}
        </div>
      )}
    </div>
  );
};

export default ResourceDisplay;
