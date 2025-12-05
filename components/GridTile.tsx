import React from 'react';
import { Hexagon, Hammer, ArrowUpCircle, Sword } from 'lucide-react';
import { GridSlot } from '../types';
import { BUILDINGS } from '../data';

interface GridTileProps {
  slot: GridSlot;
  isSelected: boolean;
  onClick: () => void;
  t: any;
}

const GridTile: React.FC<GridTileProps> = ({ slot, isSelected, onClick, t }) => {
  const building = slot.buildingId ? BUILDINGS[slot.buildingId] : null;
  return (
    <div 
      onClick={onClick}
      className={`aspect-square border-2 relative cursor-pointer transition-all duration-200 group overflow-hidden ${isSelected ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800'} ${(slot.status === 'constructing' || slot.status === 'upgrading' || slot.training) ? 'animate-pulse' : ''}`}
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-600 opacity-30 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-600 opacity-30 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-600 opacity-30 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-600 opacity-30 group-hover:opacity-100 transition-opacity"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
        {slot.status === 'empty' && (
          <div className="text-slate-700 group-hover:text-slate-500 transition-colors flex flex-col items-center">
            <Hexagon className="w-10 h-10 opacity-20 mb-2" />
            <span className="text-[10px] font-mono mt-1 opacity-50">SEC-{slot.id}</span>
          </div>
        )}
        
        {slot.status === 'constructing' && building && (
          <div className="text-center">
             <Hammer className="w-8 h-8 text-amber-500 animate-bounce mx-auto mb-2" />
             <span className="text-[10px] text-amber-500 font-mono mt-2 text-center uppercase leading-none block">{t.building_progress}</span>
             <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden w-16 mx-auto"><div className="h-full bg-amber-500" style={{ width: `${slot.progress}%` }}></div></div>
          </div>
        )}
        
        {slot.status === 'upgrading' && building && (
          <div className="text-center">
             <ArrowUpCircle className="w-8 h-8 text-cyan-500 animate-bounce mx-auto mb-2" />
             <span className="text-[10px] text-cyan-500 font-mono mt-2 text-center uppercase leading-none block">{t.upgrading_progress}</span>
             <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden w-16 mx-auto"><div className="h-full bg-cyan-500" style={{ width: `${slot.progress}%` }}></div></div>
          </div>
        )}
        
        {slot.status === 'active' && building && (
          <div className="flex flex-col items-center">
            {/* Simulated 2D Art Layer */}
            <div className={`w-16 h-16 relative mb-1 ${
                slot.buildingId === 'reactor' ? 'drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' :
                slot.buildingId === 'barracks' ? 'drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                'drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]'
            }`}>
                <building.icon className={`w-full h-full ${slot.buildingId === 'reactor' ? 'text-cyan-400' : 'text-slate-300'}`} strokeWidth={1} />
                {/* Level Badge Overlay */}
                <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-600 text-[8px] px-1 rounded text-amber-500 font-mono font-bold">
                    LVL {slot.level}
                </div>
            </div>

            <span className="text-[10px] font-bold text-slate-300 mt-1 text-center leading-tight">{t[building.nameKey] || building.nameKey}</span>
            
            <div className="flex items-center gap-1 mt-1">
              {slot.training ? (
                 <div className="flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-red-900">
                   <Sword className="w-3 h-3 text-red-500 animate-spin" />
                   <span className="text-[8px] text-red-500 uppercase">TRAINING</span>
                 </div>
              ) : (
                 <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                   <span className="text-[9px] text-emerald-500 uppercase">ONLINE</span>
                 </div>
              )}
            </div>
            
            {/* Training Progress Bar */}
            {slot.training && (
                <div className="absolute bottom-1 left-2 right-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-1000 linear" style={{ width: `${((slot.training.totalTime - slot.training.timer) / slot.training.totalTime) * 100}%` }}></div>
                </div>
            )}
            
            {/* Queue Indicators */}
            {slot.trainingQueue.length > 0 && (
               <div className="absolute top-2 right-2 flex flex-col gap-0.5">
                  {slot.trainingQueue.map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>)}
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GridTile;