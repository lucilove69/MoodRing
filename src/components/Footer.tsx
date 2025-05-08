import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--myspace-blue)] text-white text-xs p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <h4 className="font-bold mb-2">About</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:underline">About MySpace</Link></li>
              <li><Link to="/" className="hover:underline">News</Link></li>
              <li><Link to="/" className="hover:underline">Safety Tips</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-2">Discover</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:underline">Music</Link></li>
              <li><Link to="/" className="hover:underline">Movies</Link></li>
              <li><Link to="/" className="hover:underline">Games</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-2">Help</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:underline">FAQ</Link></li>
              <li><Link to="/" className="hover:underline">Support</Link></li>
              <li><Link to="/" className="hover:underline">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-2">Legal</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:underline">Terms</Link></li>
              <li><Link to="/" className="hover:underline">Privacy</Link></li>
              <li><Link to="/" className="hover:underline">Copyright</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-white/30 text-[10px]">
          <div>
            <p>©2005 MySpace.com. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-4">
            <img src="/images/browsers/ie-icon.gif" alt="Internet Explorer" className="h-4" />
            <img src="/images/browsers/netscape-icon.gif" alt="Netscape" className="h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;