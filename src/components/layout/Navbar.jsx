
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Music2 } from "lucide-react";

const Navbar = () => {
  const { user, logout, isMusician, isCreator } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <Music2 className="h-6 w-6 text-tiktok-pink" />
          <h1 className="font-bold text-xl">
            <span className="text-tiktok-pink">Tune</span>
            <span className="text-tiktok-cyan">Tok</span>
            <span className="text-black">Connect</span>
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {isMusician && (
                <>
                  <Button variant="ghost" onClick={() => router.push('/musician/dashboard')}>Dashboard</Button>
                  <Button variant="ghost" onClick={() => router.push('/musician/submit')}>Submit Music</Button>
                  <Button variant="ghost" onClick={() => router.push('/musician/review')}>Review Content</Button>
                </>
              )}
              
              {isCreator && (
                <>
                  <Button variant="ghost" onClick={() => router.push('/creator/dashboard')}>Dashboard</Button>
                  <Button variant="ghost" onClick={() => router.push('/creator/campaigns')}>Available Campaigns</Button>
                  <Button variant="ghost" onClick={() => router.push('/creator/submissions')}>My Submissions</Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden md:inline">{user.name} ({user.role})</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleLogout} 
                className="rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t bg-gray-50 px-2 py-2">
          <div className="flex justify-between px-2">
            {isMusician && (
              <>
                <Button variant="ghost" size="sm" onClick={() => router.push('/musician/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/musician/submit')}>
                  Submit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/musician/review')}>
                  Review
                </Button>
              </>
            )}
            
            {isCreator && (
              <>
                <Button variant="ghost" size="sm" onClick={() => router.push('/creator/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/creator/campaigns')}>
                  Campaigns
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/creator/submissions')}>
                  Submissions
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
