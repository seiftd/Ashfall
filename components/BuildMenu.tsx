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
      <div className="grid grid-cols-1 gap-2">
        {Object.values(BUILDINGS).map((b) => {
          const affordable = canAfford(b.cost);
          const reqMet = b.reqTech.every(req => research.includes(req));
          const name = t[b.nameKey] || b.nameKey;
          
          // If prerequisites not met, rendering a locked card with info
          
          return (
            <button
              key={b.id}
              onClick={() => reqMet && affordable && onBuild(b.id)}
              disabled={!reqMet || !affordable}
              className={`flex items-center p-3 border text-start transition-all group relative overflow-hidden rounded-md
                ${!reqMet 
                    ? 'border-slate-800 bg-slate-950/50 opacity-40 cursor-not-allowed' 
                    : affordable 
                        ? 'border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-amber-500 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                        : 'border-slate-800 bg-slate-950 opacity-60 cursor-not-allowed'
                }
              `}
            >
              <div className={`p-2 rounded bg-slate-800 me-3 shadow-inner ${affordable && reqMet ? 'text-amber-500 group-hover:text-amber-400' : 'text-slate-600'}`}>
                  <b.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                    <span className={`font-bold font-mono text-sm ${affordable && reqMet ? 'text-slate-200' : 'text-slate-500'}`}>{name}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-900 px-1 rounded" dir="ltr">{b.buildTime}s</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-1 leading-tight">{b.description}</div>
                
                {reqMet ? (
                    <div className="flex gap-2 flex-wrap" dir="ltr">
                    {b.cost.carbon && <span className={`text-[10px] font-mono ${resources.carbon >= b.cost.carbon ? 'text-slate-400' : 'text-red-500'}`}>C:{b.cost.carbon}</span>}
                    {b.cost.ferrum && <span className={`text-[10px] font-mono ${resources.ferrum >= b.cost.ferrum ? 'text-slate-400' : 'text-red-500'}`}>F:{b.cost.ferrum}</span>}
                    {b.cost.energy && <span className={`text-[10px] font-mono ${resources.energy >= b.cost.energy ? 'text-cyan-400' : 'text-red-500'}`}>E:{b.cost.energy}</span>}
                    {b.storage?.carbon && <span className="text-[10px] text-emerald-500 font-bold">+Cap</span>}
                    </div>
                ) : (
                    <div className="text-[9px] text-red-500 uppercase flex items-center gap-1 font-bold">
                        <Lock size={10} /> {t.req_tech}
                    </div>
                )}
              </div>
              {(!affordable && reqMet) && <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none"></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BuildMenu;
