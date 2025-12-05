import { 
  Zap, Hammer, Database, Crosshair, Sword, Archive, Target, Users, Shield 
} from 'lucide-react';
import { BuildingDef, BuildingType, TechDef, TechId, UnitDef, UnitType } from './types';

// --- GAME CONSTANTS ---
export const TICK_RATE_MS = 1000;
export const MAX_LOGS = 6;
export const UPGRADE_COST_MULTIPLIER = 1.5;
export const PRODUCTION_MULTIPLIER = 1.2;
export const BASE_CAPS = { carbon: 300, ferrum: 150, isotopes: 50, energy: 100 };
export const MAX_QUEUE_SIZE = 5;

// --- TRANSLATIONS ---
export const TRANSLATIONS = {
  en: {
    // Menu
    deploy: "DEPLOY",
    resume_sim: "RESUME SIMULATION",
    operations: "OPERATIONS",
    live_events: "LIVE EVENTS & MISSIONS",
    archives: "ARCHIVES",
    database: "DATABASE & LORE",
    research: "RESEARCH",
    tech_tree: "TECHNOLOGY TREE",
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
    ai_title: "SYSTEM PROTOCOL: Artificial Intelligence",
    ai_subtitle: "BEHAVIORAL MATRICES // CLEARANCE LEVEL 9",
    ai_philo_title: "1. The Ashfall Mind (Philosophy)",
    ai_philo_desc: "The AI in Ashfall Dominion is not merely a target practice algorithm; it is a predatory survivor. It reads the environment—avoiding acid rain pools and using dust storms for concealment.",
    ai_arch_title: "2. Three-Layer Architecture",
    ai_micro_title: "MICRO (Unit)",
    ai_micro_desc: "Handles immediate reactions: Aiming, Taking Cover, Reloading, Pathfinding around dynamic obstacles.",
    ai_meso_title: "MESO (Squad)",
    ai_meso_desc: "Coordinator AI. Handles Formation maintenance, Suppression Fire orders, and Flanking maneuvers.",
    ai_macro_title: "MACRO (World)",
    ai_macro_desc: "The Director. Decides Faction strategy, Economy growth, Storm spawning, and Invasion timing.",
    ai_bt_title: "3. Behavior Trees",
    ai_utility_title: "4. Utility Scoring Model",
    // Research
    research_lab: "Research Lab",
    research_progress: "RESEARCH IN PROGRESS",
    research_complete: "RESEARCH COMPLETE",
    start_research: "START RESEARCH",
    req_tech: "REQUIRES",
    military: "MILITARY",
    economy: "ECONOMY",
    defense: "DEFENSE",
    engineering: "ENGINEERING",
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
    upgrading_progress: "UPGRADE IN PROGRESS",
    upgrade: "UPGRADE",
    level_short: "LVL",
    upgrade_to: "Upgrade to Level",
    event_log: "Event Log",
    mini_map: "Mini-Map",
    coords: "COORDS",
    region: "REGION",
    ash_storm_warning: "WARNING: ASH STORM DETECTED",
    max_cap: "FULL",
    train_unit: "TRAIN COMBAT UNIT",
    training_progress: "TRAINING IN PROGRESS",
    unit_ready: "UNIT READY",
    active_forces: "ACTIVE FORCES",
    queued: "QUEUED",
    // Resources & Buildings
    carbon: "Carbon",
    ferrum: "Ferrum",
    energy: "Energy",
    reactor: "Geothermal Bore",
    extractor_carbon: "Carbon Siphon",
    extractor_ferrum: "Magma Dredge",
    barracks: "Infantry Garrison",
    radar: "Sensor Array",
    storage_depot: "Supply Depot",
    // Units
    scout: "Recon Scout",
    marine: "Ash Marine",
    tank: "Magma Walker",
    // Techs
    tech_hardened_alloys: "Hardened Alloys",
    tech_energy_grid: "Grid Optimization",
    tech_ballistics: "Advanced Ballistics",
    tech_robotics: "Combat Robotics"
  },
  ar: {
    // Menu
    deploy: "نشر القوات",
    resume_sim: "استئناف المحاكاة",
    operations: "العمليات",
    live_events: "الأحداث والمهام الحية",
    archives: "الأرشيف",
    database: "قاعدة البيانات والسجلات",
    research: "الأبحاث",
    tech_tree: "شجرة التكنولوجيا",
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
    ai_title: "بروتوكول النظام: الذكاء الاصطناعي",
    ai_subtitle: "مصفوفات السلوك // مستوى التصريح 9",
    ai_philo_title: "1. عقل السقوط الرمادي (الفلسفة)",
    ai_philo_desc: "الذكاء الاصطناعي في هذه اللعبة ليس مجرد هدف للتدريب؛ إنه ناجٍ مفترس. يقرأ البيئة - يتجنب برك المطر الحمضي ويستخدم عواصف الغبار للتخفي.",
    ai_arch_title: "2. معمارية الطبقات الثلاث",
    ai_micro_title: "جزئي (الوحدة)",
    ai_micro_desc: "يتعامل مع ردود الفعل الفورية: التصويب، الاحتماء، إعادة التلقيم، وتحديد المسار حول العقبات.",
    ai_meso_title: "متوسط (الفريق)",
    ai_meso_desc: "الذكاء المنسق. يتعامل مع الحفاظ على التشكيل، أوامر إطلاق النار القمعي، ومناورات الالتفاف.",
    ai_macro_title: "كلي (العالم)",
    ai_macro_desc: "المخرج. يقرر استراتيجية الفصائل، النمو الاقتصادي، توليد العواصف، وتوقيت الغزو.",
    ai_bt_title: "3. أشجار السلوك",
    ai_utility_title: "4. نموذج تسجيل المنفعة",
    // Research
    research_lab: "مختبر الأبحاث",
    research_progress: "جاري البحث",
    research_complete: "اكتمل البحث",
    start_research: "بدء البحث",
    req_tech: "يتطلب",
    military: "عسكري",
    economy: "اقتصاد",
    defense: "دفاع",
    engineering: "هندسة",
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
    upgrading_progress: "جاري الترقية",
    upgrade: "ترقية",
    level_short: "مستوى",
    upgrade_to: "ترقية إلى مستوى",
    event_log: "سجل الأحداث",
    mini_map: "الخريطة",
    coords: "الإحداثيات",
    region: "المنطقة",
    ash_storm_warning: "تحذير: تم اكتشاف عاصفة رماد",
    max_cap: "ممتلئ",
    train_unit: "تدريب وحدة قتالية",
    training_progress: "جاري التدريب",
    unit_ready: "الوحدة جاهزة",
    active_forces: "القوات النشطة",
    queued: "في الانتظار",
    // Resources & Buildings
    carbon: "كربون",
    ferrum: "حديد",
    energy: "طاقة",
    reactor: "حفار حراري",
    extractor_carbon: "مصفاة الكربون",
    extractor_ferrum: "كراكة الصهارة",
    barracks: "ثكنة المشاة",
    radar: "مصفوفة الاستشعار",
    storage_depot: "مخزن الإمدادات",
    // Units
    scout: "كشاف استطلاع",
    marine: "جندي الرماد",
    tank: "سائر الصهارة",
    // Techs
    tech_hardened_alloys: "سبائك مقواة",
    tech_energy_grid: "تحسين الشبكة",
    tech_ballistics: "مقدوفات متقدمة",
    tech_robotics: "روبوتات قتالية"
  }
};

