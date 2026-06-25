import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Retrieve session to trigger code/token exchange
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          toast.success('Logged in successfully with Google!');
          navigate('/dashboard');
        } else {
          // Listen for the SIGNED_IN auth event in case exchange happens asynchronously
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
            if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && currentSession) {
              toast.success('Logged in successfully with Google!');
              navigate('/dashboard');
              subscription.unsubscribe();
            }
          });

          // Timeout fallback of 10 seconds
          const timeout = setTimeout(() => {
            subscription.unsubscribe();
            setError('Authentication session not established. Please try again.');
            toast.error('Authentication session not established. Please try again.');
            navigate('/login');
          }, 10000);

          return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        setError(err.message || 'Failed to authenticate.');
        toast.error(err.message || 'Authentication failed.');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-zinc-950 text-white">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-indigo-600/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-pink-600/10 blur-[100px]" />

      <div className="z-10 flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20 mb-2">
          <span className="text-xl font-bold text-white">R</span>
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <h2 className="text-xl font-semibold text-white">Completing sign in...</h2>
        <p className="text-xs text-zinc-400">Please wait while we redirect you to your workspace.</p>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default AuthCallback;
