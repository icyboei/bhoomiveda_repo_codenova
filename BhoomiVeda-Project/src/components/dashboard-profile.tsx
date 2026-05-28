'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Save, User, MapPin, Droplets, Leaf } from 'lucide-react';
import { toast } from 'sonner';

interface FarmProfile {
  state: string; district: string; village: string; pinCode: string;
  landSize: number; landUnit: string; soilType: string; ph: number;
  soilFertility: string; nitrogen: string; phosphorus: string; potassium: string;
  irrigation: string; currentCrop: string; prevCrop: string;
  budget: number; labourCost: number; sellingPreference: string;
}

const SOIL_TYPES = [
  "Alluvial Soil", "Black Soil (Regur / Black Cotton)", "Red Soil", "Laterite Soil",
  "Sandy Soil", "Sandy Loam", "Loamy Soil", "Clay Soil",
];
const IRRIGATION_OPTIONS = ["Rain-fed", "Borewell", "Canal", "River", "Drip Irrigation", "Sprinkler", "Flood Irrigation"];
const CROP_OPTIONS = ["None / Fallow", "Wheat", "Rice", "Maize", "Soybean", "Cotton", "Sugarcane", "Groundnut", "Mustard", "Gram (Chana)"];
const NUTRIENT_LEVELS = ["Very Low", "Low", "Medium", "High", "Very High"];
const SOIL_FERTILITY = ["Poor", "Moderate", "Good", "Excellent"];

export default function DashboardProfile() {
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [farm, setFarm] = useState<FarmProfile>({
    state: 'Madhya Pradesh', district: '', village: '', pinCode: '',
    landSize: 5, landUnit: 'Acre', soilType: 'Black Soil (Regur / Black Cotton)',
    ph: 6.5, soilFertility: 'Good', nitrogen: 'Medium', phosphorus: 'Medium',
    potassium: 'Medium', irrigation: 'Borewell', currentCrop: 'Wheat',
    prevCrop: 'Soybean', budget: 75000, labourCost: 18000, sellingPreference: 'Local Market',
  });

  const set = (k: string, v: string | number) => setFarm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/ai/crop-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...farm,
          land: String(farm.landSize),
          budget: String(farm.budget),
          labourCost: String(farm.labourCost),
          season: new Date().getMonth() >= 6 && new Date().getMonth() <= 10
            ? 'Kharif (Jun-Oct)'
            : new Date().getMonth() >= 11 || new Date().getMonth() <= 3
              ? 'Rabi (Nov-Mar)' : 'Zaid (Mar-Jun)',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Farm profile saved successfully!');
      } else {
        toast.error('Failed to save profile');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-green-500";

  return (
    <div className="space-y-6 pb-20 lg:pb-6 max-w-3xl">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">👤 Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and farm profile settings.</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.mobile || 'N/A'}</p>
            <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold capitalize mt-1 inline-block">
              {user?.role === 'expert' ? '🧑‍🔬 Expert' : '👨‍🌾 Farmer'}
            </span>
          </div>
        </div>
      </div>

      {/* Farm Profile Form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-green-600" /> Farm Location
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">State</label>
            <input className={inputCls} value={farm.state} onChange={e => set('state', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">District</label>
            <input className={inputCls} value={farm.district} onChange={e => set('district', e.target.value)} placeholder="e.g. Vidisha" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Village</label>
            <input className={inputCls} value={farm.village} onChange={e => set('village', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Pin Code</label>
            <input className={inputCls} value={farm.pinCode} onChange={e => set('pinCode', e.target.value)} />
          </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Leaf size={18} className="text-green-600" /> Soil & Farm Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Soil Type</label>
            <select className={inputCls} value={farm.soilType} onChange={e => set('soilType', e.target.value)}>
              {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Irrigation</label>
            <select className={inputCls} value={farm.irrigation} onChange={e => set('irrigation', e.target.value)}>
              {IRRIGATION_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Land Size</label>
            <div className="flex gap-2">
              <input type="number" className={inputCls} value={farm.landSize} onChange={e => set('landSize', Number(e.target.value))} />
              <select className={inputCls + ' w-24'} value={farm.landUnit} onChange={e => set('landUnit', e.target.value)}>
                <option>Acre</option><option>Bigha</option><option>Hectare</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Soil Fertility</label>
            <select className={inputCls} value={farm.soilFertility} onChange={e => set('soilFertility', e.target.value)}>
              {SOIL_FERTILITY.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Current Crop</label>
            <select className={inputCls} value={farm.currentCrop} onChange={e => set('currentCrop', e.target.value)}>
              {CROP_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Previous Crop</label>
            <select className={inputCls} value={farm.prevCrop} onChange={e => set('prevCrop', e.target.value)}>
              {CROP_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Budget (₹)</label>
            <input type="number" className={inputCls} value={farm.budget} onChange={e => set('budget', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Labour Cost (₹)</label>
            <input type="number" className={inputCls} value={farm.labourCost} onChange={e => set('labourCost', Number(e.target.value))} />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto bg-[#1f8a43] hover:bg-[#176b34] disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Profile
        </button>
      </div>
    </div>
  );
}
