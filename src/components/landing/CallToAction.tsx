
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const CallToAction = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!isAuthenticated) return '/auth';
    
    switch (user?.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'teacher':
        return '/teacher-dashboard';
      case 'parent':
        return '/parent-dashboard';
      case 'child':
        return '/child-dashboard';
      default:
        return '/auth';
    }
  };

  return (
    <section className="py-16">
      <motion.div 
        className="glass p-8 rounded-lg text-center"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-owl-slate-dark mb-4">
          Ready to transform your child's educational journey?
        </h2>
        <p className="text-owl-slate mb-6 max-w-2xl mx-auto">
          Join Guardian Owlet today and gain access to a world of curriculum-aligned
          resources and tools designed to support your child's learning.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {!isAuthenticated ? (
            <>
              <Button asChild size="lg" className="px-8">
                <Link to="/auth?tab=register">Get Started Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth?tab=login">Sign In</Link>
              </Button>
            </>
          ) : (
            <Button asChild size="lg" className="px-8">
              <Link to={getDashboardLink()}>Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
