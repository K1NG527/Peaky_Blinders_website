import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  ChevronDown,
  MapPin,
  Wine
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { WhiskeyItem } from '@/types';

// Scroll reveal hook
function useScrollReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

interface InventorySectionProps {
  inventory: WhiskeyItem[];
  onAdd: (item: Omit<WhiskeyItem, 'id' | 'dateAdded'>) => void;
  onUpdate: (id: string, updates: Partial<WhiskeyItem>) => void;
  onDelete: (id: string) => void;
}

const locations = ['Warehouse A', 'Warehouse B', 'The Garrison', 'Safe House', 'Camden Spirits'];
const statuses = [
  { value: 'in-stock', label: 'In Stock', class: 'status-in-stock' },
  { value: 'low', label: 'Low', class: 'status-low' },
  { value: 'out', label: 'Out', class: 'status-out' },
] as const;

export function InventorySection({ inventory, onAdd, onUpdate, onDelete }: InventorySectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WhiskeyItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Scroll reveal hooks
  const { ref: headerRevealRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: searchRevealRef, isVisible: searchVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: tableRevealRef, isVisible: tableVisible } = useScrollReveal<HTMLDivElement>();

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    origin: string;
    distillery: string;
    barrelNumber: string;
    age: number;
    quantity: number;
    location: string;
    status: 'in-stock' | 'low' | 'out';
    notes: string;
  }>({
    name: '',
    origin: '',
    distillery: '',
    barrelNumber: '',
    age: 0,
    quantity: 0,
    location: locations[0],
    status: 'in-stock',
    notes: ''
  });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.distillery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barrelNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !filterLocation || item.location === filterLocation;
    const matchesStatus = !filterStatus || item.status === filterStatus;
    return matchesSearch && matchesLocation && matchesStatus;
  });

  const handleAdd = () => {
    onAdd(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (item: WhiskeyItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      origin: item.origin,
      distillery: item.distillery,
      barrelNumber: item.barrelNumber,
      age: item.age,
      quantity: item.quantity,
      location: item.location,
      status: item.status,
      notes: item.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdate = () => {
    if (editingItem) {
      onUpdate(editingItem.id, formData);
      setIsAddDialogOpen(false);
      setEditingItem(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      origin: '',
      distillery: '',
      barrelNumber: '',
      age: 0,
      quantity: 0,
      location: locations[0],
      status: 'in-stock',
      notes: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statuses.find(s => s.value === status);
    return (
      <span className={`px-2 py-1 text-xs font-cinzel tracking-wider ${statusConfig?.class}`}>
        {statusConfig?.label}
      </span>
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header with 3D reveal */}
      <div
        ref={headerRevealRef}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible
            ? 'perspective(1000px) rotateX(0deg) translateY(0)'
            : 'perspective(1000px) rotateX(15deg) translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div>
          <h2 className="font-cinzel text-2xl text-paper tracking-[0.15em] uppercase">
            Inventory
          </h2>
          <p className="text-paper/60 text-sm mt-2">
            {inventory.length} items in ledger
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="btn-brass flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Search and Filters with slide animation */}
      <div
        ref={searchRevealRef}
        className="flex flex-col sm:flex-row gap-4"
        style={{
          opacity: searchVisible ? 1 : 0,
          transform: searchVisible
            ? 'translateX(0) perspective(1000px) rotateY(0deg)'
            : 'translateX(-50px) perspective(1000px) rotateY(10deg)',
          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-paper/40" />
          <input
            type="text"
            placeholder="Search by name, origin, distillery, or barrel number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ledger-input w-full pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center gap-2 px-4 py-2 border transition-all duration-300
            ${showFilters
              ? 'border-brass text-brass bg-brass/5'
              : 'border-smoke text-paper/60 hover:text-paper hover:border-paper/40'
            }
          `}
        >
          <Filter className="w-4 h-4" />
          <span className="font-cinzel text-xs tracking-[0.15em] uppercase">Filters</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div
          className="flex flex-wrap gap-4 p-4 bg-charcoal border border-smoke"
          style={{
            animation: 'fade-in-up 0.3s ease-out'
          }}
        >
          <div>
            <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
              Location
            </label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="ledger-input"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="ledger-input"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterLocation('');
                setFilterStatus('');
              }}
              className="text-paper/60 hover:text-brass text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Inventory Table with 3D flip reveal */}
      <div
        ref={tableRevealRef}
        className="overflow-x-auto"
        style={{
          opacity: tableVisible ? 1 : 0,
          transform: tableVisible
            ? 'perspective(1000px) rotateX(0deg) translateY(0)'
            : 'perspective(1000px) rotateX(20deg) translateY(40px)',
          transition: 'all 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <table className="ledger-table min-w-full">
          <thead>
            <tr className="transition-all duration-500">
              <th>Name</th>
              <th>Origin</th>
              <th>Age</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <tr
                key={item.id}
                className="transition-all duration-500 hover:bg-smoke/30"
                style={{
                  opacity: tableVisible ? 1 : 0,
                  transform: tableVisible
                    ? 'translateX(0)'
                    : 'translateX(-30px)',
                  transitionDelay: `${index * 50}ms`
                }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brass/10 flex items-center justify-center">
                      <Wine className="w-4 h-4 text-brass" />
                    </div>
                    <div>
                      <p className="text-paper font-medium">{item.name}</p>
                      <p className="text-paper/40 text-xs">{item.barrelNumber}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="text-paper">{item.origin}</p>
                  <p className="text-paper/40 text-xs">{item.distillery}</p>
                </td>
                <td>
                  <span className="text-paper">{item.age} yr</span>
                </td>
                <td>
                  <span className={`font-cinzel ${item.quantity < 10 ? 'text-crimson' : 'text-paper'}`}>
                    {item.quantity}
                  </span>
                </td>
                <td>{getStatusBadge(item.status)}</td>
                <td>
                  <div className="flex items-center gap-2 text-paper/60">
                    <MapPin className="w-3 h-3" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-paper/60 hover:text-brass transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-paper/60 hover:text-crimson transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Wine className="w-12 h-12 text-paper/20 mx-auto mb-4" />
            <p className="text-paper/60">No items found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-charcoal border-smoke text-paper max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-xl tracking-[0.15em] uppercase">
              {editingItem ? 'Edit Entry' : 'Add New Entry'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
                Whiskey Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="ledger-input w-full"
                placeholder="e.g., Shelby Reserve"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
                  Origin
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="ledger-input w-full"
                  placeholder="e.g., Birmingham"
                />
              </div>
              <div>
                <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
                  Distillery
                </label>
                <input
                  type="text"
                  value={formData.distillery}
                  onChange={(e) => setFormData({ ...formData, distillery: e.target.value })}
                  className="ledger-input w-full"
                  placeholder="e.g., Small Heath"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
                  Barrel Number
                </label>
                <input
                  type="text"
                  value={formData.barrelNumber}
                  onChange={(e) => setFormData({ ...formData, barrelNumber: e.target.value })}
                  className="ledger-input w-full"
                  placeholder="e.g., SH-1921-001"
                />
              </div>
              <div>
                <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
                  Age (years)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className="ledger-input w-full"
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="ledger-input w-full"
                  min="0"
                />
              </div>
              <div>
                <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="ledger-input w-full"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
                Status
              </label>
              <div className="flex gap-2">
                {statuses.map(status => (
                  <button
                    key={status.value}
                    onClick={() => setFormData({ ...formData, status: status.value })}
                    className={`
                      flex-1 py-2 px-3 text-xs font-cinzel tracking-wider uppercase transition-all
                      ${formData.status === status.value
                        ? status.class + ' ring-1 ring-brass'
                        : 'bg-coal border border-smoke text-paper/60 hover:border-paper/40'
                      }
                    `}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-paper/60 text-xs uppercase tracking-wider mb-2 block">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="ledger-input w-full h-20 resize-none"
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 py-3 border border-smoke text-paper/60 hover:text-paper hover:border-paper/40 transition-all font-cinzel text-xs tracking-[0.15em] uppercase"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdate : handleAdd}
                disabled={!formData.name || !formData.origin}
                className="flex-1 py-3 bg-brass text-coal font-cinzel text-xs tracking-[0.15em] uppercase hover:bg-brass-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingItem ? 'Update' : 'Add'} Entry
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
