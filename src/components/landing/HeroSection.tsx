
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/select-role');
  };

  return (
    <motion.div 
      className="flex flex-col lg:flex-row items-center gap-12 mb-12"
      {...fadeIn}
    >
      <div className="flex-1 space-y-6">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-owl-slate-dark leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Empowering Education Through
          <span className="text-owl-blue"> Collaboration</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg text-owl-slate"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Guardian Owlet connects parents, teachers, and children to create
          a seamless educational journey tailored to each child's needs across
          different curricula worldwide.
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            size="lg" 
            className="px-8"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#features">Learn More</a>
          </Button>
        </motion.div>
      </div>
      
      <motion.div 
        className="flex-1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <img 
          src="/placeholder.svg" 
          alt="Guardian Owlet Platform" 
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
