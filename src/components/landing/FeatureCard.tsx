
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div 
      className="glass p-6 rounded-lg shadow-subtle"
      variants={fadeIn}
    >
      <div className="h-12 w-12 bg-owl-blue-light rounded-full flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-owl-blue" />
      </div>
      <h3 className="text-xl font-semibold text-owl-slate-dark mb-2">
        {title}
      </h3>
      <p className="text-owl-slate">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
