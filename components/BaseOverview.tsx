import React from 'react';
import { Target, Users, Shield, Coins, DollarSign } from 'lucide-react';
import { GameState, ResourceType } from '../types';
import { UNITS } from '../data';

interface BaseOverviewProps {
  gameState: GameState;
  onSell: (resource: ResourceType) => void;
  t: any;
}

const BaseOverview: React.FC<BaseOverviewProps> = ({ gameState, onSell, t }) => {
  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto no-scrollbar">
        {/* Army Overview Section */}
        <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase border-b border-slate-800 pb-2">{t.active_forces}</h3>
            <div className="grid grid-cols-1 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded flex items-center justify-between group hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded text-slate-400"><Target size={18} /></div>
                        <div>
                            <div className="text-xl font-mono text-white leading-none">{gameState.units.scout}</div>
                            <div className="text-[10px] text-slate-600 uppercase tracking-wider">{t[UNITS.scout.nameKey]}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded flex items-center justify-between group hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded text-slate-400"><Users size={18} /></div>
                        <div>
                            <div className="text-xl font-mono text-white leading-none">{gameState.units.marine}</div>
                            <div className="text-[10px] text-slate-600 uppercase tracking-wider">{t[UNITS.marine.nameKey]}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded flex items-center justify-between group hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded text-slate-400"><Shield size={18} /></div>
                        <div>
                            <div className="text-xl font-mono text-white leading-none">{gameState.units.tank}</div>
                            <div className="text-[10px] text-slate-600 uppercase tracking-wider">{t[UNITS.tank.nameKey]}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Black Market Section */}
        <div>
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase border-b border-slate-800 pb-2 flex items-center gap-2">
                <Coins size={16} className="text-amber-500" />
                {t.market}
            </h3>
            
            <div className="bg-slate-950/50 p-4 rounded border border-slate-800">
                <div className="text-xs text-slate-500 mb-3 text-center">EXCHANGE RATE: 100 RES -> 10 CREDITS</div>
                <div className="space-y-2">
                    <button 
                        onClick={() => onSell('carbon')}
                        disabled={gameState.resources.carbon < 100}
                        className={`w-full py-2 px-3 rounded border flex justify-between items-center text-sm font-bold transition-all ${
                            gameState.resources.carbon >= 100 
                            ? 'bg-slate-900 border-slate-700 hover:border-emerald-500 hover:text-emerald-400' 
                            : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                    >
                        <span>{t.sell} 100 {t.carbon}</span>
                        <div className="flex items-center text-amber-500"><DollarSign size={12} /> 10</div>
                    </button>
                    
                    <button 
                        onClick={() => onSell('ferrum')}
                        disabled={gameState.resources.ferrum < 100}
                        className={`w-full py-2 px-3 rounded border flex justify-between items-center text-sm font-bold transition-all ${
                            gameState.resources.ferrum >= 100 
                            ? 'bg-slate-900 border-slate-700 hover:border-emerald-500 hover:text-emerald-400' 
                            : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                    >
                        <span>{t.sell} 100 {t.ferrum}</span>
                        <div className="flex items-center text-amber-500"><DollarSign size={12} /> 10</div>
                    </button>

                    <button 
                        onClick={() => onSell('isotopes')}
                        disabled={gameState.resources.isotopes < 100}
                        className={`w-full py-2 px-3 rounded border flex justify-between items-center text-sm font-bold transition-all ${
                            gameState.resources.isotopes >= 100 
                            ? 'bg-slate-900 border-slate-700 hover:border-emerald-500 hover:text-emerald-400' 
                            : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                    >
                        <span>{t.sell} 100 {t.isotopes}</span>
                        <div className="flex items-center text-amber-500"><DollarSign size={12} /> 10</div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default BaseOverview;