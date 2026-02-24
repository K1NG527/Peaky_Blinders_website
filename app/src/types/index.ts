// Inventory Types
export interface WhiskeyItem {
  id: string;
  name: string;
  origin: string;
  distillery: string;
  barrelNumber: string;
  age: number;
  quantity: number;
  location: string;
  status: 'in-stock' | 'low' | 'out';
  dateAdded: string;
  notes?: string;
}

export interface InventoryStats {
  totalValue: number;
  totalBottles: number;
  territories: number;
  activeShipments: number;
}

// Map Types
export interface TerritoryLocation {
  id: string;
  name: string;
  type: 'warehouse' | 'distillery' | 'safehouse' | 'pub';
  coordinates?: [number, number];
  influenceLevel: 'high' | 'medium' | 'low';
  inventoryValue: number;
  description: string;
  lore?: string;
  personnel?: string;
  threatLevel?: number; // 0-100
  revenueHistory?: number[]; // last 6 months
  image?: string;
}

export interface SupplyRoute {
  id: string;
  from: string; // location id
  to: string;   // location id
  cargoType: 'whiskey' | 'weapons' | 'opium' | 'goods';
  label: string;
  status: 'active' | 'disrupted';
}

export interface EmpireEvent {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  timestamp: string;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  role: string;
  description: string;
  trustLevel: number;
  image: string;
  location: string;
}

// Report Types
export interface InventoryReport {
  date: string;
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  territoryBreakdown: Record<string, number>;
}

// Navigation Types
export type NavSection = 'home' | 'ledger' | 'inventory' | 'map' | 'suppliers' | 'reports' | 'dossier' | 'timeline' | 'relationships';

// Character Types
export type Character = 'thomas' | 'luca';

export interface CharacterTheme {
  name: string;
  fullName: string;
  title: string;
  accent: string;
  accentLight: string;
  accentRgb: string;
  bg: string;
  surface: string;
  splashQuote: string;
  splashAuthor: string;
  particleColor: string;
}

// App State Types
export interface AppState {
  introSeen: boolean;
  cinematicMode: boolean;
  currentSection: NavSection;
  character: Character;
}
