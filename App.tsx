
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, Hammer, TrendingUp, AlertTriangle, 
  Database, Activity, Hexagon, Shield, Wind,
  ChevronRight, Lock, Play, Cpu, Crosshair,
  Terminal, Droplet, Flame, Sword, MousePointer,
  Menu, Settings, BookOpen, Radio, Calendar,
  Globe, Clock, BarChart, Users, Star
} from 'lucide-react';

// --- LOCALIZATION ---
type Language = 'en' | 'ar';

const TRANSLATIONS = {
  en: {
    // Menu
    deploy: "DEPLOY",
    resume_sim: "RESUME SIMULATION",
    operations: "OPERATIONS",
    live_events: "LIVE EVENTS & MISSIONS",
    archives: "ARCHIVES",
    database: "DATABASE & LORE",
    settings: "SETTINGS",
    system_config: "SYSTEM CONFIG",
    // Operations
    active_now: "Active Now",
    season_title: "SEASON 1: THE ASHFALL COLLAPSE",
    global_objective: "Global Objective",
    global_objective_desc: "Secure 5,000,000 Ferrum across all Alliance Territories before the sector collapses.",
    ends_in: "ENDS IN",
    tier: "TIER",
    view_briefing: "View Briefing",
    daily_directives: "DAILY DIRECTIVES",
    operational_forecast: "Operational Forecast",
    // Archives
    system_archives: "SYSTEM ARCHIVES",
    lore_title: "LORE: The Great Ashfall",
    lore_subtitle: "YEAR 2197 // 40 YEARS POST-COLLAPSE",
    live_ops_title: "SYSTEM PROTOCOL: Live Operations",
    intel_title: "INTELLIGENCE: Known Factions",
    // Settings
    language: "Language",
    holographic_hud: "Holographic HUD",
    ambient_audio: "Ambient Audio",
    scanline_fx: "Scanline FX",
    reset_data: "Reset All Data",
    reset_warning: "WARNING: This will purge local storage and reset campaign progress.",
    // Game
    command_interface: "Command Interface",
    select_construction: "Select Construction",
    building_progress: "CONSTRUCTION IN PROGRESS",
    event_log: "Event Log",
    mini_map: "Mini-Map",
    coords: "COORDS",
    region: "REGION",
    ash_storm_warning: "WARNING: ASH STORM DETECTED",
    // Resources & Buildings
    carbon: "Carbon",
    ferrum: "Ferrum",
    energy: "Energy",
    reactor: "Geothermal Bore",
    extractor_carbon: "Carbon Siphon",
    extractor_ferrum: "Magma Dredge",
    barracks: "Infantry Garrison",
    radar: "Sensor Array"
  },
  ar: {
    // Menu
    deploy: "نشر القوات",
    resume_sim: "استئناف المحاكاة",
    operations: "العمليات",
    live_events: "الأحداث والمهام الحية",
    archives: "الأرشيف",
    database: "قاعدة البيانات والسجلات",
    settings: "الإعدادات",
    system_config: "تكوين النظام",
    // Operations
    active_now: "نشط الآن",
    season_title: "الموسم 1: الانهيار الرمادي",
    global_objective: "الهدف العالمي",
    global_objective_desc: "تأمين 5,000,000 حديد عبر جميع أراضي التحالف قبل انهيار القطاع.",
    ends_in: "ينتهي في",
    tier: "المستوى",
    view_briefing: "عرض الموجز",
    daily_directives: "التوجيهات اليومية",
    operational_forecast: "توقعات العمليات",
    // Archives
    system_archives: "أرشيف النظام",
    lore_title: "السجل: السقوط الرمادي العظيم",
    lore_subtitle: "عام 2197 // 40 عاماً بعد الانهيار",
    live_ops_title: "بروتوكول النظام: العمليات الحية",
    intel_title: "استخبارات: الفصائل المعروفة",
    // Settings
    language: "اللغة",
    holographic_hud: "شاشة ثلاثية الأبعاد",
    ambient_audio: "صوت محيطي",
    scanline_fx: "تأثيرات المسح الضوئي",
    reset_data: "إعادة تعيين البيانات",
    reset_warning: "تحذير: سيؤدي هذا إلى مسح التخزين المحلي وإعادة تعيين التقدم.",
    // Game
    command_interface: "واجهة القيادة",
    select_construction: "اختر البناء",
    building_progress: "البناء قيد التنفيذ",
    event_log: "سجل الأحداث",
    mini_map: "الخريطة",
    coords: "الإحداثيات",
    region: "المنطقة",
    ash_storm_warning: "تحذير: تم اكتشاف عاصفة رماد",
    // Resources & Buildings
    carbon: "كربون",
    ferrum: "حديد",
    energy: "طاقة",
    reactor: "حفار حراري",
    extractor_carbon: "مصفاة الكربون",
    extractor_ferrum: "كراكة الصهارة",
    barracks: "ثكنة المشاة",
    radar: "مصفوفة الاستشعار"
  }
};

