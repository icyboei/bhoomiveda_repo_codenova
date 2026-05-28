'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/lib/store';
import { Loader2, Shield, Eye, EyeOff, Phone, Lock, User, Sprout } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const { login, signup, sendOtp, verifyOtp, loading } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login state
  const [loginMobile, setLoginMobile] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpVerified, setLoginOtpVerified] = useState(false);
  const [loginDemoOtp, setLoginDemoOtp] = useState('');
  const [loginTerms, setLoginTerms] = useState(true);

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState('farmer');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupOtp, setSignupOtp] = useState('');
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtpVerified, setSignupOtpVerified] = useState(false);
  const [signupDemoOtp, setSignupDemoOtp] = useState('');
  const [signupTerms, setSignupTerms] = useState(false);

  // Resend timer
  const [loginResendTimer, setLoginResendTimer] = useState(0);
  const [signupResendTimer, setSignupResendTimer] = useState(0);

  // Mobile-only input
  const handleMobileInput = useCallback((val: string, setter: (v: string) => void) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setter(cleaned);
  }, []);

  // Resend timer effect
  useEffect(() => {
    if (loginResendTimer > 0) {
      const t = setTimeout(() => setLoginResendTimer(loginResendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [loginResendTimer]);

  useEffect(() => {
    if (signupResendTimer > 0) {
      const t = setTimeout(() => setSignupResendTimer(signupResendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [signupResendTimer]);

  // Login: Send OTP
  const handleLoginSendOtp = async () => {
    if (loginMobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    const result = await sendOtp(loginMobile, 'login');
    if (result.success) {
      setLoginOtpSent(true);
      setLoginDemoOtp(result.otp || '');
      setLoginResendTimer(60);
      toast.success('OTP sent successfully!');
    } else {
      toast.error(result.error || 'Failed to send OTP');
    }
  };

  // Login: Verify OTP
  const handleLoginVerifyOtp = async () => {
    if (loginOtp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    const result = await verifyOtp(loginMobile, loginOtp, 'login');
    if (result.success) {
      setLoginOtpVerified(true);
      toast.success('OTP verified!');
    } else {
      toast.error(result.error || 'OTP verification failed');
    }
  };

  // Login: Submit
  const handleLogin = async () => {
    if (!loginTerms) {
      toast.error('Please accept the Terms & Conditions');
      return;
    }
    if (!loginOtpVerified) {
      toast.error('Please verify your OTP first');
      return;
    }
    const result = await login(loginMobile, loginOtp);
    if (result.success) {
      toast.success('Welcome back to BhoomiVeda!');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  // Signup: Send OTP
  const handleSignupSendOtp = async () => {
    if (signupMobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    const result = await sendOtp(signupMobile, 'signup');
    if (result.success) {
      setSignupOtpSent(true);
      setSignupDemoOtp(result.otp || '');
      setSignupResendTimer(60);
      toast.success('OTP sent successfully!');
    } else {
      toast.error(result.error || 'Failed to send OTP');
    }
  };

  // Signup: Verify OTP
  const handleSignupVerifyOtp = async () => {
    if (signupOtp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    const result = await verifyOtp(signupMobile, signupOtp, 'signup');
    if (result.success) {
      setSignupOtpVerified(true);
      toast.success('OTP verified!');
    } else {
      toast.error(result.error || 'OTP verification failed');
    }
  };

  // Signup: Create Account
  const handleSignup = async () => {
    if (!signupName || signupName.length < 2) {
      toast.error('Please enter your full name');
      return;
    }
    if (!signupTerms) {
      toast.error('Please accept the Terms & Conditions');
      return;
    }
    if (!signupOtpVerified) {
      toast.error('Please verify your OTP first');
      return;
    }
    const result = await signup(signupName, signupMobile, signupRole, signupOtp);
    if (result.success) {
      toast.success('Account created! Welcome to BhoomiVeda!');
    } else {
      toast.error(result.error || 'Signup failed');
    }
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] flex flex-col"
      style={{
        background:
          "linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat",
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Green info bar */}
      <div className="bg-[#3d6d3c] text-white text-center py-3 px-4 text-sm md:text-base font-hindi">
        BhoomiVeda किसानों को मौसम, मिट्टी और बाजार के अनुसार स्मार्ट सुझाव प्रदान करता है।
      </div>

      {/* Main auth area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-[470px] bg-white rounded-2xl p-6 md:p-10 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src="/bhoomi-logo.png"
              alt="BhoomiVeda"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-200 p-1 mx-auto object-cover"
            />
            <h2 className="text-2xl md:text-3xl mt-3 text-gray-900">
              Bhoomi<span className="text-[#2fb26d]">Veda</span>
            </h2>
            <div className="inline-block mt-2 bg-[#edf7ee] text-[#2d6a4f] px-4 py-1.5 rounded-full text-xs font-semibold">
              AI Powered
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-full mb-6">
            <button
              className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-[#1f8a43] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'signup'
                  ? 'bg-[#1f8a43] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Signup
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Log in</h3>
              <p className="text-gray-500 mb-6 font-hindi text-sm md:text-base">
                अपने BhoomiVeda अकाउंट में लॉगिन करें
              </p>

              {/* Mobile */}
              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700 font-hindi">
                  मोबाइल नंबर
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={loginMobile}
                    onChange={(e) => handleMobileInput(e.target.value, setLoginMobile)}
                    placeholder="मोबाइल नंबर दर्ज करें"
                    inputMode="numeric"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#2fb26d] focus:ring-4 focus:ring-[#2fb26d]/10 outline-none text-sm transition-all"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* OTP */}
              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700 font-hindi">
                  OTP
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6 अंकों का OTP"
                      inputMode="numeric"
                      disabled={!loginOtpSent}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#2fb26d] focus:ring-4 focus:ring-[#2fb26d]/10 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-400"
                      maxLength={6}
                    />
                  </div>
                  <button
                    onClick={handleLoginSendOtp}
                    disabled={loginMobile.length !== 10 || loading || loginResendTimer > 0}
                    className="flex-shrink-0 bg-[#2d6a4f] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#245a42] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 min-w-[110px]"
                  >
                    {loading && !loginOtpVerified ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    {loginOtpSent && loginResendTimer > 0
                      ? `${loginResendTimer}s`
                      : loginOtpSent
                        ? 'Resend'
                        : 'Send OTP'}
                  </button>
                </div>
                {loginDemoOtp && loginOtpSent && (
                  <div className="mt-2 flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <Shield className="h-3.5 w-3.5" />
                    OTP for demo: {loginDemoOtp}
                  </div>
                )}
                {loginOtpVerified && (
                  <div className="mt-2 flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    ✓ OTP Verified
                  </div>
                )}
              </div>

              {/* Verify OTP button */}
              {loginOtpSent && !loginOtpVerified && (
                <button
                  onClick={handleLoginVerifyOtp}
                  disabled={loginOtp.length !== 6 || loading}
                  className="w-full bg-[#3d6d3c] text-white py-3 rounded-xl text-sm font-semibold mb-3 hover:bg-[#2f5530] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  Verify OTP
                </button>
              )}

              {/* Terms */}
              <div className="flex items-start gap-2.5 mb-5 mt-4">
                <input
                  type="checkbox"
                  checked={loginTerms}
                  onChange={(e) => setLoginTerms(e.target.checked)}
                  className="mt-0.5 accent-[#1f8a43] flex-shrink-0"
                />
                <span className="text-xs text-gray-500 font-hindi leading-relaxed">
                  लॉगिन करके आप BhoomiVeda की Terms &amp; Conditions से सहमत हैं।
                </span>
              </div>

              {/* Help box */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Need Help?</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  support@bhoomiveda.in
                  <br />
                  Helpdesk Available 24×7
                </p>
              </div>

              {/* Login button */}
              <button
                onClick={handleLogin}
                disabled={!loginOtpVerified || !loginTerms || loading}
                className="w-full bg-[#1f8a43] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#176b34] hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Verify &amp; Login
              </button>
            </div>
          )}

          {/* SIGNUP FORM */}
          {activeTab === 'signup' && (
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Signup</h3>
              <p className="text-gray-500 mb-5 font-hindi text-sm md:text-base">
                नया अकाउंट बनाकर स्मार्ट खेती शुरू करें
              </p>

              {/* Name */}
              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700 font-hindi">
                  पूरा नाम
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="पूरा नाम"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#2fb26d] focus:ring-4 focus:ring-[#2fb26d]/10 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700 font-hindi">
                  आप कौन हैं?
                </label>
                <div className="flex gap-6 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input
                      type="radio"
                      name="userRole"
                      value="farmer"
                      checked={signupRole === 'farmer'}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className="w-[18px] h-[18px] accent-[#1f8a43]"
                    />
                    <span className="font-hindi">किसान (Farmer)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input
                      type="radio"
                      name="userRole"
                      value="expert"
                      checked={signupRole === 'expert'}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className="w-[18px] h-[18px] accent-[#1f8a43]"
                    />
                    <span className="font-hindi">विशेषज्ञ (Expert)</span>
                  </label>
                </div>
              </div>

              {/* Mobile */}
              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700 font-hindi">
                  मोबाइल नंबर
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={signupMobile}
                    onChange={(e) => handleMobileInput(e.target.value, setSignupMobile)}
                    placeholder="मोबाइल नंबर"
                    inputMode="numeric"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#2fb26d] focus:ring-4 focus:ring-[#2fb26d]/10 outline-none text-sm transition-all"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* OTP */}
              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700 font-hindi">
                  OTP सत्यापन
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={signupOtp}
                      onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6 अंकों का OTP"
                      inputMode="numeric"
                      disabled={!signupOtpSent}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#2fb26d] focus:ring-4 focus:ring-[#2fb26d]/10 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-400"
                      maxLength={6}
                    />
                  </div>
                  <button
                    onClick={handleSignupSendOtp}
                    disabled={signupMobile.length !== 10 || loading || signupResendTimer > 0}
                    className="flex-shrink-0 bg-[#2d6a4f] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#245a42] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 min-w-[110px]"
                  >
                    {loading && !signupOtpVerified ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    {signupOtpSent && signupResendTimer > 0
                      ? `${signupResendTimer}s`
                      : signupOtpSent
                        ? 'Resend'
                        : 'Send OTP'}
                  </button>
                </div>
                {signupDemoOtp && signupOtpSent && (
                  <div className="mt-2 flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <Shield className="h-3.5 w-3.5" />
                    OTP for demo: {signupDemoOtp}
                  </div>
                )}
                {signupOtpVerified && (
                  <div className="mt-2 flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    ✓ OTP Verified
                  </div>
                )}
              </div>

              {/* Verify OTP */}
              {signupOtpSent && !signupOtpVerified && (
                <button
                  onClick={handleSignupVerifyOtp}
                  disabled={signupOtp.length !== 6 || loading}
                  className="w-full bg-[#3d6d3c] text-white py-3 rounded-xl text-sm font-semibold mb-3 hover:bg-[#2f5530] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  Verify OTP
                </button>
              )}

              {/* Terms */}
              <div className="flex items-start gap-2.5 mb-5">
                <input
                  type="checkbox"
                  checked={signupTerms}
                  onChange={(e) => setSignupTerms(e.target.checked)}
                  className="mt-0.5 accent-[#1f8a43] flex-shrink-0"
                />
                <span className="text-xs text-gray-500 font-hindi leading-relaxed">
                  मैं BhoomiVeda की Terms &amp; Conditions से सहमत हूँ।
                </span>
              </div>

              {/* Create Account */}
              <button
                onClick={handleSignup}
                disabled={!signupOtpVerified || !signupTerms || loading || !signupName}
                className="w-full bg-[#1f8a43] text-white py-3.5 rounded-xl text-sm font-semibold mb-2 hover:bg-[#176b34] hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
                Create Account
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <button
                  className="text-[#2d6a4f] font-semibold hover:underline"
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
        <div>© 2026 BhoomiVeda. All Rights Reserved.</div>
        <div className="flex gap-4">
          <span className="text-[#2d6a4f] font-medium cursor-pointer hover:underline">Privacy Policy</span>
          <span className="text-[#2d6a4f] font-medium cursor-pointer hover:underline">Help Center</span>
        </div>
      </footer>
    </div>
  );
}
