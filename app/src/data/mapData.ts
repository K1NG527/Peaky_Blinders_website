import type { TerritoryLocation, SupplyRoute, EmpireEvent } from '@/types';

export const territoryLocations: TerritoryLocation[] = [
  {
    id: '1',
    name: 'Shelby HQ — Watery Lane',
    type: 'safehouse',
    coordinates: [-1.8904, 52.4862],
    influenceLevel: 'high',
    inventoryValue: 15800,
    description: 'The Shelby family residence and war council room.',
    lore: 'Number 6 Watery Lane. Where it all began. The heart of the Shelby empire, guarded by razor blades and blood oaths. Every order Thomas gives echoes from these walls.',
    personnel: 'Thomas Shelby',
    threatLevel: 15,
    revenueHistory: [8200, 9100, 11500, 13200, 14800, 15800],
    image: '/assets/map/shelby_hq.png',
  },
  {
    id: '2',
    name: 'The Garrison Pub',
    type: 'pub',
    coordinates: [-1.8950, 52.4890],
    influenceLevel: 'high',
    inventoryValue: 4200,
    description: 'The Peaky Blinders\' public house. Front for smuggling ops.',
    lore: 'The snug at the Garrison is where deals are made and throats are cut. Harry runs the bar, Arthur runs the crowd. On a Friday night, the blood on the floor could be from a fight or a transaction.',
    personnel: 'Arthur Shelby',
    threatLevel: 30,
    revenueHistory: [3200, 3500, 3800, 4000, 3900, 4200],
    image: '/assets/map/garrison_pub.png',
  },
  {
    id: '3',
    name: 'Small Heath Distillery',
    type: 'distillery',
    coordinates: [-1.8800, 52.4800],
    influenceLevel: 'high',
    inventoryValue: 25000,
    description: 'Primary production facility for premium spirits.',
    lore: 'Hidden behind a scrap metal yard, the distillery runs 24 hours. The copper stills were smuggled from Ireland by Polly herself. The whiskey here is pure — which is more than you can say about the men who make it.',
    personnel: 'Polly Gray',
    threatLevel: 20,
    revenueHistory: [18000, 19500, 21000, 22500, 24000, 25000],
    image: '/assets/map/distillery.png',
  },
  {
    id: '4',
    name: 'Charlie\'s Yard',
    type: 'warehouse',
    coordinates: [-1.9000, 52.4780],
    influenceLevel: 'medium',
    inventoryValue: 8900,
    description: 'Canal-side warehouse for contraband storage.',
    lore: 'Charlie Strong\'s boatyard sits on the cut. Every crate that comes through Birmingham passes under his watchful eye. The canal is how the Shelbys move what the police can\'t see.',
    personnel: 'Charlie Strong',
    threatLevel: 45,
    revenueHistory: [6500, 7200, 7800, 8100, 8500, 8900],
    image: '/assets/map/warehouse.png',
  },
  {
    id: '5',
    name: 'BSA Factory Arms Cache',
    type: 'warehouse',
    coordinates: [-1.8850, 52.4920],
    influenceLevel: 'medium',
    inventoryValue: 3200,
    description: 'Stolen arms hidden within the BSA factory grounds.',
    lore: 'After the Great War, the British Government stored 25,000 rifles at the BSA. Thomas had other plans for them. The missing crate from 1919 is the reason Inspector Campbell came to Small Heath.',
    personnel: 'John Shelby',
    threatLevel: 65,
    revenueHistory: [2800, 3000, 3100, 3200, 3100, 3200],
    image: '/assets/map/warehouse.png',
  },
  {
    id: '6',
    name: 'Camden Town — Solomons\' Bakery',
    type: 'distillery',
    coordinates: [-0.1400, 51.5400],
    influenceLevel: 'medium',
    inventoryValue: 12000,
    description: 'Alfie Solomons\' rum distillery disguised as a bakery.',
    lore: '"It\'s bread, mate. We bake bread." — Alfie Solomons. Behind the flour-dusted counters lies the largest illegal rum operation in London. The alliance with Alfie is profitable but volatile.',
    personnel: 'Alfie Solomons',
    threatLevel: 55,
    revenueHistory: [8000, 9000, 10000, 10500, 11000, 12000],
    image: '/assets/map/distillery.png',
  },
  {
    id: '7',
    name: 'London Docks — Import Hub',
    type: 'warehouse',
    coordinates: [-0.0800, 51.5100],
    influenceLevel: 'low',
    inventoryValue: 7800,
    description: 'Overseas import hub. Sabini territory — contested.',
    lore: 'The docks are where empires meet. Crates marked "machine parts" contain Lewis guns. Barrels marked "tea" contain opium. The customs officer on the night shift works for three different gangs.',
    personnel: 'Aberama Gold',
    threatLevel: 80,
    revenueHistory: [5000, 5500, 6200, 6800, 7200, 7800],
    image: '/assets/map/warehouse.png',
  },
];