// --- GAME CONSTANTS & CONFIG ---
const TICK_RATE_MS = 1000;
const MAX_LOGS = 6;

// Resource Definitions
type ResourceType = 'carbon' | 'ferrum' | 'isotopes' | 'energy';
type BuildingType = 'reactor' | 'extractor_carbon' | 'extractor_ferrum' | 'barracks' | 'radar';

interface Cost {
  carbon?: number;
  ferrum?: number;
  isotopes?: number;
  energy?: number;
}

interface BuildingDef {
  id: BuildingType;
  nameKey: string; // Changed to key for translation
  icon: React.ElementType;
  description: string; // Keeping static for now, ideally key too
  cost: Cost;
  production: Partial<Record<ResourceType, number>>;
  energyDrain: number;
  buildTime: number;
  reqTech: number;
}

const BUILDINGS: Record<BuildingType, BuildingDef> = {
  reactor: {
    id: 'reactor',
    nameKey: 'reactor',
    icon: Zap,
    description: 'Taps into magma veins to generate Energy.',
    cost: { carbon: 150, ferrum: 50 },
    production: { energy: 20 },
    energyDrain: 0,
    buildTime: 5,
    reqTech: 0
  },
  extractor_carbon: {
    id: 'extractor_carbon',
    nameKey: 'extractor_carbon',
    icon: Database,
    description: 'Filters atmospheric soot for Carbon-Polymer.',
    cost: { carbon: 50, ferrum: 10 },
    production: { carbon: 10 },
    energyDrain: 5,
    buildTime: 3,
    reqTech: 0
  },
  extractor_ferrum: {
    id: 'extractor_ferrum',
    nameKey: 'extractor_ferrum',
    icon: Hammer,
    description: 'Dredges molten slag for Ferrum Alloy.',
    cost: { carbon: 100, ferrum: 20 },
    production: { ferrum: 5 },
    energyDrain: 8,
    buildTime: 4,
    reqTech: 0
  },
  barracks: {
    id: 'barracks',
    nameKey: 'barracks',
    icon: Sword,
    description: 'Trains basic squads and houses personnel.',
    cost: { carbon: 300, ferrum: 150, energy: 0 },
    production: {},
    energyDrain: 15,
    buildTime: 8,
    reqTech: 1
  },
  radar: {
    id: 'radar',
    nameKey: 'radar',
    icon: Crosshair,
    description: 'Scans nearby sectors for threats.',
    cost: { carbon: 200, ferrum: 100, isotopes: 10 },
    production: {},
    energyDrain: 25,
    buildTime: 10,
    reqTech: 1
  }
};

// --- TYPES ---
interface GameState {
  resources: Record<ResourceType, number>;
  caps: Record<ResourceType, number>;
  buildings: GridSlot[];
  logs: LogEntry[];
  techLevel: number;
  weather: 'clear' | 'ash_storm' | 'acid_rain';
}

interface GridSlot {
  id: number;
  buildingId: BuildingType | null;
  status: 'empty' | 'constructing' | 'active' | 'damaged';
  progress: number;
  timer?: number;
}

interface LogEntry {
  id: number;
  text: string;
  type: 'info' | 'warning' | 'success' | 'combat';
  timestamp: string;
}

// --- SUB-COMPONENTS ---

const ResourceDisplay = ({ type, value, cap, icon: Icon, color, trend }: { type: string, value: number, cap: number, icon: any, color: string, trend: number }) => (
  <div className="flex flex-col bg-slate-900/80 border border-slate-800 p-2 rounded relative overflow-hidden group">
    <div className={`absolute top-0 left-0 w-1 h-full ${color} opacity-50`}></div>
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">{type}</span>
      </div>
      <span className={`text-[10px] font-mono ${trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : 'text-slate-600'}`} dir="ltr">
        {trend > 0 ? '+' : ''}{trend}/s
      </span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-xl font-mono text-white leading-none">{Math.floor(value)}</span>
      <span className="text-[10px] text-slate-500 font-mono" dir="ltr">/{cap}</span>
    </div>
    <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full mt-1">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${Math.min(100, (value / cap) * 100)}%` }}
      ></div>
    </div>
  </div>
);

