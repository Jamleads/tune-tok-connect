
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, CheckCircle, XCircle, Clock, Search } from 'lucide-react';

const Submissions = () => {
  const { user } = useAuth();
  const { getCreatorSubmissions, campaigns, loading } = useData();
  const navigate = useNavigate();
  
  // Get submissions for the logged-in creator
  const submissions = getCreatorSubmissions(user?.id);
  
  // Filter submissions based on status
  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const approvedSubmissions = submissions.filter(sub => sub.status === 'approved');
  const rejectedSubmissions = submissions.filter(sub => sub.status === 'rejected');
  
  // Function to get campaign title from campaign ID
  const getCampaignTitle = (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.title : 'Unknown Campaign';
  };

  return (
    <Layout requireAuth={true} allowedRoles={['creator']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
            <p className="text-gray-500">Manage and track your content submissions</p>
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
        
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="bg-yellow-50 border border-yellow-100">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <p className="text-2xl font-semibold text-yellow-700">{pendingSubmissions.length}</p>
                <p className="text-yellow-600 text-sm">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border border-green-100">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-2xl font-semibold text-green-700">{approvedSubmissions.length}</p>
                <p className="text-green-600 text-sm">Approved</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border border-red-100">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-2xl font-semibold text-red-700">{rejectedSubmissions.length}</p>
                <p className="text-red-600 text-sm">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              Track the status of your content submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse-tiktok h-6 w-6 mx-auto rounded-full"></div>
                <p className="mt-4 text-gray-500">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                <p className="text-gray-500 mb-6">
                  Start creating content for active campaigns
                </p>
                <Button 
                  onClick={() => navigate('/creator/campaigns')}
                  className="tiktok-btn-cyan"
                >
                  Browse Campaigns
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">
                    All ({submissions.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending ({pendingSubmissions.length})
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approved ({approvedSubmissions.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Rejected ({rejectedSubmissions.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <SubmissionsList 
                    submissions={submissions}
                    getCampaignTitle={getCampaignTitle}
                  />
                </TabsContent>
                
                <TabsContent value="pending">
                  <SubmissionsList 
                    submissions={pendingSubmissions}
                    getCampaignTitle={getCampaignTitle}
                    emptyMessage="No pending submissions"
                  />
                </TabsContent>
                
                <TabsContent value="approved">
                  <SubmissionsList 
                    submissions={approvedSubmissions}
                    getCampaignTitle={getCampaignTitle}
                    emptyMessage="No approved submissions yet"
                  />
                </TabsContent>
                
                <TabsContent value="rejected">
                  <SubmissionsList 
                    submissions={rejectedSubmissions}
                    getCampaignTitle={getCampaignTitle}
                    emptyMessage="No rejected submissions"
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Helper component for rendering submission lists
const SubmissionsList = ({ submissions, getCampaignTitle, emptyMessage = "No submissions found" }) => {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {submissions.map(submission => {
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
          <div 
            key={submission.id}
            className={`flex flex-col sm:flex-row justify-between p-4 rounded-lg border ${
              submission.status === 'approved' 
                ? 'border-green-200 bg-green-50/50' 
                : submission.status === 'rejected'
                ? 'border-red-200 bg-red-50/50'
                : 'border-yellow-200 bg-yellow-50/50'
            }`}
          >
            <div className="mb-3 sm:mb-0">
              <div className="flex items-center mb-1">
                <span className="font-medium">{getCampaignTitle(submission.campaignId)}</span>
                <span className={`ml-3 px-2 py-1 rounded-full text-xs flex items-center ${statusColor}`}>
                  {statusIcon}
                  {statusText}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-1 truncate max-w-xs sm:max-w-md">
                {submission.videoLink}
              </div>
              <div className="text-xs text-gray-500">
                Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                {submission.reviewedAt && (
                  <> • Reviewed: {new Date(submission.reviewedAt).toLocaleDateString()}</>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <a
                href={submission.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 flex items-center hover:underline text-sm"
              >
                View on TikTok
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Submissions;
