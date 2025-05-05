
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Disc, Music, Check, ChevronRight, DollarSign } from 'lucide-react';

const SubmitMusic = () => {
  const { user } = useAuth();
  const { createCampaign, processCampaignPayment } = useData();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    musicLink: '',
    description: '',
    instructions: '',
    videosOrdered: 40,
    paymentPerVideo: 500,
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'videosOrdered' ? Math.max(40, parseInt(value) || 40) : value
    }));
  };
  
  const calculateTotal = () => {
    return formData.videosOrdered * formData.paymentPerVideo;
  };
  
  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.musicLink) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Calculate the total payment
      const totalPayment = calculateTotal();
      
      // Create the campaign
      const campaign = createCampaign({
        musicianId: user.id,
        ...formData,
        totalPayment,
      });
      
      setIsSubmitting(false);
      setStep(3); // Go to payment step
      window.scrollTo(0, 0);
    } catch (error) {
      toast.error("Failed to submit campaign. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  const handlePayment = async () => {
    setIsPaymentProcessing(true);
    
    try {
      // Simulate payment process
      const result = await processCampaignPayment({
        amount: calculateTotal(),
        musicianId: user.id
      });
      
      if (result.success) {
        setPaymentComplete(true);
        toast.success("Payment successful! Your campaign is now active.");
        setTimeout(() => {
          navigate('/musician/dashboard');
        }, 3000);
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      toast.error("Payment processing error. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };
  
  return (
    <Layout requireAuth={true} allowedRoles={['musician']}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Submit Your Music</h1>
            <p className="text-gray-500">Get your music heard by TikTok creators</p>
          </div>
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-tiktok-pink text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-tiktok-pink' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-tiktok-pink text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-tiktok-pink' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-tiktok-pink text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <div className={step >= 1 ? 'text-tiktok-pink' : 'text-gray-500'}>Music Details</div>
              <div className={step >= 2 ? 'text-tiktok-pink' : 'text-gray-500'}>Campaign Settings</div>
              <div className={step >= 3 ? 'text-tiktok-pink' : 'text-gray-500'}>Payment</div>
            </div>
          </div>
          
          {/* Step 1: Music Details */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Music Details</CardTitle>
                <CardDescription>
                  Tell us about your music for TikTok promotion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Campaign Title*
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="E.g., Summer Vibes Beat"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="musicLink" className="text-sm font-medium">
                    TikTok Music Link*
                  </label>
                  <Input
                    id="musicLink"
                    name="musicLink"
                    placeholder="https://tiktok.com/music/your-track"
                    value={formData.musicLink}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the link to your sound on TikTok
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your music style, genre, and mood"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNextStep} className="tiktok-btn-pink">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 2: Campaign Settings */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Settings</CardTitle>
                <CardDescription>
                  Set up how many videos you want and review instructions for creators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="videosOrdered" className="text-sm font-medium">
                      Number of Videos (minimum 40)
                    </label>
                    <div className="flex items-center mt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleChange({
                          target: {
                            name: 'videosOrdered',
                            value: Math.max(40, formData.videosOrdered - 10)
                          }
                        })}
                        disabled={formData.videosOrdered <= 40}
                      >
                        -
                      </Button>
                      <Input
                        id="videosOrdered"
                        name="videosOrdered"
                        type="number"
                        min="40"
                        className="text-center mx-2"
                        value={formData.videosOrdered}
                        onChange={handleChange}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleChange({
                          target: {
                            name: 'videosOrdered',
                            value: formData.videosOrdered + 10
                          }
                        })}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">
                      Payment per Video
                    </label>
                    <div className="flex items-center mt-2">
                      <div className="p-3 border rounded-md bg-gray-50 w-full flex items-center">
                        <span className="text-gray-500 mr-2">₦</span>
                        <span>{formData.paymentPerVideo.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fixed rate per approved video
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="instructions" className="text-sm font-medium">
                    Instructions for Creators
                  </label>
                  <Textarea
                    id="instructions"
                    name="instructions"
                    placeholder="Give specific instructions for creators (e.g., dance style, video theme, props to use)"
                    rows={4}
                    value={formData.instructions}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Campaign Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Number of Videos:</span>
                      <span>{formData.videosOrdered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rate per Video:</span>
                      <span>₦{formData.paymentPerVideo.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>Total Payment:</span>
                      <span className="text-tiktok-pink">₦{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button onClick={handleSubmit} className="tiktok-btn-pink" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Submit Campaign"}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 3: Payment */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>
                  Complete payment to activate your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {paymentComplete ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Payment Successful!</h3>
                    <p className="text-gray-500 mb-4">
                      Your campaign is now active and available to creators
                    </p>
                    <div className="animate-pulse text-sm text-gray-400">
                      Redirecting to dashboard...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Payment Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Campaign:</span>
                          <span>{formData.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Number of Videos:</span>
                          <span>{formData.videosOrdered}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rate per Video:</span>
                          <span>₦{formData.paymentPerVideo.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-medium text-lg">
                          <span>Total Amount:</span>
                          <span className="text-tiktok-pink">₦{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg">
                      <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-medium">Payment Method</h3>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-6 bg-blue-600 rounded mr-2"></div>
                            <span>•••• •••• •••• 1234</span>
                          </div>
                          <span className="text-sm text-gray-500">Demo Card</span>
                        </div>
                        
                        <p className="text-xs text-gray-500 italic">
                          This is a demo. No real payment will be processed.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              {!paymentComplete && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={handlePayment} 
                    className="tiktok-btn-pink" 
                    disabled={isPaymentProcessing}
                  >
                    {isPaymentProcessing ? (
                      <>
                        <span className="animate-pulse-tiktok h-4 w-4 rounded-full mr-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Pay ₦{calculateTotal().toLocaleString()}
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubmitMusic;