export const supplyRoutes: SupplyRoute[] = [
  { id: 'r1', from: '3', to: '2', cargoType: 'whiskey', label: 'Irish Whiskey — 200 bottles weekly', status: 'active' },
  { id: 'r2', from: '1', to: '4', cargoType: 'goods', label: 'Cash & Documents — Watery Lane to Yard', status: 'active' },
  { id: 'r3', from: '5', to: '4', cargoType: 'weapons', label: 'BSA Rifles — 50 crates', status: 'active' },
  { id: 'r4', from: '4', to: '7', cargoType: 'whiskey', label: 'Export Whiskey — Birmingham to Docks', status: 'active' },
  { id: 'r5', from: '6', to: '7', cargoType: 'whiskey', label: 'Solomons Rum — Camden to Docks', status: 'disrupted' },
  { id: 'r6', from: '1', to: '3', cargoType: 'opium', label: 'Opium — Medicinal Supply', status: 'active' },
];

export const empireEvents: EmpireEvent[] = [
  { id: 'e1', text: 'Arthur secured the Garrison for the week.', type: 'success', timestamp: '2 hours ago' },
  { id: 'e2', text: 'Sabini forces spotted near London Docks.', type: 'danger', timestamp: '4 hours ago' },
  { id: 'e3', text: 'New whiskey shipment arrived at Charlie\'s Yard.', type: 'info', timestamp: '6 hours ago' },
  { id: 'e4', text: 'Polly increased distillery output by 12%.', type: 'success', timestamp: '1 day ago' },
  { id: 'e5', text: 'Inspector Campbell seen in Small Heath.', type: 'warning', timestamp: '1 day ago' },
  { id: 'e6', text: 'Alfie Solomons demands renegotiation of terms.', type: 'warning', timestamp: '2 days ago' },
  { id: 'e7', text: 'John completed arms transfer to BSA cache.', type: 'success', timestamp: '3 days ago' },
  { id: 'e8', text: 'Export route to New York confirmed by Alfie.', type: 'info', timestamp: '4 days ago' },
  { id: 'e9', text: 'Billy Kimber\'s men retreating from Worcester.', type: 'success', timestamp: '5 days ago' },
  { id: 'e10', text: 'Aberama Gold reports dock workers on strike.', type: 'danger', timestamp: '1 week ago' },
];

export const lucaTerritoryLocations: TerritoryLocation[] = [
  {
    id: '1',
    name: 'Little Italy — HQ',
    type: 'safehouse',
    inventoryValue: 12000,
    influenceLevel: 'high',
    description: 'Base of operations in New York.',
    lore: 'The Changretta family parlour. Behind the restaurant kitchen, Luca plots the vendetta. Every wall has a photograph of a Shelby with a red X drawn over their face.',
    personnel: 'Luca Changretta',
    threatLevel: 10,
    revenueHistory: [10000, 10500, 11000, 11200, 11800, 12000],
  },
  {
    id: '2',
    name: 'Boston Harbor',
    type: 'warehouse',
    inventoryValue: 45000,
    influenceLevel: 'high',
    description: 'Main import hub for prohibition liquor.',
    lore: 'The harbor is controlled by the Changretta family through a network of corrupt dock workers and customs officials. Crates arrive weekly from Sicily and Ireland.',
    personnel: 'Matteo',
    threatLevel: 25,
    revenueHistory: [35000, 38000, 40000, 42000, 44000, 45000],
  },
  {
    id: '3',
    name: 'Brooklyn Docks',
    type: 'distillery',
    inventoryValue: 22000,
    influenceLevel: 'medium',
    description: 'Secondary distribution point.',
    lore: 'The Brooklyn operation runs under the guise of a fishing company. The stench of fish covers the smell of grappa distillation.',
    personnel: 'Angel Changretta',
    threatLevel: 40,
    revenueHistory: [15000, 17000, 18500, 20000, 21000, 22000],
  },
  {
    id: '4',
    name: 'Changretta Estate',
    type: 'safehouse',
    inventoryValue: 80000,
    influenceLevel: 'high',
    description: 'Family residence and fortress.',
    lore: 'A sprawling estate on Long Island. Armed guards at every entrance. The wine cellar hides enough weapons to start a small war — which is exactly the plan.',
    personnel: 'Audrey Changretta',
    threatLevel: 5,
    revenueHistory: [70000, 72000, 74000, 76000, 78000, 80000],
  },
  {
    id: '5',
    name: 'Birmingham Railyard',
    type: 'warehouse',
    inventoryValue: 5000,
    influenceLevel: 'low',
    description: 'Encroaching territory for shipments into Shelby turf.',
    lore: 'A small foothold in enemy territory. The railyard workers are paid to look the other way when Changretta men arrive at night.',
    personnel: 'Matteo',
    threatLevel: 90,
    revenueHistory: [1000, 2000, 2500, 3500, 4000, 5000],
  },
  {
    id: '6',
    name: 'London Hotel',
    type: 'pub',
    inventoryValue: 3000,
    influenceLevel: 'low',
    description: 'Meeting point for Sabini alliance.',
    lore: 'The hotel lobby serves as neutral ground. Luca meets Sabini here to discuss their shared enemy. The waiter is on three payrolls.',
    personnel: 'Vicente Changretta',
    threatLevel: 70,
    revenueHistory: [1500, 1800, 2000, 2200, 2500, 3000],
  },
];

