/* ============================================================
   LANGUAGE.JS — Global i18n for BhoomiVeda
   ------------------------------------------------------------
   - Single source of truth for translations (window.BV_I18N).
   - Persists in localStorage("bv-language") across all pages.
   - Static markup:   <el data-i18n="key">
   - Attributes:      <el data-i18n-attr="placeholder:key,title:key2">
   - Page title:      <body data-page-title-key="dashboard">
   - Dynamic strings (from data.js, generated JS): call
       BV_I18N.tr("English text")   -> Hindi if mapped, else as-is
   - Lang switcher:   <select class="bv-lang-switcher">  (auto-wired)
   - Backend-ready:   BV_I18N.loadFrom(url) merges remote JSON
     of shape { en:{...}, hi:{...}, phrases:{ "English":"हिंदी" } }
   ============================================================ */

(function () {
  const STORAGE_KEY = "bv-language";
  const DEFAULT_LANG = "hi";

  /* ----------------------------------------------------------
     Keyed UI strings (used via data-i18n / BV_I18N.t(key))
  ---------------------------------------------------------- */
  const translations = {
    en: {
      // Sidebar / nav
      dashboard: "Dashboard",
      aiCropAdvisor: "Soil & Crop Insights",
      askExpert: "Ask Expert",
      community: "Community",
      govSchemes: "Gov. Schemes",
      profile: "Profile",
      logout: "Logout",
      login: "Login",
      signup: "Sign Up",
      // Dashboard greeting + profile labels (new)
      welcome: "Welcome",
      welcomePrefix: "Welcome",
      profileDetails: "Profile Details",
      uploadPhoto: "Upload Photo",
      changePhoto: "Change Photo",
      mobileNumber: "Mobile Number",
      mobile: "Mobile",
      email: "Email",
      villageLbl: "Village",
      districtLbl: "District",
      stateLbl: "State",
      rewardPoints: "Reward Points",
      farmerSinceLbl: "Farmer Since",
      notAvailable: "Not Available",
      farmPerfDynamic: "Your farm in {village} is performing 18% above average this season.",

      // Navbar
      platformTagline: "BhoomiVeda Platform",
      notifications: "Notifications",
      newCount: "new",

      // Home / dashboard
      totalAcres: "12 acres total",
      field: "Field ",
      hybrid: "Hybrid",
      risk: "Risk",
      low: "Low",
      medium: "Medium",
      high: "High",
      ago: "ago",
      revenue: "Revenue",
      cost: "Cost",
      goodMorning: "Good Morning",
      welcomeBack: "Welcome back, Rajendra!",
      farmPerformance: "Your farm in Vidisha is performing 18% above average this season.",
      aiAdvice: "Get AI Advice",
      viewReport: "View Report",
      currentWeather: "Current Weather",
      weatherStatus: "Partly Sunny · Bhopal, MP",
      soilHealth: "Soil Health",
      marketTrends: "Market Price Trends",
      aiTopPicks: "AI Top Picks",
      profitPrediction: "Profit Prediction",
      recentActivity: "Recent Activity",
      activeCrops: "Active Crops",
      soilScore: "Soil Score",
      humidity: "Humidity",
      wind: "Wind",
      rain: "Rain",
      good: "Good",
      addNitrogen: "Add 20kg nitrogen fertilizer to Field before next irrigation",
      match: "match",

      // Community page
      communityTitle: "Farmer Community",
      communitySubtitle: "Connect, share, and grow together",
      searchPosts: "Search posts...",
      composerPlaceholder: "Share your farming experience, tips, or ask a question...",
      photo: "Photo",
      location: "Location",
      post: "Post",
      trendingTopics: "Trending Topics",
      askExperts: "Ask Experts",
      askQuestionBtn: "+ Ask a Question",
      topFarmers: "Top Farmers",
      follow: "Follow",
      awaitingExpert: "Awaiting expert",
      answers: "answers",
      posts: "posts",
      pts: "pts",

      // Schemes page
      schemesTitle: "Government Schemes",
      schemesSubtitle: "Find schemes you qualify for and apply directly",
      searchSchemes: "Search schemes...",
      catAll: "All",
      catFinancial: "Financial Aid",
      catInsurance: "Insurance",
      catAdvisory: "Advisory",
      catInfrastructure: "Infrastructure",
      eligible: "Eligible",
      notEligible: "Not Eligible",
      appliedTag: "Applied",
      benefit: "Benefit",
      deadline: "Deadline",
      applyNow: "Apply Now",
      noSchemes: "No schemes match your filters.",

      // Profile page
      profileLocation: "Vidisha, Madhya Pradesh",
      acres12: "12 acres",
      farmerSince: "Farmer since 2012",
      points2390: "2,390 pts",
      editProfile: "Edit Profile",
      farmDetails: "Farm Details",
      productivityStats: "Productivity Stats",
      achievements: "Achievements",
      editProfileTitle: "Edit Profile",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      // Farm details labels + values
      landSize: "Land Size",
      landSizeVal: "12 acres",
      soilType: "Soil Type",
      soilTypeVal: "Black Cotton",
      waterSource: "Water Source",
      waterSourceVal: "Borewell + Canal",
      locationLbl: "Location",
      locationVal: "Vidisha, MP",
      cropsGrown: "Crops Grown",
      cropsGrownVal: "Wheat, Soybean",
      season: "Season",
      seasonVal: "Kharif + Rabi",
      // Productivity stat labels
      yieldIncrease: "Yield Increase",
      annualRevenue: "Annual Revenue",
      waterSavings: "Water Savings",
      aiAccuracy: "AI Accuracy",
      // Badges
      badgeTopFarmer: "Top Farmer",
      badgeTopFarmerDesc: "Week of May 2025",
      badgeHarvest: "Harvest Master",
      badgeHarvestDesc: "3 successful harvests",
      badgeWater: "Water Saver",
      badgeWaterDesc: "20% below average",
      badgeAI: "AI Pioneer",
      badgeAIDesc: "First 1000 AI users",
      badgeCommunity: "Community Star",
      badgeCommunityDesc: "100+ helpful posts",
      badgeData: "Data Driven",
      badgeDataDesc: "30 days tracked",
      // Edit fields
      fullName: "Full Name",
      fullNameVal: "Rajendra Jatav",
      landSizeAcres: "Land Size (acres)",
      primaryCrop: "Primary Crop",
      primaryCropVal: "Wheat, Soybean",

      // ===== AI Crop Advisor =====
      acPageTitle: "Soil Testing & AI Recommendation",
      acPageSubtitle: "Choose a service to continue",
      acSoilTesting: "Soil Testing",
      acSoilTestingDesc:
        "Analyze your soil professionally for better crop productivity and accurate recommendations.",
      acBookSlot: "Book Slot",
      acMySlots: "My Soil Testing Slots",
      acAiRec: "AI Crop Recommendation",
      acAiRecDesc:
        "Get AI-powered crop suggestions using soil type, investment, weather and labour conditions.",
      acContinue: "Continue",
      acAiRecHeader: "AI Crop Recommendation",
      acAiRecSub:
        "Location via GPS and weather via Google Weather API are auto-filled. Review, adjust if needed, then get AI suggestions.",
      acReadyTitle: "Ready for AI Analysis",
      acReadyDesc:
        "Review the form, adjust if needed, then get personalised recommendations.",
      acGetRec: "Get AI Recommendation",
      acAnalysing: "Analysing…",
      acFetching: "Fetching GPS & Google Weather…",
      acFetched: "GPS & Google Weather data fetched",
      acAnalysisComplete: "AI Analysis Complete",
      acAuto: "Auto",
      acAutoFromGps: "Auto-fetched from GPS",
      acGoogleWeather: "Google Weather API",
      acSecLocation: "Location",
      acSecWeather: "Weather & Climate",
      acSecSoil: "Soil & Farm Details",
      acSecCrop: "Crop Related Input",
      acSecInvest: "Investment",
      acLblState: "State",
      acLblDistrict: "District",
      acLblVillage: "Village",
      acLblPin: "Pin Code",
      acLblTemp: "Temp (°C)",
      acLblHumidity: "Humidity (%)",
      acLblSeason: "Season",
      acLblRainfall: "Annual Rainfall",
      acLblMm: "mm",
      acLblFlood: "Flood / Drought History",
      acLblSoilType: "Soil Type",
      acLblSoilPh: "Soil pH",
      acLblFertility: "Soil Fertility",
      acLblN: "Nitrogen (N)",
      acLblP: "Phosphorus (P)",
      acLblK: "Potassium (K)",
      acLblIrr: "Irrigation Facility",
      acLblLand: "Land Size",
      acLblCurCrop: "Current Crop",
      acLblPrevCrop: "Previous Crop Grown",
      acLblCompost: "Compost Availability",
      acLblChem: "Chemical Fertilizer Availability",
      acLblBudget: "Budget (₹)",
      acLblLabour: "Labour (₹)",
      acLblSelling: "Selling Preference",
      acPhDistrict: "e.g. Vidisha",
      acPhVillage: "e.g. Karera",
      acPhPin: "6-digit PIN",
      acRank: "Rank",
      acRiskLbl: "Risk",
      acWater: "water",
      acAiMatch: "AI match",
      acInvestment: "Investment",
      acProfit: "Profit",
      acYield: "Yield",
      acRoi: "ROI",
      // Soil booking modal
      acSbTitle: "Soil Testing Booking",
      acSbSubtitle: "Book a professional soil testing visit for your farm",
      acSbFullName: "Full Name",
      acSbFullNamePh: "Enter full name",
      acSbMobile: "Mobile Number",
      acSbState: "State",
      acSbStatePh: "Enter state",
      acSbDistrict: "District",
      acSbDistrictPh: "Enter district",
      acSbVillage: "Village",
      acSbVillagePh: "Enter village",
      acSbPin: "Pin Code",
      acSbPinPh: "Enter pin code",
      acSbAddress: "Full Address",
      acSbAddressPh: "Enter complete address",
      acSbFarmSize: "Farm Size (Acres)",
      acSbFarmSizePh: "Example: 5",
      acSbCrop: "Primary Crop",
      acSbCropPh: "Wheat / Rice / Cotton",
      acSbDate: "Preferred Date",
      acSbTime: "Preferred Time",
      acSbSelectSlot: "Select Slot",
      acSbSlotMorning: "Morning (6 AM - 12 PM)",
      acSbSlotAfternoon: "Afternoon (12 PM - 4 PM)",
      acSbSlotEvening: "Evening (4 PM - 8 PM)",
      acSbSlotNight: "Night (After 8 PM)",
      acSbSubmit: "Book Soil Testing Slot",
      // Existing slots / report
      acNoBookings: "No bookings available",
      acSlotTitle: "Soil Testing Slot",
      acStatusBooked: "Booked",
      acStatusCancelled: "Cancelled",
      acStepConfirmed: "Booking Confirmed",
      acStepPending: "Technician Assignment Pending",
      acStepReport: "Soil Report Awaited",
      acStepCancelled: "Booking Successfully Cancelled",
      acViewReport: "View Soil Report",
      acCancelBooking: "Cancel Booking",
      acReportTitle: "Soil Testing Report",
      acReportSub: "AI-powered soil analytics & smart farming insights",
      acAlertBooked:
        "Your soil testing slot has been booked successfully on {date} during {time}.",
      acConfirmCancel: "Are you sure you want to cancel this booking?",
      acReportAlert: "Soil reports will be shown after the technician visit.",

      // Ask Expert module
      aePageTitle: "Ask Expert",
      aeHeading: "Ask Expert",
      aeSubtitle: "Get guidance from agricultural experts — chat, photos, voice & more.",
      aeNewConsultation: "New Consultation",
      aePreviousConsultations: "Previous Consultations",
      aeNoConsultations: "No consultations yet. Start a new one!",
      aeCropName: "Crop Name",
      aeCropNamePh: "e.g. Soybean, Wheat, Tomato",
      aeProblemCategory: "Problem Category",
      aeDescription: "Description",
      aeDescriptionPh: "Describe the problem in detail...",
      aeCropPhotos: "Crop Photos",
      aeAddPhotos: "Add Photos",
      aeCamera: "Camera",
      aeGallery: "Gallery",
      aeVoiceNote: "Voice Note (optional)",
      aeRecordVoice: "Record Voice",
      aeStopRecording: "Stop Recording",
      aeUploadAudio: "Upload Audio",
      aeSubmit: "Submit Consultation",
      aeCancel: "Cancel",
      aeBackToList: "Back",
      aeChatPlaceholder: "Type your message...",
      aeSend: "Send",
      aeAttach: "Attach",
      aeAIThinking: "AI is analyzing your problem...",
      aeAIResponse: "AI Preliminary Response",
      aePossibleIssue: "Possible Issue",
      aeSuggestedAction: "Suggested Action",
      aeWaitingExpert: "Waiting for an expert to reply...",
      aeStatusWaiting: "Waiting for Reply",
      aeStatusReplied: "Expert Replied",
      aeStatusResolved: "Resolved",
      aeYou: "You",
      aeAI: "AI Assistant",
      aeExpert: "Expert",
      aeFormError: "Please fill crop name, category and description.",
      aeFormErrorCropCat: "Please enter crop name and select a category.",
      aeOptional: "(optional)",
      aeNoDescInfo: "No detailed description provided. Expert will still analyze based on crop and category.",
      // Expert guidance + Expert Video Advice
      aeExpertGuidance: "Expert Guidance",
      aeExpertDemoReply: "Based on our expert review of your {crop} ({category}) issue: maintain proper field drainage, remove visibly affected parts, and apply the recommended treatment in the early morning. A specialist will follow up shortly with a detailed plan.",
      aeVideoHeading: "Expert Video Advice",
      aeVideoSubtitle: "Watch short advisory videos from our agriculture experts.",
      aeVideoUnavailable: "Expert video coming soon.",
      aeVideoPlay: "Play",
      aeVideoPause: "Pause",
      // Problem categories
      aeCatDisease: "Disease",
      aeCatPest: "Pest Attack",
      aeCatFertilizer: "Fertilizer",
      aeCatIrrigation: "Irrigation",
      aeCatSoil: "Soil Problem",
      aeCatWeather: "Weather Damage",
      aeCatYield: "Low Yield",
      aeCatOther: "Other",
    },

    hi: {
      // Sidebar / nav
      dashboard: "डैशबोर्ड",
      aiCropAdvisor: "मिट्टी और फसल जानकारी",
      askExpert: "विशेषज्ञ से पूछें",
      community: "समुदाय",
      govSchemes: "सरकारी योजनाएं",
      profile: "प्रोफाइल",
      logout: "लॉगआउट",
      login: "लॉगिन",
      signup: "साइन अप",
      // Dashboard greeting + profile labels (new)
      welcome: "स्वागत है",
      welcomePrefix: "स्वागत है",
      profileDetails: "प्रोफ़ाइल विवरण",
      uploadPhoto: "फोटो अपलोड करें",
      changePhoto: "फोटो बदलें",
      mobileNumber: "मोबाइल नंबर",
      mobile: "मोबाइल नंबर",
      email: "ईमेल",
      villageLbl: "गांव",
      districtLbl: "जिला",
      stateLbl: "राज्य",
      rewardPoints: "रिवॉर्ड पॉइंट्स",
      farmerSinceLbl: "किसान बने",
      notAvailable: "उपलब्ध नहीं",
      farmPerfDynamic: "{village} में आपका खेत इस सीज़न में औसत से 18% बेहतर प्रदर्शन कर रहा है।",

      // Navbar
      platformTagline: "भूमिवेद प्लेटफ़ॉर्म",
      notifications: "सूचनाएं",
      newCount: "नई",

      // Home / dashboard
      totalAcres: "कुल 12 एकड़",
      field: "खेत",
      hybrid: "हाइब्रिड",
      risk: "जोखिम",
      low: "कम",
      medium: "मध्यम",
      high: "उच्च",
      ago: "पहले",
      revenue: "राजस्व",
      cost: "लागत",
      goodMorning: "सुप्रभात",
      welcomeBack: "वापसी पर स्वागत है, राजेंद्र!",
      farmPerformance: "विदिशा में आपका खेत इस सीज़न में औसत से 18% बेहतर प्रदर्शन कर रहा है।",
      aiAdvice: "AI सलाह लें",
      viewReport: "रिपोर्ट देखें",
      currentWeather: "मौसम",
      weatherStatus: "आंशिक धूप · भोपाल, म.प्र.",
      soilHealth: "मिट्टी की गुणवत्ता",
      marketTrends: "बाज़ार मूल्य ट्रेंड",
      aiTopPicks: "AI फसल सुझाव",
      profitPrediction: "लाभ अनुमान",
      recentActivity: "हाल की गतिविधि",
      activeCrops: "सक्रिय फसलें",
      soilScore: "मिट्टी स्कोर",
      humidity: "नमी",
      wind: "हवा",
      rain: "बारिश",
      good: "अच्छा",
      addNitrogen: "अगली सिंचाई से पहले खेत में 20kg नाइट्रोजन खाद डालें",
      match: "मिलान",

      // Community page
      communityTitle: "किसान समुदाय",
      communitySubtitle: "जुड़ें, साझा करें और साथ मिलकर बढ़ें",
      searchPosts: "पोस्ट खोजें...",
      composerPlaceholder: "अपना कृषि अनुभव, सुझाव साझा करें या प्रश्न पूछें...",
      photo: "फ़ोटो",
      location: "स्थान",
      post: "पोस्ट करें",
      trendingTopics: "चर्चित विषय",
      askExperts: "विशेषज्ञ से पूछें",
      askQuestionBtn: "+ प्रश्न पूछें",
      topFarmers: "शीर्ष किसान",
      follow: "फ़ॉलो",
      awaitingExpert: "विशेषज्ञ की प्रतीक्षा",
      answers: "उत्तर",
      posts: "पोस्ट",
      pts: "अंक",

      // Schemes page
      schemesTitle: "सरकारी योजनाएं",
      schemesSubtitle: "अपनी पात्र योजनाएं ढूंढें और सीधे आवेदन करें",
      searchSchemes: "योजनाएं खोजें...",
      catAll: "सभी",
      catFinancial: "वित्तीय सहायता",
      catInsurance: "बीमा",
      catAdvisory: "सलाहकार",
      catInfrastructure: "अवसंरचना",
      eligible: "पात्र",
      notEligible: "अपात्र",
      appliedTag: "आवेदित",
      benefit: "लाभ",
      deadline: "अंतिम तिथि",
      applyNow: "अभी आवेदन करें",
      noSchemes: "आपके फ़िल्टर से मेल खाती कोई योजना नहीं।",

      // Profile page
      profileLocation: "विदिशा, मध्य प्रदेश",
      acres12: "12 एकड़",
      farmerSince: "2012 से किसान",
      points2390: "2,390 अंक",
      editProfile: "प्रोफ़ाइल संपादित करें",
      farmDetails: "खेत विवरण",
      productivityStats: "उत्पादकता आँकड़े",
      achievements: "उपलब्धियाँ",
      editProfileTitle: "प्रोफ़ाइल संपादित करें",
      cancel: "रद्द करें",
      saveChanges: "परिवर्तन सहेजें",
      landSize: "भूमि का आकार",
      landSizeVal: "12 एकड़",
      soilType: "मिट्टी का प्रकार",
      soilTypeVal: "काली कपास",
      waterSource: "जल स्रोत",
      waterSourceVal: "बोरवेल + नहर",
      locationLbl: "स्थान",
      locationVal: "विदिशा, म.प्र.",
      cropsGrown: "उगाई गई फसलें",
      cropsGrownVal: "गेहूं, सोयाबीन",
      season: "सीज़न",
      seasonVal: "खरीफ + रबी",
      yieldIncrease: "उपज में वृद्धि",
      annualRevenue: "वार्षिक आय",
      waterSavings: "जल बचत",
      aiAccuracy: "AI सटीकता",
      badgeTopFarmer: "शीर्ष किसान",
      badgeTopFarmerDesc: "मई 2025 का सप्ताह",
      badgeHarvest: "फसल विशेषज्ञ",
      badgeHarvestDesc: "3 सफल फसलें",
      badgeWater: "जल संरक्षक",
      badgeWaterDesc: "औसत से 20% कम",
      badgeAI: "AI अग्रदूत",
      badgeAIDesc: "पहले 1000 AI उपयोगकर्ता",
      badgeCommunity: "समुदाय सितारा",
      badgeCommunityDesc: "100+ सहायक पोस्ट",
      badgeData: "डेटा संचालित",
      badgeDataDesc: "30 दिन ट्रैक किए",
      fullName: "पूरा नाम",
      fullNameVal: "राजेंद्र जाटव",
      landSizeAcres: "भूमि आकार (एकड़)",
      primaryCrop: "मुख्य फसल",
      primaryCropVal: "गेहूं, सोयाबीन",

      // ===== AI Crop Advisor =====
      acPageTitle: "मिट्टी जांच और AI सिफारिश",
      acPageSubtitle: "जारी रखने के लिए सेवा चुनें",
      acSoilTesting: "मिट्टी जांच",
      acSoilTestingDesc:
        "बेहतर फसल उत्पादकता और सटीक सिफारिशों के लिए अपनी मिट्टी की पेशेवर जांच करवाएं।",
      acBookSlot: "स्लॉट बुक करें",
      acMySlots: "मेरे मिट्टी जांच स्लॉट",
      acAiRec: "AI फसल सिफारिश",
      acAiRecDesc:
        "मिट्टी प्रकार, निवेश, मौसम और श्रम स्थिति के आधार पर AI-आधारित फसल सुझाव प्राप्त करें।",
      acContinue: "आगे बढ़ें",
      acAiRecHeader: "AI फसल सिफारिश",
      acAiRecSub:
        "GPS से स्थान और Google Weather API से मौसम स्वतः भर दिए गए हैं। समीक्षा करें, ज़रूरत हो तो बदलें, फिर AI सुझाव प्राप्त करें।",
      acReadyTitle: "AI विश्लेषण के लिए तैयार",
      acReadyDesc:
        "फॉर्म की समीक्षा करें, ज़रूरत हो तो बदलें, फिर व्यक्तिगत सिफारिशें प्राप्त करें।",
      acGetRec: "AI सिफारिश प्राप्त करें",
      acAnalysing: "विश्लेषण हो रहा है…",
      acFetching: "GPS और Google Weather प्राप्त किया जा रहा है…",
      acFetched: "GPS और Google Weather डेटा प्राप्त हुआ",
      acAnalysisComplete: "AI विश्लेषण पूर्ण",
      acAuto: "स्वतः",
      acAutoFromGps: "GPS से स्वतः प्राप्त",
      acGoogleWeather: "Google Weather API",
      acSecLocation: "स्थान",
      acSecWeather: "मौसम और जलवायु",
      acSecSoil: "मिट्टी और खेत विवरण",
      acSecCrop: "फसल संबंधी जानकारी",
      acSecInvest: "निवेश",
      acLblState: "राज्य",
      acLblDistrict: "ज़िला",
      acLblVillage: "गाँव",
      acLblPin: "पिन कोड",
      acLblTemp: "तापमान (°C)",
      acLblHumidity: "नमी (%)",
      acLblSeason: "मौसम",
      acLblRainfall: "वार्षिक वर्षा",
      acLblMm: "मिमी",
      acLblFlood: "बाढ़ / सूखा इतिहास",
      acLblSoilType: "मिट्टी का प्रकार",
      acLblSoilPh: "मिट्टी pH",
      acLblFertility: "मिट्टी उर्वरता",
      acLblN: "नाइट्रोजन (N)",
      acLblP: "फॉस्फोरस (P)",
      acLblK: "पोटैशियम (K)",
      acLblIrr: "सिंचाई सुविधा",
      acLblLand: "भूमि का आकार",
      acLblCurCrop: "वर्तमान फसल",
      acLblPrevCrop: "पिछली फसल",
      acLblCompost: "खाद उपलब्धता",
      acLblChem: "रासायनिक उर्वरक उपलब्धता",
      acLblBudget: "बजट (₹)",
      acLblLabour: "श्रम (₹)",
      acLblSelling: "विक्रय प्राथमिकता",
      acPhDistrict: "जैसे विदिशा",
      acPhVillage: "जैसे करेरा",
      acPhPin: "6 अंकों का पिन",
      acRank: "रैंक",
      acRiskLbl: "जोखिम",
      acWater: "पानी",
      acAiMatch: "AI मिलान",
      acInvestment: "निवेश",
      acProfit: "लाभ",
      acYield: "उपज",
      acRoi: "लाभ अनुपात",
      // Soil booking modal
      acSbTitle: "मिट्टी जांच बुकिंग",
      acSbSubtitle: "अपने खेत के लिए पेशेवर मिट्टी जांच विज़िट बुक करें",
      acSbFullName: "पूरा नाम",
      acSbFullNamePh: "पूरा नाम दर्ज करें",
      acSbMobile: "मोबाइल नंबर",
      acSbState: "राज्य",
      acSbStatePh: "राज्य दर्ज करें",
      acSbDistrict: "ज़िला",
      acSbDistrictPh: "ज़िला दर्ज करें",
      acSbVillage: "गाँव",
      acSbVillagePh: "गाँव दर्ज करें",
      acSbPin: "पिन कोड",
      acSbPinPh: "पिन कोड दर्ज करें",
      acSbAddress: "पूरा पता",
      acSbAddressPh: "पूरा पता दर्ज करें",
      acSbFarmSize: "खेत का आकार (एकड़)",
      acSbFarmSizePh: "उदाहरण: 5",
      acSbCrop: "मुख्य फसल",
      acSbCropPh: "गेहूं / चावल / कपास",
      acSbDate: "पसंदीदा तिथि",
      acSbTime: "पसंदीदा समय",
      acSbSelectSlot: "स्लॉट चुनें",
      acSbSlotMorning: "सुबह (6 AM - 12 PM)",
      acSbSlotAfternoon: "दोपहर (12 PM - 4 PM)",
      acSbSlotEvening: "शाम (4 PM - 8 PM)",
      acSbSlotNight: "रात (8 PM के बाद)",
      acSbSubmit: "मिट्टी जांच स्लॉट बुक करें",
      // Existing slots / report
      acNoBookings: "कोई बुकिंग उपलब्ध नहीं",
      acSlotTitle: "मिट्टी जांच स्लॉट",
      acStatusBooked: "बुक",
      acStatusCancelled: "रद्द",
      acStepConfirmed: "बुकिंग पुष्टि",
      acStepPending: "तकनीशियन असाइनमेंट लंबित",
      acStepReport: "मिट्टी रिपोर्ट प्रतीक्षित",
      acStepCancelled: "बुकिंग सफलतापूर्वक रद्द",
      acViewReport: "मिट्टी रिपोर्ट देखें",
      acCancelBooking: "बुकिंग रद्द करें",
      acReportTitle: "मिट्टी जांच रिपोर्ट",
      acReportSub: "AI-आधारित मिट्टी विश्लेषण और स्मार्ट खेती अंतर्दृष्टि",
      acAlertBooked:
        "आपका मिट्टी जांच स्लॉट {date} को {time} के दौरान सफलतापूर्वक बुक हो गया है।",
      acConfirmCancel: "क्या आप वाकई इस बुकिंग को रद्द करना चाहते हैं?",
      acReportAlert: "तकनीशियन की विज़िट के बाद मिट्टी रिपोर्ट दिखाई जाएगी।",

      // Ask Expert module
      aePageTitle: "विशेषज्ञ से पूछें",
      aeHeading: "विशेषज्ञ से पूछें",
      aeSubtitle: "कृषि विशेषज्ञों से सलाह लें — चैट, फोटो, आवाज़ और बहुत कुछ।",
      aeNewConsultation: "नई सलाह",
      aePreviousConsultations: "पिछली सलाह",
      aeNoConsultations: "अभी तक कोई सलाह नहीं। नई सलाह शुरू करें!",
      aeCropName: "फसल का नाम",
      aeCropNamePh: "उदा. सोयाबीन, गेहूं, टमाटर",
      aeProblemCategory: "समस्या की श्रेणी",
      aeDescription: "विवरण",
      aeDescriptionPh: "समस्या को विस्तार से बताएं...",
      aeCropPhotos: "फसल की तस्वीरें",
      aeAddPhotos: "तस्वीरें जोड़ें",
      aeCamera: "कैमरा",
      aeGallery: "गैलरी",
      aeVoiceNote: "आवाज़ संदेश (वैकल्पिक)",
      aeRecordVoice: "आवाज़ रिकॉर्ड करें",
      aeStopRecording: "रिकॉर्डिंग रोकें",
      aeUploadAudio: "ऑडियो अपलोड करें",
      aeSubmit: "सलाह भेजें",
      aeCancel: "रद्द करें",
      aeBackToList: "वापस",
      aeChatPlaceholder: "अपना संदेश लिखें...",
      aeSend: "भेजें",
      aeAttach: "अटैच करें",
      aeAIThinking: "AI आपकी समस्या का विश्लेषण कर रहा है...",
      aeAIResponse: "AI प्रारंभिक उत्तर",
      aePossibleIssue: "संभावित समस्या",
      aeSuggestedAction: "सुझाव",
      aeWaitingExpert: "विशेषज्ञ के उत्तर की प्रतीक्षा है...",
      aeStatusWaiting: "उत्तर की प्रतीक्षा",
      aeStatusReplied: "विशेषज्ञ ने उत्तर दिया",
      aeStatusResolved: "समाधान हो गया",
      aeYou: "आप",
      aeAI: "AI सहायक",
      aeExpert: "विशेषज्ञ",
      aeFormError: "कृपया फसल का नाम, श्रेणी और विवरण भरें।",
      aeFormErrorCropCat: "कृपया फसल का नाम दर्ज करें और श्रेणी चुनें।",
      aeOptional: "(वैकल्पिक)",
      aeNoDescInfo: "कोई विस्तृत विवरण नहीं दिया गया है। विशेषज्ञ फसल और श्रेणी के आधार पर विश्लेषण करेंगे।",
      // Expert guidance + Expert Video Advice
      aeExpertGuidance: "विशेषज्ञ मार्गदर्शन",
      aeExpertDemoReply: "आपकी {crop} ({category}) समस्या की विशेषज्ञ समीक्षा के आधार पर: खेत की उचित जल निकासी बनाए रखें, स्पष्ट रूप से प्रभावित हिस्सों को हटाएं और सुझाई गई दवा सुबह जल्दी डालें। एक विशेषज्ञ शीघ्र ही विस्तृत योजना के साथ संपर्क करेगा।",
      aeVideoHeading: "विशेषज्ञ वीडियो सलाह",
      aeVideoSubtitle: "हमारे कृषि विशेषज्ञों के लघु सलाह वीडियो देखें।",
      aeVideoUnavailable: "विशेषज्ञ वीडियो जल्द आ रहा है।",
      aeVideoPlay: "चलाएं",
      aeVideoPause: "रोकें",
      // Problem categories
      aeCatDisease: "रोग",
      aeCatPest: "कीट आक्रमण",
      aeCatFertilizer: "उर्वरक",
      aeCatIrrigation: "सिंचाई",
      aeCatSoil: "मिट्टी की समस्या",
      aeCatWeather: "मौसम से नुकसान",
      aeCatYield: "कम उत्पादन",
      aeCatOther: "अन्य",
    },
  };

  /* ----------------------------------------------------------
     Phrase map for free-text data values (community posts,
     scheme names/descriptions, names, locations, etc.).
     Lookup by exact English string -> Hindi.
  ---------------------------------------------------------- */
  const phrases = {
    // ---- Community: people, places, times, tags ----
    "Ramesh Kumar": "रमेश कुमार",
    "Priya Sharma": "प्रिया शर्मा",
    "Arjun Mehta": "अर्जुन मेहता",
    "Mahesh Patel": "महेश पटेल",
    "Sunita Devi": "सुनीता देवी",
    "Arjun Singh": "अर्जुन सिंह",
    "Kavita Rao": "कविता राव",
    "Vidisha, MP": "विदिशा, म.प्र.",
    // Common villages / districts / states (for profile values)
    "Vidisha":"विदिशा","Bhopal":"भोपाल","Indore":"इंदौर","Sehore":"सीहोर","Hoshangabad":"होशंगाबाद",
    "Ujjain":"उज्जैन","Gwalior":"ग्वालियर","Jabalpur":"जबलपुर","Rewa":"रीवा","Satna":"सतना",
    "Sagar":"सागर","Dewas":"देवास","Ratlam":"रतलाम","Mandsaur":"मंदसौर","Khargone":"खरगोन",
    "Karera":"करेरा","Ganj Basoda":"गंज बासौदा","Sironj":"सिरोंज",
    "Delhi":"दिल्ली","Mumbai":"मुंबई","Pune":"पुणे","Nagpur":"नागपुर","Lucknow":"लखनऊ",
    "Jaipur":"जयपुर","Patna":"पटना","Ranchi":"रांची","Bhubaneswar":"भुवनेश्वर",
    "Hyderabad":"हैदराबाद","Chennai":"चेन्नई","Bengaluru":"बेंगलुरु","Bangalore":"बेंगलुरु",
    "Ahmedabad":"अहमदाबाद","Surat":"सूरत","Vadodara":"वडोदरा",
    "Madhya Pradesh":"मध्य प्रदेश","Uttar Pradesh":"उत्तर प्रदेश","Bihar":"बिहार",
    "Rajasthan":"राजस्थान","Maharashtra":"महाराष्ट्र","Karnataka":"कर्नाटक",
    "Tamil Nadu":"तमिलनाडु","Andhra Pradesh":"आंध्र प्रदेश","Telangana":"तेलंगाना",
    "Kerala":"केरल","Odisha":"ओडिशा","Jharkhand":"झारखंड","Chhattisgarh":"छत्तीसगढ़",
    "West Bengal":"पश्चिम बंगाल","Haryana":"हरियाणा","Himachal Pradesh":"हिमाचल प्रदेश",
    "Uttarakhand":"उत्तराखंड","Assam":"असम","Goa":"गोवा",
    // Crops
    "Wheat":"गेहूं","Rice":"चावल","Maize":"मक्का","Cotton":"कपास","Sugarcane":"गन्ना",
    "Mustard":"सरसों","Pulses":"दाल","Gram":"चना","Barley":"जौ","Bajra":"बाजरा",
    "Jowar":"ज्वार","Groundnut":"मूंगफली","Tomato":"टमाटर","Onion":"प्याज","Potato":"आलू",
    "Wheat, Soybean":"गेहूं, सोयाबीन",
    "Sehore, MP": "सेहोर, म.प्र.",
    "Hoshangabad, MP": "होशंगाबाद, म.प्र.",
    "Gujarat": "गुजरात",
    "Punjab": "पंजाब",
    "MP": "म.प्र.",
    "UP": "उ.प्र.",
    "AP": "आं.प्र.",
    "2h ago": "2 घंटे पहले",
    "5h ago": "5 घंटे पहले",
    "1d ago": "1 दिन पहले",

    // Tags
    "Soybean": "सोयाबीन",
    "Success": "सफलता",
    "BlackGram": "उड़द",
    "Disease": "रोग",
    "Help": "मदद",
    "SoilHealth": "मिट्टी स्वास्थ्य",
    "Technology": "तकनीक",

    // Post bodies
    "Just harvested my Soybean crop using BhoomiVeda recommendations — 28% higher yield than last year! The AI suggestion to switch to JS-335 variety was spot on":
      "भूमिवेद की सिफारिशों से सोयाबीन की फसल काटी — पिछले साल से 28% अधिक उपज! JS-335 किस्म में बदलने की AI सलाह बिल्कुल सही थी",
    "Anyone dealing with yellow mosaic virus in black gram this season? My plants are showing symptoms on 20% of field. Looking for organic treatment options before I try chemical intervention.":
      "क्या इस सीज़न उड़द में पीला मोज़ेक वायरस की समस्या किसी को है? 20% खेत में लक्षण दिख रहे हैं। रासायनिक उपचार से पहले जैविक विकल्प चाहिए।",
    "The new soil testing feature is incredible. Got my complete micro-nutrient report in 2 days vs 2 weeks at the local lab. Boron deficiency identified early — saved my wheat crop!":
      "नई मिट्टी जांच सुविधा कमाल की है। 2 हफ्तों के बजाय 2 दिन में पूरी सूक्ष्म-पोषक रिपोर्ट मिली। बोरॉन की कमी समय रहते पकड़ी — गेहूं की फसल बच गई!",

    // Trending topics
    "Kharif Sowing 2025": "खरीफ बुवाई 2025",
    "Organic Farming": "जैविक खेती",
    "PM Kisan Scheme": "पीएम किसान योजना",
    "Wheat MSP Increase": "गेहूं MSP वृद्धि",
    "Drip Irrigation": "ड्रिप सिंचाई",

    // Expert questions
    "How to increase wheat yield in black cotton soil?": "काली कपास मिट्टी में गेहूं की उपज कैसे बढ़ाएं?",
    "Organic solution for aphids in mustard crop?": "सरसों की फसल में माहू के लिए जैविक उपाय?",
    "Best irrigation schedule for drip in Kharif?": "खरीफ में ड्रिप के लिए सर्वोत्तम सिंचाई समय?",
    "Dr. R. Sharma": "डॉ. आर. शर्मा",
    "Agro Expert": "कृषि विशेषज्ञ",
    "Pending": "लंबित",

    // ---- Schemes ----
    "PM Kisan Samman Nidhi": "पीएम किसान सम्मान निधि",
    "Pradhan Mantri Fasal Bima Yojana": "प्रधानमंत्री फसल बीमा योजना",
    "Soil Health Card Scheme": "मृदा स्वास्थ्य कार्ड योजना",
    "Micro Irrigation Fund": "सूक्ष्म सिंचाई कोष",
    "Ministry of Agriculture": "कृषि मंत्रालय",
    "Dept. of Agriculture": "कृषि विभाग",
    "NABARD": "नाबार्ड",
    "₹6,000/year": "₹6,000/वर्ष",
    "Crop Insurance": "फसल बीमा",
    "Free Soil Testing": "मुफ्त मिट्टी जांच",
    "Up to ₹5 Lakh subsidy": "₹5 लाख तक सब्सिडी",
    "Ongoing": "चालू",
    "Direct income support of ₹6000 per year to small and marginal farmers in three equal instalments.":
      "छोटे और सीमांत किसानों को तीन समान किश्तों में ₹6000 प्रति वर्ष की प्रत्यक्ष आय सहायता।",
    "Comprehensive crop insurance scheme providing financial support in case of crop failure due to natural calamities.":
      "प्राकृतिक आपदाओं से फसल खराब होने पर वित्तीय सहायता प्रदान करने वाली व्यापक फसल बीमा योजना।",
    "Free soil health cards for farmers carrying crop-wise recommendations on nutrients and fertilizers.":
      "किसानों के लिए फसलवार पोषक तत्व और उर्वरक सिफारिशों सहित मुफ्त मृदा स्वास्थ्य कार्ड।",
    "Subsidy for drip and sprinkler irrigation systems to promote efficient water use in agriculture.":
      "कृषि में कुशल जल उपयोग को बढ़ावा देने के लिए ड्रिप और स्प्रिंकलर सिंचाई पर सब्सिडी।",

    // Soil telemetry & nutrients
    "Nitrogen": "नाइट्रोजन",
    "Phosphorus": "फॉस्फोरस",
    "Potassium": "पोटैशियम",
    "Organic": "जैविक कार्बन",

    // Crop picks
    "Soybean JS-335": "सोयाबीन JS-335",
    "Wheat GW-496 (Sharbati)": "गेहूं GW-496 (शरबती)",
    "Maize DKC-9144 (Hybrid)": "मक्का DKC-9144 (हाइब्रिड)",

    // Recent activity & notifications
    "AI recommended Soybean for Kharif season": "AI ने खरीफ सीजन के लिए सोयाबीन की सिफारिश की",
    "Irrigation scheduled for Field B — 6 AM tomorrow": "खेत B के लिए सिंचाई निर्धारित — कल सुबह 6 बजे",
    "Market prices updated — Wheat up 8%": "बाजार भाव अपडेट — गेहूं में 8% की तेजी",
    "You earned 'Top Farmer' recognition this week!": "आपको इस सप्ताह 'शीर्ष किसान' सम्मान मिला!",
    "Soil pH alert: Field A slightly acidic (5.8)": "मिट्टी pH चेतावनी: खेत A थोड़ा अम्लीय (5.8)",
    "Rain alert": "बारिश की चेतावनी",
    "Heavy rainfall expected in 48 hours": "48 घंटों में भारी बारिश की संभावना",
    "Price surge": "कीमतों में उछाल",
    "Soybean prices up 12% at Bhopal mandi": "भोपाल मंडी में सोयाबीन के दाम 12% बढ़े",
    "New scheme": "नई योजना",
    "PM Kisan 14th installment released": "पीएम किसान की 14वीं किस्त जारी",
    "Crop advice": "फसल सलाह",
    "Optimal sowing window starts next week": "बुवाई का सही समय अगले सप्ताह शुरू होगा",
  };

  const BV_I18N = {
    lang: localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG,
    translations,
    phrases,

    /** Translate a known key. Falls back: lang -> en -> key. */
    t(key) {
      const l = this.lang;
      return (
        (translations[l] && translations[l][key]) ||
        (translations.en && translations.en[key]) ||
        key
      );
    },

    /** Translate a raw English data string via the phrases map.
     *  Returns the original string when no mapping exists.
     *  In English mode always returns the original. */
    tr(text) {
      if (text == null) return text;
      if (this.lang === "en") return text;
      return phrases[text] || text;
    },

    set(lang) {
      if (!translations[lang]) return;
      const changed = this.lang !== lang;
      this.lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.setAttribute("lang", lang);
      this.apply();
      this._syncSwitchers();
      window.dispatchEvent(new CustomEvent("bv-language-changed", { detail: { lang } }));
      if (changed) setTimeout(() => window.location.reload(), 50);
    },

    apply(root) {
      const scope = root || document;

      scope.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        el.innerHTML = this.t(key);
      });

      scope.querySelectorAll("[data-i18n-attr]").forEach((el) => {
        el.getAttribute("data-i18n-attr")
          .split(",")
          .forEach((pair) => {
            const [attr, key] = pair.split(":").map((s) => s.trim());
            if (attr && key) el.setAttribute(attr, this.t(key));
          });
      });

      const titleKey = document.body && document.body.dataset.pageTitleKey;
      const titleEl = scope.getElementById && scope.getElementById("bv-page-title");
      if (titleKey && titleEl) titleEl.textContent = this.t(titleKey);
    },

    /** Future backend hook: merges remote {en,hi,phrases} over local. */
    async loadFrom(url) {
      try {
        const remote = await fetch(url).then((r) => r.json());
        for (const lang of Object.keys(remote || {})) {
          if (lang === "phrases") {
            Object.assign(phrases, remote.phrases || {});
          } else {
            translations[lang] = Object.assign(translations[lang] || {}, remote[lang]);
          }
        }
        this.apply();
      } catch (err) {
        console.warn("BV_I18N.loadFrom failed:", err);
      }
    },

    _syncSwitchers() {
      document.querySelectorAll(".bv-lang-switcher").forEach((sel) => {
        if (sel.value !== this.lang) sel.value = this.lang;
      });
    },

    _wireSwitchers() {
      document.querySelectorAll(".bv-lang-switcher").forEach((sel) => {
        if (sel.dataset.bvWired) return;
        sel.dataset.bvWired = "1";
        sel.value = this.lang;
        sel.addEventListener("change", (e) => this.set(e.target.value));
      });
    },
  };

  /* ----------------------------------------------------------
     Name transliteration: English (Latin) -> Devanagari (Hindi).
     Used for displaying user names in Hindi without mutating
     stored data. Strategy:
       1. Whole-word dictionary of common Indian first/last names.
       2. Syllable fallback (digraphs first, then single letters).
     This is intentionally pragmatic, not linguistically perfect.
  ---------------------------------------------------------- */
  const nameDict = {
    // First names
    "amit":"अमित","amita":"अमिता","anita":"अनीता","anil":"अनिल","arjun":"अर्जुन","arun":"अरुण",
    "ashok":"अशोक","ajay":"अजय","akash":"आकाश","abhishek":"अभिषेक","aman":"अमन",
    "deepak":"दीपक","dinesh":"दिनेश","dipa":"दीपा","divya":"दिव्या",
    "gita":"गीता","geeta":"गीता","gopal":"गोपाल","ganesh":"गणेश",
    "hari":"हरि","hemant":"हेमंत",
    "jyoti":"ज्योति","jatin":"जतिन",
    "kavita":"कविता","kiran":"किरण","krishna":"कृष्ण","kamla":"कमला","kumar":"कुमार","kumari":"कुमारी",
    "lakshmi":"लक्ष्मी","laxmi":"लक्ष्मी","lalit":"ललित",
    "manoj":"मनोज","mahesh":"महेश","meena":"मीना","mohan":"मोहन","mukesh":"मुकेश","manish":"मनीष",
    "neha":"नेहा","nitin":"नितिन","nisha":"निशा","naresh":"नरेश",
    "om":"ओम","omkar":"ओंकार",
    "pooja":"पूजा","puja":"पूजा","priya":"प्रिया","priyanka":"प्रियंका","prakash":"प्रकाश","pankaj":"पंकज","preeti":"प्रीति",
    "raj":"राज","raju":"राजू","rajesh":"राजेश","rajendra":"राजेन्द्र","ram":"राम","ramesh":"रमेश","rohit":"रोहित","ravi":"रवि","rekha":"रेखा","ritu":"रितु","rakesh":"राकेश",
    "sanjay":"संजय","santosh":"संतोष","seema":"सीमा","shanti":"शांति","shyam":"श्याम","sita":"सीता","sonia":"सोनिया","sonu":"सोनू","sunil":"सुनील","suresh":"सुरेश","sunita":"सुनीता","sushil":"सुशील","shiv":"शिव","shilpa":"शिल्पा",
    "uma":"उमा","umesh":"उमेश","usha":"उषा",
    "vijay":"विजय","vikas":"विकास","vinod":"विनोद","vivek":"विवेक","vandana":"वंदना",
    // Last names / castes
    "sharma":"शर्मा","singh":"सिंह","yadav":"यादव","patel":"पटेल","mehta":"मेहता","kumar":"कुमार",
    "verma":"वर्मा","gupta":"गुप्ता","jatav":"जाटव","das":"दास","devi":"देवी","prasad":"प्रसाद",
    "tiwari":"तिवारी","mishra":"मिश्रा","pandey":"पांडे","chaudhary":"चौधरी","choudhary":"चौधरी",
    "rao":"राव","reddy":"रेड्डी","nair":"नायर","menon":"मेनन","kapoor":"कपूर","khan":"खान",
    "ahmed":"अहमद","ali":"अली","banerjee":"बनर्जी","chakraborty":"चक्रवर्ती","ghosh":"घोष","sen":"सेन",
    "shah":"शाह","jain":"जैन","agarwal":"अग्रवाल","agrawal":"अग्रवाल","bhardwaj":"भारद्वाज",
    "thakur":"ठाकुर","rajput":"राजपूत","saini":"सैनी","chauhan":"चौहान","rathore":"राठौर",
    "kisan":"किसान",
  };

  // Digraphs / trigraphs first (order matters — longest match first)
  const translitMap = [
    ["sh","श"],["ch","च"],["th","थ"],["ph","फ"],["bh","भ"],["dh","ध"],["gh","घ"],
    ["jh","झ"],["kh","ख"],["ng","ंग"],
    ["aa","ा"],["ee","ी"],["ii","ी"],["oo","ू"],["uu","ू"],["ai","ै"],["au","औ"],
    ["a","ा"],["e","े"],["i","ि"],["o","ो"],["u","ु"],
    ["k","क"],["g","ग"],["c","क"],["j","ज"],["t","त"],["d","द"],["n","न"],["p","प"],
    ["b","ब"],["m","म"],["y","य"],["r","र"],["l","ल"],["v","व"],["w","व"],["s","स"],["h","ह"],["z","ज़"],["f","फ"],["q","क"],["x","क्स"],
  ];
  const vowelSigns = new Set(["ा","ि","ी","ु","ू","े","ै","ो","ौ"]);
  const vowelStandalone = { "ा":"आ","ि":"इ","ी":"ई","ु":"उ","ू":"ऊ","े":"ए","ै":"ऐ","ो":"ओ","ौ":"औ" };

  function translitWord(word) {
    if (!word) return word;
    const lower = word.toLowerCase();
    if (nameDict[lower]) return nameDict[lower];
    let s = lower;
    let out = "";
    let prevWasConsonant = false;
    let atStart = true;
    while (s.length) {
      let matched = null;
      for (const [k, v] of translitMap) {
        if (s.startsWith(k)) { matched = [k, v]; break; }
      }
      if (!matched) { out += s[0]; s = s.slice(1); atStart = false; prevWasConsonant = false; continue; }
      const [k, v] = matched;
      const isVowelSign = vowelSigns.has(v);
      if (isVowelSign) {
        if (atStart || !prevWasConsonant) {
          out += vowelStandalone[v] || v;
        } else {
          out += v;
        }
        prevWasConsonant = false;
      } else {
        // consonant: if previous was also a consonant, add virama (halant)
        if (prevWasConsonant) out += "्";
        out += v;
        prevWasConsonant = true;
      }
      s = s.slice(k.length);
      atStart = false;
    }
    // trailing consonant: add implicit 'a' visually (skip — Hindi convention drops it)
    return out;
  }

  BV_I18N.translit = function (name) {
    if (!name) return name;
    return String(name).split(/(\s+)/).map((tok) =>
      /^\s+$/.test(tok) ? tok : translitWord(tok)
    ).join("");
  };

  /** Display a user name in the current language. English: as-is.
   *  Hindi: dictionary -> transliteration fallback. */
  BV_I18N.tName = function (name) {
    if (!name) return name;
    if (this.lang !== "hi") return name;
    return this.translit(name);
  };

  /** Display arbitrary user-entered text (village/district/state).
   *  Looks up the phrases dictionary; falls back to the original. */
  BV_I18N.tValue = function (text) {
    if (text == null || text === "") return text;
    if (this.lang !== "hi") return text;
    return phrases[text] || phrases[String(text).trim()] || text;
  };

  /** Localized "Not Available" placeholder. */
  BV_I18N.naLabel = function () {
    return this.lang === "hi" ? "उपलब्ध नहीं" : "Not Available";
  };

  window.BV_I18N = BV_I18N;
  window.translations = translations;
  window.changeLanguage = (lang) => BV_I18N.set(lang);

  function init() {
    document.documentElement.setAttribute("lang", BV_I18N.lang);
    BV_I18N.apply();
    BV_I18N._wireSwitchers();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("bv-shell-ready", () => {
    BV_I18N.apply();
    BV_I18N._wireSwitchers();
  });
})();
