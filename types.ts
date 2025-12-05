import React from 'react';

export type Language = 'en' | 'ar';

export type ResourceType = 'carbon' | 'ferrum' | 'isotopes' | 'energy' | 'credits';
export type BuildingType = 'reactor' | 'extractor_carbon' | 'extractor_ferrum' | 'barracks' | 'radar' | 'storage_depot';
export type UnitType = 'scout' | 'marine' | 'tank';
export type TechBranch = 'military' | 'economy' | 'defense' | 'engineering';
export type TechId = 'hardened_alloys' | 'energy_grid' | 'ballistics' | 'robotics';

export type WorldNodeType = 'base' | 'resource_carbon' | 'resource_ferrum' | 'resource_isotopes' | 'enemy_outpost' | 'enemy_stronghold' | 'boss_lair';

export interface Cost {
  carbon?: number;
  ferrum?: number;
  isotopes?: number;
  energy?: number;
  credits?: number;
}

export interface BuildingDef {
  id: BuildingType;
  nameKey: string;
  icon: React.ElementType;
  description: string;
  cost: Cost;
  production: Partial<Record<ResourceType, number>>;
  storage?: Partial<Record<ResourceType, number>>;
  energyDrain: number;
  buildTime: number;
  reqTech: TechId[];
}

export interface UnitDef {
  id: UnitType;
  nameKey: string;
  icon: React.ElementType;
  description: string;
  cost: Cost;
  trainingTime: number;
  stats: { attack: number; defense: number; speed: number };
  reqTech: TechId[];
}

export interface TechDef {
  id: TechId;
  nameKey: string;
  branch: TechBranch;
  description: string;
  cost: Cost;
  researchTime: number;
  reqTech: TechId[]; // Prerequisites
  tier: number;
}

export interface EnemyDef {
  id: string;
  nameKey: string;
  level: number;
  power: number;
  rewards: Partial<Record<ResourceType, number>>;
}

export interface WorldNode {
  id: number;
  type: WorldNodeType;
  x: number;
  y: number;
  level: number;
  resourceAmount?: number; // For resource nodes
  enemyId?: string; // For enemy nodes
  isPlayerBase?: boolean;
}

export interface GameState {
  resources: Record<ResourceType, number>;
  caps: Record<ResourceType, number>;
  buildings: GridSlot[];
  units: Record<UnitType, number>;
  research: {
    unlocked: TechId[];
    current: {
      techId: TechId;
      timer: number;
      totalTime: number;
    } | null;
  };
  worldNodes: WorldNode[];
  logs: LogEntry[];
  techLevel: number;
  weather: 'clear' | 'ash_storm' | 'acid_rain';
}

export interface GridSlot {
  id: number;
  buildingId: BuildingType | null;
  status: 'empty' | 'constructing' | 'active' | 'damaged' | 'upgrading';
  progress: number;
  timer?: number;
  level: number;
  training?: {
    unitId: UnitType;
    timer: number;
    totalTime: number;
  } | null;
  trainingQueue: UnitType[];
}

export interface LogEntry {
  id: number;
  text: string;
  type: 'info' | 'warning' | 'success' | 'combat';
  timestamp: string;
}