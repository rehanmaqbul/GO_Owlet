import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface Child {
  id: string;
  name: string;
  avatar?: string;
  age?: number;
  grade?: string;
}

interface ChildrenCardsProps {
  children: Child[];
  onSelectChild: (childId: string) => void;
  selectedChildId?: string;
}

export const ChildrenCards = ({ children, onSelectChild, selectedChildId }: ChildrenCardsProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {children.map((child, index) => (
        <motion.div
          key={child.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card 
            className={`flex-shrink-0 cursor-pointer transition-all duration-300 w-48 ${
              selectedChildId === child.id 
                ? 'bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-300 shadow-lg' 
                : 'bg-white/70 hover:bg-white hover:shadow-md border-slate-200/60'
            }`}
            onClick={() => onSelectChild(child.id)}
          >
            <div className="p-4 flex items-center gap-3">
              <Avatar className={`h-14 w-14 border-2 transition-colors ${
                selectedChildId === child.id ? 'border-violet-400' : 'border-slate-200'
              }`}>
                <AvatarImage src={child.avatar || ''} alt={child.name} />
                <AvatarFallback className={`text-lg font-medium transition-colors ${
                  selectedChildId === child.id 
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {child.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className={`font-medium text-base transition-colors ${
                  selectedChildId === child.id ? 'text-violet-900' : 'text-slate-700'
                }`}>
                  {child.name}
                </h3>
                {child.grade && (
                  <p className={`text-xs transition-colors ${
                    selectedChildId === child.id ? 'text-violet-600' : 'text-slate-500'
                  }`}>
                    {child.grade}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}; 