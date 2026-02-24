import { useState, useEffect, useCallback, useMemo } from 'react';
import type { WhiskeyItem, InventoryStats } from '@/types';

const STORAGE_KEY = 'shelby-inventory';
const INTRO_KEY = 'shelby-intro-seen';
const CINEMATIC_KEY = 'shelby-cinematic-mode';

// Initial sample data
const initialInventory: WhiskeyItem[] = [
  {
    id: '1',
    name: 'Shelby Reserve',
    origin: 'Birmingham',
    distillery: 'Small Heath Distillery',
    barrelNumber: 'SH-1921-042',
    age: 12,
    quantity: 45,
    location: 'Warehouse A',
    status: 'in-stock',
    dateAdded: '12th March, 1921',
    notes: 'Premium batch for export'
  },
  {
    id: '2',
    name: 'Garrison Gold',
    origin: 'London',
    distillery: 'Camden Spirits',
    barrelNumber: 'CG-1920-118',
    age: 8,
    quantity: 12,
    location: 'The Garrison',
    status: 'low',
    dateAdded: '8th January, 1921',
    notes: 'House blend'
  },
  {
    id: '3',
    name: 'Small Heath Rye',
    origin: 'Sheffield',
    distillery: 'Northern Grain Co.',
    barrelNumber: 'NG-1919-067',
    age: 5,
    quantity: 0,
    location: 'Warehouse B',
    status: 'out',
    dateAdded: '3rd December, 1920',
    notes: 'Awaiting new shipment'
  },
  {
    id: '4',
    name: 'Peaky Single Malt',
    origin: 'Glasgow',
    distillery: 'Highland Reserve',
    barrelNumber: 'HR-1921-089',
    age: 15,
    quantity: 28,
    location: 'Warehouse A',
    status: 'in-stock',
    dateAdded: '15th February, 1921',
    notes: 'Scottish import'
  },
  {
    id: '5',
    name: 'Birmingham Blend',
    origin: 'Birmingham',
    distillery: 'Small Heath Distillery',
    barrelNumber: 'SH-1920-156',
    age: 7,
    quantity: 8,
    location: 'The Garrison',
    status: 'low',
    dateAdded: '22nd November, 1920',
    notes: 'Popular with locals'
  },
  {
    id: '6',
    name: 'Solomon\'s Select',
    origin: 'London',
    distillery: 'Solomon Imports',
    barrelNumber: 'SI-1921-023',
    age: 10,
    quantity: 34,
    location: 'Safe House',
    status: 'in-stock',
    dateAdded: '1st April, 1921',
    notes: 'Special arrangement'
  }
];

export function useInventory() {
  const [inventory, setInventory] = useState<WhiskeyItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setInventory(JSON.parse(stored));
      } catch {
        setInventory(initialInventory);
      }
    } else {
      setInventory(initialInventory);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    }
  }, [inventory, isLoaded]);

  const addItem = useCallback((item: Omit<WhiskeyItem, 'id' | 'dateAdded'>) => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('en-GB', { month: 'long' });
    const year = now.getFullYear();

    // Add ordinal suffix correctly
    const suffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    const newItem: WhiskeyItem = {
      ...item,
      id: Date.now().toString(),
      dateAdded: `${day}${suffix(day)} ${month}, ${year}`
    };
    setInventory(prev => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<WhiskeyItem>) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  }, []);

  const stats = useMemo((): InventoryStats => {
    const totalBottles = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = inventory.reduce((sum, item) => {
      const valuePerBottle = item.age * 15 + 50;
      return sum + (item.quantity * valuePerBottle);
    }, 0);
    const locations = new Set(inventory.map(item => item.location));
    const activeShipments = inventory.filter(item => item.status === 'in-stock' && item.quantity > 20).length;

    return {
      totalValue,
      totalBottles,
      territories: locations.size,
      activeShipments
    };
  }, [inventory]);

  const getStats = useCallback(() => stats, [stats]);

  const filterByLocation = useCallback((location: string) => {
    return inventory.filter(item => item.location === location);
  }, [inventory]);

  const searchInventory = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return inventory.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.origin.toLowerCase().includes(lowerQuery) ||
      item.distillery.toLowerCase().includes(lowerQuery) ||
      item.barrelNumber.toLowerCase().includes(lowerQuery)
    );
  }, [inventory]);

  return {
    inventory,
    isLoaded,
    addItem,
    updateItem,
    deleteItem,
    getStats,
    filterByLocation,
    searchInventory
  };
}

export function useIntroState() {
  const [introSeen, setIntroSeen] = useState(() => {
    return localStorage.getItem(INTRO_KEY) === 'true';
  });

  const markIntroSeen = useCallback(() => {
    localStorage.setItem(INTRO_KEY, 'true');
    setIntroSeen(true);
  }, []);

  const resetIntro = useCallback(() => {
    localStorage.removeItem(INTRO_KEY);
    setIntroSeen(false);
  }, []);

  return { introSeen, markIntroSeen, resetIntro };
}

export function useCinematicMode() {
  const [cinematicMode, setCinematicMode] = useState(() => {
    return localStorage.getItem(CINEMATIC_KEY) !== 'false';
  });

  const toggleCinematicMode = useCallback(() => {
    setCinematicMode(prev => {
      const newValue = !prev;
      localStorage.setItem(CINEMATIC_KEY, String(newValue));
      return newValue;
    });
  }, []);

  return { cinematicMode, toggleCinematicMode };
}
