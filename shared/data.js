/* ============================================================
   DATA.JS — All dummy data and constants used across pages.
   These mirror the arrays from the original src/App.jsx so the
   UI looks and behaves exactly the same.
   ============================================================ */

const marketData = [
  { month: "Jan", wheat: 2100, rice: 3200, soybean: 4100 },
  { month: "Feb", wheat: 2300, rice: 3100, soybean: 4300 },
  { month: "Mar", wheat: 2200, rice: 3400, soybean: 4000 },
  { month: "Apr", wheat: 2600, rice: 3300, soybean: 4500 },
  { month: "May", wheat: 2800, rice: 3600, soybean: 4200 },
  { month: "Jun", wheat: 2500, rice: 3800, soybean: 4800 },
  { month: "Jul", wheat: 2900, rice: 4000, soybean: 4600 },
];

const soilData = [
  { name: "Nitrogen",   value: 72, color: "#2E7D32" },
  { name: "Phosphorus", value: 58, color: "#81C784" },
  { name: "Potassium",  value: 85, color: "#FBC02D" },
  { name: "Organic",    value: 44, color: "#8D6E63" },
];

const profitData = [
  { crop: "Wheat",   profit: 18000, cost:  8000 },
  { crop: "Rice",    profit: 22000, cost: 11000 },
  { crop: "Soybean", profit: 31000, cost: 14000 },
  { crop: "Maize",   profit: 15000, cost:  7000 },
];

const recentActivity = [
  { icon: "sprout", text: "AI recommended Soybean for Kharif season", time: "2h ago" },
  { icon: "droplets", text: "Irrigation scheduled for Field B — 6 AM tomorrow", time: "4h ago" },
  { icon: "bar-chart-2", text: "Market prices updated — Wheat up 8%", time: "6h ago" },
  { icon: "award", text: "You earned 'Top Farmer' recognition this week!", time: "1d ago" },
  { icon: "alert-triangle", text: "Soil pH alert: Field A slightly acidic (5.8)", time: "1d ago" },
];

const notifications = [
  { title: "Rain alert",  desc: "Heavy rainfall expected in 48 hours", type: "warning", time: "1h" },
  { title: "Price surge", desc: "Soybean prices up 12% at Bhopal mandi", type: "success", time: "3h" },
  { title: "New scheme",  desc: "PM Kisan 14th installment released",   type: "info",    time: "5h" },
  { title: "Crop advice", desc: "Optimal sowing window starts next week", type: "ai",   time: "1d" },
];

let communityPosts = [
  { id: 1, author: "Ramesh Kumar", avatar: "RK", avatarColor: "#2E7D32", location: "Vidisha, MP", time: "2h ago",
    content: "Just harvested my Soybean crop using BhoomiVeda recommendations — 28% higher yield than last year! The AI suggestion to switch to JS-335 variety was spot on.",
    likes: 142, comments: 38, shares: 24, tags: ["Soybean", "Success"], liked: false },
  { id: 2, author: "Priya Sharma", avatar: "PS", avatarColor: "#1565C0", location: "Sehore, MP", time: "5h ago",
    content: "Anyone dealing with yellow mosaic virus in black gram this season? My plants are showing symptoms on 20% of field. Looking for organic treatment options before I try chemical intervention.",
    likes: 89, comments: 67, shares: 12, tags: ["BlackGram", "Disease", "Help"], liked: true },
  { id: 3, author: "Arjun Mehta", avatar: "AM", avatarColor: "#E65100", location: "Hoshangabad, MP", time: "1d ago",
    content: "The new soil testing feature is incredible. Got my complete micro-nutrient report in 2 days vs 2 weeks at the local lab. Boron deficiency identified early — saved my wheat crop!",
    likes: 203, comments: 45, shares: 67, tags: ["SoilHealth", "Technology"], liked: false },
];

const trendingTopics = [
  { topic: "Kharif Sowing 2025", posts: 342 },
  { topic: "Organic Farming",    posts: 218 },
  { topic: "PM Kisan Scheme",    posts: 195 },
  { topic: "Wheat MSP Increase", posts: 167 },
  { topic: "Drip Irrigation",    posts: 134 },
];

