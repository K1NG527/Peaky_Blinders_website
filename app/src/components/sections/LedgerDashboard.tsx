import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacter } from '@/context/CharacterContext';
import { playSFX } from '@/lib/audio';

type PageData = { title: string; subtitle: string; content: React.ReactNode; stamp?: string; };

const useThomasOperationsPages = () => useMemo<PageData[]>(() => [
  {
    title: "The Shelby Company Ltd.",
    subtitle: "Official Ledgers & Records",
    content: <div className="relative">
      <svg className="absolute -inset-10 w-[120%] h-[120%] opacity-20 pointer-events-none mix-blend-multiply text-red-900" viewBox="0 0 200 200" fill="currentColor">
        <path d="M45,40 C30,35 25,60 30,70 C40,90 60,85 70,75 C85,60 65,45 45,40 Z" />
        <circle cx="20" cy="30" r="5" />
        <circle cx="80" cy="80" r="8" />
        <circle cx="90" cy="40" r="3" />
      </svg>
      <p className="text-center mt-6 text-[#1a1005] font-handwriting text-2xl leading-relaxed relative z-10 font-bold mix-blend-multiply">"This book contains the blood, sweat, and sins of the Shelby family. To read it without permission is a death sentence." <br /><br /> - T. Shelby</p>
    </div>,
    stamp: "CONFIDENTIAL"
  },
  {
    title: "Current Operations",
    subtitle: "Birmingham & Beyond",
    content: (
      <ul className="space-y-4 font-handwriting text-xl text-[#1a1005] mix-blend-multiply opacity-90">
        <li className="line-between pb-2 border-b-2 border-dashed border-[#3a2010]/20">
          <span className="font-bold text-[#4a1010] text-2xl">Small Heath:</span> Absolute Control. Betting rings generating £12,000 weekly.
        </li>
        <li className="line-between pb-2 border-b-2 border-dashed border-[#3a2010]/20 relative">
          <span className="font-bold text-[#4a1010] text-2xl">London Expansion:</span> Sabini forces <span className="line-through decoration-[#801010] decoration-[2px] opacity-80">negotiating</span> driven out. Eden Club secured.
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#801010]/60 -rotate-2 transform blur-[0.5px]" />
        </li>
        <li className="line-between pb-2">
          <span className="font-bold text-[#4a1010] text-2xl">Garrison Pub:</span> Legal front. Fully operational.
        </li>
      </ul>
    ),
    stamp: "APPROVED"
  },
  {
    title: "Political Leverage",
    subtitle: "Section D & The Crown",
    content: (
      <div className="font-handwriting text-xl text-[#1a1005] space-y-4 relative mix-blend-multiply opacity-90">
        <div className="absolute -right-6 -top-6 text-[#801010] opacity-10 rotate-45 pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="40" /><path d="M20,50 L80,50 M50,20 L50,80" /></svg>
        </div>
        <p className="text-lg border-l-4 border-[#801010]/60 pl-3 mb-4 mix-blend-multiply opacity-80">"We hold the King's secrets. They hold our freedom."</p>
        <div className="relative">
          <p className="font-bold text-2xl mb-1 text-[#4a1010] underline decoration-[#3a2010]/30 decoration-dashed underline-offset-4">Winston Churchill</p>
          <p className="ml-3">Agreement: Weapons cache secured. Pending pardon.</p>
        </div>
        <div className="relative">
          <p className="font-bold text-2xl mb-1 text-[#4a1010] underline decoration-[#3a2010]/30 decoration-dashed underline-offset-4">Economic League</p>
          <p className="ml-3 text-[#801010]">Infiltrated. Gathering intel on Father Hughes.</p>
        </div>
      </div>
    )
  },
  {
    title: "Bribes & Payroll",
    subtitle: "Birmingham Police",
    content: (
      <table className="w-full font-handwriting text-xl text-left border-collapse mt-2 text-[#1a1005] mix-blend-multiply opacity-90">
        <thead>
          <tr className="border-b-2 border-dashed border-[#3a2010]/40">
            <th className="pb-2 font-bold text-2xl">Recipient</th>
            <th className="pb-2 font-bold text-2xl text-right">Weekly Cut</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[#3a2010]/10">
            <td className="py-2">Sgt. Moss</td>
            <td className="py-2 text-right">£50</td>
          </tr>
          <tr className="border-b border-[#3a2010]/10">
            <td className="py-2">Inspector Roberts</td>
            <td className="py-2 text-right">£120</td>
          </tr>
          <tr className="border-b border-[#3a2010]/10">
            <td className="py-2">Judge Davies</td>
            <td className="py-2 text-right font-bold text-[#801010]">£300</td>
          </tr>
        </tbody>
      </table>
    ),
    stamp: "PAID"
  },
  {
    title: "Active Targets",
    subtitle: "Threats to the Crown",
    content: (
      <div className="font-handwriting text-xl text-[#1a1005] space-y-4 mix-blend-multiply pl-3 opacity-90">
        <div className="relative">
          <p className="font-bold text-[#600505] text-2xl mb-1 line-through decoration-[#1a1005] decoration-[2px]">Inspector Campbell</p>
          <p className="ml-3">Status: Neutralized. Handled by Polly.</p>
        </div>
        <div className="relative">
          <p className="font-bold text-2xl mb-1 line-through decoration-[#801010] decoration-[3px]">Luca Changretta</p>
          <p className="ml-3">Status: Terminated. Distillery shootout.</p>
          <div className="absolute top-1/2 -left-3 w-8 h-8 bg-[#801010] rounded-full blur-[4px] opacity-20 mix-blend-multiply pointer-events-none" />
        </div>
        <div className="relative p-3 border-2 border-dashed border-[#801010]/30 -ml-3 bg-[#801010]/[0.02] -rotate-1 shadow-sm">
          <p className="font-bold text-[#600505] text-3xl mb-1">Oswald Mosley</p>
          <p className="font-bold tracking-widest text-[#801010]">Assassination Pending — Await Orders.</p>
        </div>
      </div>
    )
  }
], []);

const InventoryRow = memo(({
  asset,
  title,
  value,
  onChange,
  stamp,
  prefix = ''
}: {
  asset?: string,
  title: string,
  value: number,
  onChange: (v: number) => void,
  stamp?: string,
  prefix?: string
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border-b border-dashed border-[#3a2010]/20 relative group max-w-full">
      {/* Tiny 3D Asset Stamp */}
      {asset && (
        <div className="relative w-12 h-10 flex-shrink-0 flex items-center justify-center z-30">
          <img
            src={asset}
            alt=""
            loading="lazy"
            className="w-full h-full object-contain drop-shadow-md opacity-100 transform-none"
          />
        </div>
      )}

      {/* Label & Details */}
      <div className="flex-grow flex flex-col justify-center min-w-[100px]">
        <h4 className="font-handwriting text-[#1a1005] text-xl font-bold mix-blend-multiply leading-none mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{title}</h4>
        {stamp && (
          <div className="flex mt-0.5">
            <span className="inline-block font-handwriting text-[10px] font-bold text-[#801010] px-1.5 py-0.5 border border-[#801010]/40 -rotate-1 mix-blend-multiply rounded-[2px] shadow-[inset_0_0_2px_rgba(128,16,16,0.1)] whitespace-nowrap">
              {stamp}
            </span>
          </div>
        )}
      </div>

      {/* Custom Vintage Stepper Controls */}
      <div className="flex items-center gap-1 font-cinzel text-[#2a1a10] flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => { e.stopPropagation(); onChange(Math.max(0, value - 1)); }}
          className="w-5 h-5 rounded-full border border-[#3a2010]/50 flex items-center justify-center hover:bg-[#3a2010] hover:text-[#d8c3a5] text-xs shadow-inner transition-colors"
        >
          -
        </button>
        <div className="relative w-20 h-7 flex items-center justify-center px-1">
          <div className="absolute inset-0 bg-[#d8c3a5]/40 border border-[#3a2010]/30 rounded-sm shadow-[inset_0_1px_4px_rgba(0,0,0,0.15)]" />
          {prefix && <span className="absolute left-1 text-[#1a1005] text-sm font-handwriting font-bold z-20 top-1/2 -translate-y-1/2">{prefix}</span>}
          <input
            type="number"
            value={value}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => { e.stopPropagation(); onChange(parseInt(e.target.value) || 0); }}
            className="w-full h-full text-right pr-2 bg-transparent relative z-10 font-handwriting font-bold text-lg text-[#1a1005] outline-none mix-blend-multiply selection:bg-[#3a2010]/20"
          />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onChange(value + 1); }}
          className="w-5 h-5 rounded-full border border-[#3a2010]/50 flex items-center justify-center hover:bg-[#3a2010] hover:text-[#d8c3a5] text-xs shadow-inner transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
});


