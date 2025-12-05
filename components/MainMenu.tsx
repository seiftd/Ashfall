import React from 'react';
import { Activity, Play, Radio, BookOpen, Settings } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: any) => void;
  t: any;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate, t }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-20">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black font-mono tracking-tighter text-white mb-2 flex items-center justify-center gap-4">
          <Activity className="w-12 h-12 text-amber-500 animate-pulse" />
          ASHFALL DOMINION
        </h1>
        <p className="text-amber-500 font-mono tracking-[0.5em] text-sm uppercase">Prototype Build v0.9.1</p>
      </div>
      
      <div className="flex flex-col gap-4 w-64">
        <button onClick={() => onNavigate('game')} className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-amber-500 transition-all text-start">
           <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors"></div>
           <span className="text-xl font-bold font-mono text-white group-hover:text-amber-500 transition-colors flex items-center justify-between">
             {t.deploy} <Play size={16} className="rtl:rotate-180" />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase">{t.resume_sim}</span>
        </button>
        <button onClick={() => onNavigate('operations')} className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-cyan-500 transition-all text-start">
           <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors"></div>
           <span className="text-xl font-bold font-mono text-white group-hover:text-cyan-500 transition-colors flex items-center justify-between">
             {t.operations} <Radio size={16} />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase">{t.live_events}</span>
        </button>
        <button onClick={() => onNavigate('archives')} className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-emerald-500 transition-all text-start">
           <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors"></div>
           <span className="text-xl font-bold font-mono text-white group-hover:text-emerald-500 transition-colors flex items-center justify-between">
             {t.archives} <BookOpen size={16} />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase">{t.database}</span>
        </button>
        <button onClick={() => onNavigate('settings')} className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-purple-500 transition-all text-start">
           <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors"></div>
           <span className="text-xl font-bold font-mono text-white group-hover:text-purple-500 transition-colors flex items-center justify-between">
             {t.settings} <Settings size={16} />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase">{t.system_config}</span>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
