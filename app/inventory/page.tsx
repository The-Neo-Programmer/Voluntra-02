"use client";

import PageHeader from "@/components/layout/page-header";
import { useAppStore } from "@/lib/store/app-store";
import { Package, AlertTriangle, Plus, ArrowRightLeft, X } from "lucide-react";
import { useState } from "react";
import { InventoryItem } from "@/types/inventory";

const zones = ["Central Warehouse", "North Zone", "South Zone", "East Zone", "West Zone"];
const categories = ["Food", "Medical", "Transport", "Hygiene", "Shelter", "Education", "Other"];

export default function InventoryPage() {
  const { inventory, addInventoryItem } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [newItem, setNewItem] = useState({ name: "", category: "Food", stock: "", unit: "units", zone: "Central Warehouse", lowStockThreshold: "5" });
  const [transferItem, setTransferItem] = useState({ itemId: "", toZone: "", qty: "" });

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.stock) return;
    const item: InventoryItem = {
      id: `INV-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      stock: parseInt(newItem.stock),
      unit: newItem.unit,
      zone: newItem.zone as InventoryItem["zone"],
      lowStockThreshold: parseInt(newItem.lowStockThreshold) || 5,
      sourceOrg: "Manual Entry"
    };
    addInventoryItem(item);
    setShowAddModal(false);
    setNewItem({ name: "", category: "Food", stock: "", unit: "units", zone: "Central Warehouse", lowStockThreshold: "5" });
  };

  return (
    <div>
      <PageHeader title="Global Inventory" subtitle="Manage stock levels across all zones and central warehouses.">
        <div className="flex gap-2">
          <button
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Transfer Stock
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium">
            <Package className="w-4 h-4" /> Total Tracked Items
          </div>
          <div className="text-3xl font-bold text-gray-900">{inventory.length}</div>
        </div>
        <div className="bg-orange-50 p-5 rounded-xl border border-orange-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-orange-800 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" /> Low Stock Alerts
          </div>
          <div className="text-3xl font-bold text-orange-700">
            {inventory.filter(i => i.stock <= i.lowStockThreshold && i.stock > 0).length}
          </div>
        </div>
        <div className="bg-red-50 p-5 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-red-800 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" /> Depleted Items
          </div>
          <div className="text-3xl font-bold text-red-700">
            {inventory.filter(i => i.stock === 0).length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Zone</th>
              <th className="px-6 py-4">Current Stock</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map((item) => {
              const isDepleted = item.stock === 0;
              const isLow = item.stock > 0 && item.stock <= item.lowStockThreshold;

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.id}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-gray-600">{item.zone}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{item.stock}</span>{" "}
                    <span className="text-gray-500">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    {isDepleted ? (
                      <span className="px-2.5 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-medium">Out of Stock</span>
                    ) : isLow ? (
                      <span className="px-2.5 py-1 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-xs font-medium">Low Stock</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-medium">Healthy</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {inventory.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No inventory items yet.</p>
            <button onClick={() => setShowAddModal(true)} className="mt-2 text-primary text-sm hover:underline">Add your first item</button>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Add Inventory Item</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Item Name *</label>
                <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
                  placeholder="e.g. Food Kit, Medicine Pack..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Zone</label>
                  <select value={newItem.zone} onChange={e => setNewItem({...newItem, zone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    {zones.map(z => <option key={z}>{z}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Quantity *</label>
                  <input type="number" min="0" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Unit</label>
                  <input type="text" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Low Alert</label>
                  <input type="number" min="1" value={newItem.lowStockThreshold} onChange={e => setNewItem({...newItem, lowStockThreshold: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddItem} disabled={!newItem.name.trim() || !newItem.stock}
                className="flex-1 bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors">
                Add to Inventory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Stock Modal (simplified) */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Transfer Stock</h2>
              <button onClick={() => setShowTransferModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Select Item</label>
                <select value={transferItem.itemId} onChange={e => setTransferItem({...transferItem, itemId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">-- Select Item --</option>
                  {inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.zone} — {i.stock} {i.unit})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Transfer To</label>
                  <select value={transferItem.toZone} onChange={e => setTransferItem({...transferItem, toZone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">-- Select Zone --</option>
                    {zones.map(z => <option key={z}>{z}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Quantity</label>
                  <input type="number" min="1" value={transferItem.qty} onChange={e => setTransferItem({...transferItem, qty: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowTransferModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button
                disabled={!transferItem.itemId || !transferItem.toZone || !transferItem.qty}
                onClick={() => { alert(`Transfer logged: ${transferItem.qty} units → ${transferItem.toZone}`); setShowTransferModal(false); }}
                className="flex-1 bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors">
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
