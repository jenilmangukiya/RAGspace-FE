import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const Cancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
      {/* Background glowing rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-red-500/5 blur-[80px] pointer-events-none" />

      <div className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-2xl relative z-10 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 mb-6">
          <AlertCircle className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
          Checkout Cancelled
        </h2>

        <p className="text-sm text-zinc-400 leading-relaxed mb-8">
          The payment checkout session was cancelled. No charges were billed to your account. 
          If you'd like to select a different plan or try again, you can return to settings.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/settings')}
            className="gradient-btn w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <span>Return to Settings</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
