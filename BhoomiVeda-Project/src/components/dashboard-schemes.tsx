'use client';

import { useState } from 'react';
import { CheckCircle, ExternalLink, Calendar, Shield, Landmark, Wrench } from 'lucide-react';
import { toast } from 'sonner';

const schemes = [
  {
    id: 1, name: "PM Kisan Samman Nidhi", ministry: "Ministry of Agriculture",
    benefit: "₹6,000/year", deadline: "2025-12-31", eligible: true, category: "Financial Aid",
    description: "Direct income support of ₹6000 per year to small and marginal farmers in three equal instalments.",
    applied: false, icon: Landmark, color: "green",
  },
  {
    id: 2, name: "Pradhan Mantri Fasal Bima Yojana", ministry: "Ministry of Agriculture",
    benefit: "Crop Insurance", deadline: "2025-07-31", eligible: true, category: "Insurance",
    description: "Comprehensive crop insurance scheme providing financial support in case of crop failure due to natural calamities.",
    applied: false, icon: Shield, color: "blue",
  },
  {
    id: 3, name: "Soil Health Card Scheme", ministry: "Dept. of Agriculture",
    benefit: "Free Soil Testing", deadline: "Ongoing", eligible: true, category: "Advisory",
    description: "Free soil health cards for farmers carrying crop-wise recommendations on nutrients and fertilizers.",
    applied: false, icon: Wrench, color: "amber",
  },
  {
    id: 4, name: "Micro Irrigation Fund", ministry: "NABARD",
    benefit: "Up to ₹5 Lakh subsidy", deadline: "2025-09-30", eligible: false, category: "Infrastructure",
    description: "Subsidy for drip and sprinkler irrigation systems to promote efficient water use in agriculture.",
    applied: false, icon: Landmark, color: "purple",
  },
  {
    id: 5, name: "Kisan Credit Card (KCC)", ministry: "Ministry of Finance",
    benefit: "Low-interest loans", deadline: "Ongoing", eligible: true, category: "Financial Aid",
    description: "Provides affordable credit to farmers for agricultural needs, post-harvest expenses, and consumption requirements.",
    applied: false, icon: Landmark, color: "green",
  },
  {
    id: 6, name: "e-NAM (National Agriculture Market)", ministry: "Ministry of Agriculture",
    benefit: "Better market access", deadline: "Ongoing", eligible: true, category: "Market Access",
    description: "Pan-India electronic trading portal that networks existing APMC mandis to create a unified national market.",
    applied: false, icon: Wrench, color: "blue",
  },
];

const categories = ["All", "Financial Aid", "Insurance", "Advisory", "Infrastructure", "Market Access"];

export default function DashboardSchemes() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [appliedSchemes, setAppliedSchemes] = useState<Set<number>>(new Set());

  const filteredSchemes = activeCategory === "All"
    ? schemes
    : schemes.filter(s => s.category === activeCategory);

  const handleApply = (schemeId: number, schemeName: string) => {
    setAppliedSchemes(prev => new Set(prev).add(schemeId));
    toast.success(`Applied to "${schemeName}" successfully!`);
  };

  const colorMap: Record<string, string> = {
    green: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  };

  const iconBgMap: Record<string, string> = {
    green: 'bg-green-100 dark:bg-green-900/50 text-green-600',
    blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600',
    amber: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600',
    purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600',
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">📋 Government Schemes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Explore government schemes and subsidies for farmers.</p>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-[#1f8a43] text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map(scheme => {
          const isApplied = appliedSchemes.has(scheme.id);
          const Icon = scheme.icon;
          return (
            <div key={scheme.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${iconBgMap[scheme.color]}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">{scheme.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{scheme.ministry}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${colorMap[scheme.color]}`}>
                  {scheme.category}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{scheme.description}</p>

              <div className="flex flex-wrap gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span className="font-bold text-green-600 dark:text-green-400">{scheme.benefit}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Calendar size={12} />
                  {scheme.deadline}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {scheme.eligible ? (
                  isApplied ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                      <CheckCircle size={14} />
                      Applied
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(scheme.id, scheme.name)}
                      className="px-4 py-2 bg-[#1f8a43] hover:bg-[#176b34] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink size={12} />
                      Apply Now
                    </button>
                  )
                ) : (
                  <span className="text-xs text-amber-600 font-semibold bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg">
                    ⚠️ Not eligible in your region
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