export const lucaSupplyRoutes: SupplyRoute[] = [
  { id: 'lr1', from: '2', to: '1', cargoType: 'whiskey', label: 'Prohibition Liquor — Boston to NY', status: 'active' },
  { id: 'lr2', from: '1', to: '3', cargoType: 'goods', label: 'Distribution Orders — HQ to Brooklyn', status: 'active' },
  { id: 'lr3', from: '4', to: '1', cargoType: 'weapons', label: 'Weapons Cache — Estate to HQ', status: 'active' },
  { id: 'lr4', from: '1', to: '5', cargoType: 'weapons', label: 'Thompson Guns — NY to Birmingham', status: 'disrupted' },
  { id: 'lr5', from: '6', to: '5', cargoType: 'goods', label: 'Intelligence — London to Birmingham', status: 'active' },
];

export const lucaEmpireEvents: EmpireEvent[] = [
  { id: 'le1', text: 'Luca arrived in Birmingham. Vendetta begins.', type: 'danger', timestamp: '1 hour ago' },
  { id: 'le2', text: 'Matteo secured Thompson guns at the docks.', type: 'success', timestamp: '3 hours ago' },
  { id: 'le3', text: 'Sabini intel confirms Arthur Shelby\'s location.', type: 'warning', timestamp: '6 hours ago' },
  { id: 'le4', text: 'John Shelby eliminated. Christmas Day.', type: 'danger', timestamp: '1 day ago' },
  { id: 'le5', text: 'New York sends 15 soldiers via Liverpool.', type: 'info', timestamp: '2 days ago' },
  { id: 'le6', text: 'Changretta safehouses in Nechells secured.', type: 'success', timestamp: '3 days ago' },
  { id: 'le7', text: 'Audrey demands accelerated vendetta timeline.', type: 'warning', timestamp: '4 days ago' },
  { id: 'le8', text: 'Kitchen spy placed near Shelby properties.', type: 'info', timestamp: '5 days ago' },
];

export { type Supplier } from '@/types';

export const suppliers: import('@/types').Supplier[] = [
  {
    id: '1',
    name: 'Camden Distillery',
    role: 'Primary Source',
    description: 'The source of the finest grain spirits in London. Our longest-standing partnership, dating back to 1915.',
    trustLevel: 95,
    image: '/supplier_distillery.jpg',
    location: 'London'
  },
  {
    id: '2',
    name: 'The Garrison Pub',
    role: 'Distribution Hub',
    description: 'Our primary distribution center for the south of Birmingham. The heart of our local operations.',
    trustLevel: 100,
    image: '/supplier_pub.jpg',
    location: 'Small Heath, Birmingham'
  },
  {
    id: '3',
    name: "Solomon's Imports",
    role: 'Overseas Partner',
    description: 'Overseas connections for rare and exotic spirits. Handles all international shipments.',
    trustLevel: 75,
    image: '/supplier_imports.jpg',
    location: 'London Docks'
  }
];

export const mapStyle = {
  version: 8,
  sources: {
    'simple-tiles': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      ],
      tileSize: 256
    }
  },
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'simple-tiles',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};
