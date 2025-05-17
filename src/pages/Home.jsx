
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Music, Disc } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleCTAClick = (role) => {
    if (isAuthenticated) {
      if (user.role === role) {
        router.push(role === 'musician' ? '/musician/submit' : '/creator/campaigns');
      } else {
        router.push(user.role === 'musician' ? '/musician/dashboard' : '/creator/dashboard');
      }
    } else {
      router.push(`/login?role=${role}`);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 text-white py-24 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="text-tiktok-pink">Tune</span>
            <span className="text-tiktok-cyan">Tok</span>
            <span className="text-white">Connect</span>
          </h1>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            The ultimate platform connecting musicians with TikTok creators.
            Reach millions with your music through authentic creator content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleCTAClick('musician')}
              className="tiktok-btn-pink flex items-center justify-center gap-2"
            >
              <Music className="h-5 w-5" />
              Submit Music
            </button>
            <button
              onClick={() => handleCTAClick('creator')} 
              className="tiktok-btn-cyan flex items-center justify-center gap-2"
            >
              <Disc className="h-5 w-5" />
              Create Content
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-10 lg:gap-20">
            {/* For Musicians */}
            <div className="bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-tiktok-pink rounded-full flex items-center justify-center mb-6 mx-auto">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4">For Musicians</h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="bg-tiktok-pink text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">1</span>
                  <p>Submit your TikTok music link for promotion</p>
                </li>
                <li className="flex gap-3">
                  <span className="bg-tiktok-pink text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">2</span>
                  <p>Choose how many creator videos you want (minimum 40)</p>
                </li>
                <li className="flex gap-3">
                  <span className="bg-tiktok-pink text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">3</span>
                  <p>Pay a simple flat rate per video (₦500 per video)</p>
                </li>
                <li className="flex gap-3">
                  <span className="bg-tiktok-pink text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">4</span>
                  <p>Review and approve creator content within 3 days</p>
                </li>
                <li className="flex gap-3">
                  <span className="bg-tiktok-pink text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">5</span>
                  <p>Watch your music go viral across TikTok!</p>
                </li>
              </ol>
              <div className="mt-8 text-center">
                <button 
                  onClick={() => handleCTAClick('musician')}
                  className="tiktok-btn-pink"
                >
                  Submit Your Music
                </button>
              </div>
            </div>
            
            {/* For Creators */}
            <div className="bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-tiktok-cyan rounded-full flex items-center justify-center mb-6 mx-auto">
                <Disc className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4">For Content Creators</h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="bg-tiktok-cyan text-black rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">1</span>
                  <p>Browse available music campaigns that match your style</p>
                </li>
                <li className="flex gap-3">
                  <span className="bg-tiktok-cyan text-black rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">2</span>
                  <p>Choose campaigns you're interested in creating content for</p>
                </li>
                <li className="flex gap-3">
                  <span className="bg-tiktok-cyan text-black rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">3</span>
                  <p>Create and upload your TikTok video using the music</p>
                </li>
                <li className="flex gap-3">
                  <span className="bg-tiktok-cyan text-black rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">4</span>
                  <p>Submit the video link and wait for approval</p>
                </li>
                <li className="flex gap-3">
                  <span className="bg-tiktok-cyan text-black rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">5</span>
                  <p>Get paid ₦500 for each approved video!</p>
                </li>
              </ol>
              <div className="mt-8 text-center">
                <button 
                  onClick={() => handleCTAClick('creator')}
                  className="tiktok-btn-cyan"
                >
                  Start Creating
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold tiktok-gradient">5K+</h3>
              <p className="text-gray-600 mt-2">Musicians</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold tiktok-gradient">20K+</h3>
              <p className="text-gray-600 mt-2">Content Creators</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold tiktok-gradient">100K+</h3>
              <p className="text-gray-600 mt-2">Videos Created</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold tiktok-gradient">10M+</h3>
              <p className="text-gray-600 mt-2">Views Generated</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Connect?</h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto">
            Whether you're a musician looking to promote your next hit or a content creator ready to earn,
            TuneTokConnect makes it happen.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleCTAClick('musician')}
              className="tiktok-btn-pink"
            >
              I'm a Musician
            </button>
            <button 
              onClick={() => handleCTAClick('creator')}
              className="tiktok-btn-cyan"
            >
              I'm a Creator
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