// --- DATA DEFINITIONS ---

export const BUILDINGS: Record<BuildingType, BuildingDef> = {
  reactor: {
    id: 'reactor',
    nameKey: 'reactor',
    icon: Zap,
    description: 'Taps into magma veins to generate Energy.',
    cost: { carbon: 150, ferrum: 50 },
    production: { energy: 20 },
    energyDrain: 0,
    buildTime: 5,
    reqTech: []
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
    reqTech: []
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
    reqTech: []
  },
  storage_depot: {
    id: 'storage_depot',
    nameKey: 'storage_depot',
    icon: Archive,
    description: 'Increases resource storage capacity.',
    cost: { carbon: 100, ferrum: 50 },
    production: {},
    storage: { carbon: 500, ferrum: 250 },
    energyDrain: 2,
    buildTime: 4,
    reqTech: []
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
    reqTech: []
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
    reqTech: ['energy_grid']
  }
};

export const UNITS: Record<UnitType, UnitDef> = {
  scout: {
    id: 'scout',
    nameKey: 'scout',
    icon: Target,
    description: 'Fast, cheap reconnaissance unit.',
    cost: { carbon: 50, ferrum: 0, energy: 10 },
    trainingTime: 5,
    stats: { attack: 5, defense: 2, speed: 10 },
    reqTech: []
  },
  marine: {
    id: 'marine',
    nameKey: 'marine',
    icon: Users,
    description: 'Standard frontline infantry.',
    cost: { carbon: 100, ferrum: 20, energy: 20 },
    trainingTime: 10,
    stats: { attack: 15, defense: 10, speed: 5 },
    reqTech: ['ballistics']
  },
  tank: {
    id: 'tank',
    nameKey: 'tank',
    icon: Shield,
    description: 'Heavy armored walker.',
    cost: { carbon: 300, ferrum: 150, energy: 50 },
    trainingTime: 20,
    stats: { attack: 40, defense: 50, speed: 2 },
    reqTech: ['hardened_alloys', 'robotics']
  }
};

export const RESEARCH_TREE: Record<TechId, TechDef> = {
  energy_grid: {
    id: 'energy_grid',
    nameKey: 'tech_energy_grid',
    branch: 'economy',
    description: 'Improves energy distribution, unlocking advanced sensors.',
    cost: { carbon: 200, energy: 50 },
    researchTime: 10,
    reqTech: [],
    tier: 1
  },
  hardened_alloys: {
    id: 'hardened_alloys',
    nameKey: 'tech_hardened_alloys',
    branch: 'engineering',
    description: 'Stronger materials for heavy vehicles and structures.',
    cost: { ferrum: 300, carbon: 100 },
    researchTime: 15,
    reqTech: [],
    tier: 1
  },
  ballistics: {
    id: 'ballistics',
    nameKey: 'tech_ballistics',
    branch: 'military',
    description: 'Standardized ammo types for combat units.',
    cost: { ferrum: 150, energy: 20 },
    researchTime: 12,
    reqTech: [],
    tier: 1
  },
  robotics: {
    id: 'robotics',
    nameKey: 'tech_robotics',
    branch: 'military',
    description: 'Automated combat systems for heavy mechs.',
    cost: { carbon: 500, ferrum: 300, energy: 100 },
    researchTime: 25,
    reqTech: ['energy_grid', 'ballistics'],
    tier: 2
  }
};
