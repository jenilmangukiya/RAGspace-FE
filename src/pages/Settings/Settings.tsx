import React, { useState } from 'react';
import { useBilling } from '../../hooks/useBilling';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/Loader';
import { 
  CreditCard, 
  Sparkles, 
  Check, 
  User, 
  Shield, 
  Calendar, 
  HelpCircle,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isLoading, checkout, isCheckingOut } = useBilling();
  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('billing');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Stripe Price IDs matching backend settings
  const priceIds = {
    pro: {
      monthly: 'price_1TkLdgKCizlk0JMON5kvQSW5',
      yearly: 'price_1TkLe9KCizlk0JMOTXbMh58z',
    },
    premium: {
      monthly: 'price_1TkLg6KCizlk0JMOGccSmyac',
      yearly: 'price_1TkLgXKCizlk0JMOz5XT2kGC',
    },
  };

  const handleUpgrade = async (priceId: string) => {
    try {
      await checkout(priceId);
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  // Helper to get remaining trial days
  const getTrialDaysRemaining = (endsAtStr: string | null) => {
    if (!endsAtStr) return 0;
    const endsAt = new Date(endsAtStr);
    const now = new Date();
    const diffTime = endsAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getPlanNameDisplay = (plan: string) => {
    if (plan === 'free') return 'Free Trial';
    if (plan === 'pro') return 'Pro Plan';
    if (plan === 'premium') return 'Premium Plan';
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const isCurrentPlan = (planName: string) => {
    if (!subscription) return false;
    
    // In our backend, if plan is "free", it maps to trial
    const isPlanMatch = subscription.plan_name.toLowerCase() === planName.toLowerCase();
    
    // Stripe price ID checks can also verify billing period if needed
    // Since only 2 APIs are built, we assume match based on plan name for simplicity
    return isPlanMatch;
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const trialDaysLeft = subscription?.trial_ends_at 
    ? getTrialDaysRemaining(subscription.trial_ends_at) 
    : 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Title */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Settings
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your account settings, preferences, and billing subscription.
          </p>
        </div>

        {/* Settings Tab Structure */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Sidebar Tabs */}
          <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1 border-b border-zinc-800 md:border-b-0 pb-4 md:pb-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full cursor-pointer',
                activeTab === 'profile'
                  ? 'bg-zinc-800/80 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/30 hover:text-white'
              )}
            >
              <User className="h-4.5 w-4.5" />
              <span>Profile Details</span>
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full cursor-pointer',
                activeTab === 'billing'
                  ? 'bg-zinc-800/80 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/30 hover:text-white'
              )}
            >
              <CreditCard className="h-4.5 w-4.5" />
              <span>Billing & Subscription</span>
            </button>
          </aside>

          {/* Settings Content Area */}
          <div className="flex-1 min-w-0">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  <span>Profile Information</span>
                </h3>
                
                <div className="grid grid-cols-1 gap-6 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || ''}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2.5 px-4 text-sm text-zinc-400 cursor-not-allowed outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">
                      Account ID
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user?.id || ''}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2.5 px-4 text-xs text-zinc-500 font-mono cursor-not-allowed outline-hidden"
                    />
                  </div>
                  <div className="pt-2">
                    <div className="flex items-start gap-3 rounded-xl bg-zinc-900/50 border border-zinc-800 p-4">
                      <Shield className="h-5 w-5 text-zinc-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-zinc-300">Security Credentials</h4>
                        <p className="text-xs text-zinc-500">
                          Password settings and authentication options are managed via Supabase auth security protocols.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-8">
                {/* Current Active Plan Summary Card */}
                <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden">
                  {/* Glowing graphic element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none translate-x-12 -translate-y-12" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Subscription Status: Active</span>
                      </div>
                      
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-zinc-400">Current Plan:</span>
                        <h3 className="text-2xl font-black text-white">
                          {getPlanNameDisplay(subscription?.plan_name || 'free')}
                        </h3>
                      </div>

                      {subscription?.plan_name === 'free' && subscription.trial_ends_at && (
                        <p className="text-sm text-zinc-400 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-400" />
                          <span>
                            Your free trial ends in <span className="text-indigo-400 font-bold">{trialDaysLeft} days</span> (on {new Date(subscription.trial_ends_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}).
                          </span>
                        </p>
                      )}

                      {subscription?.plan_name !== 'free' && (
                        <p className="text-sm text-zinc-400 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-400" />
                          <span>All features for this plan are active. Thank you for your support!</span>
                        </p>
                      )}
                    </div>

                    {subscription?.plan_name === 'free' && (
                      <div className="shrink-0 flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-400 text-xs max-w-sm">
                        <HelpCircle className="h-5 w-5 shrink-0" />
                        <p>
                          Once your trial ends, document upload permissions and query responses will be locked. Choose a plan below to keep using RAGSpace.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Plan Chooser Section */}
                <div className="space-y-6">
                  {/* Period Switcher Toggle */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl">
                      <button
                        onClick={() => setBillingPeriod('monthly')}
                        className={clsx(
                          'px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                          billingPeriod === 'monthly'
                            ? 'bg-zinc-800 text-white shadow-xs'
                            : 'text-zinc-400 hover:text-white'
                        )}
                      >
                        Bill Monthly
                      </button>
                      <button
                        onClick={() => setBillingPeriod('yearly')}
                        className={clsx(
                          'px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer',
                          billingPeriod === 'yearly'
                            ? 'bg-zinc-800 text-white shadow-xs'
                            : 'text-zinc-400 hover:text-white'
                        )}
                      >
                        <span>Bill Annually</span>
                        <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-sm text-[10px] font-bold">
                          Save 17%
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pro Plan Card */}
                    <div className={clsx(
                      'glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between border relative overflow-hidden transition-all',
                      isCurrentPlan('pro') 
                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/5' 
                        : 'border-zinc-800 hover:border-zinc-700'
                    )}>
                      {isCurrentPlan('pro') && (
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span>Active</span>
                        </div>
                      )}
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-bold text-white">Pro Plan</h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            Ideal for power users who need consistent document extraction.
                          </p>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-white">
                            {billingPeriod === 'monthly' ? '$10' : '$100'}
                          </span>
                          <span className="text-zinc-500 text-xs font-medium">
                            /{billingPeriod === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>

                        {/* Feature List */}
                        <ul className="space-y-3 pt-2">
                          <li className="flex items-center gap-2.5 text-xs text-zinc-300">
                            <span className="h-4.5 w-4.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>Up to 10 App Workspaces</span>
                          </li>
                          <li className="flex items-center gap-2.5 text-xs text-zinc-300">
                            <span className="h-4.5 w-4.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>100 Document uploads/month</span>
                          </li>
                          <li className="flex items-center gap-2.5 text-xs text-zinc-300">
                            <span className="h-4.5 w-4.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>Standard AI model answers</span>
                          </li>
                          <li className="flex items-center gap-2.5 text-xs text-zinc-300">
                            <span className="h-4.5 w-4.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>Faster response rates</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-8">
                        {isCurrentPlan('pro') ? (
                          <button
                            disabled
                            className="w-full bg-zinc-800 text-zinc-400 rounded-xl py-2.5 text-sm font-semibold border border-zinc-700 cursor-not-allowed"
                          >
                            Current Active Plan
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpgrade(priceIds.pro[billingPeriod])}
                            disabled={isCheckingOut}
                            className="w-full gradient-btn rounded-xl py-2.5 text-sm font-semibold cursor-pointer shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCheckingOut && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span>Upgrade to Pro</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Premium Plan Card */}
                    <div className={clsx(
                      'glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between border relative overflow-hidden transition-all',
                      isCurrentPlan('premium') 
                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/5' 
                        : 'border-zinc-800 hover:border-zinc-700'
                    )}>
                      {isCurrentPlan('premium') && (
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span>Active</span>
                        </div>
                      )}

                      {/* Best Value Tag */}
                      {!isCurrentPlan('premium') && (
                        <div className="absolute top-0 right-0 bg-linear-to-r from-pink-500 to-indigo-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest flex items-center gap-1.5">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>Best Value</span>
                        </div>
                      )}

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                            <span>Premium Plan</span>
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            For teams and enterprises requiring full semantic knowledge limits.
                          </p>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-white">
                            {billingPeriod === 'monthly' ? '$20' : '$200'}
                          </span>
                          <span className="text-zinc-500 text-xs font-medium">
                            /{billingPeriod === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>

                        {/* Feature List */}
                        <ul className="space-y-3 pt-2">
                          <li className="flex items-center gap-2.5 text-xs text-zinc-300">
                            <span className="h-4.5 w-4.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>Unlimited App Workspaces</span>
                          </li>
                          <li className="flex items-center gap-2.5 text-xs text-zinc-300">
                            <span className="h-4.5 w-4.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>Unlimited Document uploads</span>
                          </li>
                          <li className="flex items-center gap-2.5 text-xs text-zinc-300">
                            <span className="h-4.5 w-4.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>Advanced AI models (GPT-4 / Claude-3)</span>
                          </li>
                          <li className="flex items-center gap-2.5 text-xs text-zinc-300">
                            <span className="h-4.5 w-4.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>Priority support & Instant answers</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-8">
                        {isCurrentPlan('premium') ? (
                          <button
                            disabled
                            className="w-full bg-zinc-800 text-zinc-400 rounded-xl py-2.5 text-sm font-semibold border border-zinc-700 cursor-not-allowed"
                          >
                            Current Active Plan
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpgrade(priceIds.premium[billingPeriod])}
                            disabled={isCheckingOut}
                            className="w-full gradient-btn rounded-xl py-2.5 text-sm font-semibold cursor-pointer shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCheckingOut && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span>Upgrade to Premium</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
