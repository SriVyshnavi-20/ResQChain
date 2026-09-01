import React, { useState } from 'react';
import { NgoSidebar } from '../components/layout/NgoSidebar';
import { NgoMobileNav } from '../components/layout/NgoMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Minus,
  Search
} from 'lucide-react';

export const NgoInventoryPage: React.FC = () => {
  const { inventory, restockSupply, dispatchSupply, addSupplyItem, openSosModal } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Restock / Dispatch Modal state
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'RESTOCK' | 'DISPATCH'>('RESTOCK');
  const [amount, setAmount] = useState<number>(100);

  // Add Item Modal state
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Food' | 'Water' | 'Medical' | 'Shelter' | 'Sanitation'>('Food');
  const [quantity, setQuantity] = useState(500);
  const [unit, setUnit] = useState('Packs');
  const [minThreshold, setMinThreshold] = useState(200);
  const [campLocation, setCampLocation] = useState('Central District Hub #1');

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.campLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAction = (id: string, type: 'RESTOCK' | 'DISPATCH') => {
    setSelectedItemId(id);
    setActionType(type);
    setAmount(type === 'RESTOCK' ? 250 : 50);
    setActionModalOpen(true);
  };

  const handleExecuteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemId && amount > 0) {
      if (actionType === 'RESTOCK') {
        restockSupply(selectedItemId, Number(amount));
      } else {
        dispatchSupply(selectedItemId, Number(amount));
      }
    }
    setActionModalOpen(false);
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplyItem({
      name,
      category,
      quantity: Number(quantity),
      unit,
      minThreshold: Number(minThreshold),
      campLocation
    });
    setAddItemModalOpen(false);
    setName('');
  };

  const getStatusBadgeVariant = (st: string) => {
    switch (st) {
      case 'Critical':
        return 'emergency';
      case 'Low Stock':
        return 'warning';
      case 'Adequate':
        return 'resolved';
      default:
        return 'neutral';
    }
  };

  const totalStockCount = inventory.reduce((acc, curr) => acc + curr.quantity, 0);
  const criticalItemsCount = inventory.filter((i) => i.status === 'Critical' || i.status === 'Low Stock').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <NgoMobileNav />
      <NgoSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                Logistics &amp; Depot Management
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{inventory.length} Tracked Supply SKUs</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Supplies / Inventory
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAddItemModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Supply SKU
            </Button>
            <Button
              variant="sos"
              size="sm"
              onClick={openSosModal}
              className="shadow-sm font-bold"
            >
              EMERGENCY SOS
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card padding="md" className="bg-white border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total In Stock</span>
              <span className="text-3xl font-black text-navy-900 font-mono mt-1 block">
                {totalStockCount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">Total verified items across all hubs</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Low / Critical Alerts</span>
              <span className="text-3xl font-black text-red-600 font-mono mt-1 block">
                {criticalItemsCount}
              </span>
              <span className="text-xs text-red-600 font-semibold">SKUs below minimum safety threshold</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Dispatched Today</span>
              <span className="text-3xl font-black text-emerald-700 font-mono mt-1 block">
                1,850
              </span>
              <span className="text-xs text-slate-400">Packs allocated to field causeways</span>
            </Card>
          </div>

          {/* Search & Categories Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search supplies by name, camp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Food', 'Water', 'Medical', 'Shelter', 'Sanitation'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Supply Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInventory.map((item) => {
              const pct = Math.min(100, Math.round((item.quantity / (item.minThreshold * 2)) * 100));
              const isCritical = item.status === 'Critical';
              const isLow = item.status === 'Low Stock';

              return (
                <Card
                  key={item.id}
                  padding="lg"
                  className="bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-slate-400">{item.id}</span>
                      <StatusBadge
                        variant={getStatusBadgeVariant(item.status)}
                        label={item.status.toUpperCase()}
                        size="sm"
                      />
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Depot: <strong>{item.campLocation}</strong></p>

                    {/* Stock level bar */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-xs text-slate-500 font-semibold">Available Stock</span>
                        <span className="text-xl font-black font-mono text-navy-900">
                          {item.quantity.toLocaleString()} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                        <span>Min Threshold: {item.minThreshold} {item.unit}</span>
                        <span>Restocked: {item.lastRestocked}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAction(item.id, 'DISPATCH')}
                      leftIcon={<Minus className="w-3.5 h-3.5 text-red-500" />}
                    >
                      Dispatch
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenAction(item.id, 'RESTOCK')}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="bg-emerald-700 hover:bg-emerald-800"
                    >
                      Restock
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </main>

      {/* Restock / Dispatch Modal */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={actionType === 'RESTOCK' ? 'Restock Supply Inflow' : 'Dispatch Field Consignment'}
        maxWidth="sm"
      >
        <form onSubmit={handleExecuteAction} className="space-y-4">
          <p className="text-xs text-slate-600">
            {actionType === 'RESTOCK'
              ? 'Record newly arrived relief supplier shipment into warehouse database.'
              : 'Deduct dispatched units for relief trucks, boats, or field camp triage.'}
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Quantity ({actionType === 'RESTOCK' ? '+ Increase' : '- Deduct'})
            </label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-base font-mono font-bold focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setActionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Confirm {actionType === 'RESTOCK' ? 'Restock' : 'Dispatch'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add New Supply Item Modal */}
      <Modal
        isOpen={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        title="Register New Supply SKU in Inventory"
        maxWidth="md"
      >
        <form onSubmit={handleAddItemSubmit} className="space-y-4">
          <Input
            label="Item Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pediatric ORS Electrolyte Packs"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Food">Food Rations</option>
                <option value="Water">Drinking Water</option>
                <option value="Medical">Medical Aid</option>
                <option value="Shelter">Shelter &amp; Blankets</option>
                <option value="Sanitation">Sanitation Kits</option>
              </select>
            </div>

            <Input
              label="Unit Type"
              required
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. Packs, Bottles, Kits"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Initial Quantity"
              type="number"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <Input
              label="Minimum Alert Threshold"
              type="number"
              required
              value={minThreshold}
              onChange={(e) => setMinThreshold(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Primary Warehouse / Camp Depot
            </label>
            <select
              value={campLocation}
              onChange={(e) => setCampLocation(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="Central District Hub #1">Central District Hub #1 (Gandhi Rd)</option>
              <option value="South Sector Camp">South Sector Camp (Cathedral Rd)</option>
              <option value="Riverside Lowland Camp">Riverside Lowland Mobile Camp</option>
              <option value="Anna Nagar Shelter Camp">Anna Nagar Shelter Camp</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setAddItemModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Register SKU
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
