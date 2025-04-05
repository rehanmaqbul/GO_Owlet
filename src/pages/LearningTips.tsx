import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Search,
  Bookmark,
  Share2,
  ThumbsUp,
  Clock,
  Brain,
  LightbulbIcon,
  BookOpen,
  PencilRuler,
  Calendar,
  Sparkles,
  Library,
  HeartPulse,
  GraduationCap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for learning tips
const learningTips = [
  {
    id: 1,
    title: "The Pomodoro Technique",
    description: "Study for 25 minutes, then take a 5-minute break. Repeat 4 times, then take a longer 15-30 minute break.",
    category: "Study Habits",
    icon: <Clock className="h-5 w-5" />,
    likes: 258,
    isSaved: true,
    difficulty: "Easy",
    timeToImplement: "Immediate"
  },
  {
    id: 2,
    title: "Create Mind Maps",
    description: "Organize information visually with mind maps to connect related concepts and improve recall.",
    category: "Memory Techniques",
    icon: <Brain className="h-5 w-5" />,
    likes: 183,
    isSaved: false,
    difficulty: "Medium",
    timeToImplement: "1-2 days"
  },
  {
    id: 3,
    title: "Active Recall Practice",
    description: "Test yourself on material rather than re-reading. Try to recall information from memory to strengthen learning.",
    category: "Memory Techniques",
    icon: <LightbulbIcon className="h-5 w-5" />,
    likes: 325,
    isSaved: true,
    difficulty: "Medium",
    timeToImplement: "Immediate"
  },
  {
    id: 4,
    title: "Spaced Repetition",
    description: "Review material at increasing intervals over time to improve long-term retention.",
    category: "Memory Techniques",
    icon: <Calendar className="h-5 w-5" />,
    likes: 196,
    isSaved: false,
    difficulty: "Hard",
    timeToImplement: "1 week+"
  },
  {
    id: 5,
    title: "Teach Someone Else",
    description: "Explaining concepts to others reinforces your understanding and helps identify knowledge gaps.",
    category: "Comprehension",
    icon: <GraduationCap className="h-5 w-5" />,
    likes: 212,
    isSaved: false,
    difficulty: "Easy",
    timeToImplement: "Immediate"
  },
  {
    id: 6,
    title: "Create a Dedicated Study Space",
    description: "Set up a consistent, distraction-free environment for studying to improve focus and productivity.",
    category: "Environment",
    icon: <Library className="h-5 w-5" />,
    likes: 157,
    isSaved: true,
    difficulty: "Medium",
    timeToImplement: "1-2 days"
  },
  {
    id: 7,
    title: "Use Mnemonic Devices",
    description: "Create acronyms, rhymes, or visual associations to remember complex information more easily.",
    category: "Memory Techniques",
    icon: <Sparkles className="h-5 w-5" />,
    likes: 178,
    isSaved: false,
    difficulty: "Easy",
    timeToImplement: "Immediate"
  },
  {
    id: 8,
    title: "Take Care of Your Health",
    description: "Ensure you get enough sleep, exercise, and healthy food to optimize your brain's performance.",
    category: "Well-being",
    icon: <HeartPulse className="h-5 w-5" />,
    likes: 234,
    isSaved: false,
    difficulty: "Medium",
    timeToImplement: "Ongoing"
  }
];

// Featured tip of the day
const tipOfTheDay = {
  title: "Dual Coding Theory",
  description: "Combine words and visuals when studying to engage both verbal and visual processing channels in your brain, which can significantly improve learning and retention.",
  category: "Memory Techniques",
  author: "Learning Team",
  date: "June 15, 2023"
};

// Learning tip categories
const categories = [
  "All Tips",
  "Study Habits",
  "Memory Techniques",
  "Comprehension",
  "Environment",
  "Well-being"
];

