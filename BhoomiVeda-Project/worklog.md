---
Task ID: 1
Agent: Main Agent
Task: Build complete BhoomiVeda backend + frontend

Work Log:
- Analyzed uploaded auth.html/auth.js/auth.css (BhoomiVeda login/signup with OTP)
- Analyzed uploaded zipbhumiveda (BhoomiVeda dashboard - React/Vite with recharts)
- Designed Prisma schema: User, Otp, Session, FarmProfile, Activity, Notification, CommunityPost, CommunityLike
- Created auth utility (src/lib/auth.ts) with session management, OTP generation
- Created all Auth API routes: send-otp, verify-otp, signup, login, me, logout
- Created all Dashboard API routes: stats, weather, market, soil, notifications, activity, community, community/like
- Created AI Crop Recommendation API (POST /api/ai/crop-recommendation) with dynamic logic
- Created Seed API for demo data
- Created Zustand auth store (src/lib/store.ts)
- Created Auth Page component with login/signup OTP flow
- Created Dashboard Layout with sidebar navigation
- Created Dashboard Home with weather, soil, market charts
- Created AI Crop Recommendation page with detailed results
- Created Community page with like functionality
- Created Schemes page with government schemes
- Created Profile page with farm profile editing
- Updated main page.tsx with auth-based routing
- Updated layout.tsx with Google Fonts
- Fixed lint errors

Stage Summary:
- Full backend with SQLite/Prisma database (10 API routes)
- Full frontend with 5 dashboard pages + auth page
- OTP-based authentication with session management
- AI crop recommendation engine with season/soil/budget logic
- Community features with like/unlike
- All APIs return real data from database
- Demo OTP shown in response for testing
