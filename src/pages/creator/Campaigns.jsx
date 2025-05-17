
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Search } from 'lucide-react';

const Campaigns = () => {
  const { getActiveCampaigns, loading } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get active campaigns
  const activeCampaigns = getActiveCampaigns();
  
  // Filter campaigns based on search query
  const filteredCampaigns = activeCampaigns.filter(campaign => {
    const query = searchQuery.toLowerCase();
    return (
      campaign.title.toLowerCase().includes(query) ||
      campaign.description.toLowerCase().includes(query)
    );
  });

  return (
    <Layout requireAuth={true} allowedRoles={['creator']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Available Campaigns</h1>
            <p className="text-gray-500">Browse music campaigns to create content for</p>
          </div>
          
          <div className="w-full md:w-64 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Campaign Listings */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse-tiktok h-6 w-6 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500">Loading campaigns...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-12 text-center">
              <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              {searchQuery ? (
                <>
                  <h3 className="text-xl font-medium mb-2">No matching campaigns</h3>
                  <p className="text-gray-500 mb-6">
                    Try changing your search terms or clear the search
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-medium mb-2">No active campaigns</h3>
                  <p className="text-gray-500">
                    Check back later for new opportunities
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-2">
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {campaign.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Payment:</span>
                        <span className="font-medium">₦{campaign.paymentPerVideo} per video</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Videos needed:</span>
                        <span className="font-medium">{campaign.videosOrdered}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="font-medium text-sm mb-1">Instructions</h4>
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {campaign.instructions || "Create content using this music. Be creative!"}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => navigate(`/creator/campaigns/${campaign.id}`)}
                      className="w-full bg-tiktok-cyan text-black hover:bg-tiktok-cyan/90"
                    >
                      View Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Campaigns;
