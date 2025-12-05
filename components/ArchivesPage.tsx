import React from 'react';
import { Database, Brain, Bot, Network, GitBranch, Cpu } from 'lucide-react';

interface ArchivesPageProps {
  t: any;
}

const ArchivesPage: React.FC<ArchivesPageProps> = ({ t }) => {
  return (
    <div className="flex-1 p-8 overflow-auto z-20 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold font-mono text-emerald-500 mb-8 flex items-center gap-3">
        <Database className="animate-pulse" /> {t.system_archives}
      </h2>
      
      <div className="space-y-8 text-slate-300 font-sans leading-relaxed">
        
        {/* Lore Section */}
        <section className="bg-slate-900/80 p-6 border-s-4 border-emerald-500 rounded-e-lg shadow-lg">
           <h3 className="text-2xl font-bold text-white mb-2">{t.lore_title}</h3>
           <div className="text-sm font-mono text-emerald-500 mb-4 tracking-wider bg-emerald-950/30 inline-block px-2 py-1 rounded">{t.lore_subtitle}</div>
           <p className="mb-4 text-slate-400 leading-7">
             Civilization ended not with a bang, but a choke. The volcanic chain-reaction of 2157 blanketed the sky in eternal particulate darkness.
             Solar power failed. Crops withered. The surface became a frozen, toxic hellscape.
           </p>
           <p className="text-slate-400 leading-7">
             Humanity retreated into the Citadels—massive subterranean geo-scrapers powered by the planet's bleeding core.
             Now, we fight for what remains: Ferrum from the old cities, Carbon from the air itself, and Isotopes from the mutants that roam the wastes.
           </p>
        </section>

        {/* Live Ops Design Section */}
        <section className="bg-slate-900/80 p-6 border-s-4 border-amber-500 rounded-e-lg shadow-lg">
           <h3 className="text-2xl font-bold text-white mb-2">{t.live_ops_title}</h3>
           <div className="text-sm font-mono text-amber-500 mb-4 tracking-wider bg-amber-950/30 inline-block px-2 py-1 rounded">DESIGN DOCUMENT // CLEARANCE LEVEL 5</div>
           
           <h4 className="text-lg font-bold text-white mt-6 mb-2 border-b border-slate-700 pb-1">1. The Retention Loop</h4>
           <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
              <li><strong className="text-white">Daily (24h):</strong> "Logistics Directives". Login rewards, daily kill quotas, resource contributions.</li>
              <li><strong className="text-white">Weekly (7d):</strong> "Sector Conflicts". Rotating boss spawns, map modifiers (e.g., Acid Rain week).</li>
              <li><strong className="text-white">Seasonal (90d):</strong> "The Collapse Cycle". A 90-day narrative arc ending in a server-wide wipe and prestige reset.</li>
           </ul>

           <h4 className="text-lg font-bold text-white mt-6 mb-2 border-b border-slate-700 pb-1">2. Event Typology</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-black/30 p-3 rounded border border-slate-700 hover:border-amber-500/50 transition-colors">
                 <div className="text-amber-500 font-bold text-xs uppercase mb-1">COMBAT</div>
                 <div className="text-sm">Faction Invasions, Mutant Swarms, Territory Defense.</div>
              </div>
              <div className="bg-black/30 p-3 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors">
                 <div className="text-cyan-500 font-bold text-xs uppercase mb-1">ECONOMY</div>
                 <div className="text-sm">Double Harvest Days, Black Market Openings, Storm Cleanup.</div>
              </div>
              <div className="bg-black/30 p-3 rounded border border-slate-700 hover:border-emerald-500/50 transition-colors">
                 <div className="text-emerald-500 font-bold text-xs uppercase mb-1">EXPLORATION</div>
                 <div className="text-sm">Fog-Lift Events, Ruins Discovery, Signal Interception.</div>
              </div>
              <div className="bg-black/30 p-3 rounded border border-slate-700 hover:border-purple-500/50 transition-colors">
                 <div className="text-purple-500 font-bold text-xs uppercase mb-1">ALLIANCE</div>
                 <div className="text-sm">Mega-Boss Raids, Territory Wars, Diplomacy Challenges.</div>
              </div>
           </div>
        </section>

        {/* AI System Design Section */}
        <section className="bg-slate-900/80 p-6 border-s-4 border-blue-500 rounded-e-lg shadow-lg">
           <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
             <Brain size={24} className="text-blue-500" />
             {t.ai_title}
           </h3>
           <div className="text-sm font-mono text-blue-500 mb-6 tracking-wider bg-blue-950/30 inline-block px-2 py-1 rounded">{t.ai_subtitle}</div>

           {/* 1. Philosophy */}
           <div className="mb-8">
             <h4 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
               <Bot size={18} /> {t.ai_philo_title}
             </h4>
             <p className="text-sm text-slate-400 leading-relaxed mb-4">
               {t.ai_philo_desc}
             </p>
           </div>

           {/* 2. Architecture */}
           <div className="mb-8">
             <h4 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
               <Network size={18} /> {t.ai_arch_title}
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-blue-950/30 p-4 border border-blue-900/50 rounded hover:bg-blue-900/20 transition-colors">
                 <div className="text-blue-400 font-bold font-mono mb-2">{t.ai_micro_title}</div>
                 <div className="text-xs text-slate-400">
                   {t.ai_micro_desc}
                 </div>
               </div>
               <div className="bg-blue-950/30 p-4 border border-blue-900/50 rounded hover:bg-blue-900/20 transition-colors">
                 <div className="text-blue-400 font-bold font-mono mb-2">{t.ai_meso_title}</div>
                 <div className="text-xs text-slate-400">
                   {t.ai_meso_desc}
                 </div>
               </div>
               <div className="bg-blue-950/30 p-4 border border-blue-900/50 rounded hover:bg-blue-900/20 transition-colors">
                 <div className="text-blue-400 font-bold font-mono mb-2">{t.ai_macro_title}</div>
                 <div className="text-xs text-slate-400">
                   {t.ai_macro_desc}
                 </div>
               </div>
             </div>
           </div>

           {/* 3. Behavior Trees */}
           <div className="mb-8">
             <h4 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
               <GitBranch size={18} /> {t.ai_bt_title}
             </h4>
             <div className="space-y-4">
               <div className="bg-slate-950 p-4 rounded border-s-2 border-slate-700">
                 <div className="text-sm font-bold text-white mb-2">CLASS: INFANTRY</div>
                 <div className="font-mono text-xs text-slate-400 leading-relaxed" dir="ltr">
                   ROOT <br/>
                   ├── <span className="text-emerald-500 font-bold">Self_Preservation</span> (Health &lt; 30%? → Retreat/Heal)<br/>
                   ├── <span className="text-amber-500 font-bold">Combat_Logic</span> (Has Target?)<br/>
                   │   ├── Is Suppressed? → Hunker Down<br/>
                   │   ├── Can Flank? → Move to Flank Node<br/>
                   │   └── <span className="text-red-500 font-bold">Engage</span> (Fire / Grenade)<br/>
                   └── <span className="text-blue-500 font-bold">Idle_State</span> (Patrol / Guard)
                 </div>
               </div>
               <div className="bg-slate-950 p-4 rounded border-s-2 border-slate-700">
                 <div className="text-sm font-bold text-white mb-2">CLASS: MUTANT BEAST</div>
                 <div className="font-mono text-xs text-slate-400 leading-relaxed" dir="ltr">
                   ROOT <br/>
                   ├── <span className="text-red-500 font-bold">Enrage_Check</span> (Taken Damage? → Roar & Charge)<br/>
                   ├── <span className="text-amber-500 font-bold">Hunt_Logic</span> (Smell Player?)<br/>
                   │   ├── Stealth_Approach (Avoid Line of Sight)<br/>
                   │   └── Ambush_Leap<br/>
                   └── <span className="text-blue-500 font-bold">Wander</span> (Territory Patrol)
                 </div>
               </div>
             </div>
           </div>

           {/* 4. Utility AI */}
           <div className="mb-8">
             <h4 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
               <Cpu size={18} /> {t.ai_utility_title}
             </h4>
             <p className="text-sm text-slate-400 mb-4">
               Decisions are made by scoring all possible actions. The AI selects the action with the highest Utility Score.
             </p>
             <div className="bg-black/40 p-4 rounded border border-slate-700 font-mono text-xs text-slate-300">
               <div className="mb-2" dir="ltr">FORMULA: <span className="text-amber-500 font-bold">Score = (Benefit × Weight) - (Cost × Risk)</span></div>
               <hr className="border-slate-800 my-2" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <span className="text-cyan-500 font-bold">ACTION: Flank Left</span>
                   <ul className="list-disc list-inside mt-1 text-slate-500">
                     <li>Benefit: Exposed Enemy Side (+50)</li>
                     <li>Cost: Stamina Drain (-10)</li>
                     <li>Risk: Crossing Open Ground (-30)</li>
                     <li><strong>TOTAL: 10</strong></li>
                   </ul>
                 </div>
                 <div>
                   <span className="text-cyan-500 font-bold">ACTION: Throw Grenade</span>
                   <ul className="list-disc list-inside mt-1 text-slate-500">
                     <li>Benefit: Cluster Damage (+80)</li>
                     <li>Cost: Ammo Count (-50)</li>
                     <li>Risk: Friendly Fire Check (-0)</li>
                     <li><strong>TOTAL: 30 (SELECTED)</strong></li>
                   </ul>
                 </div>
               </div>
             </div>
           </div>

        </section>

        {/* Faction Data */}
        <section className="bg-slate-900/80 p-6 border-s-4 border-red-500 rounded-e-lg shadow-lg">
           <h3 className="text-2xl font-bold text-white mb-2">{t.intel_title}</h3>
           <div className="space-y-4 mt-4">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-red-900/20 border border-red-500 flex items-center justify-center text-red-500 font-bold text-lg rounded">FE</div>
                 <div>
                    <div className="font-bold text-white text-lg">Ferrum Enclave</div>
                    <div className="text-xs text-slate-400">Militaristic scavengers who worship old-world steel. Heavy armor, ballistic weaponry.</div>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-cyan-900/20 border border-cyan-500 flex items-center justify-center text-cyan-500 font-bold text-lg rounded">NS</div>
                 <div>
                    <div className="font-bold text-white text-lg">Neo-Synapse</div>
                    <div className="text-xs text-slate-400">Cybernetically enhanced scientists seeking to transcend the flesh. Energy weapons, shields.</div>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-green-900/20 border border-green-500 flex items-center justify-center text-green-500 font-bold text-lg rounded">AM</div>
                 <div>
                    <div className="font-bold text-white text-lg">Ashborn Mutants</div>
                    <div className="text-xs text-slate-400">Tribal warriors who have adapted to the toxic atmosphere. Biological weapons, stealth.</div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default ArchivesPage;
