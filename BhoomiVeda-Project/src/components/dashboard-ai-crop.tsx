'use client';

import { useState, useEffect } from 'react';
import { Bot, ChevronDown, ChevronUp, CheckCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const SOIL_TYPES = [
  "Alluvial Soil", "Black Soil (Regur / Black Cotton)", "Red Soil", "Laterite Soil",
  "Sandy Soil", "Sandy Loam", "Loamy Soil", "Clay Soil", "Clay Loam",
];

const SEASONS = ["Kharif (Jun–Oct)", "Rabi (Nov–Mar)", "Zaid (Mar–Jun)"];
const IRRIGATION_OPTIONS = ["Rain-fed", "Borewell", "Canal", "River", "Drip Irrigation", "Sprinkler", "Flood Irrigation"];
const CROP_OPTIONS = ["None / Fallow", "Wheat", "Rice", "Maize", "Soybean", "Cotton", "Sugarcane", "Groundnut", "Mustard", "Gram (Chana)", "Arhar (Pigeon Pea)", "Moong (Green Gram)", "Urad (Black Gram)", "Bajra (Pearl Millet)", "Jowar (Sorghum)", "Barley", "Potato", "Onion", "Tomato", "Chilli"];
const NUTRIENT_LEVELS = ["Very Low", "Low", "Medium", "High", "Very High"];
const SOIL_FERTILITY = ["Poor", "Moderate", "Good", "Excellent"];

function detectSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 6 && m <= 10) return SEASONS[0];
  if (m >= 11 || m <= 3) return SEASONS[1];
  return SEASONS[2];
}

interface Recommendation {
  crop: string; icon: string; color: string; water: string; risk: string;
  confidence: number; hybrid: boolean; investment: number;
  investmentBreakdown: Record<string, number>;
  yieldPerAcre: number; yieldUnit: string; marketPrice: number;
  marketTrend: string; marketChange: number; grossRevenue: number;
  profit: number; successRate: number; successNote: string;
  advice?: { fertilizers: string[]; pesticides: string[] };
}

