import React from 'react';
import { Activity, Play, Radio, BookOpen, Settings, Map } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: any) => void;
  t: any;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate, t }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-20">
      <div className="text-center mb-12 relative group cursor-default">
        <div className="absolute inset-0 bg-amber-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full"></div>
        <h1 className="text-7xl font-black font-mono tracking-tighter text-white mb-2 flex items-center justify-center gap-4 relative z-10 drop-shadow-2xl">
          <Activity className="w-16 h-16 text-amber-500 animate-pulse" />
          ASHFALL <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">DOMINION</span>
        </h1>
        <p className="text-amber-500 font-mono tracking-[0.8em] text-sm uppercase relative z-10 pl-2">Prototype Build v0.9.1</p>
      </div>
      
      <div className="flex flex-col gap-4 w-72">
        <button onClick={() => onNavigate('world')} className="group relative px-8 py-5 bg-slate-900 border border-slate-700 hover:border-amber-500 transition-all text-start overflow-hidden">
           <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors"></div>
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
           <span className="text-2xl font-bold font-mono text-white group-hover:text-amber-500 transition-colors flex items-center justify-between relative z-10">
             {t.deploy} <Map size={20} className="rtl:rotate-180" />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase relative z-10 tracking-widest">{t.world_map}</span>
        </button>
        <button onClick={() => onNavigate('operations')} className="group relative px-8 py-5 bg-slate-900 border border-slate-700 hover:border-cyan-500 transition-all text-start overflow-hidden">
           <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors"></div>
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
           <span className="text-2xl font-bold font-mono text-white group-hover:text-cyan-500 transition-colors flex items-center justify-between relative z-10">
             {t.operations} <Radio size={20} />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase relative z-10 tracking-widest">{t.live_events}</span>
        </button>
        <button onClick={() => onNavigate('archives')} className="group relative px-8 py-5 bg-slate-900 border border-slate-700 hover:border-emerald-500 transition-all text-start overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors"></div>
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
           <span className="text-2xl font-bold font-mono text-white group-hover:text-emerald-500 transition-colors flex items-center justify-between relative z-10">
             {t.archives} <BookOpen size={20} />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase relative z-10 tracking-widest">{t.database}</span>
        </button>
        <button onClick={() => onNavigate('settings')} className="group relative px-8 py-5 bg-slate-900 border border-slate-700 hover:border-purple-500 transition-all text-start overflow-hidden">
           <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors"></div>
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
           <span className="text-2xl font-bold font-mono text-white group-hover:text-purple-500 transition-colors flex items-center justify-between relative z-10">
             {t.settings} <Settings size={20} />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase relative z-10 tracking-widest">{t.system_config}</span>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;