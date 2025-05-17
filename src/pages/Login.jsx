
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Music, Disc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract role from URL query parameters
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'musician' || roleParam === 'creator') {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);
  
  // Redirect logged in users to their dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = searchParams.get('from') || '';
      const redirectPath = from || 
        (user.role === 'musician' ? '/musician/dashboard' : '/creator/dashboard');
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, router, searchParams]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username) return;
    
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      const success = login(username, selectedRole);
      
      if (success) {
        const from = searchParams.get('from') || '';
        const redirectPath = from || 
          (selectedRole === 'musician' ? '/musician/dashboard' : '/creator/dashboard');
        router.push(redirectPath);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-16 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-center mb-8">
            Login to <span className="text-tiktok-pink">Tune</span>
            <span className="text-tiktok-cyan">Tok</span>Connect
          </h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">I am a:</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`flex flex-col items-center justify-center border rounded-xl p-4 transition-all ${
                  selectedRole === 'musician'
                    ? 'border-tiktok-pink bg-tiktok-pink/5 pink-shadow'
                    : 'border-gray-200'
                }`}
                onClick={() => handleRoleSelect('musician')}
              >
                <Music className={`h-8 w-8 mb-2 ${selectedRole === 'musician' ? 'text-tiktok-pink' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedRole === 'musician' ? 'text-tiktok-pink' : 'text-gray-500'}`}>
                  Musician
                </span>
              </button>
              
              <button
                type="button"
                className={`flex flex-col items-center justify-center border rounded-xl p-4 transition-all ${
                  selectedRole === 'creator'
                    ? 'border-tiktok-cyan bg-tiktok-cyan/5 cyan-shadow'
                    : 'border-gray-200'
                }`}
                onClick={() => handleRoleSelect('creator')}
              >
                <Disc className={`h-8 w-8 mb-2 ${selectedRole === 'creator' ? 'text-tiktok-cyan' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedRole === 'creator' ? 'text-tiktok-cyan' : 'text-gray-500'}`}>
                  Content Creator
                </span>
              </button>
            </div>
          </div>
          
          {selectedRole && (
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={selectedRole === 'musician' ? "musician1" : "creator1"}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  For this demo, use {selectedRole === 'musician' ? "musician1 or musician2" : "creator1 or creator2"}
                </p>
              </div>
              
              <Button
                type="submit"
                className={selectedRole === 'musician' ? 'tiktok-btn-pink w-full' : 'tiktok-btn-cyan w-full'}
                disabled={!username || isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account? <br />
              <span className="text-tiktok-pink font-medium cursor-pointer">
                Sign up
              </span>{' '}
              (Demo only - use the logins above)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
