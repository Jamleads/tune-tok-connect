
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Music, CheckCircle, Clock } from 'lucide-react';

const MusicianDashboard = () => {
  const { user } = useAuth();
  const { getMusicianCampaigns, getSubmissionsForCampaign, loading } = useData();
  const navigate = useNavigate();
  
  // Get campaigns for the logged-in musician
  const campaigns = getMusicianCampaigns(user?.id);
  
  // Calculate statistics
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
  
  // Calculate total spend
  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.totalPayment, 0);
  
  // Get submission metrics
  const pendingSubmissions = campaigns.flatMap(campaign => 
    getSubmissionsForCampaign(campaign.id).filter(sub => sub.status === 'pending')
  ).length;

  return (
    <Layout requireAuth={true} allowedRoles={['musician']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Musician Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => navigate('/musician/submit')}
              className="tiktok-btn-pink"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Campaigns</CardDescription>
              <CardTitle className="text-3xl">{totalCampaigns}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                All time
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Campaigns</CardDescription>
              <CardTitle className="text-3xl">{activeCampaigns}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Currently running
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Spent</CardDescription>
              <CardTitle className="text-3xl">₦{totalSpend.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                All campaigns
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Reviews</CardDescription>
              <CardTitle className="text-3xl">{pendingSubmissions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Need your approval
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <h2 className="text-2xl font-bold mb-4">Your Campaigns</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse-tiktok h-6 w-6 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-8 text-center">
              <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-6">
                Get your music heard by creating your first campaign
              </p>
              <Button 
                onClick={() => navigate('/musician/submit')}
                className="tiktok-btn-pink"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map(campaign => {
              // Get submissions for this campaign
              const submissions = getSubmissionsForCampaign(campaign.id);
              const pendingCount = submissions.filter(s => s.status === 'pending').length;
              const approvedCount = submissions.filter(s => s.status === 'approved').length;
              const rejectedCount = submissions.filter(s => s.status === 'rejected').length;
              const totalCount = pendingCount + approvedCount + rejectedCount;
              const progress = Math.round((approvedCount / campaign.videosOrdered) * 100);
              
              return (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          campaign.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </div>
                    <CardDescription className="truncate">
                      {campaign.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{approvedCount} of {campaign.videosOrdered}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-2 bg-tiktok-pink rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-500">Total Budget:</span>
                          <span className="ml-1 font-medium">₦{campaign.totalPayment.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Videos:</span>
                          <span className="ml-1 font-medium">{campaign.videosOrdered}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-yellow-600" />
                          <span className="text-yellow-600">{pendingCount} pending</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">{approvedCount} approved</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/musician/review/${campaign.id}`)}
                      >
                        {pendingCount > 0 ? `Review ${pendingCount} Submissions` : 'View Details'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MusicianDashboard;
