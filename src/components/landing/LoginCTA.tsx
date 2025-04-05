
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';

const LoginCTA = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/select-role');
  };

  return (
    <motion.div 
      className="container mx-auto text-center mt-12"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.6 }}
    >
      <div className="bg-owl-blue/10 backdrop-blur-sm rounded-xl p-8 shadow-subtle">
        <h2 className="text-2xl font-bold text-owl-slate-dark mb-3">
          Already have an account?
        </h2>
        <p className="text-owl-slate mb-6 max-w-2xl mx-auto">
          Log in to access your dashboard and continue your educational journey.
        </p>
        <Button 
          size="lg" 
          onClick={handleLogin}
          className="px-8 py-6 text-lg"
        >
          Login
        </Button>
      </div>
    </motion.div>
  );
};

export default LoginCTA;