export default function DashboardAiCrop() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [form, setForm] = useState({
    state: "Madhya Pradesh", district: "", village: "", pinCode: "",
    temp: "", rainfall: "850", humidity: "", season: detectSeason(),
    soil: "Black Soil (Regur / Black Cotton)", ph: "6.5", soilFertility: "Good",
    nitrogen: "Medium", phosphorus: "Medium", potassium: "Medium",
    land: "5", landUnit: "Acre", irrigation: "Borewell",
    currentCrop: "Wheat", prevCrop: "Soybean",
    budget: "75000", labourCost: "18000", sellingPreference: "Local Market",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/crop-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations);
        setSubmitted(true);
        toast.success(`AI analysis complete! ${data.recommendations.length} crops recommended.`);
      } else {
        toast.error(data.error || 'Failed to get recommendations');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-green-500 focus:bg-white dark:focus:bg-gray-700";

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            🤖 AI Crop Recommendation
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in your farm details and get AI-powered crop suggestions.</p>
        </div>
        <button onClick={() => { setSubmitted(false); setRecommendations([]); }} className="text-sm text-green-600 font-semibold hover:text-green-700">
          {submitted ? '← Edit Form' : ''}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className={`${submitted ? 'hidden lg:block' : ''} ${'bg-white dark:bg-gray-800'} border border-gray-100 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-sm`}>
          {/* Location */}
          <div className="mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-600 font-bold text-sm">📍 Location</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">State</label>
                <select className={inputCls} value={form.state} onChange={e => set('state', e.target.value)}>
                  {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">District</label>
                <input className={inputCls} value={form.district} onChange={e => set('district', e.target.value)} placeholder="e.g. Vidisha" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Pin Code</label>
                <input className={inputCls} value={form.pinCode} onChange={e => set('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit PIN" maxLength={6} inputMode="numeric" />
              </div>
            </div>
          </div>

          {/* Weather */}
          <div className="mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-500 font-bold text-sm">🌤️ Weather & Climate</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Season</label>
                <select className={inputCls} value={form.season} onChange={e => set('season', e.target.value)}>
                  {SEASONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Temp (°C)</label>
                <input className={inputCls} type="number" value={form.temp} onChange={e => set('temp', e.target.value)} placeholder="°C" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Humidity (%)</label>
                <input className={inputCls} type="number" min="0" max="100" value={form.humidity} onChange={e => set('humidity', e.target.value)} placeholder="%" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Annual Rainfall — {form.rainfall} mm</label>
              <input type="range" min="200" max="2000" value={form.rainfall} onChange={e => set('rainfall', e.target.value)} className="w-full accent-green-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>200mm</span><span>2000mm</span></div>
            </div>
          </div>

          {/* Soil */}
          <div className="mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-600 font-bold text-sm">🌱 Soil Details</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Soil Type</label>
                <select className={inputCls} value={form.soil} onChange={e => set('soil', e.target.value)}>
                  {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">pH Level ({form.ph})</label>
                <input type="range" min="3" max="10" step="0.1" value={form.ph} onChange={e => set('ph', e.target.value)} className="w-full accent-green-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Fertility</label>
                <select className={inputCls} value={form.soilFertility} onChange={e => set('soilFertility', e.target.value)}>
                  {SOIL_FERTILITY.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Irrigation</label>
                <select className={inputCls} value={form.irrigation} onChange={e => set('irrigation', e.target.value)}>
                  {IRRIGATION_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Nitrogen</label>
                <select className={inputCls} value={form.nitrogen} onChange={e => set('nitrogen', e.target.value)}>
                  {NUTRIENT_LEVELS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Phosphorus</label>
                <select className={inputCls} value={form.phosphorus} onChange={e => set('phosphorus', e.target.value)}>
                  {NUTRIENT_LEVELS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Potassium</label>
                <select className={inputCls} value={form.potassium} onChange={e => set('potassium', e.target.value)}>
                  {NUTRIENT_LEVELS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Farm Details */}
          <div className="mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-600 font-bold text-sm">🌾 Farm Details</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Land Size ({form.land} {form.landUnit})</label>
                <input type="number" className={inputCls} value={form.land} onChange={e => set('land', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Current Crop</label>
                <select className={inputCls} value={form.currentCrop} onChange={e => set('currentCrop', e.target.value)}>
                  {CROP_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Previous Crop</label>
                <select className={inputCls} value={form.prevCrop} onChange={e => set('prevCrop', e.target.value)}>
                  {CROP_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Budget (₹)</label>
                <input type="number" className={inputCls} value={form.budget} onChange={e => set('budget', e.target.value)} />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#1f8a43] hover:bg-[#176b34] disabled:bg-[#9cb5a8] text-white py-3 rounded-xl font-bold text-sm transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : '🤖 Get AI Recommendations'}
          </button>
        </div>

        {/* Results */}
        <div className={`${!submitted ? 'hidden lg:block' : ''}`}>
          {!submitted ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 text-center shadow-sm">
              <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI Crop Recommendations</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fill in your farm details and click &quot;Get AI Recommendations&quot; to see personalized crop suggestions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">{recommendations.length} Crops Recommended</h3>
              </div>
              {recommendations.map((crop, i) => {
                const isExpanded = expanded === crop.crop;
                const riskColor = crop.risk === 'Low' ? 'text-green-600 bg-green-50 dark:bg-green-900/30' : crop.risk === 'Medium' ? 'text-yellow-700 bg-yellow-50 dark:bg-yellow-900/30' : 'text-red-600 bg-red-50 dark:bg-red-900/30';
                return (
                  <div key={crop.crop} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{crop.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                          <span className="text-green-600 font-black mr-1">#{i + 1}</span>
                          {crop.crop}
                          {crop.hybrid && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">Hybrid</span>}
                        </div>
                        <div className="text-xs text-green-600 font-semibold">₹{crop.profit?.toLocaleString()}/acre profit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black" style={{ color: crop.color }}>{crop.confidence}%</div>
                        <div className="text-[10px] text-gray-500">match</div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                      <div className="h-full rounded-full" style={{ width: `${crop.confidence}%`, backgroundColor: crop.color }} />
                    </div>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColor}`}>Risk: {crop.risk}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-blue-700 bg-blue-50 dark:bg-blue-900/30">💧 {crop.water}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-gray-600 bg-gray-100 dark:bg-gray-700">📊 {crop.successRate}% success</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <div>📈 Yield: {crop.yieldPerAcre} {crop.yieldUnit}/acre</div>
                      <div>💰 Market: ₹{crop.marketPrice}/quintal</div>
                      <div>💵 Revenue: ₹{crop.grossRevenue?.toLocaleString()}</div>
                      <div>🏷️ Investment: ₹{crop.investment?.toLocaleString()}</div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{crop.successNote}</p>
                    {crop.advice && (
                      <button onClick={() => setExpanded(isExpanded ? null : crop.crop)} className="w-full flex items-center justify-between text-xs font-semibold text-green-700 dark:text-green-400 py-2 border-t border-gray-100 dark:border-gray-700">
                        {isExpanded ? 'Hide' : 'Show'} Detailed Advice
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}
                    {isExpanded && crop.advice && (
                      <div className="mt-3 space-y-3 animate-in slide-in-from-top duration-200">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                          <div className="text-xs font-bold text-green-800 dark:text-green-400 mb-2">🧪 Fertilizer Recommendation</div>
                          <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                            {crop.advice.fertilizers.map((f, j) => <li key={j}>• {f}</li>)}
                          </ul>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                          <div className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-2">🐛 Pesticide Recommendation</div>
                          <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                            {crop.advice.pesticides.map((p, j) => <li key={j}>• {p}</li>)}
                          </ul>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <div className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-2">💰 Investment Breakdown</div>
                          <div className="grid grid-cols-2 gap-1 text-xs text-blue-700 dark:text-blue-300">
                            {Object.entries(crop.investmentBreakdown || {}).map(([k, v]) => (
                              <div key={k}>{k}: ₹{v?.toLocaleString()}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
