import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('superadmin@edunexa.demo');
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(email, password, rememberMe);
    if (!res.success) {
      setError(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleFillDemo = () => {
    setEmail('superadmin@edunexa.demo');
    setPassword('Demo@123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden selection:bg-teal-500 selection:text-white">
      {/* Background Decorative Mesh & Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Demo Header Notice */}
      <div className="absolute top-0 inset-x-0 bg-slate-900/80 border-b border-slate-800 text-center py-2 px-4 text-xs text-slate-400">
        <span className="font-semibold text-teal-400">DEMO PROTOTYPE</span> — Super Admin Demonstration Portal by <strong className="text-white">L.Tech Solutions</strong>
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6 py-12">
        {/* Brand Card */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="text-2xl font-black text-white tracking-tight">Edu<span className="text-teal-400">Nexa</span></span>
                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">ADMIN</span>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-1">One Platform. Every Campus. Connected Education.</p>
              <p className="text-[11px] text-teal-400/90 font-medium">Developed by L.Tech Solutions</p>
            </div>
          </div>

          {/* Demo Credentials Quick Fill Banner */}
          <div className="mb-6 p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Pre-Configured Demo Credentials:
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-teal-400 hover:text-teal-300 font-bold hover:underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-slate-400 font-mono text-[11px] space-y-0.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <div>Email: <span className="text-teal-300">superadmin@edunexa.demo</span></div>
              <div>Password: <span className="text-teal-300">Demo@123</span></div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@edunexa.demo"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-teal-400 hover:text-teal-300 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-teal-600/30 transition-all cursor-pointer mt-2"
            >
              Sign In to Super Admin
            </button>
          </form>

          {/* Mock Auth Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Mock authentication for demonstration. No external credentials stored.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Demo Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Demo Account Password Reset"
        subtitle="EduNexa Prototype Authentication Note"
        maxWidth="md"
      >
        <div className="space-y-4 text-sm text-slate-600">
          <p>
            This is a frontend demonstration prototype developed by <strong>L.Tech Solutions</strong>. Production password reset links via SMTP / SMS gateways are disabled in Phase 1.
          </p>
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs">
            <strong>Default Super Admin Credentials:</strong><br />
            Email: <span className="font-mono font-bold">superadmin@edunexa.demo</span><br />
            Password: <span className="font-mono font-bold">Demo@123</span>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                handleFillDemo();
                setShowForgotModal(false);
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700"
            >
              Apply Demo Credentials
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
