import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Filter, 
  Trophy, 
  CheckCircle, 
  X 
} from 'lucide-react';

interface TasksHeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  totalTasks: number;
  completedTasks: number;
}

export default function TasksHeader({ 
  onSearch, 
  onFilterChange, 
  totalTasks, 
  completedTasks 
}: TasksHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };
  
  const filters = [
    { id: 'all', label: 'All Tasks', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'completed', label: 'Completed', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'pending', label: 'To Do', icon: <Trophy className="h-4 w-4" /> }
  ];
  
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="mb-8">
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 mb-6 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              My Learning Tasks
            </h1>
            <p className="text-white/90">
              Choose a subject below to start your learning adventure!
            </p>
            
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="bg-white/20 rounded-full px-4 py-2 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-300 mr-2" />
                <span className="text-white font-medium">
                  {completedTasks} of {totalTasks} tasks completed
                </span>
              </div>
              
              {progress >= 50 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 }}
                  className="bg-green-400/20 rounded-full px-4 py-2 flex items-center"
                >
                  <Sparkles className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-white font-medium">
                    {progress}% Progress - Amazing job!
                  </span>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="hidden md:block relative w-32 h-32">
            {/* Decorative elements */}
            <div className="absolute right-0 top-0 w-full h-full bg-white/10 rounded-full"></div>
            <div className="absolute right-8 bottom-4 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute left-4 top-8 w-8 h-8 bg-white/10 rounded-full"></div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20">
          <motion.div 
            className="h-full bg-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full"></div>
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative">
          <motion.div 
            className="flex items-center"
            animate={{ width: isSearchExpanded ? '100%' : '240px' }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for tasks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 py-2 w-full border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(false)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchQuery && (
        <Button 
          variant="ghost" 
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0"
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                >
                  <X className="h-3 w-3 text-gray-400" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-2">
          <span className="hidden sm:flex items-center text-sm text-gray-500">
            <Filter className="h-4 w-4 mr-1" />
            Filter:
          </span>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant="ghost"
                size="sm"
                className={`px-3 text-xs font-medium rounded-md flex items-center gap-1 ${
                  activeFilter === filter.id
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
                onClick={() => handleFilterClick(filter.id)}
              >
                {filter.icon}
                {filter.label}
        </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
