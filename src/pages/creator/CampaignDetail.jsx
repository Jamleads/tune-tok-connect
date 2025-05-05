
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { toast } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ExternalLink, Music2 } from 'lucide-react';

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    campaigns,
    submissions,
    loading,
    createSubmission
  } = useData();
  
  const [campaign, setCampaign] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  useEffect(() => {
    if (!loading) {
      // Find the campaign
      const foundCampaign = campaigns.find(c => c.id === parseInt(campaignId));
      
      if (foundCampaign) {
        setCampaign(foundCampaign);
        
        // Check if creator has already submitted to this campaign
        const existingSubmission = submissions.find(
          sub => sub.campaignId === parseInt(campaignId) && sub.creatorId === user.id
        );
        
        if (existingSubmission) {
          setHasSubmitted(true);
          setVideoLink(existingSubmission.videoLink);
        }
      } else {
        toast.error("Campaign not found");
        navigate('/creator/campaigns');
      }
    }
  }, [campaignId, campaigns, submissions, loading, user, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoLink.includes('tiktok.com')) {
      toast.error("Please enter a valid TikTok video URL");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the submission
      createSubmission({
        campaignId: parseInt(campaignId),
        creatorId: user.id,
        videoLink
      });
      
      setHasSubmitted(true);
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading || !campaign) {
    return (
      <Layout requireAuth={true} allowedRoles={['creator']}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-pulse-tiktok h-6 w-6 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500">Loading campaign...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout requireAuth={true} allowedRoles={['creator']}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/creator/campaigns')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Campaign Details</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{campaign.title}</CardTitle>
                <CardDescription>
                  Campaign details and instructions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">About this campaign</h3>
                  <p className="text-gray-700">
                    {campaign.description || "Create engaging content using this music track."}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Music Track</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-3">
                        <Music2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="truncate max-w-xs">
                        <p className="font-medium truncate">{campaign.title}</p>
                        <a 
                          href={campaign.musicLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 flex items-center hover:underline truncate"
                        >
                          Listen on TikTok <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Creator Instructions</h3>
                  <div className="p-4 bg-tiktok-cyan/10 border border-tiktok-cyan/20 rounded-lg">
                    <p className="text-gray-700">
                      {campaign.instructions || "Create a TikTok video using this track. Be creative and authentic!"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Submission Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>
                  Submit your content for this campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment per video:</span>
                    <span className="font-medium">₦{campaign.paymentPerVideo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Videos ordered:</span>
                    <span className="font-medium">{campaign.videosOrdered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="videoLink" className="text-sm font-medium">
                        Your TikTok Video URL
                      </label>
                      <Input
                        id="videoLink"
                        placeholder="https://tiktok.com/@username/video/1234567890"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        disabled={hasSubmitted || isSubmitting}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Link to your TikTok video using this music
                      </p>
                    </div>
                    
                    {hasSubmitted ? (
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                        <p className="text-green-700 font-medium mb-1">Submission received!</p>
                        <p className="text-sm text-gray-600 mb-3">
                          Your submission is currently being reviewed.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/creator/submissions')}
                          className="text-green-700 border-green-200"
                        >
                          View All Submissions
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        type="submit" 
                        className="w-full bg-tiktok-cyan text-black hover:bg-tiktok-cyan/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Video"}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 text-center text-sm text-gray-500">
                Please ensure your video follows all TikTok guidelines
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignDetail;
