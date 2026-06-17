import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

const signupSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupInputs = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInputs) => {
    setIsSubmitting(true);
    try {
      await signUp(data.email, data.password);
      toast.success('Sign up successful! Please check your email to verify your account or proceed to log in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">Create Account</h2>
      <p className="text-xs text-zinc-400 mb-6">Create a free RAG Space account to start chatting with your PDFs.</p>

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

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Lock className="h-4 w-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="gradient-btn w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Sign Up</span>
        </button>
      </form>

      {/* Footer link */}
      <div className="mt-6 text-center text-xs text-zinc-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Signup;
