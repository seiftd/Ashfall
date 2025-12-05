import React from 'react';
import { Activity, Play, Radio, BookOpen, Settings, Map } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: any) => void;
  t: any;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate, t }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

      <div className="text-center mb-16 relative group cursor-default">
        <div className="absolute inset-0 bg-amber-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full"></div>
        <h1 className="text-8xl font-black font-mono tracking-tighter text-white mb-2 flex items-center justify-center gap-6 relative z-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
          <Activity className="w-20 h-20 text-amber-500 animate-float" />
          <span className="hover-glitch">ASHFALL</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-slate-700">DOMINION</span>
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-12 bg-amber-500/50"></div>
            <p className="text-amber-500 font-mono tracking-[0.6em] text-xs uppercase relative z-10">TACTICAL WARFARE SIMULATION v0.9.1</p>
            <div className="h-px w-12 bg-amber-500/50"></div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 w-80 relative z-10">
        <button onClick={() => onNavigate('world')} className="group relative px-8 py-5 bg-slate-900/80 border border-slate-700 hover:border-amber-500 transition-all text-start overflow-hidden clip-path-slant shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
           <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-transparent transition-all duration-500"></div>
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
           
           <div className="flex justify-between items-center relative z-10">
               <div>
                   <span className="text-2xl font-bold font-mono text-white group-hover:text-amber-400 transition-colors block">
                     {t.deploy}
                   </span>
                   <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-300 uppercase tracking-widest">{t.world_map}</span>
               </div>
               <Map size={24} className="text-slate-600 group-hover:text-amber-500 transition-colors rtl:rotate-180" />
           </div>
        </button>

        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => onNavigate('operations')} className="group relative px-4 py-4 bg-slate-900/80 border border-slate-700 hover:border-cyan-500 transition-all text-start overflow-hidden hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                <div className="flex flex-col items-center gap-2">
                    <Radio size={20} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-xs font-bold font-mono text-slate-300 group-hover:text-white uppercase">{t.operations}</span>
                </div>
            </button>
            
            <button onClick={() => onNavigate('archives')} className="group relative px-4 py-4 bg-slate-900/80 border border-slate-700 hover:border-emerald-500 transition-all text-start overflow-hidden hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                <div className="flex flex-col items-center gap-2">
                    <BookOpen size={20} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-xs font-bold font-mono text-slate-300 group-hover:text-white uppercase">{t.archives}</span>
                </div>
            </button>
        </div>

        <button onClick={() => onNavigate('settings')} className="group relative px-6 py-3 bg-transparent border border-slate-800 hover:border-purple-500 transition-all text-center rounded">
           <span className="text-xs font-bold font-mono text-slate-500 group-hover:text-purple-400 uppercase tracking-widest flex items-center justify-center gap-2">
             <Settings size={14} /> {t.settings}
           </span>
        </button>
      </div>
      
      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-[10px] text-slate-700 font-mono">
        SYSTEM READY // CONNECTION SECURE
      </div>
    </div>
  );
};

export default MainMenu;