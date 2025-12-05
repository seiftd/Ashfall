import React from 'react';
import { Radio, Wind, Clock } from 'lucide-react';

interface OperationsPageProps {
  t: any;
}

const OperationsPage: React.FC<OperationsPageProps> = ({ t }) => {
  return (
    <div className="flex-1 p-8 overflow-auto z-20">
      <h2 className="text-4xl font-bold font-mono text-cyan-500 mb-8 flex items-center gap-3">
        <Radio className="animate-pulse" /> {t.operations}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Event Card */}
        <div className="col-span-1 md:col-span-2 bg-slate-900/90 border border-cyan-500/50 p-6 rounded-lg relative overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <div className="absolute top-0 end-0 p-2 bg-cyan-500 text-black text-xs font-bold font-mono uppercase shadow-lg">{t.active_now}</div>
          <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors pointer-events-none"></div>
          
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">{t.season_title}</h3>
            <Wind className="w-10 h-10 text-cyan-500 opacity-80" />
          </div>
          
          <div className="space-y-4 mb-6 relative z-10">
            <div className="bg-black/40 p-4 rounded border border-cyan-900/50 backdrop-blur-sm">
               <div className="text-xs text-cyan-400 uppercase font-bold mb-1 tracking-wider">{t.global_objective}</div>
               <div className="text-sm text-slate-300 leading-relaxed">{t.global_objective_desc}</div>
            </div>
            <div className="flex gap-6 text-xs font-mono">
               <span className="text-slate-400 uppercase">{t.ends_in}: <span className="text-white font-bold" dir="ltr">14D 03H 22M</span></span>
               <span className="text-slate-400 uppercase">{t.tier}: <span className="text-amber-500 font-bold shadow-amber-500/20 drop-shadow-md">LEGENDARY</span></span>
            </div>
          </div>
          
          <button className="px-6 py-2 bg-cyan-900/30 border border-cyan-500 text-cyan-400 text-sm font-bold uppercase hover:bg-cyan-500 hover:text-black transition-all hover:shadow-[0_0_15px_cyan]">
             {t.view_briefing}
          </button>
        </div>

        {/* Daily Challenges */}
        <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-lg">
           <h3 className="text-lg font-bold text-emerald-500 mb-4 flex items-center gap-2">
              <Clock size={18} /> {t.daily_directives}
           </h3>
           <ul className="space-y-3">
              {[
                { task: 'Extract 500 Carbon', progress: '320/500', reward: '50 Credits' },
                { task: 'Upgrade 1 Reactor', progress: '0/1', reward: '10 Isotopes' },
                { task: 'Scout 3 Sectors', progress: '3/3', reward: 'Claimed', done: true },
              ].map((m, i) => (
                 <li key={i} className={`text-sm p-3 rounded border transition-colors ${m.done ? 'bg-emerald-900/20 border-emerald-900/50 text-emerald-600 line-through opacity-70' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'}`}>
                    <div className="flex justify-between mb-1">
                       <span>{m.task}</span>
                       <span className="font-mono text-xs opacity-80" dir="ltr">{m.progress}</span>
                    </div>
                    <div className="text-[10px] text-amber-500 font-mono tracking-wide" dir="ltr">REWARD: {m.reward}</div>
                 </li>
              ))}
           </ul>
        </div>
      </div>

      {/* Upcoming Roadmap */}
      <h3 className="text-xl font-bold text-slate-500 mt-12 mb-6 uppercase tracking-wider border-b border-slate-800 pb-2 inline-block">{t.operational_forecast}</h3>
      <div className="relative border-s-2 border-slate-800 ms-4 space-y-8 pb-8">
         <div className="ps-6 relative group">
            <div className="absolute -start-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-slate-400 group-hover:bg-slate-700 transition-all"></div>
            <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">WEEK 2: MUTANT MIGRATION</div>
            <div className="text-xs text-slate-500 mt-1">Ash Crawlers expected to breach outer sectors. Prepare defenses.</div>
         </div>
         <div className="ps-6 relative group">
            <div className="absolute -start-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-slate-400 group-hover:bg-slate-700 transition-all"></div>
            <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">WEEK 4: ALLIANCE WARS</div>
            <div className="text-xs text-slate-500 mt-1">Territory control nodes unlock. PvP enabled in Neutral Zones.</div>
         </div>
         <div className="ps-6 relative group">
            <div className="absolute -start-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-slate-400 group-hover:bg-slate-700 transition-all"></div>
            <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">SEASON END: THE PURGE</div>
            <div className="text-xs text-slate-500 mt-1">Total server reset. Prestige rewards distribution.</div>
         </div>
      </div>
    </div>
  );
};

export default OperationsPage;
