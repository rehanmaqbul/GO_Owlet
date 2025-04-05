
import { motion } from 'framer-motion';
import { BookOpen, Users, MessageSquare, BarChart } from 'lucide-react';
import { slideUp, staggerChildren } from '@/lib/animations';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Curriculum-Aligned Tasks',
      description: 'Access educational content tailored to different curricula including American, English, Scottish, Australian, and more.'
    },
    {
      icon: Users,
      title: 'Collaborative Approach',
      description: 'Connect parents, teachers, and children in one platform to create a supportive educational environment.'
    },
    {
      icon: MessageSquare,
      title: 'Integrated Communication',
      description: 'Built-in messaging system allows teachers and parents to stay connected and discuss a child\'s progress.'
    },
    {
      icon: BarChart,
      title: 'Detailed Analytics',
      description: 'Track performance with comprehensive reports, graphs, and subject-wise analysis.'
    }
  ];

  return (
    <section id="features" className="py-16">
      <motion.div 
        className="text-center mb-16"
        {...slideUp}
      >
        <h2 className="text-3xl font-bold text-owl-slate-dark mb-4">Features</h2>
        <p className="text-owl-slate max-w-2xl mx-auto">
          Our platform provides a comprehensive suite of tools for personalizing education
          and tracking progress with curriculum-specific resources.
        </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerChildren}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
