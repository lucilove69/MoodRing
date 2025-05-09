import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-[#7FB3D5] to-[#5C9ECF] text-white text-xs p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-light text-sm mb-4 text-white/90">About</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">About MoodRing</Link></li>
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">News</Link></li>
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">Safety Tips</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-light text-sm mb-4 text-white/90">Discover</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">Music</Link></li>
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">Movies</Link></li>
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">Games</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-light text-sm mb-4 text-white/90">Help</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">FAQ</Link></li>
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">Support</Link></li>
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-light text-sm mb-4 text-white/90">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">Terms</Link></li>
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">Privacy</Link></li>
              <li><Link to="/" className="hover:text-white/80 transition-colors duration-200">Copyright</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-white/20 text-[10px]">
          <div>
            <p className="text-white/70">©2024 MoodRing. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-4">
            <img src="/images/browsers/chrome-icon.png" alt="Chrome" className="h-4" />
            <img src="/images/browsers/firefox-icon.png" alt="Firefox" className="h-4" />
            <img src="/images/browsers/edge-icon.png" alt="Edge" className="h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;