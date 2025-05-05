
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              <span className="text-tiktok-pink">Tune</span>
              <span className="text-tiktok-cyan">Tok</span>
              <span className="text-white">Connect</span>
            </h3>
            <p className="text-sm text-gray-400">
              Connecting musicians and content creators for the perfect TikTok promotion
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-tiktok-pink transition-colors cursor-pointer" onClick={() => navigate('/')}>
                Home
              </li>
              <li className="hover:text-tiktok-pink transition-colors cursor-pointer" onClick={() => navigate('/login?role=musician')}>
                For Musicians
              </li>
              <li className="hover:text-tiktok-pink transition-colors cursor-pointer" onClick={() => navigate('/login?role=creator')}>
                For Content Creators
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-400 mb-2">
              contact@tunetokconnect.com
            </p>
            <div className="flex gap-4 mt-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-tiktok-pink transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-tiktok-cyan transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-tiktok-pink transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} TuneTokConnect. All rights reserved.</p>
          <p className="mt-1">This is a simulated platform for demo purposes only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
