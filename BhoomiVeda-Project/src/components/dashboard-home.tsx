'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Leaf, Activity, Droplets, Wind, Cloud, Bot,
  ArrowUp, ArrowDown,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useTheme } from 'next-themes';

interface Stats { activeCrops: string; totalAcres: number; soilScore: number; soilGrade: string; season: string; }
interface WeatherData { location: string; current: { temp: number; humidity: number; description: string; windSpeed: number; rainChance: number; }; forecast: { day: string; temp: number; icon: string }[]; soilReport: string[]; }
interface MarketData { prices: { month: string; wheat: number; rice: number; soybean: number }[]; profit: { crop: string; profit: number; cost: number }[]; aiRecommendations: any[]; }
interface SoilData { data: { name: string; value: number; color: string }[]; overallScore: number; grade: string; ph: number; advice: string[]; }
interface ActivityItem { id: string; icon: string; text: string; type: string; time: string; }
interface NotificationItem { id: string; title: string; desc: string; type: string; time: string; }

function StatCard({ icon, label, value, sub, trend, color }: { icon: React.ReactNode; label: string; value: string; sub?: string; trend?: number; color: string }) {
  const { theme } = useTheme();
  const dm = theme === 'dark';
  return (
    <div className={`${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: color + '20' }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {trend >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-xl font-bold text-gray-900 dark:text-white mb-0.5">{value}</div>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const dm = theme === 'dark';
  const [stats, setStats] = useState<Stats | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [s, w, m, so, a, n] = await Promise.all([
          fetch('/api/dashboard/stats').then(r => r.json()),
          fetch('/api/dashboard/weather').then(r => r.json()),
          fetch('/api/dashboard/market').then(r => r.json()),
          fetch('/api/dashboard/soil').then(r => r.json()),
          fetch('/api/dashboard/activity').then(r => r.json()),
          fetch('/api/dashboard/notifications').then(r => r.json()),
        ]);
        if (s.success) setStats(s.stats);
        if (w.success) setWeather(w.weather);
        if (m.success) setMarket(m.market);
        if (so.success) setSoil(so.soil);
        if (a.success) setActivities(a.activities);
        if (n.success) setNotifications(n.notifications);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 rounded-2xl p-5 md:p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 text-8xl opacity-10 -mt-4 -mr-4 select-none">🌾</div>
        <div className="relative z-10">
          <p className="text-green-200 text-sm font-medium mb-1">Good {getGreeting()} 👋</p>
          <h1 className="text-xl md:text-2xl font-black mb-1">Welcome back, {user?.name || 'Farmer'}!</h1>
          <p className="text-green-100 text-sm mb-4">Your farm is performing well this {stats?.season || 'season'}.</p>
          <div className="flex gap-3 flex-wrap">
            <button className="bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors shadow-sm">
              🤖 Get AI Advice
            </button>
            <button className="bg-green-800/40 text-white px-4 py-2 rounded-xl text-sm font-semibold border border-white/20 hover:bg-green-800/60 transition-colors">
              📊 View Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<Leaf size={18} />} label="Active Crops" value={stats?.activeCrops || '-'} sub={`${stats?.totalAcres || 0} acres total`} trend={0} color="#81C784" />
        <StatCard icon={<Activity size={18} />} label="Soil Score" value={`${stats?.soilScore || 0}/100`} sub={stats?.soilGrade || '-'} trend={5} color="#FBC02D" />
      </div>

      {/* Weather + Soil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 border rounded-2xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold opacity-70 uppercase tracking-widest mb-1">Current Weather</div>
              <div className="text-4xl font-black">{weather?.current.temp || 28}°C</div>
              <div className="text-sm opacity-80 mt-1">{weather?.current.description || 'Partly Sunny'} · {weather?.location || 'Bhopal, MP'}</div>
            </div>
            <div className="text-5xl">{weather?.current.rainChance && weather.current.rainChance > 50 ? '🌧️' : '☀️'}</div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <Droplets size={14} className="mx-auto mb-1 opacity-70" />
              <div className="text-sm font-bold">{weather?.current.humidity || 62}%</div>
              <div className="text-xs opacity-60">Humidity</div>
            </div>
            <div className="text-center">
              <Wind size={14} className="mx-auto mb-1 opacity-70" />
              <div className="text-sm font-bold">{weather?.current.windSpeed || 14}km/h</div>
              <div className="text-xs opacity-60">Wind</div>
            </div>
            <div className="text-center">
              <Cloud size={14} className="mx-auto mb-1 opacity-70" />
              <div className="text-sm font-bold">{weather?.current.rainChance || 15}%</div>
              <div className="text-xs opacity-60">Rain</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-1">
            {(weather?.forecast || []).map(day => (
              <div key={day.day} className="text-center bg-white/10 rounded-lg p-1.5">
                <div className="text-xs opacity-60">{day.day}</div>
                <div className="text-sm">{day.icon}</div>
                <div className="text-xs font-bold">{day.temp}°</div>
              </div>
            ))}
          </div>
        </div>

        {/* Soil Health Card */}
        <div className={`${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-5 shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Soil Health</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">{soil?.grade || 'Good'}</span>
          </div>
          <div className="space-y-3">
            {(soil?.data || []).map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">{item.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
          {soil?.advice && soil.advice.length > 0 && (
            <div className={`mt-4 p-3 rounded-xl text-xs ${dm ? 'bg-gray-700 text-gray-300' : 'bg-green-50 text-green-800'}`}>
              💡 {soil.advice[0]}
            </div>
          )}
        </div>
      </div>

      {/* Market Trends + AI Picks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-5 shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Market Price Trends (₹/quintal)</h3>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2E7D32]" />Wheat</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1565C0]" />Rice</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FBC02D]" />Soybean</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={market?.prices || []}>
              <defs>
                <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} /><stop offset="95%" stopColor="#2E7D32" stopOpacity={0} /></linearGradient>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1565C0" stopOpacity={0.3} /><stop offset="95%" stopColor="#1565C0" stopOpacity={0} /></linearGradient>
                <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FBC02D" stopOpacity={0.3} /><stop offset="95%" stopColor="#FBC02D" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dm ? '#374151' : '#f0f0f0'} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: dm ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: dm ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: dm ? '#1f2937' : '#fff', border: 'none', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="wheat" stroke="#2E7D32" fill="url(#gw)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="rice" stroke="#1565C0" fill="url(#gr)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="soybean" stroke="#FBC02D" fill="url(#gs)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-5 shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">AI Top Picks</h3>
            <Bot size={16} className="text-green-600" />
          </div>
          <div className="space-y-3">
            {(market?.aiRecommendations || []).slice(0, 3).map(crop => (
              <div key={crop.crop} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <span className="text-2xl">{crop.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-gray-900 dark:text-white truncate">{crop.crop}</div>
                  <div className="text-xs text-green-600 font-semibold">₹{(crop.profit || 0).toLocaleString()}/acre</div>
                </div>
                <div className="text-lg font-black" style={{ color: crop.color }}>{crop.confidence}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit + Activity + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-5 shadow-sm`}>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Profit Prediction</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={market?.profit || []} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={dm ? '#374151' : '#f0f0f0'} vertical={false} />
              <XAxis dataKey="crop" tick={{ fontSize: 10, fill: dm ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: dm ? '#1f2937' : '#fff', border: 'none', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="profit" fill="#2E7D32" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="cost" fill="#81C784" radius={[4, 4, 0, 0]} name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-5 shadow-sm`}>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.map(a => (
              <div key={a.id} className="flex gap-3 items-start">
                <span className="text-lg leading-none mt-0.5">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl p-5 shadow-sm`}>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Notifications</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notifications.map(n => {
              const colors: Record<string, string> = { warning: 'border-l-yellow-400 bg-yellow-50 dark:bg-yellow-900/20', success: 'border-l-green-500 bg-green-50 dark:bg-green-900/20', info: 'border-l-blue-400 bg-blue-50 dark:bg-blue-900/20', ai: 'border-l-purple-400 bg-purple-50 dark:bg-purple-900/20' };
              return (
                <div key={n.id} className={`border-l-4 rounded-r-xl px-3 py-2 ${colors[n.type] || colors.info}`}>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">{n.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.desc}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
