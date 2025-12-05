import React from 'react';
import { Hexagon, Hammer, ArrowUpCircle, Sword } from 'lucide-react';
import { GridSlot } from '../types';
import { BUILDINGS, UNITS } from '../data';

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
      className={`aspect-square border-2 relative cursor-pointer transition-all duration-200 group overflow-hidden ${isSelected ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800'} ${(slot.status === 'constructing' || slot.status === 'upgrading' || slot.training) ? 'animate-pulse' : ''}`}
    >
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        {slot.status === 'empty' && (
          <div className="text-slate-700 group-hover:text-slate-500 transition-colors">
            <Hexagon className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-mono mt-1 opacity-50">SEC-{slot.id}</span>
          </div>
        )}
        {slot.status === 'constructing' && building && (
          <><Hammer className="w-8 h-8 text-amber-500 animate-bounce" /><span className="text-[10px] text-amber-500 font-mono mt-2 text-center uppercase leading-none">{t.building_progress}</span><div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: `${slot.progress}%` }}></div></div></>
        )}
        {slot.status === 'upgrading' && building && (
          <><ArrowUpCircle className="w-8 h-8 text-cyan-500 animate-bounce" /><span className="text-[10px] text-cyan-500 font-mono mt-2 text-center uppercase leading-none">{t.upgrading_progress}</span><div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden"><div className="h-full bg-cyan-500" style={{ width: `${slot.progress}%` }}></div></div></>
        )}
        {slot.status === 'active' && building && (
          <>
            <building.icon className={`w-8 h-8 ${slot.buildingId === 'reactor' ? 'text-cyan-400' : 'text-slate-300'}`} />
            <span className="text-[10px] font-bold text-slate-300 mt-2 text-center leading-tight">{t[building.nameKey] || building.nameKey}</span>
            <div className="flex items-center gap-1 mt-1">
              {slot.training ? (<><Sword className="w-3 h-3 text-red-500 animate-spin" /><span className="text-[9px] text-red-500 uppercase">TRAINING</span></>) : (<><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-[9px] text-emerald-500 uppercase">ONLINE</span></>)}
              <span className="text-[9px] text-slate-500">|</span><span className="text-[9px] text-amber-500 font-mono">LVL {slot.level}</span>
            </div>
            {/* Training Progress Bar */}
            {slot.training && <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: `${((slot.training.totalTime - slot.training.timer) / slot.training.totalTime) * 100}%` }}></div></div>}
            {/* Queue Indicators */}
            {slot.trainingQueue.length > 0 && (
               <div className="absolute top-1 right-1 flex gap-0.5">
                  {slot.trainingQueue.map((_, i) => <div key={i} className="w-1 h-1 bg-white rounded-full"></div>)}
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GridTile;