const LearningTips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Tips");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedTips, setSavedTips] = useState(
    learningTips.filter(tip => tip.isSaved).map(tip => tip.id)
  );
  
  // Redirect if not authenticated or not a child
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (user.role !== 'child') {
    navigate('/dashboard');
    return null;
  }
  
  // Filter tips by category and search query
  const getFilteredTips = () => {
    let filtered = learningTips;
    
    // Filter by category
    if (selectedCategory !== "All Tips") {
      filtered = filtered.filter(tip => tip.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tip => 
          tip.title.toLowerCase().includes(query) || 
          tip.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  // Toggle saved status of a tip
  const toggleSaved = (tipId: number) => {
    if (savedTips.includes(tipId)) {
      setSavedTips(savedTips.filter(id => id !== tipId));
    } else {
      setSavedTips([...savedTips, tipId]);
    }
  };
  
  const filteredTips = getFilteredTips();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/child-dashboard')}
              className="rounded-full bg-white shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 text-amber-700" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Learning Tips</h1>
              <p className="text-gray-600">Discover strategies to improve your learning</p>
            </div>
          </div>
          
          {/* Tip of the Day */}
          <section className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl p-6 border border-amber-200">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-grow">
                <Badge className="bg-amber-200 text-amber-800 mb-2">Tip of the Day</Badge>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{tipOfTheDay.title}</h2>
                <p className="text-gray-600 mb-4">{tipOfTheDay.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Badge variant="outline" className="border-amber-200">
                    {tipOfTheDay.category}
                  </Badge>
                  <span>•</span>
                  <span>By {tipOfTheDay.author}</span>
                  <span>•</span>
                  <span>{tipOfTheDay.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-100">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-100">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </section>
          
          {/* Search and filters */}
          <section>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search for learning tips..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-amber-200 focus-visible:ring-amber-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category 
                    ? "bg-amber-600 hover:bg-amber-700 text-white" 
                    : "border-amber-200 text-amber-700 hover:bg-amber-100"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </section>
          
          {/* Learning Tips */}
          <section>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Tips</TabsTrigger>
                <TabsTrigger value="saved">Saved Tips</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTips.map(tip => (
                    <Card key={tip.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                            {tip.icon}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-amber-700 hover:bg-amber-100"
                              onClick={() => toggleSaved(tip.id)}
                            >
                              <Bookmark 
                                className="h-4 w-4" 
                                fill={savedTips.includes(tip.id) ? "currentColor" : "none"} 
                              />
                            </Button>
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{tip.likes}</span>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2">{tip.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{tip.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="border-amber-200 text-amber-700">
                            {tip.category}
                          </Badge>
                          <div className="flex gap-2">
                            <Badge className="bg-amber-100 text-amber-800">
                              {tip.difficulty}
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-800">
                              {tip.timeToImplement}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredTips.length === 0 && (
                    <div className="col-span-3 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <LightbulbIcon className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No Tips Found</h3>
                      <p className="text-gray-600 mb-3">
                        We couldn't find any tips matching your search criteria.
                      </p>
                      <Button 
                        variant="outline"
                        className="border-amber-200 text-amber-700 hover:bg-amber-100"
                        onClick={() => {
                          setSelectedCategory("All Tips");
                          setSearchQuery("");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="saved" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningTips
                    .filter(tip => savedTips.includes(tip.id))
                    .map(tip => (
                      <Card key={tip.id} className="hover:shadow-md transition-all">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                              {tip.icon}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-amber-700 hover:bg-amber-100"
                                onClick={() => toggleSaved(tip.id)}
                              >
                                <Bookmark 
                                  className="h-4 w-4" 
                                  fill="currentColor"
                                />
                              </Button>
                              <div className="flex items-center gap-1 text-gray-500 text-sm">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{tip.likes}</span>
                              </div>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-gray-800 mb-2">{tip.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{tip.description}</p>
                          
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="border-amber-200 text-amber-700">
                              {tip.category}
                            </Badge>
                            <div className="flex gap-2">
                              <Badge className="bg-amber-100 text-amber-800">
                                {tip.difficulty}
                              </Badge>
                              <Badge className="bg-gray-100 text-gray-800">
                                {tip.timeToImplement}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  
                  {learningTips.filter(tip => savedTips.includes(tip.id)).length === 0 && (
                    <div className="col-span-3 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <Bookmark className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No Saved Tips</h3>
                      <p className="text-gray-600 mb-3">
                        You haven't saved any learning tips yet. Browse tips and bookmark them to find them here.
                      </p>
                      <Button 
                        variant="outline"
                        className="border-amber-200 text-amber-700 hover:bg-amber-100"
                        onClick={() => {
                          document.querySelector('[data-value="all"]')?.click();
                        }}
                      >
                        Browse All Tips
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </section>
          
          {/* Weekly Learning Challenge */}
          <section className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="p-8 text-white col-span-3">
                <Badge className="bg-white/20 text-white mb-4">Weekly Challenge</Badge>
                <h2 className="text-2xl font-bold mb-2">Memory Mastery Challenge</h2>
                <p className="mb-4 opacity-90">
                  Try at least 3 different memory techniques this week and track which works best for you!
                  Share your results with your teacher to earn special rewards.
                </p>
                <div className="flex gap-2 mb-6">
                  <Badge className="bg-white/20 text-white">5 Days Remaining</Badge>
                  <Badge className="bg-white/20 text-white">Earn 150 Points</Badge>
                </div>
                <Button className="bg-white text-amber-700 hover:bg-amber-50">
                  Accept Challenge
                </Button>
              </div>
              <div className="col-span-2 bg-amber-200 hidden md:flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl mb-2">🧠</div>
                  <div className="text-amber-800 font-bold">Boost Your Memory</div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Learning Resources Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Study Guides</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Access our collection of study guides for all subjects to improve your understanding.
                  </p>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                    Browse Guides
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-full text-purple-700">
                      <Brain className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Learning Styles Quiz</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Discover your unique learning style and get personalized tips that work best for you.
                  </p>
                  <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                    Take Quiz
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-700">
                      <PencilRuler className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Printable Worksheets</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Download and print helpful worksheets, planners, and study organizers.
                  </p>
                  <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                    Download Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default LearningTips;