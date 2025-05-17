'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

// Mock initial data
const initialCampaigns = [
  {
    id: 1,
    musicianId: 1,
    title: "Summer Vibes Beat",
    musicLink: "https://tiktok.com/music/summer-vibes-12345",
    description: "Upbeat summer track perfect for dance videos",
    instructions: "Create a dance video with summer aesthetic",
    videosOrdered: 40,
    paymentPerVideo: 500,
    totalPayment: 20000,
    status: "active",
    createdAt: "2023-04-15T10:30:00Z"
  },
  {
    id: 2,
    musicianId: 1,
    title: "Chill Beats",
    musicLink: "https://tiktok.com/music/chill-beats-67890",
    description: "Relaxing lo-fi beat for ambient content",
    instructions: "Create a day-in-life or study vlog with this track",
    videosOrdered: 60,
    paymentPerVideo: 500,
    totalPayment: 30000,
    status: "active",
    createdAt: "2023-04-10T14:20:00Z"
  },
  {
    id: 3,
    musicianId: 2,
    title: "Party Anthem",
    musicLink: "https://tiktok.com/music/party-anthem-24680",
    description: "High-energy party track for dancing",
    instructions: "Create a dance or party scene using this track",
    videosOrdered: 50,
    paymentPerVideo: 500,
    totalPayment: 25000,
    status: "completed",
    createdAt: "2023-03-25T09:15:00Z"
  }
];

const initialSubmissions = [
  {
    id: 1,
    campaignId: 1,
    creatorId: 3,
    videoLink: "https://tiktok.com/@tiktokprince/video/12345",
    status: "approved",
    submittedAt: "2023-04-16T11:45:00Z",
    reviewedAt: "2023-04-17T14:30:00Z"
  },
  {
    id: 2,
    campaignId: 1,
    creatorId: 4,
    videoLink: "https://tiktok.com/@dancequeen/video/67890",
    status: "pending",
    submittedAt: "2023-04-17T16:20:00Z",
    reviewedAt: null
  },
  {
    id: 3,
    campaignId: 2,
    creatorId: 3,
    videoLink: "https://tiktok.com/@tiktokprince/video/13579",
    status: "rejected",
    submittedAt: "2023-04-12T10:10:00Z",
    reviewedAt: "2023-04-13T09:05:00Z"
  },
  {
    id: 4,
    campaignId: 3,
    creatorId: 4,
    videoLink: "https://tiktok.com/@dancequeen/video/24680",
    status: "approved",
    submittedAt: "2023-03-26T15:30:00Z",
    reviewedAt: "2023-03-27T11:15:00Z"
  }
];

const DataContext = createContext();

export function DataProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Try to get data from localStorage first
      const storedCampaigns = localStorage.getItem('tikTokCampaigns');
      const storedSubmissions = localStorage.getItem('tikTokSubmissions');
      
      if (storedCampaigns && storedSubmissions) {
        setCampaigns(JSON.parse(storedCampaigns));
        setSubmissions(JSON.parse(storedSubmissions));
      } else {
        setCampaigns(initialCampaigns);
        setSubmissions(initialSubmissions);
        // Store initial data
        localStorage.setItem('tikTokCampaigns', JSON.stringify(initialCampaigns));
        localStorage.setItem('tikTokSubmissions', JSON.stringify(initialSubmissions));
      }
      
      setLoading(false);
    }, 1000);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tikTokCampaigns', JSON.stringify(campaigns));
      localStorage.setItem('tikTokSubmissions', JSON.stringify(submissions));
    }
  }, [campaigns, submissions, loading]);

  // Campaign functions
  const createCampaign = (campaignData) => {
    const newCampaign = {
      id: Date.now(),
      ...campaignData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    setCampaigns([...campaigns, newCampaign]);
    toast.success("Campaign created successfully!");
    return newCampaign;
  };

  const getMusicianCampaigns = (musicianId) => {
    return campaigns.filter(campaign => campaign.musicianId === musicianId);
  };

  const getActiveCampaigns = () => {
    return campaigns.filter(campaign => campaign.status === 'active');
  };

  // Submission functions
  const createSubmission = (submissionData) => {
    const newSubmission = {
      id: Date.now(),
      ...submissionData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedAt: null
    };
    
    setSubmissions([...submissions, newSubmission]);
    toast.success("Content submitted successfully!");
    return newSubmission;
  };

  const getSubmissionsForCampaign = (campaignId) => {
    return submissions.filter(sub => sub.campaignId === campaignId);
  };

  const getCreatorSubmissions = (creatorId) => {
    return submissions.filter(sub => sub.creatorId === creatorId);
  };

  const reviewSubmission = (submissionId, status) => {
    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status,
          reviewedAt: new Date().toISOString()
        };
      }
      return sub;
    });
    
    setSubmissions(updatedSubmissions);
    toast.success(`Submission ${status === 'approved' ? 'approved' : 'rejected'}`);
  };

  // Simulate payment process
  const processCampaignPayment = (campaignData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Payment processed successfully' });
      }, 2000);
    });
  };

  const value = {
    campaigns,
    submissions,
    loading,
    createCampaign,
    getMusicianCampaigns,
    getActiveCampaigns,
    createSubmission,
    getSubmissionsForCampaign,
    getCreatorSubmissions,
    reviewSubmission,
    processCampaignPayment
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
