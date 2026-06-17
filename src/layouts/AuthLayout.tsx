import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '../components/Loader';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950">
        <Loader size="lg" />
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-indigo-600/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-pink-600/10 blur-[100px]" />

      <div className="z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20">
            <span className="text-xl font-bold text-white">R</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            RAG<span className="gradient-text">Space</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Your intelligence layer for PDF documents
          </p>
        </div>

        {/* Content card */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl shadow-black/50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
