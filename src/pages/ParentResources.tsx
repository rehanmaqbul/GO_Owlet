import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Book, 
  BookOpen, 
  Download, 
  ExternalLink, 
  FileText, 
  Play, 
  Search, 
  Video,
  Share2,
  CheckCircle,
  Users
} from 'lucide-react';
import { mockChildren } from '@/components/parent/check-tasks/mockData';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Resource categories and their corresponding icons
const resourceCategories = [
  { id: 'all', name: 'All Resources', icon: FileText },
  { id: 'articles', name: 'Articles', icon: Book },
  { id: 'videos', name: 'Videos', icon: Video },
  { id: 'guides', name: 'Guides', icon: BookOpen },
];

// Define resource types
interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide';
  category: string;
  imageUrl?: string;
  link: string;
  duration?: string;
  author?: string;
  publishDate: string;
  recommended?: boolean;
}

// Mock resources data
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Developing Reading Habits in Children',
    description: 'Learn effective strategies to foster a love for reading in your children from an early age.',
    type: 'article',
    category: 'literacy',
    imageUrl: 'https://placehold.co/600x400/orange/white?text=Reading+Habits',
    link: '/resources/reading-habits',
    author: 'Dr. Emma Johnson',
    publishDate: '2023-05-15',
    recommended: true,
  },
  {
    id: '2',
    title: 'Math Activities for Elementary School Kids',
    description: 'Fun and engaging math activities that you can do with your children at home to reinforce their learning.',
    type: 'guide',
    category: 'mathematics',
    imageUrl: 'https://placehold.co/600x400/blue/white?text=Math+Activities',
    link: '/resources/math-activities',
    publishDate: '2023-06-22',
  },
  {
    id: '3',
    title: 'How to Support Your Child With Homework',
    description: 'Practical tips for helping your child with homework without doing it for them.',
    type: 'video',
    category: 'parenting',
    imageUrl: 'https://placehold.co/600x400/purple/white?text=Homework+Support',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '15:42',
    author: 'Sarah Williams, M.Ed',
    publishDate: '2023-04-30',
  },
  {
    id: '4',
    title: 'Digital Literacy for Modern Kids',
    description: 'Help your children navigate the digital world safely and responsibly.',
    type: 'article',
    category: 'technology',
    imageUrl: 'https://placehold.co/600x400/teal/white?text=Digital+Literacy',
    link: '/resources/digital-literacy',
    author: 'Tech Safety Institute',
    publishDate: '2023-07-10',
  },
  {
    id: '5',
    title: 'Encouraging Scientific Thinking at Home',
    description: 'Simple science experiments and activities that promote critical thinking and curiosity.',
    type: 'guide',
    category: 'science',
    imageUrl: 'https://placehold.co/600x400/green/white?text=Science+Thinking',
    link: '/resources/science-thinking',
    publishDate: '2023-08-05',
    recommended: true,
  },
  {
    id: '6',
    title: 'Helping Children Manage Anxiety About School',
    description: 'Recognize signs of school anxiety and learn techniques to help your child cope.',
    type: 'video',
    category: 'mental-health',
    imageUrl: 'https://placehold.co/600x400/red/white?text=School+Anxiety',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '22:15',
    author: 'Dr. Michael Chen, Child Psychologist',
    publishDate: '2023-09-01',
  },
];

