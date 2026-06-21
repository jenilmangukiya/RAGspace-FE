import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate the subscription query when landing on this page to fetch the new plan
    queryClient.invalidateQueries({ queryKey: ['subscription'] });
  }, [queryClient]);

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
      {/* Background glowing rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

      <div className="glass-panel w-full max-w-md rounded-2xl p-8 shadow-2xl relative z-10 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 mb-6">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-3">
          <Sparkles className="h-3 w-3" />
          <span>Subscription Updated</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
          Thank you for your purchase!
        </h2>

        <p className="text-sm text-zinc-400 leading-relaxed mb-8">
          Your payment was successful and your subscription plan has been upgraded. 
          Your new features and limits are now fully active across your workspaces.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="gradient-btn w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer shadow-lg shadow-indigo-500/20"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Success;
