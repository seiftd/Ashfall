import React from 'react';
import { Lock } from 'lucide-react';
import { BuildingType, ResourceType, TechId, Cost } from '../types';
import { BUILDINGS } from '../data';

interface BuildMenuProps {
  onBuild: (type: BuildingType) => void;
  resources: Record<ResourceType, number>;
  research: TechId[];
  t: any;
}

const BuildMenu: React.FC<BuildMenuProps> = ({ onBuild, resources, research, t }) => {
  const canAfford = (cost: Cost) => (
      (cost.carbon || 0) <= resources.carbon &&
      (cost.ferrum || 0) <= resources.ferrum &&
      (cost.isotopes || 0) <= resources.isotopes &&
      (cost.energy || 0) <= resources.energy
  );

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-1">
      <div className="grid grid-cols-1 gap-3">
        {Object.values(BUILDINGS).map((b) => {
          const affordable = canAfford(b.cost);
          const reqMet = b.reqTech.every(req => research.includes(req));
          const name = t[b.nameKey] || b.nameKey;
          
          if (!reqMet) return null;

          return (
            <button
              key={b.id}
              onClick={() => reqMet && affordable && onBuild(b.id)}
              disabled={!reqMet || !affordable}
              className={`
                relative flex flex-col p-0 border text-start transition-all group overflow-hidden rounded-lg
                ${affordable 
                    ? 'border-slate-700 bg-slate-900/40 hover:bg-slate-800 hover:border-amber-500 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                    : 'border-slate-800 bg-slate-950/30 opacity-60 cursor-not-allowed grayscale'
                }
              `}
            >
              {/* Header / Title Bar */}
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 border-b border-slate-800 w-full">
                  <div className={`p-1.5 rounded-md bg-slate-950 border border-slate-700 ${affordable ? 'text-amber-500 group-hover:text-amber-400 group-hover:border-amber-500/50' : 'text-slate-600'}`}>
                      <b.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between items-center">
                          <span className={`font-bold font-mono text-sm uppercase ${affordable ? 'text-slate-200' : 'text-slate-500'}`}>{name}</span>
                          <span className="text-[9px] text-slate-500 font-mono bg-black/40 px-1.5 py-0.5 rounded" dir="ltr">{b.buildTime}s</span>
                      </div>
                  </div>
              </div>

              {/* Body */}
              <div className="p-3 w-full">
                  <div className="text-[10px] text-slate-400 mb-3 leading-relaxed min-h-[2.5em]">{b.description}</div>
                  
                  {/* Cost Grid */}
                  <div className="grid grid-cols-3 gap-2" dir="ltr">
                    {b.cost.carbon ? (
                        <div className={`text-[9px] font-mono px-1.5 py-1 rounded bg-black/30 border border-slate-800 text-center ${resources.carbon >= b.cost.carbon ? 'text-slate-400' : 'text-red-500 border-red-900/50'}`}>
                            C: {b.cost.carbon}
                        </div>
                    ) : null}
                    {b.cost.ferrum ? (
                        <div className={`text-[9px] font-mono px-1.5 py-1 rounded bg-black/30 border border-slate-800 text-center ${resources.ferrum >= b.cost.ferrum ? 'text-slate-400' : 'text-red-500 border-red-900/50'}`}>
                            F: {b.cost.ferrum}
                        </div>
                    ) : null}
                    {b.cost.energy ? (
                        <div className={`text-[9px] font-mono px-1.5 py-1 rounded bg-black/30 border border-slate-800 text-center ${resources.energy >= b.cost.energy ? 'text-cyan-400' : 'text-red-500 border-red-900/50'}`}>
                            E: {b.cost.energy}
                        </div>
                    ) : null}
                  </div>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BuildMenu;