/* Shared ledger stock state so it persists across pages seamlessly */
let globalInventoryState = {
  garrison: 1200,
  edenClub: 4500,
  betting: 12000,
  protection: 800,
  whiskey: 5000,
  gin: 1200,
  cigars: 450,
  opium: 15,
  lewis: 24,
  rifles: 80,
  ammo: 250,
  trucks: 6,
  jewelry: 1500,
  watches: 840,
  leather: 230,
  silk: 56,
  dock_bribes: 450,
  customs_fees: 320,
  informants: 15
};

// Component Wrapper to inject the reactive hook dynamically
const LedgerPagesRenderer = ({ pageIndex }: { pageIndex: number }) => {
  const [data, setData] = useState(globalInventoryState);

  // Sync back to global ref so state isn't lost if unmounted
  useEffect(() => {
    globalInventoryState = data;
  }, [data]);

  const update = useCallback((key: keyof typeof data, val: number) => {
    setData(prev => ({ ...prev, [key]: val }));
  }, []);

  if (pageIndex === 0) return (
    <div className="w-full flex justify-center -mt-2">
      <div className="w-full flex flex-col gap-0">
        <InventoryRow asset="/assets/ledger/vintage_whiskey_crate.png" prefix="£" title="Garrison Pub" value={data.garrison} onChange={val => update("garrison", val)} stamp="CLEAN LOCAL" />
        <InventoryRow asset="/assets/ledger/vintage_whiskey_crate.png" prefix="£" title="Eden Club" value={data.edenClub} onChange={val => update("edenClub", val)} stamp="LONDON SABINI" />
        <InventoryRow asset="/assets/ledger/vintage_whiskey_crate.png" prefix="£" title="Track Betting" value={data.betting} onChange={val => update("betting", val)} stamp="LEE FAMILY" />
        <InventoryRow asset="/assets/ledger/vintage_whiskey_crate.png" prefix="£" title="Protection" value={data.protection} onChange={val => update("protection", val)} stamp="STREET CAPTAINS" />
      </div>
    </div>
  );

  if (pageIndex === 1) return (
    <div className="w-full relative min-h-[300px] overflow-visible">
      <div className="w-full flex flex-col gap-0 relative z-10 overflow-visible">
        <InventoryRow asset="/assets/ledger/vintage_whiskey_crate.png" title="Irish Whiskey" value={data.whiskey} onChange={val => update("whiskey", val)} stamp="EXPORT SECURED" />
        <InventoryRow asset="/assets/ledger/vintage_whiskey_crate.png" title="Premium Gin" value={data.gin} onChange={val => update("gin", val)} stamp="DISTILLED" />
        <InventoryRow title="Cuban Cigars" value={data.cigars} onChange={val => update("cigars", val)} stamp="SMUGGLED" />
        <InventoryRow title="Opium Raw" value={data.opium} onChange={val => update("opium", val)} stamp="MEDICINAL" />
      </div>

      {/* Decorative Stamp Card */}
      <img src={ASSETS.stampCard} alt="" className="absolute -bottom-4 -right-4 w-56 h-56 opacity-100 pointer-events-none z-40 drop-shadow-xl rotate-12" />
    </div>
  );

  if (pageIndex === 2) return (
    <div className="w-full relative min-h-[300px] overflow-visible">
      <div className="w-full flex flex-col gap-0 relative z-10 overflow-visible">
        <InventoryRow asset="/assets/ledger/lewis_gun_asset.png" title="Lewis Guns" value={data.lewis} onChange={val => update("lewis", val)} stamp="STOLEN - BSA" />
        <InventoryRow asset="/assets/ledger/vintage_ammo_box.png" title="Ammo Crates" value={data.ammo} onChange={val => update("ammo", val)} stamp="BIRMINGHAM" />
        <InventoryRow title="Lee-Enfield" value={data.rifles} onChange={val => update("rifles", val)} stamp="MILITARY SURPLUS" />
        <InventoryRow title="Cargo Trucks" value={data.trucks} onChange={val => update("trucks", val)} stamp="GARAGE" />
      </div>

      {/* Decorative Ink Bottle */}
      <img src={ASSETS.inkBottle} alt="" className="absolute -bottom-4 -left-4 w-48 h-48 opacity-100 pointer-events-none z-40 drop-shadow-xl -rotate-6" />
    </div>
  );

  if (pageIndex === 3) return (
    <div className="w-full flex flex-col gap-0 text-sm">
      <InventoryRow asset="/assets/ledger/vintage_whiskey_crate.png" title="Stolen Jewelry" value={data.jewelry} onChange={val => update("jewelry", val)} stamp="MIDLANDS LARCENY" />
      <InventoryRow asset="/assets/ledger/vintage_ammo_box.png" title="Pocket Watches" value={data.watches} onChange={val => update("watches", val)} stamp="REPAIR SHOP FRONT" />
      <InventoryRow title="Leather Hides" value={data.leather} onChange={val => update("leather", val)} stamp="WALSALL EXPORT" />
      <InventoryRow title="French Silk" value={data.silk} onChange={val => update("silk", val)} stamp="CHANEL SMUGGLE" />
    </div>
  );

  if (pageIndex === 4) return (
    <div className="w-full flex flex-col gap-0 text-sm">
      <InventoryRow prefix="£" title="Dock Bribes" value={data.dock_bribes} onChange={val => update("dock_bribes", val)} stamp="LIVERPOOL AGENT" />
      <InventoryRow prefix="£" title="Customs Fees" value={data.customs_fees} onChange={val => update("customs_fees", val)} stamp="INVOICE FAKE" />
      <InventoryRow asset="/assets/ledger/lewis_gun_asset.png" title="Informants" value={data.informants} onChange={val => update("informants", val)} stamp="STREET EYES" />
    </div>
  );

  return null;
};

