import React, { useState, useEffect } from 'react';
import { 
  Activity, Database, Hammer, Zap, Terminal, ArrowUpCircle, MousePointer, Target, Users, Shield, Lock, Archive
} from 'lucide-react';

import { 
  Language, GameState, BuildingType, UnitType, TechId, LogEntry 
} from './types';

import { 
  TRANSLATIONS, BUILDINGS, UNITS, RESEARCH_TREE, 
  TICK_RATE_MS, MAX_LOGS, UPGRADE_COST_MULTIPLIER, PRODUCTION_MULTIPLIER, BASE_CAPS, MAX_QUEUE_SIZE 
} from './data';

import ResourceDisplay from './components/ResourceDisplay';
import GridTile from './components/GridTile';
import BuildMenu from './components/BuildMenu';
import MainMenu from './components/MainMenu';
import OperationsPage from './components/OperationsPage';
import ArchivesPage from './components/ArchivesPage';
import SettingsPage from './components/SettingsPage';
import ResearchPage from './components/ResearchPage';

export default function App() {
  const [view, setView] = useState<'home' | 'game' | 'operations' | 'archives' | 'settings' | 'research'>('home');
  const [tickCount, setTickCount] = useState(0);
  const [lang, setLang] = useState<Language>('en');

  // Translation helper
  const t = TRANSLATIONS[lang];

  // --- LIFTED GAME STATE ---
  const [gameState, setGameState] = useState<GameState>({
    resources: { carbon: 300, ferrum: 150, isotopes: 0, energy: 100 },
    caps: { carbon: 1000, ferrum: 500, isotopes: 100, energy: 100 },
    buildings: Array(9).fill(null).map((_, i) => ({ id: i, buildingId: null, status: 'empty', progress: 0, level: 1, trainingQueue: [] })),
    units: { scout: 0, marine: 0, tank: 0 },
    research: { unlocked: [], current: null },
    logs: [{ id: 0, text: "SYSTEM INITIALIZED. COMMANDER ONLINE.", type: 'info', timestamp: '00:00:00' }],
    techLevel: 0,
    weather: 'clear'
  });

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  // --- GAME LOOP ---
  useEffect(() => {
    const loop = setInterval(() => {
      setTickCount(c => c + 1);

      setGameState(prev => {
        const next = { ...prev };
        const production = { carbon: 0, ferrum: 0, isotopes: 0, energy: 0 };
        const consumption = { energy: 0 };
        const currentCaps = { ...BASE_CAPS };

        // Pass 1: Calculate Caps
        next.buildings.forEach(slot => {
             if (slot.status === 'active' && slot.buildingId) {
                 const def = BUILDINGS[slot.buildingId];
                 const multiplier = Math.pow(PRODUCTION_MULTIPLIER, slot.level - 1);
                 if (def.storage) {
                    if (def.storage.carbon) currentCaps.carbon += def.storage.carbon * multiplier;
                    if (def.storage.ferrum) currentCaps.ferrum += def.storage.ferrum * multiplier;
                    if (def.storage.isotopes) currentCaps.isotopes += def.storage.isotopes * multiplier;
                    if (def.storage.energy) currentCaps.energy += def.storage.energy * multiplier;
                 }
             }
        });
        next.caps = currentCaps;

        // Pass 2: Production, Timers, Research
        next.buildings.forEach(slot => {
          if (slot.status === 'active' && slot.buildingId) {
            const def = BUILDINGS[slot.buildingId];
            const multiplier = Math.pow(PRODUCTION_MULTIPLIER, slot.level - 1);
            
            let isBlocked = false;
            if (def.production.carbon && next.resources.carbon >= next.caps.carbon) isBlocked = true;
            if (def.production.ferrum && next.resources.ferrum >= next.caps.ferrum) isBlocked = true;
            if (def.production.isotopes && next.resources.isotopes >= next.caps.isotopes) isBlocked = true;
            if (def.production.energy && next.resources.energy >= next.caps.energy) isBlocked = true;

            if (!isBlocked) {
                if (def.production.carbon) production.carbon += def.production.carbon * multiplier;
                if (def.production.ferrum) production.ferrum += def.production.ferrum * multiplier;
                if (def.production.energy) production.energy += def.production.energy * multiplier;
                if (def.energyDrain) consumption.energy += def.energyDrain * multiplier;
            }
          }
          
          // Construction
          if (slot.status === 'constructing' && slot.timer && slot.timer > 0) {
            slot.timer -= 1;
            const def = BUILDINGS[slot.buildingId!];
            slot.progress = Math.floor(((def.buildTime - slot.timer) / def.buildTime) * 100);
            if (slot.timer <= 0) {
              slot.status = 'active';
              slot.progress = 100;
            }
          }

          // Upgrade
          if (slot.status === 'upgrading' && slot.timer && slot.timer > 0) {
            slot.timer -= 1;
            const def = BUILDINGS[slot.buildingId!];
            const buildTime = def.buildTime * slot.level; 
            slot.progress = Math.floor(((buildTime - slot.timer) / buildTime) * 100);
            if (slot.timer <= 0) {
              slot.status = 'active';
              slot.level += 1;
              slot.progress = 0;
            }
          }

          // Training
          if (slot.status === 'active' && slot.training) {
             slot.training.timer -= 1;
             if (slot.training.timer <= 0) {
                const uId = slot.training.unitId;
                next.units[uId] = (next.units[uId] || 0) + 1;
                
                const now = new Date().toISOString().split('T')[1].split('.')[0];
                next.logs.unshift({
                    id: Date.now(),
                    text: `UNIT READY: ${UNITS[uId].nameKey.toUpperCase()}`,
                    type: 'success',
                    timestamp: now
                });
                if(next.logs.length > MAX_LOGS) next.logs.pop();

                slot.training = null; 
             }
          }

          // Queue Promotion
          if (slot.status === 'active' && !slot.training && slot.trainingQueue.length > 0) {
             const nextUnitId = slot.trainingQueue[0];
             const unitDef = UNITS[nextUnitId];
             slot.trainingQueue = slot.trainingQueue.slice(1);
             slot.training = {
                unitId: nextUnitId,
                timer: unitDef.trainingTime,
                totalTime: unitDef.trainingTime
             };
          }
        });

        // Research Logic
        if (next.research.current) {
           next.research.current.timer -= 1;
           if (next.research.current.timer <= 0) {
              next.research.unlocked.push(next.research.current.techId);
              const now = new Date().toISOString().split('T')[1].split('.')[0];
              next.logs.unshift({
                  id: Date.now(),
                  text: `RESEARCH COMPLETE: ${TRANSLATIONS[lang][RESEARCH_TREE[next.research.current.techId].nameKey] || next.research.current.techId}`,
                  type: 'success',
                  timestamp: now
              });
              if(next.logs.length > MAX_LOGS) next.logs.pop();
              next.research.current = null;
           }
        }

        const netEnergy = production.energy - consumption.energy;
        if (next.resources.carbon < next.caps.carbon) production.carbon += 1; 
        
        next.resources.carbon = Math.min(next.caps.carbon, next.resources.carbon + production.carbon);
        next.resources.ferrum = Math.min(next.caps.ferrum, next.resources.ferrum + production.ferrum);
        
        const newEnergy = next.resources.energy + netEnergy;
        next.resources.energy = Math.max(0, Math.min(next.caps.energy, newEnergy));
        
        if (next.weather === 'clear' && Math.random() < 0.005) next.weather = 'ash_storm';
        else if (next.weather === 'ash_storm' && Math.random() < 0.02) next.weather = 'clear';

        return next;
      });
    }, TICK_RATE_MS);
    return () => clearInterval(loop);
  }, [lang]);

  const handleBuild = (type: BuildingType) => {
    if (selectedSlotId === null) return;
    setGameState(prev => {
      const slotIndex = prev.buildings.findIndex(b => b.id === selectedSlotId);
      if (slotIndex === -1) return prev;
      const def = BUILDINGS[type];
      const slot = prev.buildings[slotIndex];
      if (slot.status !== 'empty') return prev;
      if (prev.resources.carbon < (def.cost.carbon || 0)) return prev;
      if (prev.resources.ferrum < (def.cost.ferrum || 0)) return prev;

      const newResources = { ...prev.resources };
      if (def.cost.carbon) newResources.carbon -= def.cost.carbon;
      if (def.cost.ferrum) newResources.ferrum -= def.cost.ferrum;

      const newBuildings = [...prev.buildings];
      newBuildings[slotIndex] = { ...slot, buildingId: type, status: 'constructing', timer: def.buildTime, progress: 0, level: 1 };
      
      const now = new Date().toISOString().split('T')[1].split('.')[0];
      const newLogs = [{ id: Date.now(), text: `BUILDING: ${def.nameKey.toUpperCase()}`, type: 'info', timestamp: now }, ...prev.logs].slice(0, MAX_LOGS);

      return { ...prev, resources: newResources, buildings: newBuildings, logs: newLogs as LogEntry[] };
    });
  };

  const handleUpgrade = () => {
    if (selectedSlotId === null) return;
    setGameState(prev => {
      const slotIndex = prev.buildings.findIndex(b => b.id === selectedSlotId);
      if (slotIndex === -1) return prev;
      const slot = prev.buildings[slotIndex];
      if (slot.status !== 'active' || !slot.buildingId) return prev;

      const def = BUILDINGS[slot.buildingId];
      const costMultiplier = Math.pow(UPGRADE_COST_MULTIPLIER, slot.level);
      const upgradeCost = {
        carbon: Math.floor((def.cost.carbon || 0) * costMultiplier),
        ferrum: Math.floor((def.cost.ferrum || 0) * costMultiplier),
        energy: Math.floor((def.cost.energy || 0) * costMultiplier),
      };

      if (prev.resources.carbon < (upgradeCost.carbon || 0)) return prev;
      if (prev.resources.ferrum < (upgradeCost.ferrum || 0)) return prev;
      
      const newResources = { ...prev.resources };
      if (upgradeCost.carbon) newResources.carbon -= upgradeCost.carbon;
      if (upgradeCost.ferrum) newResources.ferrum -= upgradeCost.ferrum;

      const newBuildings = [...prev.buildings];
      const buildTime = def.buildTime * slot.level; 
      
      newBuildings[slotIndex] = { ...slot, status: 'upgrading', timer: buildTime, progress: 0 };
      
      const now = new Date().toISOString().split('T')[1].split('.')[0];
      const newLogs = [{ id: Date.now(), text: `UPGRADING: ${def.nameKey.toUpperCase()} TO LVL ${slot.level + 1}`, type: 'info', timestamp: now }, ...prev.logs].slice(0, MAX_LOGS);

      return { ...prev, resources: newResources, buildings: newBuildings, logs: newLogs as LogEntry[] };
    });
  };

  const handleTrain = (unitId: UnitType) => {
    if (selectedSlotId === null) return;
    setGameState(prev => {
      const slotIndex = prev.buildings.findIndex(b => b.id === selectedSlotId);
      if (slotIndex === -1) return prev;
      const slot = prev.buildings[slotIndex];
      if (slot.status !== 'active' || slot.buildingId !== 'barracks') return prev;
      
      if (slot.trainingQueue.length >= MAX_QUEUE_SIZE) return prev;

      const unitDef = UNITS[unitId];
      if (prev.resources.carbon < (unitDef.cost.carbon || 0)) return prev;
      if (prev.resources.ferrum < (unitDef.cost.ferrum || 0)) return prev;
      if (prev.resources.energy < (unitDef.cost.energy || 0)) return prev;

      const newResources = { ...prev.resources };
      if (unitDef.cost.carbon) newResources.carbon -= unitDef.cost.carbon;
      if (unitDef.cost.ferrum) newResources.ferrum -= unitDef.cost.ferrum;
      if (unitDef.cost.energy) newResources.energy -= unitDef.cost.energy;

      const newBuildings = [...prev.buildings];
      const newSlot = { ...slot, trainingQueue: [...slot.trainingQueue, unitId] };
      
      if (!newSlot.training) {
         newSlot.training = { unitId: unitId, timer: unitDef.trainingTime, totalTime: unitDef.trainingTime };
         newSlot.trainingQueue = [];
      }

      newBuildings[slotIndex] = newSlot;
      
      const now = new Date().toISOString().split('T')[1].split('.')[0];
      const newLogs = [{ id: Date.now(), text: `QUEUED: ${unitDef.nameKey.toUpperCase()}`, type: 'info', timestamp: now }, ...prev.logs].slice(0, MAX_LOGS);

      return { ...prev, resources: newResources, buildings: newBuildings, logs: newLogs as LogEntry[] };
    });
  }

  const handleResearch = (techId: TechId) => {
    setGameState(prev => {
      if (prev.research.current) return prev;
      const tech = RESEARCH_TREE[techId];
      if (prev.resources.carbon < (tech.cost.carbon || 0)) return prev;
      if (prev.resources.ferrum < (tech.cost.ferrum || 0)) return prev;
      if (prev.resources.energy < (tech.cost.energy || 0)) return prev;

      const newResources = { ...prev.resources };
      if (tech.cost.carbon) newResources.carbon -= tech.cost.carbon;
      if (tech.cost.ferrum) newResources.ferrum -= tech.cost.ferrum;
      if (tech.cost.energy) newResources.energy -= tech.cost.energy;

      const now = new Date().toISOString().split('T')[1].split('.')[0];
      const newLogs = [{ id: Date.now(), text: `RESEARCH STARTED: ${t[tech.nameKey] || tech.nameKey}`, type: 'info', timestamp: now }, ...prev.logs].slice(0, MAX_LOGS);

      return {
        ...prev,
        resources: newResources,
        logs: newLogs as LogEntry[],
        research: {
          ...prev.research,
          current: { techId: techId, timer: tech.researchTime, totalTime: tech.researchTime }
        }
      };
    });
  };

  const calculateTrends = () => {
    let trends = { carbon: 1, ferrum: 0, energy: 0 };
    if (gameState.resources.carbon >= gameState.caps.carbon) trends.carbon = 0;

    gameState.buildings.forEach(slot => {
      if (slot.status === 'active' && slot.buildingId) {
        const def = BUILDINGS[slot.buildingId];
        const multiplier = Math.pow(PRODUCTION_MULTIPLIER, slot.level - 1);
        
        let isBlocked = false;
        if (def.production.carbon && gameState.resources.carbon >= gameState.caps.carbon) isBlocked = true;
        if (def.production.ferrum && gameState.resources.ferrum >= gameState.caps.ferrum) isBlocked = true;
        if (def.production.energy && gameState.resources.energy >= gameState.caps.energy) isBlocked = true;

        if (!isBlocked) {
            if (def.production.carbon) trends.carbon += def.production.carbon * multiplier;
            if (def.production.ferrum) trends.ferrum += def.production.ferrum * multiplier;
            if (def.production.energy) trends.energy += def.production.energy * multiplier;
            if (def.energyDrain) trends.energy -= def.energyDrain * multiplier;
        }
      }
    });
    return trends;
  };

  const trends = calculateTrends();
  const selectedSlot = selectedSlotId !== null ? gameState.buildings.find(b => b.id === selectedSlotId) : null;
  const selectedBuildingDef = selectedSlot?.buildingId ? BUILDINGS[selectedSlot.buildingId] : null;

  // UI Helpers
  const getUpgradeCost = (def: any, currentLevel: number) => {
    const costMultiplier = Math.pow(UPGRADE_COST_MULTIPLIER, currentLevel);
    return {
      carbon: Math.floor((def.cost.carbon || 0) * costMultiplier),
      ferrum: Math.floor((def.cost.ferrum || 0) * costMultiplier),
      energy: Math.floor((def.cost.energy || 0) * costMultiplier),
    };
  };
  const currentUpgradeCost = selectedBuildingDef && selectedSlot ? getUpgradeCost(selectedBuildingDef, selectedSlot.level) : null;
  const canAffordUpgrade = currentUpgradeCost ? (
    gameState.resources.carbon >= currentUpgradeCost.carbon &&
    gameState.resources.ferrum >= currentUpgradeCost.ferrum &&
    gameState.resources.energy >= currentUpgradeCost.energy
  ) : false;

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-amber-500/30 overflow-hidden flex flex-col relative" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-0"></div>
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <header className="relative z-30 bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setView('home')}>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-mono tracking-tighter text-white flex items-center gap-2"><Activity className="text-amber-500 w-5 h-5" />ASHFALL <span className="text-slate-600">DOMINION</span></h1>
          </div>
        </div>
        {view !== 'home' && (
           <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setView('game')} className={`text-sm font-mono font-bold uppercase ${view === 'game' ? 'text-amber-500' : 'text-slate-500 hover:text-white'}`}>{t.resume_sim}</button>
              <button onClick={() => setView('operations')} className={`text-sm font-mono font-bold uppercase ${view === 'operations' ? 'text-cyan-500' : 'text-slate-500 hover:text-white'}`}>{t.operations}</button>
              <button onClick={() => setView('research')} className={`text-sm font-mono font-bold uppercase ${view === 'research' ? 'text-purple-500' : 'text-slate-500 hover:text-white'}`}>{t.research}</button>
              <button onClick={() => setView('archives')} className={`text-sm font-mono font-bold uppercase ${view === 'archives' ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}>{t.archives}</button>
              <button onClick={() => setView('settings')} className={`text-sm font-mono font-bold uppercase ${view === 'settings' ? 'text-purple-500' : 'text-slate-500 hover:text-white'}`}>{t.settings}</button>
           </div>
        )}
        {view === 'game' && (
          <div className="flex items-center gap-4" dir="ltr">
            <div className="w-24"><ResourceDisplay type={t.carbon} value={gameState.resources.carbon} cap={gameState.caps.carbon} icon={Database} color="bg-slate-500" trend={trends.carbon} t={t} /></div>
            <div className="w-24"><ResourceDisplay type={t.ferrum} value={gameState.resources.ferrum} cap={gameState.caps.ferrum} icon={Hammer} color="bg-slate-400" trend={trends.ferrum} t={t} /></div>
            <div className="w-24"><ResourceDisplay type={t.energy} value={gameState.resources.energy} cap={gameState.caps.energy} icon={Zap} color={gameState.resources.energy < 10 ? "bg-red-500" : "bg-cyan-500"} trend={trends.energy} t={t} /></div>
          </div>
        )}
      </header>

      <main className="flex-1 flex relative z-10 overflow-hidden">
        {view === 'home' && <MainMenu onNavigate={setView} t={t} />}
        {view === 'operations' && <OperationsPage t={t} />}
        {view === 'archives' && <ArchivesPage t={t} />}
        {view === 'research' && <ResearchPage gameState={gameState} onResearch={handleResearch} t={t} />}
        {view === 'settings' && <SettingsPage lang={lang} setLang={setLang} t={t} />}
        
        {view === 'game' && (
          <>
            <aside className="w-80 bg-slate-900/90 border-e border-slate-800 flex flex-col backdrop-blur-sm z-20">
              <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                <h2 className="text-sm font-mono text-amber-500 font-bold uppercase tracking-wider flex items-center"><Terminal className="w-4 h-4 me-2" />{t.command_interface}</h2>
              </div>
              <div className="flex-1 overflow-hidden p-4">
                {selectedSlot ? (
                  selectedSlot.status === 'empty' ? (
                    <div className="h-full flex flex-col">
                      <div className="text-xs text-slate-400 mb-3 uppercase font-bold tracking-wider">{t.select_construction}</div>
                      <BuildMenu onBuild={handleBuild} resources={gameState.resources} research={gameState.research.unlocked} t={t} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                       {selectedBuildingDef && (
                         <>
                            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                               <div className="p-3 bg-slate-800 rounded border border-slate-700 text-cyan-400"><selectedBuildingDef.icon size={24} /></div>
                               <div><div className="text-lg font-bold text-white leading-none">{t[selectedBuildingDef.nameKey]}</div><div className="text-xs text-emerald-500 font-mono mt-1">LVL {selectedSlot.level} // ONLINE</div></div>
                            </div>
                            <div className="space-y-4">
                               <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-slate-400 leading-tight">{selectedBuildingDef.description}</div>
                               <div className="grid grid-cols-2 gap-2">
                                  <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
                                     <span className="text-[10px] text-slate-500 block">OUTPUT</span>
                                     <span className="text-sm text-emerald-400 font-mono" dir="ltr">
                                        {selectedBuildingDef.production.energy ? `+${(selectedBuildingDef.production.energy * Math.pow(PRODUCTION_MULTIPLIER, selectedSlot.level - 1)).toFixed(0)} E` : ''}
                                        {selectedBuildingDef.production.carbon ? `+${(selectedBuildingDef.production.carbon * Math.pow(PRODUCTION_MULTIPLIER, selectedSlot.level - 1)).toFixed(0)} C` : ''}
                                        {selectedBuildingDef.production.ferrum ? `+${(selectedBuildingDef.production.ferrum * Math.pow(PRODUCTION_MULTIPLIER, selectedSlot.level - 1)).toFixed(0)} F` : ''}
                                        {Object.keys(selectedBuildingDef.production).length === 0 && 'None'}
                                     </span>
                                  </div>
                                  <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
                                     <span className="text-[10px] text-slate-500 block">DRAIN</span>
                                     <span className="text-sm text-amber-400 font-mono" dir="ltr">
                                       {(selectedBuildingDef.energyDrain * Math.pow(PRODUCTION_MULTIPLIER, selectedSlot.level - 1)).toFixed(0)} Energy/s
                                     </span>
                                  </div>
                               </div>
                               {selectedSlot.status === 'active' && currentUpgradeCost && !selectedSlot.training && (
                                 <div className="mt-6 border-t border-slate-800 pt-4">
                                   <div className="text-xs font-bold text-slate-400 mb-2 uppercase">{t.upgrade_to} {selectedSlot.level + 1}</div>
                                   <button onClick={handleUpgrade} disabled={!canAffordUpgrade} className={`w-full flex items-center justify-between p-3 border transition-all group relative overflow-hidden ${canAffordUpgrade ? 'bg-cyan-900/30 border-cyan-500 hover:bg-cyan-900/50' : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'}`}>
                                     <div className="flex items-center gap-2"><ArrowUpCircle className={`w-5 h-5 ${canAffordUpgrade ? 'text-cyan-400' : 'text-slate-500'}`} /><span className={`text-sm font-bold ${canAffordUpgrade ? 'text-white' : 'text-slate-500'}`}>{t.upgrade}</span></div>
                                     <div className="text-xs font-mono text-right flex flex-col items-end" dir="ltr">
                                        {currentUpgradeCost.carbon > 0 && <span className={gameState.resources.carbon >= currentUpgradeCost.carbon ? 'text-slate-400' : 'text-red-500'}>C: {currentUpgradeCost.carbon}</span>}
                                        {currentUpgradeCost.ferrum > 0 && <span className={gameState.resources.ferrum >= currentUpgradeCost.ferrum ? 'text-slate-400' : 'text-red-500'}>F: {currentUpgradeCost.ferrum}</span>}
                                     </div>
                                   </button>
                                 </div>
                               )}
                               {selectedSlot.status === 'upgrading' && (
                                 <div className="mt-6 border-t border-slate-800 pt-4 text-center">
                                    <div className="text-cyan-500 font-bold mb-2 animate-pulse">{t.upgrading_progress}</div>
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-500" style={{ width: `${selectedSlot.progress}%` }}></div></div>
                                    <div className="text-xs text-slate-500 mt-1 font-mono">{t.level_short} {selectedSlot.level} → {selectedSlot.level + 1}</div>
                                 </div>
                               )}
                               {selectedSlot.status === 'active' && selectedBuildingDef.id === 'barracks' && (
                                 <div className="mt-6 border-t border-slate-800 pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                      <div className="text-xs font-bold text-slate-400 uppercase">{t.train_unit}</div>
                                      <div className="text-[10px] text-slate-500">{selectedSlot.trainingQueue.length}/{MAX_QUEUE_SIZE} {t.queued}</div>
                                    </div>
                                    {selectedSlot.training ? (
                                       <div className="bg-slate-900 border border-slate-800 p-3 rounded mb-2">
                                          <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold text-red-400">{t[UNITS[selectedSlot.training.unitId].nameKey]}</span><span className="text-xs font-mono text-slate-500">{selectedSlot.training.timer}s</span></div>
                                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: `${((selectedSlot.training.totalTime - selectedSlot.training.timer) / selectedSlot.training.totalTime) * 100}%` }}></div></div>
                                          <div className="text-[10px] text-center text-slate-500 mt-1 uppercase animate-pulse">{t.training_progress}</div>
                                       </div>
                                    ) : null}
                                    {selectedSlot.trainingQueue.length > 0 && (
                                      <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
                                        {selectedSlot.trainingQueue.map((uId, idx) => (<div key={idx} className="w-6 h-6 bg-slate-800 rounded border border-slate-600 flex items-center justify-center" title={t[UNITS[uId].nameKey]}><div className="w-3 h-3 bg-slate-500 rounded-full"></div></div>))}
                                      </div>
                                    )}
                                    <div className="space-y-2">
                                          {Object.values(UNITS).map((u) => {
                                             const reqMet = u.reqTech.every(req => gameState.research.unlocked.includes(req));
                                             if (!reqMet) return null; 
                                             const canTrain = (
                                                gameState.resources.carbon >= (u.cost.carbon || 0) &&
                                                gameState.resources.ferrum >= (u.cost.ferrum || 0) &&
                                                gameState.resources.energy >= (u.cost.energy || 0)
                                             );
                                             const queueFull = selectedSlot.trainingQueue.length >= MAX_QUEUE_SIZE;
                                             const canT = canTrain && !queueFull;
                                             return (
                                                <button key={u.id} onClick={() => handleTrain(u.id)} disabled={!canT} className={`w-full flex items-center justify-between p-2 border text-start transition-all ${canT ? 'bg-slate-900 border-slate-700 hover:border-red-500' : 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed'}`}>
                                                   <div className="flex items-center gap-2"><u.icon className={`w-4 h-4 ${canT ? 'text-red-400' : 'text-slate-600'}`} /><div><div className={`text-xs font-bold ${canT ? 'text-slate-200' : 'text-slate-500'}`}>{t[u.nameKey]}</div><div className="text-[9px] text-slate-500" dir="ltr">{u.trainingTime}s</div></div></div>
                                                   <div className="flex flex-col items-end text-[9px] font-mono" dir="ltr">{u.cost.carbon > 0 && <span className={gameState.resources.carbon >= u.cost.carbon ? 'text-slate-400' : 'text-red-500'}>C:{u.cost.carbon}</span>}{u.cost.ferrum > 0 && <span className={gameState.resources.ferrum >= u.cost.ferrum ? 'text-slate-400' : 'text-red-500'}>F:{u.cost.ferrum}</span>}{u.cost.energy > 0 && <span className={gameState.resources.energy >= u.cost.energy ? 'text-cyan-400' : 'text-red-500'}>E:{u.cost.energy}</span>}</div>
                                                </button>
                                             );
                                          })}
                                    </div>
                                 </div>
                               )}
                            </div>
                         </>
                       )}
                       {!selectedBuildingDef && selectedSlot.status === 'constructing' && (
                          <div className="text-center mt-10"><Hammer className="w-12 h-12 text-amber-500 mx-auto animate-bounce mb-4" /><div className="text-amber-500 font-bold">{t.building_progress}</div></div>
                       )}
                    </div>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                     <div className="text-center mb-8">
                       <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase">{t.active_forces}</h3>
                       <div className="grid grid-cols-3 gap-4 text-center">
                          <div><Target className="w-6 h-6 text-slate-500 mx-auto mb-1" /><span className="text-lg font-mono text-white block">{gameState.units.scout}</span><span className="text-[9px] text-slate-600 uppercase">Scout</span></div>
                          <div><Users className="w-6 h-6 text-slate-500 mx-auto mb-1" /><span className="text-lg font-mono text-white block">{gameState.units.marine}</span><span className="text-[9px] text-slate-600 uppercase">Marine</span></div>
                          <div><Shield className="w-6 h-6 text-slate-500 mx-auto mb-1" /><span className="text-lg font-mono text-white block">{gameState.units.tank}</span><span className="text-[9px] text-slate-600 uppercase">Tank</span></div>
                       </div>
                     </div>
                     <MousePointer size={48} className="mb-4" />
                     <p className="text-xs font-mono">SELECT A SECTOR</p>
                  </div>
                )}
              </div>
            </aside>
            <section className="flex-1 bg-black relative flex items-center justify-center overflow-auto p-8 z-10">
               <div className="absolute top-4 start-4 text-[10px] font-mono text-slate-600">{t.coords}: 45.92, -12.04<br/>{t.region}: OBSIDIAN WASTES</div>
               {gameState.weather === 'ash_storm' && (
                  <div className="absolute inset-0 pointer-events-none z-40 bg-amber-900/10 mix-blend-overlay animate-pulse"><div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 animate-[spin_10s_linear_infinite]"></div><div className="absolute top-10 left-1/2 -translate-x-1/2 bg-amber-900/80 text-amber-100 px-4 py-1 rounded text-xs font-bold font-mono border border-amber-500 animate-pulse">{t.ash_storm_warning}</div></div>
               )}
               <div className="grid grid-cols-3 gap-4 max-w-2xl w-full aspect-square p-8 border border-slate-800/50 bg-slate-900/20 rounded-xl relative">
                  <div className="absolute -top-1 -start-1 w-8 h-8 border-t-2 border-s-2 border-slate-600"></div><div className="absolute -top-1 -end-1 w-8 h-8 border-t-2 border-e-2 border-slate-600"></div><div className="absolute -bottom-1 -start-1 w-8 h-8 border-b-2 border-s-2 border-slate-600"></div><div className="absolute -bottom-1 -end-1 w-8 h-8 border-b-2 border-e-2 border-slate-600"></div>
                  {gameState.buildings.map((slot) => (<GridTile key={slot.id} slot={slot} isSelected={selectedSlotId === slot.id} onClick={() => setSelectedSlotId(slot.id)} t={t} />))}
               </div>
            </section>
            <aside className="w-64 bg-slate-950 border-s border-slate-800 hidden lg:flex flex-col z-20">
               <div className="flex-1 p-4 border-b border-slate-800"><h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{t.event_log}</h3><div className="space-y-2 font-mono text-[10px]">{gameState.logs.map((log) => (<div key={log.id} className="mb-2 animate-fadeIn text-start"><span className="text-slate-600 block mb-0.5" dir="ltr">[{log.timestamp}]</span><span className={`${log.type === 'warning' ? 'text-amber-500' : log.type === 'success' ? 'text-emerald-500' : 'text-slate-300'}`}>{log.text}</span></div>))}</div></div>
               <div className="h-1/3 bg-slate-900 p-4 border-t border-slate-800"><h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{t.mini_map}</h3><div className="w-full h-full bg-slate-800 rounded border border-slate-700 relative overflow-hidden opacity-50"><div className="absolute top-1/2 start-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]"></div><div className="absolute top-1/3 start-1/4 w-1 h-1 bg-red-500 rounded-full animate-ping"></div></div></div>
            </aside>
          </>
        )}
      </main>
      <div className="absolute inset-0 pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] animate-pulse"></div>
      <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
    </div>
  );
}
