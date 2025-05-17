
'use client';

import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, Search, ArrowRight } from 'lucide-react';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const { getCreatorSubmissions, getActiveCampaigns, loading } = useData();
  const router = useRouter();
  
  // Get submissions for the logged-in creator
  const submissions = getCreatorSubmissions(user?.id);
  
  // Calculate statistics
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending').length;
  const approvedSubmissions = submissions.filter(sub => sub.status === 'approved').length;
  const rejectedSubmissions = submissions.filter(sub => sub.status === 'rejected').length;
  
  // Calculate estimated earnings (₦500 per approved submission)
  const estimatedEarnings = approvedSubmissions * 500;
  
  // Get active campaigns count
  const activeCampaigns = getActiveCampaigns();
  const activeCampaignsCount = activeCampaigns.length;

  return (
    <Layout requireAuth={true} allowedRoles={['creator']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => navigate('/creator/campaigns')}
              className="tiktok-btn-cyan"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Campaigns
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Available Campaigns</CardDescription>
              <CardTitle className="text-3xl">{activeCampaignsCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Ready for content
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Submissions</CardDescription>
              <CardTitle className="text-3xl">{totalSubmissions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                All time
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved Videos</CardDescription>
              <CardTitle className="text-3xl">{approvedSubmissions}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Successful submissions
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Estimated Earnings</CardDescription>
              <CardTitle className="text-3xl">₦{estimatedEarnings.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                From approved videos
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse-tiktok h-6 w-6 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No submissions yet</h3>
              <p className="text-gray-500 mb-6">
                Start creating content and earning by browsing available campaigns
              </p>
              <Button 
                onClick={() => navigate('/creator/campaigns')}
                className="tiktok-btn-cyan"
              >
                <Search className="mr-2 h-4 w-4" />
                Find Campaigns
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.slice(0, 5).map(submission => {
              let statusColor, statusIcon, statusText;
              
              switch(submission.status) {
                case 'approved':
                  statusColor = 'bg-green-100 text-green-800';
                  statusIcon = <CheckCircle className="h-4 w-4 text-green-600 mr-1" />;
                  statusText = 'Approved';
                  break;
                case 'rejected':
                  statusColor = 'bg-red-100 text-red-800';
                  statusIcon = <XCircle className="h-4 w-4 text-red-600 mr-1" />;
                  statusText = 'Rejected';
                  break;
                default:
                  statusColor = 'bg-yellow-100 text-yellow-800';
                  statusIcon = <Clock className="h-4 w-4 text-yellow-600 mr-1" />;
                  statusText = 'Pending';
              }
              
              return (
                <Card key={submission.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center mb-1">
                          <span className="font-medium truncate max-w-xs">
                            {submission.videoLink}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center mr-4 ${statusColor}`}>
                          {statusIcon}
                          {statusText}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate('/creator/submissions')}
                          className="text-blue-500"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {submissions.length > 5 && (
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/creator/submissions')}
                >
                  View All Submissions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Available Campaigns Preview */}
        <h2 className="text-2xl font-bold mt-12 mb-4">Available Campaigns</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse-tiktok h-6 w-6 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500">Loading campaigns...</p>
          </div>
        ) : activeCampaigns.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-8 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No campaigns available</h3>
              <p className="text-gray-500 mb-2">
                Check back later for new opportunities
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCampaigns.slice(0, 3).map(campaign => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {campaign.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="text-sm">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500">Payment per video:</span>
                          <span className="font-medium">₦{campaign.paymentPerVideo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Videos needed:</span>
                          <span className="font-medium">{campaign.videosOrdered}</span>
                        </div>
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
            
            <div className="text-center mt-8">
              <Button 
                onClick={() => navigate('/creator/campaigns')}
                variant="outline"
                className="px-8"
              >
                View All Campaigns
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CreatorDashboard;
