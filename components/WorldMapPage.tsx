import React, { useState } from 'react';
import { Map, Home, Sword, Pickaxe, Skull, X, ShieldAlert, Mountain, Flag } from 'lucide-react';
import { GameState, WorldNode } from '../types';
import { ENEMIES } from '../data';

interface WorldMapPageProps {
  gameState: GameState;
  onEnterBase: () => void;
  onAttack: (nodeId: number) => void;
  onGather: (nodeId: number) => void;
  t: any;
}

const WorldMapPage: React.FC<WorldMapPageProps> = ({ gameState, onEnterBase, onAttack, onGather, t }) => {
  const [selectedNode, setSelectedNode] = useState<WorldNode | null>(null);

  const renderNodeIcon = (node: WorldNode) => {
    if (node.isPlayerBase) return <Home size={24} className="text-emerald-400" />;
    if (node.type.includes('resource')) return <Pickaxe size={20} className="text-cyan-400" />;
    if (node.type.includes('boss')) return <Skull size={28} className="text-red-600 animate-pulse" />;
    return <Sword size={20} className="text-red-400" />;
  };

  const getNodeColor = (node: WorldNode) => {
    if (node.isPlayerBase) return 'bg-emerald-900/50 border-emerald-500';
    if (node.type.includes('resource')) return 'bg-cyan-900/50 border-cyan-500';
    if (node.type.includes('boss')) return 'bg-red-900/50 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]';
    return 'bg-red-900/30 border-red-500';
  };

  // Simple grid rendering centered on 0,0
  const GRID_SIZE = 7;
  const OFFSET = Math.floor(GRID_SIZE / 2);

  return (
    <div className="flex-1 p-8 overflow-hidden relative flex flex-col items-center justify-center bg-black/90">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <h2 className="text-4xl font-bold font-mono text-slate-300 mb-8 flex items-center gap-3 relative z-10">
        <Map className="text-amber-500" /> {t.world_map}
      </h2>

      {/* Map Grid */}
      <div className="relative border border-slate-700 bg-slate-950/80 p-8 rounded-lg shadow-2xl overflow-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(60px, 1fr))` }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = (idx % GRID_SIZE) - OFFSET;
            const y = Math.floor(idx / GRID_SIZE) - OFFSET;
            const node = gameState.worldNodes.find(n => n.x === x && n.y === y);

            return (
              <div 
                key={idx}
                onClick={() => node && setSelectedNode(node)}
                className={`
                  w-16 h-16 md:w-24 md:h-24 border border-slate-800 rounded flex items-center justify-center relative cursor-pointer transition-all hover:border-slate-500
                  ${node ? getNodeColor(node) : 'bg-slate-900/30'}
                  ${selectedNode?.id === node?.id ? 'ring-2 ring-amber-500 z-10 scale-110 bg-slate-800' : ''}
                `}
              >
                {/* Simulated Terrain */}
                {!node && Math.random() > 0.8 && <Mountain size={16} className="text-slate-700 opacity-20" />}
                
                {node && (
                  <div className="flex flex-col items-center">
                    {renderNodeIcon(node)}
                    {!node.isPlayerBase && <span className="text-[10px] font-mono text-slate-300 mt-1">LVL {node.level}</span>}
                  </div>
                )}
                <div className="absolute top-1 left-1 text-[8px] text-slate-700 font-mono">{x},{y}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNode && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-600 p-6 rounded-lg max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-full border-2 ${selectedNode.type.includes('resource') ? 'bg-cyan-900/20 border-cyan-500' : selectedNode.isPlayerBase ? 'bg-emerald-900/20 border-emerald-500' : 'bg-red-900/20 border-red-500'}`}>
                {renderNodeIcon(selectedNode)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white uppercase">
                  {selectedNode.isPlayerBase ? t.enter_base : 
                   selectedNode.enemyId ? t[ENEMIES[selectedNode.enemyId].nameKey] : 
                   selectedNode.type.replace('resource_', '').toUpperCase()}
                </h3>
                <div className="text-slate-400 font-mono text-sm">{t.coords}: {selectedNode.x}, {selectedNode.y}</div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedNode.isPlayerBase ? (
                <button onClick={onEnterBase} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded uppercase tracking-widest transition-colors shadow-lg shadow-emerald-900/50">
                  {t.enter_base}
                </button>
              ) : selectedNode.type.includes('resource') ? (
                <div className="bg-slate-950 p-4 rounded border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm uppercase">{t.gather}</span>
                    <span className="text-cyan-400 font-bold">{selectedNode.resourceAmount} {selectedNode.type.split('_')[1].toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                    <span>{t.energy_cost}</span>
                    <span className="text-amber-500 font-mono">10</span>
                  </div>
                  <button onClick={() => { onGather(selectedNode.id); setSelectedNode(null); }} className="w-full py-2 bg-cyan-900/50 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold uppercase transition-colors rounded">
                    {t.gather}
                  </button>
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm uppercase">{t.scout_report}</span>
                    <span className="text-red-500 font-bold">{t.level} {selectedNode.level}</span>
                  </div>
                  {selectedNode.enemyId && (
                    <div className="mb-4">
                       <div className="flex justify-between text-xs text-slate-500 mb-1">
                         <span>{t.enemy_power}</span>
                         <span className="text-white font-mono">{ENEMIES[selectedNode.enemyId].power}</span>
                       </div>
                       <div className="flex justify-between text-xs text-slate-500">
                         <span>{t.rewards}</span>
                         <span className="text-emerald-400 font-mono">{Object.keys(ENEMIES[selectedNode.enemyId].rewards).join(', ')}</span>
                       </div>
                    </div>
                  )}
                  <button onClick={() => { onAttack(selectedNode.id); setSelectedNode(null); }} className="w-full py-3 bg-red-900/50 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold uppercase transition-colors rounded flex items-center justify-center gap-2">
                    <Sword size={18} /> {t.attack}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMapPage;