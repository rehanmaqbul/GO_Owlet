import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Gamepad2,
  Brain,
  Puzzle,
  Medal,
  Users,
  Star,
  Clock,
  BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for games
const games = [
  {
    id: 1,
    title: "Math Monsters",
    category: "Mathematics",
    level: "Beginner",
    players: "Single Player",
    description: "Defeat monsters by solving math problems!",
    image: "https://placehold.co/300x200/7ec8e3/ffffff?text=Math+Monsters",
    playedCount: 1203,
    recentlyAdded: false,
    popular: true,
    skillsFocused: ["Problem Solving", "Arithmetic"]
  },
  {
    id: 2,
    title: "Word Wizards",
    category: "Language",
    level: "Intermediate",
    players: "Multiplayer",
    description: "Build your vocabulary in this fast-paced word game",
    image: "https://placehold.co/300x200/ffd966/ffffff?text=Word+Wizards",
    playedCount: 956,
    recentlyAdded: false,
    popular: true,
    skillsFocused: ["Vocabulary", "Spelling"]
  },
  {
    id: 3,
    title: "Science Quest",
    category: "Science",
    level: "Advanced",
    players: "Single Player",
    description: "Explore scientific concepts through challenging puzzles",
    image: "https://placehold.co/300x200/a7c957/ffffff?text=Science+Quest",
    playedCount: 745,
    recentlyAdded: true,
    popular: false,
    skillsFocused: ["Critical Thinking", "Scientific Knowledge"]
  },
  {
    id: 4,
    title: "History Heroes",
    category: "History",
    level: "Intermediate",
    players: "Multiplayer",
    description: "Travel through time and learn about historical events",
    image: "https://placehold.co/300x200/ffb4a2/ffffff?text=History+Heroes",
    playedCount: 612,
    recentlyAdded: true,
    popular: false,
    skillsFocused: ["Memory", "Historical Knowledge"]
  },
  {
    id: 5,
    title: "Code Breakers",
    category: "Coding",
    level: "Beginner",
    players: "Single Player",
    description: "Learn coding concepts through fun puzzle challenges",
    image: "https://placehold.co/300x200/b5e48c/ffffff?text=Code+Breakers",
    playedCount: 823,
    recentlyAdded: false,
    popular: true,
    skillsFocused: ["Logic", "Problem Solving"]
  },
  {
    id: 6,
    title: "Geography Explorer",
    category: "Geography",
    level: "Beginner",
    players: "Single Player",
    description: "Explore countries, continents and landmarks around the world",
    image: "https://placehold.co/300x200/cdb4db/ffffff?text=Geography+Explorer",
    playedCount: 542,
    recentlyAdded: true,
    popular: false,
    skillsFocused: ["Spatial Awareness", "General Knowledge"]
  }
];

// Player stats
const playerStats = {
  gamesPlayed: 42,
  pointsEarned: 1450,
  highestScore: 280,
  badges: 7,
  achievements: [
    { title: "Quick Learner", description: "Complete 5 games in one day", completed: true },
    { title: "Math Wizard", description: "Score 100 points in Math games", completed: true },
    { title: "Explorer", description: "Try games from all categories", completed: false },
    { title: "Champion", description: "Win 10 multiplayer games", completed: false }
  ],
  recentlyPlayed: [
    { id: 1, name: "Math Monsters", score: 85, date: "2023-05-15" },
    { id: 2, name: "Word Wizards", score: 92, date: "2023-05-14" },
    { id: 5, name: "Code Breakers", score: 76, date: "2023-05-12" }
  ]
};

// Game categories
const categories = [
  "All Games",
  "Mathematics",
  "Language",
  "Science",
  "History",
  "Coding",
  "Geography"
];

