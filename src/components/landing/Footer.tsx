
import { School } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-owl-slate-dark/85 backdrop-blur-sm text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <School className="h-6 w-6 text-owl-blue-light" />
            <span className="text-xl font-bold">Guardian Owlet</span>
          </div>
          <p className="text-gray-300">
            Empowering parents and teachers to collaborate for better educational outcomes.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Features</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Curricula</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect</h3>
          <p className="text-gray-300 mb-2">
            Subscribe to our newsletter for updates
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-owl-slate/50 backdrop-blur-sm px-3 py-2 rounded-l text-white text-sm focus:outline-none border border-white/10"
            />
            <button className="bg-owl-blue/90 backdrop-blur-sm px-3 py-2 rounded-r text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-700/50 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Guardian Owlet. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
