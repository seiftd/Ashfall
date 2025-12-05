import React, { useState } from 'react';
import { Map, Home, Sword, Pickaxe, Skull, X, ShieldAlert, Mountain, Flag, Radar, LocateFixed, Zap } from 'lucide-react';
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
    if (node.isPlayerBase) return <Home size={28} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />;
    if (node.type.includes('resource')) return <Pickaxe size={20} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" />;
    if (node.type.includes('boss')) return <Skull size={32} className="text-red-600 animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />;
    return <Sword size={22} className="text-red-400" />;
  };

  const getNodeStyles = (node: WorldNode) => {
    if (node.isPlayerBase) return 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (node.type.includes('resource')) return 'bg-cyan-900/30 border-cyan-500/50 hover:border-cyan-400';
    if (node.type.includes('boss')) return 'bg-red-900/40 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]';
    return 'bg-red-950/30 border-red-800 hover:border-red-500';
  };

  // Grid config
  const GRID_SIZE = 7;
  const OFFSET = Math.floor(GRID_SIZE / 2);

  return (
    <div className="flex-1 p-0 overflow-hidden relative flex flex-col items-center justify-center bg-black">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
      
      {/* Header */}
      <div className="absolute top-6 left-0 right-0 text-center z-10 pointer-events-none">
        <h2 className="text-3xl font-black font-mono text-white tracking-[0.2em] flex items-center justify-center gap-4 drop-shadow-lg">
          <Radar className="text-amber-500 animate-spin-slow" size={24} /> {t.world_map} <Radar className="text-amber-500 animate-spin-slow" size={24} />
        </h2>
        <div className="text-[10px] text-slate-500 font-mono mt-1">SECTOR SCAN IN PROGRESS...</div>
      </div>

      {/* Map Grid Container */}
      <div className="relative border border-slate-700/50 bg-slate-950/80 p-8 rounded-full aspect-square max-h-[80vh] shadow-2xl overflow-hidden backdrop-blur-md group">
        
        {/* Radar Sweep Animation */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-800 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-[50%] h-[2px] bg-gradient-to-r from-transparent to-emerald-500 origin-left animate-[radar-sweep_4s_linear_infinite] opacity-30"></div>
        </div>

        <div className="grid gap-3 relative z-10" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(50px, 1fr))` }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = (idx % GRID_SIZE) - OFFSET;
            const y = Math.floor(idx / GRID_SIZE) - OFFSET;
            const node = gameState.worldNodes.find(n => n.x === x && n.y === y);

            return (
              <div 
                key={idx}
                onClick={() => node && setSelectedNode(node)}
                className={`
                  aspect-square border rounded-md flex items-center justify-center relative cursor-pointer transition-all duration-300
                  ${node ? getNodeStyles(node) : 'border-slate-800/30 bg-transparent'}
                  ${selectedNode?.id === node?.id ? 'ring-2 ring-amber-400 scale-110 z-20 bg-slate-800' : 'hover:scale-105'}
                `}
              >
                {/* Empty Space Decor */}
                {!node && Math.random() > 0.9 && <div className="w-1 h-1 bg-slate-700 rounded-full opacity-30"></div>}
                
                {node && (
                  <div className="flex flex-col items-center">
                    {renderNodeIcon(node)}
                    {!node.isPlayerBase && <span className="text-[8px] font-mono text-slate-300 mt-0.5 bg-black/50 px-1 rounded">LVL {node.level}</span>}
                  </div>
                )}
                {node && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-slate-500 rounded-full animate-ping opacity-50"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedNode && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-600 p-6 rounded-lg max-w-sm w-full shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300 z-50">
            <button onClick={() => setSelectedNode(null)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><X size={20} /></button>
            
            <div className="flex gap-4 mb-4">
              <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center ${selectedNode.type.includes('resource') ? 'bg-cyan-950 border-cyan-500' : selectedNode.isPlayerBase ? 'bg-emerald-950 border-emerald-500' : 'bg-red-950 border-red-500'}`}>
                {renderNodeIcon(selectedNode)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white uppercase leading-none mb-1">
                  {selectedNode.isPlayerBase ? t.enter_base : 
                   selectedNode.enemyId ? t[ENEMIES[selectedNode.enemyId].nameKey] : 
                   selectedNode.type.replace('resource_', '').toUpperCase()}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <LocateFixed size={12} /> {t.coords}: [{selectedNode.x}, {selectedNode.y}]
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {selectedNode.isPlayerBase ? (
                <button onClick={onEnterBase} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2">
                  <Home size={18} /> {t.enter_base}
                </button>
              ) : selectedNode.type.includes('resource') ? (
                <div className="bg-black/30 p-3 rounded border border-slate-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-xs uppercase font-bold">{t.gather}</span>
                    <span className="text-cyan-400 font-mono font-bold text-lg">{selectedNode.resourceAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mb-3 border-t border-slate-800 pt-2">
                    <span>{t.energy_cost}</span>
                    <span className="text-amber-500 font-mono font-bold">10 <Zap size={8} className="inline"/></span>
                  </div>
                  <button onClick={() => { onGather(selectedNode.id); setSelectedNode(null); }} className="w-full py-2 bg-cyan-900/40 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold uppercase transition-all rounded text-xs tracking-wider">
                    INITIATE HARVEST
                  </button>
                </div>
              ) : (
                <div className="bg-black/30 p-3 rounded border border-slate-700/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-xs uppercase font-bold">{t.scout_report}</span>
                    <span className="text-red-500 font-mono font-bold">THREAT LVL {selectedNode.level}</span>
                  </div>
                  {selectedNode.enemyId && (
                    <div className="mb-4 space-y-1">
                       <div className="flex justify-between text-[10px] text-slate-400">
                         <span>{t.enemy_power}</span>
                         <span className="text-white font-mono">{ENEMIES[selectedNode.enemyId].power}</span>
                       </div>
                       <div className="flex justify-between text-[10px] text-slate-400">
                         <span>{t.rewards}</span>
                         <span className="text-emerald-400 font-mono">{Object.keys(ENEMIES[selectedNode.enemyId].rewards).join(', ')}</span>
                       </div>
                    </div>
                  )}
                  <button onClick={() => { onAttack(selectedNode.id); setSelectedNode(null); }} className="w-full py-3 bg-red-900/60 border border-red-500 text-white hover:bg-red-600 font-bold uppercase transition-all rounded shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 tracking-widest text-xs">
                    <Sword size={16} /> {t.attack}
                  </button>
                </div>
              )}
            </div>
          </div>
      )}
    </div>
  );
};

export default WorldMapPage;