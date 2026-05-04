/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, LogIn, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    const success = await api.adminLogin(password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-white/10 rounded-2xl items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">כניסת מנהל</h1>
          <p className="text-white/40 text-sm mt-1">אנא הזן סיסמה כדי להמשיך ללוח הבקרה</p>
        </div>

        <form onSubmit={handleLogin} className="glass-dark rounded-3xl p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest">סיסמת גישה</label>
            <input
              type="password"
              autoFocus
              className="w-full h-14 px-5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent transition-colors text-center text-2xl tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-100 text-sm"
            >
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              סיסמה שגויה. נסה שוב (רמז: password)
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-accent text-primary font-bold text-lg flex items-center justify-center gap-2 hover:bg-accent/90 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <>
                התחברות
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
        
        <button 
          onClick={() => navigate('/')}
          className="w-full mt-8 text-white/30 text-xs hover:text-white/60 transition-colors"
        >
          חזרה לאתר הציבורי
        </button>
      </motion.div>
    </div>
  );
}
