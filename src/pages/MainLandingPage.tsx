
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import HeroSection from '@/components/landing/HeroSection';
import LoginCTA from '@/components/landing/LoginCTA';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

const MainLandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      let redirectPath = '/select-role';
      switch (user.role) {
        case 'admin':
          redirectPath = '/admin-dashboard';
          break;
        case 'teacher':
          redirectPath = '/teacher-dashboard';
          break;
        case 'parent':
          redirectPath = '/parent-dashboard';
          break;
        case 'child':
          redirectPath = '/child-dashboard';
          break;
      }
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-owl-neutral flex flex-col">
      {/* Header */}
      <Header />
      
      <main className="flex-1 flex flex-col px-4 py-12 md:py-16">
        {/* Hero Section with CTA */}
        <HeroSection />
        
        {/* Features Section */}
        <motion.div 
          className="container mx-auto text-center mt-12"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <div className="bg-owl-blue/10 backdrop-blur-sm rounded-xl p-8 shadow-subtle">
            <h2 className="text-2xl font-bold text-owl-slate-dark mb-3">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/30 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">For Teachers</h3>
                <p>Create and assign tasks, monitor student progress, and provide personalized feedback.</p>
              </div>
              <div className="bg-white/30 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">For Parents</h3>
                <p>Stay involved in your child's education, assign additional practice, and track improvement.</p>
              </div>
              <div className="bg-white/30 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">For Children</h3>
                <p>Engage with interactive learning materials tailored to your specific curriculum needs.</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Login CTA */}
        <LoginCTA />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLandingPage;
