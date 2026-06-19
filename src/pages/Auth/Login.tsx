import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInputs = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);

  const handleDemoLogin = async () => {
    if (isSubmitting || isDemoLoggingIn) return;
    setIsDemoLoggingIn(true);
    try {
      await login(
        import.meta.env.VITE_DEMO_EMAIL || 'demo@demo.com',
        import.meta.env.VITE_DEMO_PASSWORD || 'demo@123'
      );
      toast.success('Logged in as Demo User successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in as guest.');
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">Welcome Back</h2>
      <p className="text-xs text-zinc-400 mb-6">Sign in to your RAG Space account to resume work.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              {...register('email')}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Lock className="h-4 w-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || isDemoLoggingIn}
          className="gradient-btn w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Sign In</span>
        </button>

        {/* Demo login option */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting || isDemoLoggingIn}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-zinc-700 py-2.5 text-sm font-semibold mt-3 text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDemoLoggingIn ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span>Sign In as Guest / Demo</span>
        </button>
      </form>

      {/* Footer link */}
      <div className="mt-6 text-center text-xs text-zinc-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Create account
        </Link>
      </div>
    </div>
  );
};

export default Login;