const leaderboard = [
  { rank: 1, name: "Mahesh Patel",  state: "Gujarat", points: 2840, badge: "1st" },
  { rank: 2, name: "Sunita Devi",   state: "Punjab",  points: 2610, badge: "2nd" },
  { rank: 3, name: "Ramesh Kumar",  state: "MP",      points: 2390, badge: "3rd" },
  { rank: 4, name: "Arjun Singh",   state: "UP",      points: 2150, badge: "4th" },
  { rank: 5, name: "Kavita Rao",    state: "AP",      points: 1980, badge: "5th" },
];

const schemes = [
  { id: 1, name: "PM Kisan Samman Nidhi", ministry: "Ministry of Agriculture", benefit: "₹6,000/year",
    deadline: "2025-12-31", eligible: true, category: "Financial Aid",
    description: "Direct income support of ₹6000 per year to small and marginal farmers in three equal instalments.", applied: true },
  { id: 2, name: "Pradhan Mantri Fasal Bima Yojana", ministry: "Ministry of Agriculture", benefit: "Crop Insurance",
    deadline: "2025-07-31", eligible: true, category: "Insurance",
    description: "Comprehensive crop insurance scheme providing financial support in case of crop failure due to natural calamities.", applied: false },
  { id: 3, name: "Soil Health Card Scheme", ministry: "Dept. of Agriculture", benefit: "Free Soil Testing",
    deadline: "Ongoing", eligible: true, category: "Advisory",
    description: "Free soil health cards for farmers carrying crop-wise recommendations on nutrients and fertilizers.", applied: false },
  { id: 4, name: "Micro Irrigation Fund", ministry: "NABARD", benefit: "Up to ₹5 Lakh subsidy",
    deadline: "2025-09-30", eligible: false, category: "Infrastructure",
    description: "Subsidy for drip and sprinkler irrigation systems to promote efficient water use in agriculture.", applied: false },
];

const cropRecommendations = [
  { crop: "Soybean JS-335", icon: "sprout", color: "#2E7D32", water: "Low",    risk: "Low",    confidence: 94, hybrid: false,
    investment: 12500, investmentBreakdown: { Seeds: 2800, Fertilizer: 4200, Labour: 3000, Irrigation: 1500, Other: 1000 },
    yieldPerAcre: 12, yieldUnit: "quintals", marketPrice: 4600, marketTrend: "up", marketChange: 8,
    grossRevenue: 55200, profit: 42700, successRate: 91, successNote: "High success in Black Cotton soil with moderate rainfall" },
  { crop: "Wheat GW-496 (Sharbati)", icon: "wheat", color: "#D97706", water: "Medium", risk: "Low", confidence: 88, hybrid: false,
    investment: 10800, investmentBreakdown: { Seeds: 2200, Fertilizer: 3800, Labour: 2800, Irrigation: 1200, Other: 800 },
    yieldPerAcre: 18, yieldUnit: "quintals", marketPrice: 2275, marketTrend: "stable", marketChange: 2,
    grossRevenue: 40950, profit: 30150, successRate: 85, successNote: "Reliable Rabi crop; MSP guaranteed at ₹2275/quintal" },
  { crop: "Maize DKC-9144 (Hybrid)", icon: "corn", color: "#EA580C", water: "Medium", risk: "Medium", confidence: 76, hybrid: true,
    investment: 9200, investmentBreakdown: { Seeds: 3400, Fertilizer: 3000, Labour: 1800, Irrigation: 700, Other: 300 },
    yieldPerAcre: 22, yieldUnit: "quintals", marketPrice: 1850, marketTrend: "up", marketChange: 5,
    grossRevenue: 40700, profit: 31500, successRate: 74, successNote: "High-yield hybrid; requires consistent moisture in early stage" },
];

const expertQuestions = [
  { question: "How to increase wheat yield in black cotton soil?", expert: "Dr. R. Sharma", answered: true,  answers: 3 },
  { question: "Organic solution for aphids in mustard crop?",       expert: "Pending",        answered: false, answers: 0 },
  { question: "Best irrigation schedule for drip in Kharif?",        expert: "Agro Expert",    answered: true,  answers: 5 },
];

