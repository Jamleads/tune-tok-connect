
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Layout from '@/components/layout/Layout';
import { toast } from '@/components/ui/sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, ArrowLeft, ExternalLink } from 'lucide-react';

const ReviewContent = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    campaigns, 
    submissions, 
    loading,
    getSubmissionsForCampaign, 
    reviewSubmission 
  } = useData();
  
  const [campaign, setCampaign] = useState(null);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [rejectedSubmissions, setRejectedSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  
  useEffect(() => {
    if (!loading) {
      // Find the campaign
      const foundCampaign = campaigns.find(c => c.id === parseInt(campaignId));
      
      if (foundCampaign) {
        // Check if the campaign belongs to the logged-in musician
        if (foundCampaign.musicianId !== user.id) {
          toast.error("You don't have access to this campaign");
          navigate('/musician/dashboard');
          return;
        }
        
        setCampaign(foundCampaign);
        
        // Get submissions for this campaign
        const campaignSubmissions = getSubmissionsForCampaign(parseInt(campaignId));
        
        // Filter by status
        setPendingSubmissions(campaignSubmissions.filter(s => s.status === 'pending'));
        setApprovedSubmissions(campaignSubmissions.filter(s => s.status === 'approved'));
        setRejectedSubmissions(campaignSubmissions.filter(s => s.status === 'rejected'));
      } else {
        toast.error("Campaign not found");
        navigate('/musician/dashboard');
      }
    }
  }, [campaignId, campaigns, submissions, loading, user, navigate, getSubmissionsForCampaign]);
  
  const handleApproveSubmission = (submissionId) => {
    reviewSubmission(submissionId, 'approved');
    
    // Update local state
    const submission = pendingSubmissions.find(s => s.id === submissionId);
    setPendingSubmissions(pendingSubmissions.filter(s => s.id !== submissionId));
    setApprovedSubmissions([...approvedSubmissions, { ...submission, status: 'approved' }]);
    
    toast.success("Submission approved!");
  };
  
  const handleRejectSubmission = (submissionId) => {
    reviewSubmission(submissionId, 'rejected');
    
    // Update local state
    const submission = pendingSubmissions.find(s => s.id === submissionId);
    setPendingSubmissions(pendingSubmissions.filter(s => s.id !== submissionId));
    setRejectedSubmissions([...rejectedSubmissions, { ...submission, status: 'rejected' }]);
    
    toast.success("Submission rejected");
  };
  
  // Calculate submission statistics
  const totalSubmissions = pendingSubmissions.length + approvedSubmissions.length + rejectedSubmissions.length;
  const approvalRate = totalSubmissions > 0 
    ? Math.round((approvedSubmissions.length / totalSubmissions) * 100) 
    : 0;
  
  // Calculate deadline for pending submissions (3 days from submission)
  const calculateDeadline = (submissionDate) => {
    const submitDate = new Date(submissionDate);
    const deadline = new Date(submitDate);
    deadline.setDate(deadline.getDate() + 3);
    return deadline;
  };
  
  // Calculate remaining time in hours
  const calculateRemainingTime = (deadline) => {
    const now = new Date();
    const diffMs = deadline - now;
    const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
    return diffHrs;
  };
  
  // Format remaining time display
  const formatRemainingTime = (hours) => {
    if (hours < 0) return "Expired";
    if (hours < 24) return `${hours} hours left`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h left`;
  };
  
  if (loading || !campaign) {
    return (
      <Layout requireAuth={true} allowedRoles={['musician']}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-pulse-tiktok h-6 w-6 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500">Loading campaign data...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout requireAuth={true} allowedRoles={['musician']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/musician/dashboard')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <p className="text-gray-500">Review creator submissions</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <div className="text-sm flex flex-col items-end">
              <span className="text-gray-500">Campaign Status</span>
              <span className={`font-medium ${
                campaign.status === 'active' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {campaign.status === 'active' ? 'Active' : 'Completed'}
              </span>
            </div>
            <div className="ml-4 text-sm flex flex-col items-end">
              <span className="text-gray-500">Videos Ordered</span>
              <span className="font-medium">{campaign.videosOrdered}</span>
            </div>
          </div>
        </div>
        
        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-semibold">{totalSubmissions}</p>
                <p className="text-gray-500 text-sm">Total Submissions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-yellow-600">
                <p className="text-2xl font-semibold">{pendingSubmissions.length}</p>
                <p className="text-gray-500 text-sm">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-green-600">
                <p className="text-2xl font-semibold">{approvedSubmissions.length}</p>
                <p className="text-gray-500 text-sm">Approved</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-semibold">{approvalRate}%</p>
                <p className="text-gray-500 text-sm">Approval Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Submission Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Content Submissions</CardTitle>
            <CardDescription>
              Review and manage creator content submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
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
              
              <TabsContent value="pending">
                {pendingSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-1">No pending submissions</h3>
                    <p className="text-gray-500">
                      All submissions have been reviewed.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingSubmissions.map(submission => {
                      const deadline = calculateDeadline(submission.submittedAt);
                      const remainingTime = calculateRemainingTime(deadline);
                      
                      return (
                        <Card key={submission.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="border-b p-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                <h3 className="font-medium truncate">
                                  {submission.videoLink}
                                </h3>
                                <div className="flex items-center mt-2 sm:mt-0">
                                  <Clock className={`h-4 w-4 ${
                                    remainingTime < 12 ? 'text-red-500' : 'text-yellow-500'
                                  } mr-1`} />
                                  <span className={`text-xs ${
                                    remainingTime < 12 ? 'text-red-500' : 'text-yellow-500'
                                  }`}>
                                    {formatRemainingTime(remainingTime)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">
                                  Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                                </span>
                                <a 
                                  href={submission.videoLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 flex items-center hover:underline"
                                >
                                  Open video <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            </div>
                            
                            <div className="p-4 flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRejectSubmission(submission.id)}
                                className="bg-white text-red-500 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleApproveSubmission(submission.id)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="approved">
                {approvedSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-1">No approved submissions yet</h3>
                    <p className="text-gray-500">
                      Approved submissions will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {approvedSubmissions.map(submission => (
                      <div key={submission.id} className="flex justify-between items-center p-3 bg-green-50 border border-green-100 rounded-lg text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="mr-2 truncate max-w-xs">{submission.videoLink}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-4">
                            Approved on {new Date(submission.reviewedAt).toLocaleDateString()}
                          </span>
                          <a 
                            href={submission.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 flex items-center hover:underline"
                          >
                            View <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="rejected">
                {rejectedSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <XCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-1">No rejected submissions</h3>
                    <p className="text-gray-500">
                      Rejected submissions will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rejectedSubmissions.map(submission => (
                      <div key={submission.id} className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg text-sm">
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="mr-2 truncate max-w-xs">{submission.videoLink}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-4">
                            Rejected on {new Date(submission.reviewedAt).toLocaleDateString()}
                          </span>
                          <a 
                            href={submission.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 flex items-center hover:underline"
                          >
                            View <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReviewContent;
