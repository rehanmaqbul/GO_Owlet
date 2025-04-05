
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { fadeIn, springIn } from '@/lib/animations';

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log page not found for analytics purposes
    console.log('404 Page not found accessed');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#F2FCE2] to-white p-4">
      <motion.div 
        className="max-w-md w-full text-center space-y-6"
        {...fadeIn}
      >
        <div className="space-y-2">
          <motion.h1 
            className="text-6xl font-bold text-[#9b87f5]"
            {...springIn}
          >
            404
          </motion.h1>
          <h2 className="text-2xl font-semibold text-owl-slate-dark">Page Not Found</h2>
          <p className="text-owl-slate">
            We couldn't find the page you're looking for. Let's get you back on track!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button 
            asChild
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