/* Constants for the AI Crop form */
const LAND_UNITS = ["Acre", "Bigha", "Bissa", "Hectare"];
const SEASONS = ["Kharif (Jun–Oct)", "Rabi (Nov–Mar)", "Zaid (Mar–Jun)"];
const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh",
  "Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha",
  "Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];
const INDIAN_SOIL_TYPES = [
  "Alluvial Soil","Black Soil (Regur / Black Cotton)","Red Soil","Laterite Soil","Desert (Arid) Soil",
  "Saline and Alkaline Soil","Peaty and Marshy Soil","Forest and Mountain Soil","Sandy Soil","Sandy Loam",
  "Loamy Soil","Clay Soil","Clay Loam","Red and Black Mixed Soil","Coastal Alluvial Soil","Lateritic Soil",
  "Mountain Meadow Soil","Piedmont Soil","Terai Soil","Red Sandy Soil","Brown Soil","Sub-montane Soil"
];
const CROP_OPTIONS = [
  "None / Fallow","Wheat","Rice","Maize","Soybean","Cotton","Sugarcane","Groundnut","Mustard","Gram (Chana)",
  "Arhar (Pigeon Pea)","Moong (Green Gram)","Urad (Black Gram)","Bajra (Pearl Millet)","Jowar (Sorghum)","Barley",
  "Potato","Onion","Tomato","Chilli","Turmeric","Ginger","Sunflower","Sesame","Linseed","Jute","Tea","Coffee","Other"
];
const SOIL_FERTILITY_OPTIONS = ["Poor","Moderate","Good","Excellent"];
const NUTRIENT_LEVELS = ["Very Low","Low","Medium","High","Very High"];
const IRRIGATION_OPTIONS = [
  "Rain-fed","Borewell","Canal","River","Pond / Lake","Drip Irrigation","Sprinkler","Flood Irrigation",
  "Mixed (Borewell + Canal)"
];
const COMPOST_OPTIONS = ["Available (Sufficient)","Limited","Not Available"];
const CHEMICAL_FERTILIZER_OPTIONS = ["None","Light","Moderate","Heavy"];
const FLOOD_DROUGHT_OPTIONS = [
  "None reported","Flood in last 5 years","Drought in last 5 years","Both flood & drought (last 10 years)",
  "Occasional floods","Occasional droughts","Chronic flood-prone area","Chronic drought-prone area"
];
const SELLING_PREFERENCES = ["Local Market","Export","Direct Customer","Online Selling"];

const CROP_INPUT_ADVICE = {
  Soybean: {
    fertilizers: ["Rhizobium culture seed treatment","Single Super Phosphate (SSP)","Sulphur 20-25 kg/ha"],
    pesticides: ["Thiamethoxam (for stem fly/whitefly)","Neem oil spray 3 ml/L (early stage)","Emamectin benzoate (for girdle beetle/caterpillars)"],
  },
  Wheat: {
    fertilizers: ["Urea split dose (basal + CRI stage)","DAP at sowing","MOP for potash-deficient soils"],
    pesticides: ["Pendimethalin pre-emergence (weed control)","Propiconazole/Tebuconazole (rust management)","Imidacloprid (aphids if ETL crossed)"],
  },
  Maize: {
    fertilizers: ["NPK 120:60:40 kg/ha (crop-stage split)","Zinc sulphate in zinc-deficient soils","Farmyard manure 5-10 t/ha"],
    pesticides: ["Chlorantraniliprole (fall armyworm)","Spinosad for early larvae","Atrazine pre-emergence (weed control)"],
  },
};

/* Expose globally so plain <script> files can read them */
window.BV_DATA = {
  marketData, soilData, profitData, recentActivity, notifications,
  communityPosts, trendingTopics, leaderboard, schemes, cropRecommendations,
  expertQuestions, LAND_UNITS, SEASONS, INDIA_STATES, INDIAN_SOIL_TYPES,
  CROP_OPTIONS, SOIL_FERTILITY_OPTIONS, NUTRIENT_LEVELS, IRRIGATION_OPTIONS,
  COMPOST_OPTIONS, CHEMICAL_FERTILIZER_OPTIONS, FLOOD_DROUGHT_OPTIONS,
  SELLING_PREFERENCES, CROP_INPUT_ADVICE,
};