const useThomasInventoryPages = () => {
  return useMemo<PageData[]>(() => [
    {
      title: "Operations",
      subtitle: "Weekly Revenue Tracking",
      content: <LedgerPagesRenderer pageIndex={0} />
    },
    {
      title: "Contraband",
      subtitle: "Warehouse Stock",
      content: <LedgerPagesRenderer pageIndex={1} />
    },
    {
      title: "Armory",
      subtitle: "Weapons & Transport",
      content: <LedgerPagesRenderer pageIndex={2} />
    },
    {
      title: "Larceny",
      subtitle: "High Value Assets",
      content: <LedgerPagesRenderer pageIndex={3} />
    },
    {
      title: "Overhead",
      subtitle: "Logistic Expenses",
      content: <LedgerPagesRenderer pageIndex={4} />
    },
    {
      title: "Distribution",
      subtitle: "Export Logistics",
      content: (
        <div className="font-handwriting text-xl text-[#1a1005] space-y-4 mix-blend-multiply opacity-90 pl-1">
          <p className="border-l-2 border-[#3a2010]/40 pl-2 mb-2 text-sm">"The whiskey is legal. The routes are not."</p>
          <ul className="space-y-3 text-base">
            <li className="flex flex-col border-b border-dashed border-[#3a2010]/30 pb-2">
              <span className="font-bold text-[#4a1010] text-xl mb-0.5">North America:</span>
              <span>5,000 crates via Canada brokered by Alfie Solomons.</span>
            </li>
            <li className="flex flex-col border-b border-dashed border-[#3a2010]/30 pb-2 relative">
              <span className="font-bold text-[#4a1010] text-xl mb-0.5">London Docks:</span>
              <span>2,000 crates weekly. Assorted local bribes sorted.</span>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#801010]/40 -rotate-1 pointer-events-none" />
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Shipments",
      subtitle: "Historical Cargo Logs",
      content: (
        <div className="font-handwriting text-[#1a1005] mix-blend-multiply opacity-90 pl-1 text-sm space-y-3">
          <div className="border-b border-[#3a2010]/30 pb-2">
            <p className="font-bold text-[#801010] text-[10px]">DEC 15, 1918</p>
            <p className="text-base uppercase leading-none">Cargo: 'Tea' (Opium) - 5 Crates</p>
            <p className="text-xs italic opacity-70">Signed: Arthur Shelby</p>
          </div>
          <div className="border-b border-[#3a2010]/30 pb-2">
            <p className="font-bold text-[#801010] text-[10px]">DEC 10, 1918</p>
            <p className="text-base uppercase leading-none">Cargo: Irish Gold - 200 Crates</p>
            <p className="text-xs italic opacity-70">Status: Delivered. Garrison Cellar.</p>
          </div>
          <div className="border-b border-[#3a2010]/30 pb-2">
            <p className="font-bold text-[#801010] text-[10px]">NOV 28, 1918</p>
            <p className="text-base uppercase leading-none">Cargo: Scrap Metal (Enfield)</p>
            <p className="text-xs italic opacity-70">Supplier: Section D</p>
          </div>
        </div>
      )
    },
    {
      title: "Suppliers",
      subtitle: "Authenticated Contacts",
      content: (
        <div className="font-handwriting text-[#1a1005] mix-blend-multiply opacity-90 pl-1 space-y-4">
          <div className="border-l-2 border-[#3a2010]/30 pl-3">
            <p className="font-bold text-2xl text-[#4a1010]">Alfie Solomons</p>
            <p className="text-sm">Camden Town Broker. Export Specialist.</p>
          </div>
          <div className="border-l-2 border-[#3a2010]/30 pl-3">
            <p className="font-bold text-2xl text-[#4a1010]">Lee Family</p>
            <p className="text-sm">Horse Track Enforcers. Security Logistics.</p>
          </div>
          <div className="border-l-2 border-[#801010]/40 pl-3">
            <p className="font-bold text-2xl text-[#801010] line-through">Darby Sabini</p>
            <p className="text-sm italic opacity-70 line-through">Compromised. Do not fulfill orders.</p>
          </div>
        </div>
      )
    }
  ], []);
};


const useLucaVendettaPages = () => {
  return useMemo<PageData[]>(() => [
    {
      title: "La Cosa Nostra",
      subtitle: "Vendetta Ledger",
      content: <div className="relative font-handwriting text-3xl text-[#1a1005] mix-blend-multiply flex flex-col items-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMzAsMTAgQzIwLDUwIDUwLDYwIDYwLDgwIEM0MCw5MCAxMCw1MCAzMCwxMCBaIiBmaWxsPSIjODAxMDEwIiBvcGFjaXR5PSIwLjE1Ii8+PC9zdmc+')] bg-cover opacity-60 mix-blend-multiply pointer-events-none" />
        <p className="mt-8 leading-relaxed relative z-10 font-bold mix-blend-multiply">"We are an organization of honor. Blood demands blood. This ledger records the debts owed to the Changretta family."</p>
        <p className="mt-8 self-end font-bold text-4xl mr-8">- L. Changretta</p>
      </div>,
      stamp: "BLOOD DEBT"
    },
    {
      title: "Retaliation Logistics",
      subtitle: "New York Imports",
      content: (
        <ul className="space-y-4 font-handwriting text-xl text-[#1a1005] mix-blend-multiply opacity-90 pl-2">
          <li className="line-between pb-2 border-b-2 border-dashed border-[#3a2010]/30">
            <span className="font-bold text-[#4a1010] text-3xl">Safehouses:</span> Three locations secured in Nechells.
          </li>
          <li className="line-between pb-2 border-b-2 border-dashed border-[#3a2010]/30 relative">
            <span className="font-bold text-[#4a1010] text-3xl">Weaponry:</span> 50 Thompson Submachine Guns arrived at Liverpool docks.
          </li>
          <li className="line-between pb-2 text-[#801010] font-bold">
            <span className="font-bold text-[#4a1010] text-3xl">Priority target:</span> Arthur Shelby.
          </li>
        </ul>
      )
    },
    {
      title: "Blood Debts Signed",
      subtitle: "Local Alliances",
      content: (
        <div className="font-handwriting text-xl text-[#1a1005] space-y-4 mix-blend-multiply opacity-90">
          <p className="border-l-4 border-[#801010] pl-3 mb-4">"The enemy of my enemy is my friend."</p>
          <div className="p-3 border border-dashed border-[#3a2010]/50 bg-[#cca382]/10 -rotate-1 shadow-sm">
            <p className="font-bold text-3xl mb-1 text-[#4a1010]">Darby Sabini</p>
            <p className="">Agreement: Shared intelligence on Shelby shipment routes.</p>
          </div>
        </div>
      )
    },
    {
      title: "The Target List",
      subtitle: "The Shelby Family",
      content: (
        <div className="font-handwriting text-xl text-[#1a1005] space-y-6 mix-blend-multiply pl-2 opacity-90">
          <div className="p-3 border-2 border-dashed border-[#801010] rotate-1 relative bg-[#801010]/5 shadow-sm">
            <p className="font-bold text-3xl mb-1 text-[#600505] line-through decoration-black decoration-[2px]">John Shelby</p>
            <p className="">Status: Executed. Christmas Day.</p>
            <div className="absolute inset-0 flex items-center justify-center opacity-70 pointer-events-none">
              <span className="text-[#801010] font-bold text-6xl -rotate-12 outline-4 drop-shadow-md">PAID</span>
            </div>
          </div>
          <div className="p-3 border-b-2 border-dashed border-[#3a2010]/50 -rotate-1">
            <p className="font-bold text-3xl mb-1">Arthur Shelby</p>
            <p className="">Status: Target Active.</p>
          </div>
          <div className="p-3 border-b-2 border-dashed border-[#3a2010]/50 rotate-1 relative">
            <p className="font-bold text-3xl mb-1">Thomas Shelby</p>
            <p className="font-bold tracking-widest mt-2 text-[#801010]">High Priority. Save for last.</p>
            <div className="absolute top-2 right-2 w-16 h-16 bg-[#801010] rounded-full blur-[20px] opacity-30 mix-blend-multiply pointer-events-none" />
          </div>
        </div>
      ),
      stamp: "VENDETTA"
    },
    {
      title: "Allies & Assets",
      subtitle: "Birmingham Arrival",
      content: (
        <ul className="space-y-6 font-serif text-[#1a1005] mix-blend-multiply">
          <li className="line-between pb-2 border-b border-[#3a2010]/30">
            <span className="font-bold text-[#4a1010]">New York Soldiers:</span> 15 highly trained assassins arrived securely via Liverpool.
          </li>
          <li className="line-between pb-2 border-b border-[#3a2010]/30">
            <span className="font-bold text-[#4a1010]">Local Informants:</span> Secured kitchen staff and stable boys near Shelby properties.
          </li>
          <li className="line-between pb-2">
            <span className="font-bold text-[#4a1010]">Alfie Solomons:</span> Negotiation <span className="line-through decoration-[#801010] decoration-2">pending</span>. Betrayal imminent.
          </li>
        </ul>
      )
    }
  ], []);
};


const ASSETS = {
  desk: '/assets/ledger/peaky_desk_bg.png',
  pullCord: '/assets/ledger/vintage_pull_cord.png',
  page: '/assets/ledger/yellow_paper_seamless.png',
  coverHistorical: '/assets/ledger/vintage_leather_cover_historical_cutout.png',
  coverWhiskey: '/assets/ledger/vintage_leather_cover_whiskey_cutout.png',
  stampCard: '/assets/ledger/vintage_ink_stamp_card.png',
  inkBottle: '/assets/ledger/vintage_ink_bottle_quill.png',
};

type BookType = 'none' | 'historical' | 'whiskey' | 'vendetta';

const BOOKS = [
  { id: 'historical' as BookType, cover: ASSETS.coverHistorical, title: "Historical Records", position: "top-[10%] -left-[5%]", deskRotation: -12 },
  { id: 'whiskey' as BookType, cover: ASSETS.coverWhiskey, title: "Whiskey Inventory", position: "bottom-[5%] right-[15%]", deskRotation: 8 },
  { id: 'vendetta' as BookType, cover: ASSETS.coverHistorical, title: "Vendetta Ledger", position: "top-1/2 left-1/2 -ml-28 -mt-36 lg:-ml-36 lg:-mt-48", deskRotation: -4, filter: "sepia(0.5) saturate(0.8) hue-rotate(-20deg) brightness(0.9)" }
];

export function LedgerDashboard() {
  const { character } = useCharacter();
  const [activeBook, setActiveBook] = useState<BookType>('none');
  const [lampOn, setLampOn] = useState(true);

  const availableBooks = character === 'thomas' ? BOOKS.filter(b => b.id !== 'vendetta') : BOOKS.filter(b => b.id === 'vendetta');

  return (
    <div className="min-h-screen w-full relative select-none overflow-hidden bg-black text-paper flex items-center justify-center">

      {/* Background Desk image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[2000ms] ease-out"
        style={{
          backgroundImage: `url(${ASSETS.desk})`,
          transform: activeBook !== 'none' ? 'scale(1.1) translateY(5%)' : 'scale(1)',
          filter: activeBook !== 'none' ? 'blur(8px) brightness(0.3)' : 'blur(0px) brightness(0.6)'
        }}
      />

      {/* Dynamic Lighting Overlays */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out mix-blend-multiply"
        style={{
          background: lampOn
            ? 'radial-gradient(circle at 80% 20%, transparent 20%, rgba(10,5,0,0.8) 80%, black 100%)'
            : 'radial-gradient(circle at 50% 50%, rgba(20,20,20,0.5), black 90%)'
        }}
      />

      {/* Warm lamp glow overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out mix-blend-screen bg-[radial-gradient(ellipse_at_80%_0%,rgba(212,175,55,0.15),transparent_50%)] ${lampOn ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Volumetric light rays */}
      <div
        className={`absolute -top-[20%] right-0 w-[800px] h-[800px] pointer-events-none mix-blend-screen transition-opacity duration-1000 z-10 ${lampOn && activeBook === 'none' ? 'opacity-50' : 'opacity-0'}`}
        style={{
          background: 'conic-gradient(from 180deg at 70% 20%, rgba(212,175,55,0.05) 0deg, transparent 40deg, transparent 320deg, rgba(212,175,55,0.05) 360deg)'
        }}
      />

      {/* Interactive Vintage Pull Cord */}
      <motion.div
        className={`absolute -top-10 left-12 md:left-24 w-[100px] h-[450px] z-30 flex justify-center cursor-pointer transition-opacity duration-1000 ${activeBook !== 'none' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onTapStart={() => {
          // Play the sound the moment they start pulling (on press)
          playSFX(!lampOn ? 'lamp_on' : 'lamp_off');
        }}
        onClick={() => {
          // Toggle the light on release (click)
          setLampOn(!lampOn);
        }}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ y: 80, scale: 0.98 }} // Pull cord physically moves down on click
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <img src={ASSETS.pullCord} alt="Vintage Pull Cord" className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-30 mix-blend-screen" />

      {/* "The Desk" Title */}
      <AnimatePresence>
        {activeBook === 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none"
          >
            <h1 className="font-cinzel text-paper/80 text-2xl lg:text-4xl uppercase tracking-[0.3em] drop-shadow-2xl">The Desk</h1>
            <p className="text-paper/40 font-light tracking-widest text-xs mt-2 uppercase drop-shadow-lg">Select an Archive to Inspect</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desk Layer (Closed Books) */}
      <div className="absolute inset-0 w-full max-w-5xl h-[600px] m-auto z-20 pointer-events-none flex items-center justify-end p-8">
        <div className="relative w-1/2 h-full">
          {availableBooks.map(book => (
            <AnimatePresence key={`desk-${book.id}`}>
              {activeBook !== book.id && (
                <DeskBook
                  book={book}
                  lampOn={lampOn}
                  onClick={() => setActiveBook(book.id)}
                />
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* Focused Layer (Opened Book) */}
      <AnimatePresence>
        {activeBook !== 'none' && (
          <OpenedBook
            key={`open-${activeBook}`}
            book={BOOKS.find(b => b.id === activeBook)!}
            onClose={() => setActiveBook('none')}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

function DeskBook({ book, onClick, lampOn }: { book: typeof BOOKS[0], onClick: () => void, lampOn: boolean }) {
  return (
    <motion.div
      layoutId={`book-wrapper-${book.id}`}
      className={`absolute ${book.position} w-56 h-72 lg:w-72 lg:h-96 z-20 pointer-events-auto transform-style-3d cursor-pointer`}
      onClick={onClick}
      initial={{ rotateZ: book.deskRotation }}
      animate={{
        rotateZ: book.deskRotation,
        opacity: lampOn ? 1 : 0,
        pointerEvents: lampOn ? 'auto' : 'none'
      }}
      exit={{ opacity: 0 }}
      whileHover={lampOn ? {
        scale: 1.05,
        translateY: -20, // Move up more 
        translateX: -30, // Move left to reveal it from behind the other book
        rotateZ: book.deskRotation - 8, // Tilt it further left
        boxShadow: "0 30px 60px rgba(0,0,0,0.9)"
      } : undefined}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute -bottom-4 -right-2 w-[110%] h-[110%] bg-black/80 rounded-sm blur-lg -z-10" />
      <div
        className="absolute inset-0 shadow-2xl overflow-hidden rounded-md"
        style={{ backgroundImage: `url(${book.cover})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: book.filter }}
      >
        <div className={`absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 mix-blend-overlay transition-opacity duration-1000 pointer-events-none ${lampOn ? 'opacity-100' : 'opacity-40'}`} />
      </div>
    </motion.div>
  );
}

function OpenedBook({ book, onClose }: { book: typeof BOOKS[0], onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [visualPage, setVisualPage] = useState(0);

  // Trigger opening animation after layout transition completes
  useEffect(() => {
    const t = setTimeout(() => setIsOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setTimeout(onClose, 800); // Allow cover to close physically before unmounting & transitioning to desk
  };

  const thomasOperationsPages = useThomasOperationsPages();
  const thomasInventoryPages = useThomasInventoryPages();
  const lucaVendettaPages = useLucaVendettaPages();

  const pages = useMemo(() => {
    if (book.id === 'historical') return thomasOperationsPages;
    if (book.id === 'whiskey') return thomasInventoryPages;
    return lucaVendettaPages;
  }, [book.id, thomasOperationsPages, thomasInventoryPages, lucaVendettaPages]);

  const renderPageContent = (page: PageData | null, pageNum: number | string) => {
    if (!page) {
      return <div className="h-full w-full pointer-events-none" />;
    }
    return (
      <div className="h-full p-4 lg:p-8 relative font-serif text-[#1a1005]">
        <h2 className="font-cinzel text-xl lg:text-3xl font-bold border-b-2 border-black/60 pb-2 mb-1 opacity-90">{page.title}</h2>
        <h3 className="font-cinzel text-xs lg:text-sm tracking-widest uppercase text-[#601a10] mb-4 lg:mb-8 opacity-80">{page.subtitle}</h3>
        <div className="text-xs lg:text-base leading-relaxed">
          {page.content}
        </div>
        {page.stamp && (
          <div className="absolute top-10 right-10 border-[3px] border-[#601a10]/40 p-1 lg:p-3 rotate-12 opacity-80 pointer-events-none mix-blend-multiply">
            <span className="font-bold text-xl lg:text-3xl tracking-widest text-[#601a10] uppercase drop-shadow-sm">
              {page.stamp}
            </span>
          </div>
        )}
        <div className="absolute bottom-4 lg:bottom-6 w-full text-center left-0 text-[#1a1005]/50 text-[10px] lg:text-sm font-bold">
          {pageNum}
        </div>
      </div>
    );
  };

  const turnNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage < pages.length && !isFlipping && isOpen) {
      playSFX('page_turn'); // Trigger SFX
      setFlipDirection('next');
      setIsFlipping(true);
      setCurrentPage(c => c + 2);
    }
  };

  const turnPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage > 0 && !isFlipping && isOpen) {
      playSFX('page_turn'); // Trigger SFX
      setFlipDirection('prev');
      setIsFlipping(true);
      setCurrentPage(c => c - 2);
    }
  };

  const handleAnimationComplete = () => {
    setIsFlipping(false);
    setVisualPage(currentPage);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none perspective-[3000px]">

      {/* The Unified 3D Wrapper that transitions from the desk dimensions to half the open book dimensions */}
      <motion.div
        layoutId={`book-wrapper-${book.id}`}
        className="relative w-[350px] h-[500px] lg:w-[450px] lg:h-[650px] z-[60] transform-style-3d pointer-events-auto"
        initial={{ rotateZ: 0 }}
        animate={{ rotateZ: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute -bottom-10 -right-10 w-[120%] h-[120%] bg-black/90 rounded-sm blur-[50px] -z-10 pointer-events-none" />

        {/* ========================================================== */}
        {/* RIGHT HALF (Stationary Base representing back cover + right page) */}
        {/* ========================================================== */}
        <div className="absolute inset-0 rounded-r-md rounded-l-sm shadow-2xl transform-style-3d">

          {/* Outside Back Cover */}
          <div
            className="absolute inset-0 rounded-r-md bg-[#2a1a10]"
            style={{ backgroundImage: `url(${book.cover})`, backgroundSize: 'cover', backgroundPosition: 'left center', filter: book.filter }}
          />

          {/* Right Base Page (Bound inside the cover) */}
          <div
            className={`absolute inset-[3%] left-[1%] rounded-sm overflow-hidden transition-opacity duration-700 border-l-2 border-[#1a1005]/20 shadow-[inset_20px_0_40px_rgba(0,0,0,0.6)] cursor-pointer group ${isOpen ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ backgroundImage: `url(${ASSETS.page})`, backgroundSize: '200% 100%', backgroundPosition: 'right center' }}
            onClick={turnNext}
          >
            <div className="absolute inset-0 bg-[#d8c3a5]/20 mix-blend-multiply transition-colors duration-300 group-hover:bg-black/5" />
            {renderPageContent(isFlipping && flipDirection === 'next' ? pages[currentPage] : pages[visualPage], isFlipping && flipDirection === 'next' ? currentPage + 1 : visualPage + 1)}
          </div>

          {/* ========================================================== */}
          {/* FLAWLESS FLIPPING ANIMATION LAYER (Anchored to Spine/Left edge of Right Half) */}
          {/* ========================================================== */}
          <AnimatePresence>
            {isFlipping && isOpen && (
              <motion.div
                className="absolute top-[3%] bottom-[3%] right-[3%] origin-left z-30 transform-style-3d"
                style={{ left: '1%' }} // Exact fit over the base right page constraints
                initial={{ rotateY: flipDirection === 'next' ? 0 : -180 }}
                animate={{ rotateY: flipDirection === 'next' ? -180 : 0 }}
                transition={{ duration: 0.9, type: 'spring', bounce: 0.2 }}
                onAnimationComplete={handleAnimationComplete}
              >
                {/* Front Face (Lands on Right, Shows Old Right Page) */}
                <div
                  className="absolute inset-0 backface-hidden rounded-sm border-l-2 border-[#1a1005]/20 shadow-[-20px_0_30px_rgba(0,0,0,0.3)] bg-[#e6dbcc]"
                  style={{ backgroundImage: `url(${ASSETS.page})`, backgroundSize: '200% 100%', backgroundPosition: 'right center' }}
                >
                  <div className="absolute inset-0 bg-[#d8c3a5]/20 mix-blend-multiply" />
                  {renderPageContent(flipDirection === 'next' ? pages[visualPage] : pages[currentPage], flipDirection === 'next' ? visualPage + 1 : currentPage + 1)}
                  {/* Dynamic Lighting sweep */}
                  <motion.div
                    className="absolute inset-0 mix-blend-overlay pointer-events-none"
                    style={{ background: 'linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 30%, rgba(0,0,0,0.6) 100%)' }}
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: [0, 0.4, 0], x: ['100%', '-100%'] }}
                    transition={{ duration: 0.9 }}
                  />
                </div>

                {/* Back Face (Lands on Left, Shows New Left Page) */}
                <div
                  className="absolute inset-0 backface-hidden rounded-sm border-r-2 border-[#1a1005]/20 shadow-[20px_0_30px_rgba(0,0,0,0.3)] bg-[#e6dbcc]"
                  style={{ backgroundImage: `url(${ASSETS.page})`, backgroundSize: '200% 100%', backgroundPosition: 'left center', transform: 'rotateY(180deg)' }}
                >
                  <div className="absolute inset-0 bg-[#d8c3a5]/20 mix-blend-multiply" />
                  {renderPageContent(flipDirection === 'next' ? pages[currentPage - 1] : pages[visualPage - 1], flipDirection === 'next' ? currentPage : visualPage)}
                  {/* Dynamic Lighting sweep */}
                  <motion.div
                    className="absolute inset-0 mix-blend-overlay pointer-events-none"
                    style={{ background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 30%, rgba(0,0,0,0.6) 100%)' }}
                    initial={{ opacity: 0, x: '-100%' }}
                    animate={{ opacity: [0, 0.4, 0], x: ['-100%', '100%'] }}
                    transition={{ duration: 0.9 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Central spine gradient for depth */}
          <div className="absolute top-0 bottom-0 left-0 w-8 z-40 pointer-events-none bg-gradient-to-r from-black/60 via-black/10 to-transparent mix-blend-multiply" />
        </div>

        {/* ========================================================== */}
        {/* LEFT HALF (FRONT COVER ANIMATING OPEN)                     */}
        {/* ========================================================== */}
        <motion.div
          className="absolute inset-0 origin-left z-40 transform-style-3d rounded-r-md shadow-[20px_0_50px_rgba(0,0,0,0.8)]"
          animate={{ rotateY: isOpen ? -180 : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Outside Front Cover (Visible initially) */}
          <div className="absolute inset-0 backface-hidden rounded-r-md bg-[#2a1a10] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `url(${book.cover})`, backgroundSize: 'cover', backgroundPosition: 'right center', filter: book.filter }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />
          </div>

          {/* Inside Front Cover (Revealed when open) */}
          <div
            className="absolute inset-0 backface-hidden bg-[#2a1a10] rounded-l-md transform overflow-hidden"
            style={{ transform: 'rotateY(180deg)', borderRadius: '4px 0 0 4px' }}
          >
            {/* Inner leather lining */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-black shadow-[inset_-30px_0_50px_rgba(0,0,0,0.9)]"
              style={{ backgroundImage: `url(${book.cover})`, backgroundPosition: 'left center', backgroundSize: 'cover', filter: book.filter }} />

            {/* Left Base Page (Bound inside the cover) */}
            <div
              className={`absolute inset-[3%] right-[1%] rounded-sm overflow-hidden transition-opacity duration-700 border-r-2 border-[#1a1005]/20 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.6)] cursor-pointer group ${isOpen ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url(${ASSETS.page})`, backgroundSize: '200% 100%', backgroundPosition: 'left center' }}
              onClick={turnPrev}
            >
              <div className="absolute inset-0 bg-[#d8c3a5]/20 mix-blend-multiply transition-colors duration-300 group-hover:bg-black/5" />
              {renderPageContent(isFlipping && flipDirection === 'prev' ? pages[currentPage - 1] : pages[visualPage - 1], isFlipping && flipDirection === 'prev' ? currentPage : visualPage)}
            </div>

            <div className="absolute top-0 bottom-0 right-0 w-8 z-40 pointer-events-none bg-gradient-to-l from-black/60 via-black/10 to-transparent mix-blend-multiply" />
          </div>
        </motion.div>

      </motion.div>

      {/* Close Button UI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-12 z-50 pointer-events-auto"
          >
            <button
              onClick={handleClose}
              className="font-cinzel tracking-widest text-paper/80 hover:text-white px-8 py-3 bg-black/70 rounded-full backdrop-blur-md border border-white/10 shadow-2xl transition-all"
            >
              Close Ledger
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
