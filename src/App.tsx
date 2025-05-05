
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import MusicianDashboard from "./pages/musician/Dashboard";
import SubmitMusic from "./pages/musician/SubmitMusic";
import ReviewContent from "./pages/musician/ReviewContent";
import CreatorDashboard from "./pages/creator/Dashboard";
import Campaigns from "./pages/creator/Campaigns";
import CampaignDetail from "./pages/creator/CampaignDetail";
import Submissions from "./pages/creator/Submissions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              {/* Musician Routes */}
              <Route path="/musician/dashboard" element={<MusicianDashboard />} />
              <Route path="/musician/submit" element={<SubmitMusic />} />
              <Route path="/musician/review/:campaignId" element={<ReviewContent />} />
              
              {/* Creator Routes */}
              <Route path="/creator/dashboard" element={<CreatorDashboard />} />
              <Route path="/creator/campaigns" element={<Campaigns />} />
              <Route path="/creator/campaigns/:campaignId" element={<CampaignDetail />} />
              <Route path="/creator/submissions" element={<Submissions />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