const FunGames = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Games");
  const [selectedTab, setSelectedTab] = useState("all");
  
  useEffect(() => {
    document.title = "Fun Games | Owlet";
  }, []);
  
  // Redirect if not authenticated or not a child
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (user.role !== 'child') {
    navigate('/dashboard');
    return null;
  }
  
  // Filter games based on category and selected tab
  const getFilteredGames = () => {
    let filtered = games;
    
    // Filter by category
    if (selectedCategory !== "All Games") {
      filtered = filtered.filter(game => game.category === selectedCategory);
    }
    
    // Filter by tab
    if (selectedTab === "popular") {
      filtered = filtered.filter(game => game.popular);
    } else if (selectedTab === "new") {
      filtered = filtered.filter(game => game.recentlyAdded);
    }
    
    return filtered;
  };
  
  const filteredGames = getFilteredGames();
  
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
              <h1 className="text-2xl font-bold text-gray-800">Fun Games</h1>
              <p className="text-gray-600">Learn while having fun with educational games</p>
            </div>
          </div>
          
          {/* Player Stats */}
          <section className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl p-6 border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-3">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Gaming Stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Games Played</p>
                    <p className="text-2xl font-bold text-gray-800">{playerStats.gamesPlayed}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Points Earned</p>
                    <p className="text-2xl font-bold text-gray-800">{playerStats.pointsEarned}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Highest Score</p>
                    <p className="text-2xl font-bold text-gray-800">{playerStats.highestScore}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Badges Earned</p>
                    <p className="text-2xl font-bold text-gray-800">{playerStats.badges}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">Achievements</h3>
                <div className="space-y-2">
                  {playerStats.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${achievement.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <p className="text-sm text-gray-700 font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-500 ml-2">- {achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-span-1">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Recently Played</h3>
                <div className="space-y-3">
                  {playerStats.recentlyPlayed.map((game, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-medium text-gray-800">{game.name}</p>
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-500">{game.date}</p>
                        <p className="text-amber-600 font-medium">{game.score} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* Games Section */}
          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
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
              
              {/* Tabs */}
              <Tabs 
                defaultValue="all" 
                className="w-full sm:w-auto"
                onValueChange={setSelectedTab}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Games</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map(game => (
                <Card key={game.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${game.image})` }}
                  >
                    <div className="flex justify-between p-3">
                      <Badge className="bg-white/80 text-gray-700">{game.category}</Badge>
                      {game.recentlyAdded && (
                        <Badge className="bg-green-500 text-white">New</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{game.title}</h3>
                      <Badge variant="outline" className="text-amber-700 border-amber-200">
                        {game.level}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{game.players}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gamepad2 className="h-3 w-3" />
                        <span>{game.playedCount} plays</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {game.skillsFocused.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-700 border-none">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {filteredGames.length === 0 && (
                <div className="col-span-3 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Gamepad2 className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No Games Found</h3>
                  <p className="text-gray-600 mb-3">
                    We couldn't find any games for {selectedCategory} in the {selectedTab} category.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-amber-200 text-amber-700 hover:bg-amber-100"
                    onClick={() => {
                      setSelectedCategory("All Games");
                      setSelectedTab("all");
                    }}
                  >
                    View All Games
                  </Button>
                </div>
              )}
            </div>
          </section>
          
          {/* Featured Game */}
          <section className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 text-white">
                <Badge className="bg-white/20 text-white mb-4">Featured Game</Badge>
                <h2 className="text-2xl font-bold mb-2">Brain Teasers Challenge</h2>
                <p className="mb-4 opacity-90">
                  Test your critical thinking skills with our new brain teasers collection! 
                  Solve puzzles, riddles, and logic problems to earn extra points!
                </p>
                <div className="flex gap-2 mb-6">
                  <Badge className="bg-white/20 text-white">Logic</Badge>
                  <Badge className="bg-white/20 text-white">Problem Solving</Badge>
                  <Badge className="bg-white/20 text-white">Critical Thinking</Badge>
                </div>
                <Button className="bg-white text-amber-700 hover:bg-amber-50">
                  Try It Now
                </Button>
              </div>
              <div className="bg-cover bg-center hidden md:block" style={{ backgroundImage: "url(https://placehold.co/500x300/f3b664/ffffff?text=Brain+Teasers)" }}></div>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default FunGames; 