const ParentResources = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [sharingResourceId, setSharingResourceId] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  
  // Filter resources based on active category and search query
  const filteredResources = mockResources.filter((resource) => {
    // Filter by category
    const categoryMatch = activeCategory === 'all' || 
                         (activeCategory === 'articles' && resource.type === 'article') ||
                         (activeCategory === 'videos' && resource.type === 'video') ||
                         (activeCategory === 'guides' && resource.type === 'guide');
    
    // Filter by search query
    const searchMatch = searchQuery === '' || 
                       resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       resource.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const handleReturnToDashboard = () => {
    navigate('/parent-dashboard');
  };
  
  const handleShareResource = (resourceId: string, childId: string) => {
    // In a real app, this would send the resource to the child's account
    const resource = mockResources.find(r => r.id === resourceId);
    const child = mockChildren.find(c => c.id === childId);
    
    if (resource && child) {
      toast({
        title: "Resource shared!",
        description: `"${resource.title}" has been shared with ${child.name}.`,
        duration: 3000,
      });
      
      // Reset state
      setSharingResourceId(null);
      setSelectedChild(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 flex justify-between items-start">
          <div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleReturnToDashboard}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-3xl font-bold text-white">Parent Resources</h1>
                </div>
                <p className="text-white/90 mt-2 ml-10">
                  Discover helpful materials to support your child's learning journey
            </p>
          </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute left-1/2 top-1/3 w-8 h-8 bg-white/10 rounded-full"></div>
          </motion.div>
          
          {/* Search and filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 shadow-sm"
                />
              </div>
              <Tabs 
                defaultValue="all" 
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  {resourceCategories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center gap-1.5 px-3"
                    >
                      <category.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Resource cards */}
          {filteredResources.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm"
            >
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-amber-500" />
                      </div>
              <h2 className="text-xl font-medium mb-2 text-gray-800">No Resources Found</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any resources that match your search criteria. Try adjusting your filters or search terms.
              </p>
                    <Button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
              >
                View All Resources
                    </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredResources.map((resource) => (
                    <motion.div 
                  key={resource.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Card className="h-full border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={resource.imageUrl} 
                        alt={resource.title} 
                        className="object-cover w-full h-full"
                      />
                      {resource.recommended && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                            Recommended
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className={`
                          ${resource.type === 'article' ? 'bg-blue-100 text-blue-500 hover:bg-blue-200' : ''}
                          ${resource.type === 'video' ? 'bg-red-100 text-red-500 hover:bg-red-200' : ''}
                          ${resource.type === 'guide' ? 'bg-green-100 text-green-500 hover:bg-green-200' : ''}
                        `}>
                          {resource.type === 'article' && <Book className="h-3 w-3 mr-1" />}
                          {resource.type === 'video' && <Play className="h-3 w-3 mr-1" />}
                          {resource.type === 'guide' && <BookOpen className="h-3 w-3 mr-1" />}
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                        <CardDescription>
                          {resource.type === 'video' && resource.duration && (
                            <span className="flex items-center text-xs text-gray-500 mb-1">
                              <Play className="h-3 w-3 mr-1" /> {resource.duration}
                            </span>
                          )}
                          {resource.author && (
                            <span className="text-sm text-gray-600">By {resource.author}</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-2 flex-grow">
                        <p className="text-gray-600 text-sm">
                          {resource.description}
                        </p>
                      </CardContent>
                      <CardFooter className="mt-auto pt-0 pb-4 flex flex-col gap-3">
                        <div className="flex justify-between w-full">
                          <div className="text-xs text-gray-500">
                            Published on {new Date(resource.publishDate).toLocaleDateString()}
                          </div>
                          <Button
                            variant="outline"
                            className="text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            asChild
                            size="sm"
                          >
                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                              {resource.type === 'video' ? (
                                <>Watch <ExternalLink className="ml-1 h-3 w-3" /></>
                              ) : resource.type === 'guide' ? (
                                <>Download <Download className="ml-1 h-3 w-3" /></>
                              ) : (
                                <>Read <ExternalLink className="ml-1 h-3 w-3" /></>
                              )}
                            </a>
                          </Button>
                        </div>
                        
                        <Popover 
                          open={sharingResourceId === resource.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setSharingResourceId(resource.id);
                              setSelectedChild(null);
                            } else {
                              setSharingResourceId(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                              className="w-full h-10 text-amber-500 border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                    >
                              <Share2 className="mr-2 h-4 w-4" /> Share with Child
                    </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-4">
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-amber-500" />
                                <h4 className="font-medium">Share with Child</h4>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                {mockChildren.map((child) => (
                                  <div
                                    key={child.id}
                                    onClick={() => setSelectedChild(child.id)}
                                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                      selectedChild === child.id 
                                        ? 'bg-amber-100 text-amber-900' 
                                        : 'hover:bg-gray-50'
                                    }`}
                                  >
                                    <Avatar className="h-7 w-7">
                                      <AvatarFallback className={`${
                                        selectedChild === child.id
                                          ? 'bg-amber-200 text-amber-800'
                                          : 'bg-gray-200 text-gray-600'
                                      }`}>
                                        {child.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium truncate">{child.name}</span>
                                    {selectedChild === child.id && (
                                      <CheckCircle className="h-4 w-4 text-amber-500 ml-auto" />
                                    )}
                                  </div>
                                ))}
                              </div>
                    
                    <Button
                                className="w-full bg-amber-500 hover:bg-amber-600"
                                disabled={!selectedChild}
                                onClick={() => {
                                  if (selectedChild) {
                                    handleShareResource(resource.id, selectedChild);
                                  }
                                }}
                              >
                                Send Resource
                    </Button>
                  </div>
                          </PopoverContent>
                        </Popover>
                      </CardFooter>
                    </div>
          </Card>
        </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      
      <footer className="py-6 text-center text-owl-slate">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          © {new Date().getFullYear()} Guardian Owlet. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
};

export default ParentResources;