const GridTile = ({ slot, isSelected, onClick, t }: { slot: GridSlot, isSelected: boolean, onClick: () => void, t: any }) => {
  const building = slot.buildingId ? BUILDINGS[slot.buildingId] : null;

  return (
    <div 
      onClick={onClick}
      className={`
        aspect-square border-2 relative cursor-pointer transition-all duration-200 group overflow-hidden
        ${isSelected ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800'}
        ${slot.status === 'constructing' ? 'animate-pulse' : ''}
      `}
    >
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
      <div className="absolute top-0 start-0 w-2 h-2 border-t border-s border-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 end-0 w-2 h-2 border-b border-e border-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        {slot.status === 'empty' && (
          <div className="text-slate-700 group-hover:text-slate-500 transition-colors">
            <Hexagon className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-mono mt-1 opacity-50">SEC-{slot.id}</span>
          </div>
        )}

        {slot.status === 'constructing' && building && (
          <>
             <Hammer className="w-8 h-8 text-amber-500 animate-bounce" />
             <span className="text-[10px] text-amber-500 font-mono mt-2 text-center uppercase leading-none">{t.building_progress}</span>
             <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500" style={{ width: `${slot.progress}%` }}></div>
             </div>
          </>
        )}

        {slot.status === 'active' && building && (
          <>
            <building.icon className={`w-8 h-8 ${slot.buildingId === 'reactor' ? 'text-cyan-400' : 'text-slate-300'}`} />
            <span className="text-[10px] font-bold text-slate-300 mt-2 text-center leading-tight">{t[building.nameKey] || building.nameKey}</span>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] text-emerald-500 uppercase">ONLINE</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const BuildMenu = ({ onBuild, resources, t }: { onBuild: (type: BuildingType) => void, resources: Record<ResourceType, number>, t: any }) => {
  const canAfford = (cost: Cost) => {
    return (
      (cost.carbon || 0) <= resources.carbon &&
      (cost.ferrum || 0) <= resources.ferrum &&
      (cost.isotopes || 0) <= resources.isotopes &&
      (cost.energy || 0) <= resources.energy
    );
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-1">
      <div className="grid grid-cols-1 gap-2">
        {Object.values(BUILDINGS).map((b) => {
          const affordable = canAfford(b.cost);
          const name = t[b.nameKey] || b.nameKey;
          return (
            <button
              key={b.id}
              onClick={() => affordable && onBuild(b.id)}
              disabled={!affordable}
              className={`
                flex items-center p-3 border text-start transition-all group relative overflow-hidden
                ${affordable 
                  ? 'border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-amber-500' 
                  : 'border-slate-800 bg-slate-950 opacity-50 cursor-not-allowed'}
              `}
            >
              <div className={`p-2 rounded bg-slate-800 me-3 ${affordable ? 'text-amber-500 group-hover:text-amber-400' : 'text-slate-600'}`}>
                <b.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                   <span className={`font-bold font-mono text-sm ${affordable ? 'text-slate-200' : 'text-slate-500'}`}>{name}</span>
                   <span className="text-[10px] text-slate-500" dir="ltr">{b.buildTime}s</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-1 leading-tight">{b.description}</div>
                <div className="flex gap-2" dir="ltr">
                  {b.cost.carbon && <span className={`text-[10px] ${resources.carbon >= b.cost.carbon ? 'text-slate-400' : 'text-red-500'}`}>C:{b.cost.carbon}</span>}
                  {b.cost.ferrum && <span className={`text-[10px] ${resources.ferrum >= b.cost.ferrum ? 'text-slate-400' : 'text-red-500'}`}>F:{b.cost.ferrum}</span>}
                  {b.cost.energy && <span className={`text-[10px] ${resources.energy >= b.cost.energy ? 'text-cyan-400' : 'text-red-500'}`}>E:{b.cost.energy}</span>}
                </div>
              </div>
              {!affordable && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                   <Lock className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- PAGES ---

const MainMenu = ({ onNavigate, t }: { onNavigate: (page: 'home' | 'game' | 'operations' | 'archives' | 'settings') => void, t: any }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-20">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black font-mono tracking-tighter text-white mb-2 flex items-center justify-center gap-4">
          <Activity className="w-12 h-12 text-amber-500 animate-pulse" />
          ASHFALL DOMINION
        </h1>
        <p className="text-amber-500 font-mono tracking-[0.5em] text-sm uppercase">Prototype Build v0.9.1</p>
      </div>
      
      <div className="flex flex-col gap-4 w-64">
        <button onClick={() => onNavigate('game')} className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-amber-500 transition-all text-start">
           <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors"></div>
           <span className="text-xl font-bold font-mono text-white group-hover:text-amber-500 transition-colors flex items-center justify-between">
             {t.deploy} <Play size={16} className="rtl:rotate-180" />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase">{t.resume_sim}</span>
        </button>
        <button onClick={() => onNavigate('operations')} className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-cyan-500 transition-all text-start">
           <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors"></div>
           <span className="text-xl font-bold font-mono text-white group-hover:text-cyan-500 transition-colors flex items-center justify-between">
             {t.operations} <Radio size={16} />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase">{t.live_events}</span>
        </button>
        <button onClick={() => onNavigate('archives')} className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-emerald-500 transition-all text-start">
           <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors"></div>
           <span className="text-xl font-bold font-mono text-white group-hover:text-emerald-500 transition-colors flex items-center justify-between">
             {t.archives} <BookOpen size={16} />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase">{t.database}</span>
        </button>
        <button onClick={() => onNavigate('settings')} className="group relative px-8 py-4 bg-slate-900 border border-slate-700 hover:border-purple-500 transition-all text-start">
           <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors"></div>
           <span className="text-xl font-bold font-mono text-white group-hover:text-purple-500 transition-colors flex items-center justify-between">
             {t.settings} <Settings size={16} />
           </span>
           <span className="text-[10px] text-slate-500 font-mono block mt-1 group-hover:text-slate-400 uppercase">{t.system_config}</span>
        </button>
      </div>
    </div>
  );
};

const OperationsPage = ({ t }: { t: any }) => {
  return (
    <div className="flex-1 p-8 overflow-auto z-20">
      <h2 className="text-4xl font-bold font-mono text-cyan-500 mb-8 flex items-center gap-3">
        <Radio className="animate-pulse" /> {t.operations}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Event Card */}
        <div className="col-span-1 md:col-span-2 bg-slate-900/90 border border-cyan-500/50 p-6 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 end-0 p-2 bg-cyan-500 text-black text-xs font-bold font-mono uppercase">{t.active_now}</div>
          <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors pointer-events-none"></div>
          
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">{t.season_title}</h3>
            <Wind className="w-8 h-8 text-cyan-500" />
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-black/40 p-3 rounded border border-cyan-900/50">
               <div className="text-xs text-cyan-400 uppercase font-bold mb-1">{t.global_objective}</div>
               <div className="text-sm text-slate-300">{t.global_objective_desc}</div>
            </div>
            <div className="flex gap-4 text-xs font-mono">
               <span className="text-slate-400 uppercase">{t.ends_in}: <span className="text-white" dir="ltr">14D 03H 22M</span></span>
               <span className="text-slate-400 uppercase">{t.tier}: <span className="text-amber-500">LEGENDARY</span></span>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-cyan-900/30 border border-cyan-500 text-cyan-400 text-sm font-bold uppercase hover:bg-cyan-500 hover:text-black transition-all">
             {t.view_briefing}
          </button>
        </div>

        {/* Daily Challenges */}
        <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-lg">
           <h3 className="text-lg font-bold text-emerald-500 mb-4 flex items-center gap-2">
              <Clock size={16} /> {t.daily_directives}
           </h3>
           <ul className="space-y-3">
              {[
                { task: 'Extract 500 Carbon', progress: '320/500', reward: '50 Credits' },
                { task: 'Upgrade 1 Reactor', progress: '0/1', reward: '10 Isotopes' },
                { task: 'Scout 3 Sectors', progress: '3/3', reward: 'Claimed', done: true },
              ].map((m, i) => (
                 <li key={i} className={`text-sm p-2 rounded border ${m.done ? 'bg-emerald-900/20 border-emerald-900 text-emerald-600 line-through' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                    <div className="flex justify-between mb-1">
                       <span>{m.task}</span>
                       <span className="font-mono text-xs" dir="ltr">{m.progress}</span>
                    </div>
                    <div className="text-[10px] text-amber-500 font-mono" dir="ltr">REWARD: {m.reward}</div>
                 </li>
              ))}
           </ul>
        </div>
      </div>

      {/* Upcoming Roadmap */}
      <h3 className="text-xl font-bold text-slate-500 mt-12 mb-6 uppercase tracking-wider">{t.operational_forecast}</h3>
      <div className="relative border-s-2 border-slate-800 ms-4 space-y-8 pb-8">
         <div className="ps-6 relative">
            <div className="absolute -start-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600"></div>
            <div className="text-sm font-bold text-slate-300">WEEK 2: MUTANT MIGRATION</div>
            <div className="text-xs text-slate-500 mt-1">Ash Crawlers expected to breach outer sectors. Prepare defenses.</div>
         </div>
         <div className="ps-6 relative">
            <div className="absolute -start-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600"></div>
            <div className="text-sm font-bold text-slate-300">WEEK 4: ALLIANCE WARS</div>
            <div className="text-xs text-slate-500 mt-1">Territory control nodes unlock. PvP enabled in Neutral Zones.</div>
         </div>
         <div className="ps-6 relative">
            <div className="absolute -start-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600"></div>
            <div className="text-sm font-bold text-slate-300">SEASON END: THE PURGE</div>
            <div className="text-xs text-slate-500 mt-1">Total server reset. Prestige rewards distribution.</div>
         </div>
      </div>
    </div>
  );
};

const ArchivesPage = ({ t }: { t: any }) => {
  return (
    <div className="flex-1 p-8 overflow-auto z-20 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold font-mono text-emerald-500 mb-8 flex items-center gap-3">
        <Database className="animate-pulse" /> {t.system_archives}
      </h2>
      
      <div className="space-y-8 text-slate-300 font-sans leading-relaxed">
        
        {/* Lore Section */}
        <section className="bg-slate-900/80 p-6 border-s-4 border-emerald-500 rounded-e-lg">
           <h3 className="text-2xl font-bold text-white mb-2">{t.lore_title}</h3>
           <div className="text-sm font-mono text-emerald-500 mb-4">{t.lore_subtitle}</div>
           <p className="mb-4">
             Civilization ended not with a bang, but a choke. The volcanic chain-reaction of 2157 blanketed the sky in eternal particulate darkness.
             Solar power failed. Crops withered. The surface became a frozen, toxic hellscape.
           </p>
           <p>
             Humanity retreated into the Citadels—massive subterranean geo-scrapers powered by the planet's bleeding core.
             Now, we fight for what remains: Ferrum from the old cities, Carbon from the air itself, and Isotopes from the mutants that roam the wastes.
           </p>
        </section>

        {/* Live Ops Design Section */}
        <section className="bg-slate-900/80 p-6 border-s-4 border-amber-500 rounded-e-lg">
           <h3 className="text-2xl font-bold text-white mb-2">{t.live_ops_title}</h3>
           <div className="text-sm font-mono text-amber-500 mb-4">DESIGN DOCUMENT // CLEARANCE LEVEL 5</div>
           
           <h4 className="text-lg font-bold text-white mt-6 mb-2">1. The Retention Loop</h4>
           <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
              <li><strong className="text-white">Daily (24h):</strong> "Logistics Directives". Login rewards, daily kill quotas, resource contributions.</li>
              <li><strong className="text-white">Weekly (7d):</strong> "Sector Conflicts". Rotating boss spawns, map modifiers (e.g., Acid Rain week).</li>
              <li><strong className="text-white">Seasonal (90d):</strong> "The Collapse Cycle". A 90-day narrative arc ending in a server-wide wipe and prestige reset.</li>
           </ul>

           <h4 className="text-lg font-bold text-white mt-6 mb-2">2. Event Typology</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-black/30 p-3 rounded border border-slate-700">
                 <div className="text-amber-500 font-bold text-xs uppercase mb-1">COMBAT</div>
                 <div className="text-sm">Faction Invasions, Mutant Swarms, Territory Defense.</div>
              </div>
              <div className="bg-black/30 p-3 rounded border border-slate-700">
                 <div className="text-cyan-500 font-bold text-xs uppercase mb-1">ECONOMY</div>
                 <div className="text-sm">Double Harvest Days, Black Market Openings, Storm Cleanup.</div>
              </div>
              <div className="bg-black/30 p-3 rounded border border-slate-700">
                 <div className="text-emerald-500 font-bold text-xs uppercase mb-1">EXPLORATION</div>
                 <div className="text-sm">Fog-Lift Events, Ruins Discovery, Signal Interception.</div>
              </div>
              <div className="bg-black/30 p-3 rounded border border-slate-700">
                 <div className="text-purple-500 font-bold text-xs uppercase mb-1">ALLIANCE</div>
                 <div className="text-sm">Mega-Boss Raids, Territory Wars, Diplomacy Challenges.</div>
              </div>
           </div>
        </section>

        {/* Faction Data */}
        <section className="bg-slate-900/80 p-6 border-s-4 border-red-500 rounded-e-lg">
           <h3 className="text-2xl font-bold text-white mb-2">{t.intel_title}</h3>
           <div className="space-y-4 mt-4">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-red-900/20 border border-red-500 flex items-center justify-center text-red-500 font-bold">FE</div>
                 <div>
                    <div className="font-bold text-white">Ferrum Enclave</div>
                    <div className="text-xs text-slate-400">Militaristic scavengers who worship old-world steel. Heavy armor, ballistic weaponry.</div>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-cyan-900/20 border border-cyan-500 flex items-center justify-center text-cyan-500 font-bold">NS</div>
                 <div>
                    <div className="font-bold text-white">Neo-Synapse</div>
                    <div className="text-xs text-slate-400">Cybernetically enhanced scientists seeking to transcend the flesh. Energy weapons, shields.</div>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-green-900/20 border border-green-500 flex items-center justify-center text-green-500 font-bold">AM</div>
                 <div>
                    <div className="font-bold text-white">Ashborn Mutants</div>
                    <div className="text-xs text-slate-400">Tribal warriors who have adapted to the toxic atmosphere. Biological weapons, stealth.</div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

const SettingsPage = ({ lang, setLang, t }: { lang: Language, setLang: (l: Language) => void, t: any }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center z-20">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-500 mb-6 flex items-center gap-2">
           <Settings /> {t.system_config}
        </h2>
        
        <div className="space-y-6">
           {/* Language Switcher */}
           <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">{t.language}</span>
              <div className="flex bg-slate-800 rounded p-1 gap-1">
                 <button 
                   onClick={() => setLang('en')}
                   className={`px-3 py-1 rounded text-xs font-bold transition-colors ${lang === 'en' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                   English
                 </button>
                 <button 
                   onClick={() => setLang('ar')}
                   className={`px-3 py-1 rounded text-xs font-bold transition-colors ${lang === 'ar' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                   العربية
                 </button>
              </div>
           </div>

           <div className="flex items-center justify-between">
              <span className="text-slate-300">{t.holographic_hud}</span>
              <div className="w-12 h-6 bg-purple-900 rounded-full relative cursor-pointer">
                 <div className="absolute end-1 top-1 w-4 h-4 bg-purple-400 rounded-full"></div>
              </div>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-slate-300">{t.ambient_audio}</span>
              <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer">
                 <div className="absolute start-1 top-1 w-4 h-4 bg-slate-500 rounded-full"></div>
              </div>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-slate-300">{t.scanline_fx}</span>
              <div className="w-12 h-6 bg-purple-900 rounded-full relative cursor-pointer">
                 <div className="absolute end-1 top-1 w-4 h-4 bg-purple-400 rounded-full"></div>
              </div>
           </div>
           
           <div className="border-t border-slate-800 pt-6 mt-6">
              <button className="w-full py-3 bg-red-900/20 border border-red-900 text-red-500 font-bold uppercase hover:bg-red-900/40 transition-colors">
                 {t.reset_data}
              </button>
              <div className="text-center text-[10px] text-slate-600 mt-2">
                 {t.reset_warning}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP SHELL ---

export default function App() {
  const [view, setView] = useState<'home' | 'game' | 'operations' | 'archives' | 'settings'>('home');
  const [tickCount, setTickCount] = useState(0);
  const [lang, setLang] = useState<Language>('en');

  // Translation helper
  const t = TRANSLATIONS[lang];

  // --- LIFTED GAME STATE ---
  const [gameState, setGameState] = useState<GameState>({
    resources: { carbon: 300, ferrum: 150, isotopes: 0, energy: 100 },
    caps: { carbon: 1000, ferrum: 500, isotopes: 100, energy: 100 },
    buildings: Array(9).fill(null).map((_, i) => ({ id: i, buildingId: null, status: 'empty', progress: 0 })),
    logs: [{ id: 0, text: "SYSTEM INITIALIZED. COMMANDER ONLINE.", type: 'info', timestamp: '00:00:00' }],
    techLevel: 0,
    weather: 'clear'
  });

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  // --- GAME LOOP ---
  // The loop runs continuously in the background to simulate "server" time,
  // even if the user is looking at the Archives.
  useEffect(() => {
    const loop = setInterval(() => {
      setTickCount(c => c + 1);

      setGameState(prev => {
        const next = { ...prev };
        const production = { carbon: 0, ferrum: 0, isotopes: 0, energy: 0 };
        const consumption = { energy: 0 };

        next.buildings.forEach(slot => {
          if (slot.status === 'active' && slot.buildingId) {
            const def = BUILDINGS[slot.buildingId];
            if (def.production.carbon) production.carbon += def.production.carbon;
            if (def.production.ferrum) production.ferrum += def.production.ferrum;
            if (def.production.energy) production.energy += def.production.energy;
            if (def.energyDrain) consumption.energy += def.energyDrain;
          }
          if (slot.status === 'constructing' && slot.timer && slot.timer > 0) {
            slot.timer -= 1;
            const def = BUILDINGS[slot.buildingId!];
            slot.progress = Math.floor(((def.buildTime - slot.timer) / def.buildTime) * 100);
            if (slot.timer <= 0) {
              slot.status = 'active';
              slot.progress = 100;
            }
          }
        });

        const netEnergy = production.energy - consumption.energy;
        production.carbon += 1; // Passive
        
        next.resources.carbon = Math.min(next.caps.carbon, next.resources.carbon + production.carbon);
        next.resources.ferrum = Math.min(next.caps.ferrum, next.resources.ferrum + production.ferrum);
        
        const newEnergy = next.resources.energy + netEnergy;
        next.resources.energy = Math.max(0, Math.min(next.caps.energy, newEnergy));
        
        if (next.weather === 'clear' && Math.random() < 0.005) {
           next.weather = 'ash_storm';
        } else if (next.weather === 'ash_storm' && Math.random() < 0.02) {
           next.weather = 'clear';
        }

        return next;
      });
    }, TICK_RATE_MS);
    return () => clearInterval(loop);
  }, []);

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
      newBuildings[slotIndex] = { ...slot, buildingId: type, status: 'constructing', timer: def.buildTime, progress: 0 };
      
      const now = new Date().toISOString().split('T')[1].split('.')[0];
      const newLogs = [{ id: Date.now(), text: `BUILDING: ${def.nameKey.toUpperCase()}`, type: 'info', timestamp: now }, ...prev.logs].slice(0, MAX_LOGS);

      return { ...prev, resources: newResources, buildings: newBuildings, logs: newLogs as LogEntry[] };
    });
  };

  const calculateTrends = () => {
    let trends = { carbon: 1, ferrum: 0, energy: 0 };
    gameState.buildings.forEach(slot => {
      if (slot.status === 'active' && slot.buildingId) {
        const def = BUILDINGS[slot.buildingId];
        if (def.production.carbon) trends.carbon += def.production.carbon;
        if (def.production.ferrum) trends.ferrum += def.production.ferrum;
        if (def.production.energy) trends.energy += def.production.energy;
        if (def.energyDrain) trends.energy -= def.energyDrain;
      }
    });
    return trends;
  };

  const trends = calculateTrends();
  const selectedSlot = selectedSlotId !== null ? gameState.buildings.find(b => b.id === selectedSlotId) : null;
  const selectedBuildingDef = selectedSlot?.buildingId ? BUILDINGS[selectedSlot.buildingId] : null;

  // --- RENDER ---
  return (
    <div 
      className="min-h-screen bg-black text-slate-200 font-sans selection:bg-amber-500/30 overflow-hidden flex flex-col relative"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      
      {/* GLOBAL BACKGROUND */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-0"></div>
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* --- HEADER --- */}
      <header className="relative z-30 bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setView('home')}>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-mono tracking-tighter text-white flex items-center gap-2">
              <Activity className="text-amber-500 w-5 h-5" />
              ASHFALL <span className="text-slate-600">DOMINION</span>
            </h1>
          </div>
        </div>

        {/* Top Nav (only visible if not on home) */}
        {view !== 'home' && (
           <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setView('game')} className={`text-sm font-mono font-bold uppercase ${view === 'game' ? 'text-amber-500' : 'text-slate-500 hover:text-white'}`}>{t.resume_sim}</button>
              <button onClick={() => setView('operations')} className={`text-sm font-mono font-bold uppercase ${view === 'operations' ? 'text-cyan-500' : 'text-slate-500 hover:text-white'}`}>{t.operations}</button>
              <button onClick={() => setView('archives')} className={`text-sm font-mono font-bold uppercase ${view === 'archives' ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}>{t.archives}</button>
              <button onClick={() => setView('settings')} className={`text-sm font-mono font-bold uppercase ${view === 'settings' ? 'text-purple-500' : 'text-slate-500 hover:text-white'}`}>{t.settings}</button>
           </div>
        )}
        
        {/* Resource Ticker (Always visible in Game, Maybe simpler elsewhere) */}
        {view === 'game' && (
          <div className="flex items-center gap-4" dir="ltr">
            <div className="w-24"><ResourceDisplay type={t.carbon} value={gameState.resources.carbon} cap={gameState.caps.carbon} icon={Database} color="bg-slate-500" trend={trends.carbon} /></div>
            <div className="w-24"><ResourceDisplay type={t.ferrum} value={gameState.resources.ferrum} cap={gameState.caps.ferrum} icon={Hammer} color="bg-slate-400" trend={trends.ferrum} /></div>
            <div className="w-24"><ResourceDisplay type={t.energy} value={gameState.resources.energy} cap={gameState.caps.energy} icon={Zap} color={gameState.resources.energy < 10 ? "bg-red-500" : "bg-cyan-500"} trend={trends.energy} /></div>
          </div>
        )}
      </header>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 flex relative z-10 overflow-hidden">
        
        {view === 'home' && <MainMenu onNavigate={setView} t={t} />}
        
        {view === 'operations' && <OperationsPage t={t} />}
        
        {view === 'archives' && <ArchivesPage t={t} />}
        
        {view === 'settings' && <SettingsPage lang={lang} setLang={setLang} t={t} />}

        {/* THE GAME VIEW (Preserved Logic) */}
        {view === 'game' && (
          <>
            <aside className="w-80 bg-slate-900/90 border-e border-slate-800 flex flex-col backdrop-blur-sm z-20">
              <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                <h2 className="text-sm font-mono text-amber-500 font-bold uppercase tracking-wider flex items-center">
                  <Terminal className="w-4 h-4 me-2" />
                  {t.command_interface}
                </h2>
              </div>
              <div className="flex-1 overflow-hidden p-4">
                {selectedSlot ? (
                  selectedSlot.status === 'empty' ? (
                    <div className="h-full flex flex-col">
                      <div className="text-xs text-slate-400 mb-3 uppercase font-bold tracking-wider">{t.select_construction}</div>
                      <BuildMenu onBuild={handleBuild} resources={gameState.resources} t={t} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                       {selectedBuildingDef && (
                         <>
                            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                               <div className="p-3 bg-slate-800 rounded border border-slate-700 text-cyan-400"><selectedBuildingDef.icon size={24} /></div>
                               <div>
                                  <div className="text-lg font-bold text-white leading-none">{t[selectedBuildingDef.nameKey]}</div>
                                  <div className="text-xs text-emerald-500 font-mono mt-1">LVL 1 // ONLINE</div>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-slate-400 leading-tight">{selectedBuildingDef.description}</div>
                               <div className="grid grid-cols-2 gap-2">
                                  <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
                                     <span className="text-[10px] text-slate-500 block">OUTPUT</span>
                                     <span className="text-sm text-emerald-400 font-mono" dir="ltr">
                                        {selectedBuildingDef.production.energy ? `+${selectedBuildingDef.production.energy} E` : ''}
                                        {selectedBuildingDef.production.carbon ? `+${selectedBuildingDef.production.carbon} C` : ''}
                                        {selectedBuildingDef.production.ferrum ? `+${selectedBuildingDef.production.ferrum} F` : ''}
                                        {Object.keys(selectedBuildingDef.production).length === 0 && 'None'}
                                     </span>
                                  </div>
                                  <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
                                     <span className="text-[10px] text-slate-500 block">DRAIN</span>
                                     <span className="text-sm text-amber-400 font-mono" dir="ltr">{selectedBuildingDef.energyDrain} Energy/s</span>
                                  </div>
                               </div>
                            </div>
                         </>
                       )}
                       {!selectedBuildingDef && selectedSlot.status === 'constructing' && (
                          <div className="text-center mt-10">
                             <Hammer className="w-12 h-12 text-amber-500 mx-auto animate-bounce mb-4" />
                             <div className="text-amber-500 font-bold">{t.building_progress}</div>
                          </div>
                       )}
                    </div>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                     <MousePointer size={48} className="mb-4" />
                     <p className="text-xs font-mono">SELECT A SECTOR</p>
                  </div>
                )}
              </div>
            </aside>

            <section className="flex-1 bg-black relative flex items-center justify-center overflow-auto p-8 z-10">
               <div className="absolute top-4 start-4 text-[10px] font-mono text-slate-600">
                  {t.coords}: 45.92, -12.04<br/>{t.region}: OBSIDIAN WASTES
               </div>
               {gameState.weather === 'ash_storm' && (
                  <div className="absolute inset-0 pointer-events-none z-40 bg-amber-900/10 mix-blend-overlay animate-pulse">
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 animate-[spin_10s_linear_infinite]"></div>
                     <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-amber-900/80 text-amber-100 px-4 py-1 rounded text-xs font-bold font-mono border border-amber-500 animate-pulse">
                        {t.ash_storm_warning}
                     </div>
                  </div>
               )}
               <div className="grid grid-cols-3 gap-4 max-w-2xl w-full aspect-square p-8 border border-slate-800/50 bg-slate-900/20 rounded-xl relative">
                  <div className="absolute -top-1 -start-1 w-8 h-8 border-t-2 border-s-2 border-slate-600"></div>
                  <div className="absolute -top-1 -end-1 w-8 h-8 border-t-2 border-e-2 border-slate-600"></div>
                  <div className="absolute -bottom-1 -start-1 w-8 h-8 border-b-2 border-s-2 border-slate-600"></div>
                  <div className="absolute -bottom-1 -end-1 w-8 h-8 border-b-2 border-e-2 border-slate-600"></div>
                  {gameState.buildings.map((slot) => (
                    <GridTile key={slot.id} slot={slot} isSelected={selectedSlotId === slot.id} onClick={() => setSelectedSlotId(slot.id)} t={t} />
                  ))}
               </div>
            </section>

            <aside className="w-64 bg-slate-950 border-s border-slate-800 hidden lg:flex flex-col z-20">
               <div className="flex-1 p-4 border-b border-slate-800">
                  <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{t.event_log}</h3>
                  <div className="space-y-2 font-mono text-[10px]">
                     {gameState.logs.map((log) => (
                       <div key={log.id} className="mb-2 animate-fadeIn text-start">
                          <span className="text-slate-600 block mb-0.5" dir="ltr">[{log.timestamp}]</span>
                          <span className={`${log.type === 'warning' ? 'text-amber-500' : log.type === 'success' ? 'text-emerald-500' : 'text-slate-300'}`}>{log.text}</span>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="h-1/3 bg-slate-900 p-4 border-t border-slate-800">
                  <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{t.mini_map}</h3>
                  <div className="w-full h-full bg-slate-800 rounded border border-slate-700 relative overflow-hidden opacity-50">
                     <div className="absolute top-1/2 start-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]"></div>
                     <div className="absolute top-1/3 start-1/4 w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                  </div>
               </div>
            </aside>
          </>
        )}

      </main>

      {/* FOOTER OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] animate-pulse"></div>
      <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

    </div>
  );
}
