import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { 
  Lock, 
  ShieldCheck, 
  Mail, 
  Key, 
  AlertCircle, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const AdminAuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { loginAdmin, isFirebaseConnected } = useBuilder();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginAdmin(email, password);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-white">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 border-b border-slate-800 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/30 border border-blue-500/30 rounded-xl text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Administrator Portal</h3>
              <p className="text-xs text-blue-200/80 mt-0.5">Blue Wien No-Code Management Suite</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="admin@bluewien.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Master Access Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-950/40 border border-blue-900/50 rounded-lg text-xs text-blue-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-semibold text-blue-200">Firebase Security Notice</p>
              <p className="text-blue-300/80 text-[11px] mt-0.5">
                {isFirebaseConnected 
                  ? 'Real Firebase Authentication active. Enter registered admin credentials.' 
                  : 'Firebase credentials standby. Please configure your VITE_FIREBASE_ keys in .env to authenticate.'}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-blue-900/40 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {isLoading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
