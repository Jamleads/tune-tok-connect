
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Music2 } from "lucide-react";

const Navbar = () => {
  const { user, logout, isMusician, isCreator } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
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
                  <Button variant="ghost" onClick={() => navigate('/musician/dashboard')}>Dashboard</Button>
                  <Button variant="ghost" onClick={() => navigate('/musician/submit')}>Submit Music</Button>
                  <Button variant="ghost" onClick={() => navigate('/musician/review')}>Review Content</Button>
                </>
              )}
              
              {isCreator && (
                <>
                  <Button variant="ghost" onClick={() => navigate('/creator/dashboard')}>Dashboard</Button>
                  <Button variant="ghost" onClick={() => navigate('/creator/campaigns')}>Available Campaigns</Button>
                  <Button variant="ghost" onClick={() => navigate('/creator/submissions')}>My Submissions</Button>
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
                <Button variant="ghost" size="sm" onClick={() => navigate('/musician/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/musician/submit')}>
                  Submit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/musician/review')}>
                  Review
                </Button>
              </>
            )}
            
            {isCreator && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/creator/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/creator/campaigns')}>
                  Campaigns
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/creator/submissions')}>
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
