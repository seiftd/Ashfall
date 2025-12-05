import React from 'react';
import { Beaker, Sword, TrendingUp, Cpu, Shield, TestTube, Lock } from 'lucide-react';
import { GameState, TechId, TechBranch } from '../types';
import { RESEARCH_TREE } from '../data';

interface ResearchPageProps {
  gameState: GameState;
  onResearch: (id: TechId) => void;
  t: any;
}

const ResearchPage: React.FC<ResearchPageProps> = ({ gameState, onResearch, t }) => {
  const branches: TechBranch[] = ['military', 'economy', 'engineering']; // 'defense' removed for simplicity in UI if empty

  return (
    <div className="flex-1 p-8 overflow-auto z-20">
      <h2 className="text-4xl font-bold font-mono text-purple-500 mb-8 flex items-center gap-3">
        <Beaker className="animate-pulse" /> {t.research}
      </h2>

      {gameState.research.current && (
        <div className="bg-slate-900/90 border border-purple-500 p-4 rounded-lg mb-8 relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)]">
           <div className="flex justify-between items-end mb-2 relative z-10">
              <div>
                 <div className="text-xs text-purple-400 font-bold uppercase mb-1 flex items-center gap-2">
                    <TestTube size={12} className="animate-spin" /> {t.research_progress}
                 </div>
                 <div className="text-xl font-bold text-white">{t[RESEARCH_TREE[gameState.research.current.techId].nameKey]}</div>
              </div>
              <div className="text-2xl font-mono text-white" dir="ltr">
                 {Math.ceil(gameState.research.current.timer)}s
              </div>
           </div>
           <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative z-10">
              <div 
                className="h-full bg-purple-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(168,85,247,0.8)]" 
                style={{ width: `${((gameState.research.current.totalTime - gameState.research.current.timer) / gameState.research.current.totalTime) * 100}%` }}
              ></div>
           </div>
           <div className="absolute inset-0 bg-purple-500/5 animate-pulse pointer-events-none"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-bold text-slate-400 uppercase border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
               {branch === 'military' && <Sword size={16} />}
               {branch === 'economy' && <TrendingUp size={16} />}
               {branch === 'engineering' && <Cpu size={16} />}
               {t[branch]}
            </h3>
            <div className="space-y-4">
               {Object.values(RESEARCH_TREE).filter(tech => tech.branch === branch).map(tech => {
                  const unlocked = gameState.research.unlocked.includes(tech.id);
                  const researching = gameState.research.current?.techId === tech.id;
                  const requirementsMet = tech.reqTech.every(req => gameState.research.unlocked.includes(req));
                  const canAfford = (
                    gameState.resources.carbon >= (tech.cost.carbon || 0) &&
                    gameState.resources.ferrum >= (tech.cost.ferrum || 0) &&
                    gameState.resources.energy >= (tech.cost.energy || 0)
                  );

                  return (
                    <div key={tech.id} className={`p-3 rounded border relative group transition-all duration-200 ${
                        unlocked ? 'bg-emerald-900/10 border-emerald-900/50' :
                        researching ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' :
                        requirementsMet ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500' :
                        'bg-slate-950 border-slate-800 opacity-50'
                    }`}>
                       <div className="flex justify-between items-start mb-2">
                          <span className={`font-bold text-sm ${unlocked ? 'text-emerald-400' : researching ? 'text-purple-400' : requirementsMet ? 'text-white' : 'text-slate-600'}`}>
                             {t[tech.nameKey]}
                          </span>
                          {unlocked && <Shield size={14} className="text-emerald-500" />}
                          {researching && <TestTube size={14} className="text-purple-500 animate-bounce" />}
                          {!unlocked && !researching && !requirementsMet && <Lock size={14} className="text-slate-600" />}
                       </div>
                       <div className="text-[10px] text-slate-500 mb-3 leading-tight">{tech.description}</div>
                       
                       {!unlocked && !researching && (
                          <div className="flex justify-between items-end">
                             <div className="flex flex-col text-[9px] font-mono text-slate-400" dir="ltr">
                                {tech.cost.carbon && <span>C: {tech.cost.carbon}</span>}
                                {tech.cost.ferrum && <span>F: {tech.cost.ferrum}</span>}
                                {tech.cost.energy && <span>E: {tech.cost.energy}</span>}
                             </div>
                             {requirementsMet ? (
                                <button 
                                  onClick={() => canAfford && onResearch(tech.id)}
                                  disabled={!canAfford || !!gameState.research.current}
                                  className={`px-2 py-1 text-[9px] font-bold uppercase rounded border transition-all ${
                                     canAfford && !gameState.research.current
                                     ? 'bg-purple-900/30 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
                                     : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                                  }`}
                                >
                                   {t.start_research} ({tech.researchTime}s)
                                </button>
                             ) : (
                                <span className="text-[9px] text-red-500 uppercase font-bold">{t.req_tech}</span>
                             )}
                          </div>
                       )}
                    </div>
                  );
               })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchPage;
