import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Trophy,
  Medal,
  Gift,
  Star,
  Clock,
  BadgePlus,
  Download,
  Sparkles,
  Crown,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for badges
const badges = [
  {
    id: 1,
    name: "Math Whiz",
    description: "Completed 10 math tasks with high scores",
    icon: "🧮",
    earnedOn: "2023-04-15",
    category: "Academic",
    level: "Bronze",
    earned: true
  },
  {
    id: 2,
    name: "Science Explorer",
    description: "Completed all lessons in the science module",
    icon: "🔬",
    earnedOn: "2023-05-02",
    category: "Academic",
    level: "Silver",
    earned: true
  },
  {
    id: 3,
    name: "Reading Champion",
    description: "Read 5 books and answered all comprehension questions correctly",
    icon: "📚",
    earnedOn: "2023-03-20",
    category: "Academic",
    level: "Gold",
    earned: true
  },
  {
    id: 4,
    name: "Quick Thinker",
    description: "Completed 5 timed challenges under the time limit",
    icon: "⏱️",
    earnedOn: "2023-05-10",
    category: "Skills",
    level: "Bronze",
    earned: true
  },
  {
    id: 5,
    name: "Team Player",
    description: "Participated in 3 group activities",
    icon: "👫",
    category: "Social",
    level: "Silver",
    earned: false
  },
  {
    id: 6,
    name: "Creative Genius",
    description: "Submitted 3 original projects to the gallery",
    icon: "🎨",
    category: "Creative",
    level: "Gold",
    earned: false
  },
  {
    id: 7,
    name: "Coding Ninja",
    description: "Completed the entire coding module",
    icon: "💻",
    category: "Skills",
    level: "Platinum",
    earned: false
  },
  {
    id: 8,
    name: "Perfect Attendance",
    description: "Logged in for 10 consecutive days",
    icon: "📅",
    earnedOn: "2023-04-28",
    category: "Engagement",
    level: "Bronze",
    earned: true
  }
];

// Mock data for rewards
const rewards = [
  {
    id: 1,
    name: "Custom Profile Theme",
    description: "Unlock a special profile background and theme",
    points: 500,
    icon: "🎨",
    category: "Customization",
    available: true
  },
  {
    id: 2,
    name: "Extra Game Time",
    description: "Get an extra 15 minutes of game time",
    points: 300,
    icon: "🎮",
    category: "Activities",
    available: true
  },
  {
    id: 3,
    name: "Digital Certificate",
    description: "Printable achievement certificate signed by your teacher",
    points: 800,
    icon: "📜",
    category: "Recognition",
    available: true
  },
  {
    id: 4,
    name: "Bonus Mission",
    description: "Unlock a special bonus mission with extra rewards",
    points: 1000,
    icon: "🚀",
    category: "Activities",
    available: false
  },
  {
    id: 5,
    name: "Virtual Pet",
    description: "Adopt a virtual pet that grows as you learn",
    points: 1200,
    icon: "🐶",
    category: "Customization",
    available: true
  },
  {
    id: 6,
    name: "Story Creator",
    description: "Unlock the story creation tool to write your own adventures",
    points: 1500,
    icon: "📝",
    category: "Creative",
    available: false
  }
];

// User reward stats
const rewardStats = {
  currentPoints: 950,
  totalPointsEarned: 1650,
  badgesEarned: 5,
  rewardsRedeemed: 2,
  streak: 12,
  level: 8,
  xpToNextLevel: {
    current: 750,
    required: 1000
  }
};

const MyRewards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedBadgeCategory, setSelectedBadgeCategory] = useState("All");
  const [selectedRewardCategory, setSelectedRewardCategory] = useState("All");
  
  // Redirect if not authenticated or not a child
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (user.role !== 'child') {
    navigate('/dashboard');
    return null;
  }
  
  // Filter badges by category and earned status
  const getFilteredBadges = (category: string, earnedOnly: boolean = false) => {
    let filtered = badges;
    
    if (category !== "All") {
      filtered = filtered.filter(badge => badge.category === category);
    }
    
    if (earnedOnly) {
      filtered = filtered.filter(badge => badge.earned);
    }
    
    return filtered;
  };
  
  // Filter rewards by category and availability
  const getFilteredRewards = (category: string) => {
    let filtered = rewards;
    
    if (category !== "All") {
      filtered = filtered.filter(reward => reward.category === category);
    }
    
    return filtered;
  };
  
  const badgeCategories = ["All", "Academic", "Skills", "Social", "Creative", "Engagement"];
  const rewardCategories = ["All", "Customization", "Activities", "Recognition", "Creative"];
  
  const earnedBadges = badges.filter(badge => badge.earned);
  const availableRewards = rewards.filter(reward => reward.available);
  
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
              <h1 className="text-2xl font-bold text-gray-800">My Rewards</h1>
              <p className="text-gray-600">Track your progress and redeem rewards</p>
            </div>
          </div>
          
          {/* Reward Stats Card */}
          <section className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl p-6 border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Rewards Dashboard</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-5 w-5 text-amber-500" />
                      <p className="text-sm text-gray-500">Current Points</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{rewardStats.currentPoints}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <p className="text-sm text-gray-500">Total Earned</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{rewardStats.totalPointsEarned}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Medal className="h-5 w-5 text-amber-500" />
                      <p className="text-sm text-gray-500">Badges Earned</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{rewardStats.badgesEarned}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="h-5 w-5 text-amber-500" />
                      <p className="text-sm text-gray-500">Rewards Redeemed</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{rewardStats.rewardsRedeemed}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <Crown className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Level {rewardStats.level}</h3>
                      <p className="text-sm text-gray-600">Explorer</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">XP Progress</span>
                      <span className="text-amber-600 font-medium">{rewardStats.xpToNextLevel.current}/{rewardStats.xpToNextLevel.required}</span>
                    </div>
                    <Progress 
                      value={(rewardStats.xpToNextLevel.current / rewardStats.xpToNextLevel.required) * 100} 
                      className="h-2 bg-amber-100" 
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    Earn {rewardStats.xpToNextLevel.required - rewardStats.xpToNextLevel.current} more XP to reach Level {rewardStats.level + 1}
                  </p>
                  
                  <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{rewardStats.streak} Day Streak!</p>
                      <p className="text-xs text-gray-600">Keep it up to earn bonus points</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Badges Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Badges</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Earned: {earnedBadges.length}/{badges.length}</span>
                <Progress 
                  value={(earnedBadges.length / badges.length) * 100} 
                  className="w-24 h-2 bg-amber-100" 
                />
              </div>
            </div>
            
            <Tabs defaultValue="earned">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {badgeCategories.map(category => (
                    <Button
                      key={category}
                      variant={selectedBadgeCategory === category ? "default" : "outline"}
                      className={selectedBadgeCategory === category 
                        ? "bg-amber-600 hover:bg-amber-700 text-white" 
                        : "border-amber-200 text-amber-700 hover:bg-amber-100"
                      }
                      size="sm"
                      onClick={() => setSelectedBadgeCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                
                <TabsList className="grid w-full sm:w-52 grid-cols-2">
                  <TabsTrigger value="earned">Earned</TabsTrigger>
                  <TabsTrigger value="all">All Badges</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="earned" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getFilteredBadges(selectedBadgeCategory, true).map(badge => (
                    <Card key={badge.id} className={`hover:shadow-md transition-all ${
                      badge.level === 'Bronze' ? 'border-amber-200' :
                      badge.level === 'Silver' ? 'border-gray-300' :
                      badge.level === 'Gold' ? 'border-yellow-400' :
                      'border-purple-300'
                    }`}>
                      <CardContent className="p-4 text-center">
                        <div className="mb-3 text-4xl">{badge.icon}</div>
                        <Badge className={`mb-2 ${
                          badge.level === 'Bronze' ? 'bg-amber-100 text-amber-800' :
                          badge.level === 'Silver' ? 'bg-gray-200 text-gray-800' :
                          badge.level === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {badge.level}
                        </Badge>
                        <h3 className="font-semibold text-gray-800 mb-1">{badge.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                        <p className="text-xs text-gray-500">Earned on {badge.earnedOn}</p>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getFilteredBadges(selectedBadgeCategory, true).length === 0 && (
                    <div className="col-span-4 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <Medal className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No Badges Found</h3>
                      <p className="text-gray-600 mb-3">
                        You haven't earned any badges in this category yet.
                      </p>
                      <Button 
                        variant="outline"
                        className="border-amber-200 text-amber-700 hover:bg-amber-100"
                        onClick={() => setSelectedBadgeCategory("All")}
                      >
                        View All Categories
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getFilteredBadges(selectedBadgeCategory).map(badge => (
                    <Card key={badge.id} className={`${!badge.earned ? 'opacity-60 grayscale' : ''} hover:shadow-md transition-all ${
                      badge.level === 'Bronze' ? 'border-amber-200' :
                      badge.level === 'Silver' ? 'border-gray-300' :
                      badge.level === 'Gold' ? 'border-yellow-400' :
                      'border-purple-300'
                    }`}>
                      <CardContent className="p-4 text-center">
                        <div className="mb-3 text-4xl">{badge.icon}</div>
                        <Badge className={`mb-2 ${
                          badge.level === 'Bronze' ? 'bg-amber-100 text-amber-800' :
                          badge.level === 'Silver' ? 'bg-gray-200 text-gray-800' :
                          badge.level === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {badge.level}
                        </Badge>
                        <h3 className="font-semibold text-gray-800 mb-1">{badge.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                        {badge.earned ? (
                          <p className="text-xs text-gray-500">Earned on {badge.earnedOn}</p>
                        ) : (
                          <p className="text-xs text-amber-600 font-medium">Not yet earned</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getFilteredBadges(selectedBadgeCategory).length === 0 && (
                    <div className="col-span-4 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <Medal className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No Badges Found</h3>
                      <p className="text-gray-600 mb-3">
                        There are no badges in this category.
                      </p>
                      <Button 
                        variant="outline"
                        className="border-amber-200 text-amber-700 hover:bg-amber-100"
                        onClick={() => setSelectedBadgeCategory("All")}
                      >
                        View All Categories
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </section>
          
          {/* Rewards Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Available Rewards</h2>
              <Badge className="bg-amber-100 text-amber-800">
                {rewardStats.currentPoints} Points Available
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {rewardCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedRewardCategory === category ? "default" : "outline"}
                  className={selectedRewardCategory === category 
                    ? "bg-amber-600 hover:bg-amber-700 text-white" 
                    : "border-amber-200 text-amber-700 hover:bg-amber-100"
                  }
                  size="sm"
                  onClick={() => setSelectedRewardCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {getFilteredRewards(selectedRewardCategory).map(reward => (
                <Card key={reward.id} className={`hover:shadow-md transition-all ${!reward.available ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{reward.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{reward.name}</h3>
                          <Badge className="bg-amber-100 text-amber-800">
                            {reward.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={reward.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {reward.points} pts
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                    
                    <Button 
                      className="w-full"
                      disabled={!reward.available || rewardStats.currentPoints < reward.points}
                      variant={rewardStats.currentPoints >= reward.points ? "default" : "outline"}
                    >
                      {rewardStats.currentPoints >= reward.points ? 'Redeem Reward' : `Need ${reward.points - rewardStats.currentPoints} more points`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {getFilteredRewards(selectedRewardCategory).length === 0 && (
                <div className="col-span-3 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Gift className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No Rewards Found</h3>
                  <p className="text-gray-600 mb-3">
                    There are no rewards available in this category.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-amber-200 text-amber-700 hover:bg-amber-100"
                    onClick={() => setSelectedRewardCategory("All")}
                  >
                    View All Categories
                  </Button>
                </div>
              )}
            </div>
          </section>
          
          {/* Special Reward Callout */}
          <section className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="p-8 text-white col-span-3">
                <Badge className="bg-white/20 text-white mb-4">Special Reward</Badge>
                <h2 className="text-2xl font-bold mb-2">Certificate of Achievement</h2>
                <p className="mb-4 opacity-90">
                  Complete all Math and Science modules to earn a special certificate signed by your teacher!
                  Show your parents and hang it on your wall.
                </p>
                <div className="flex gap-2 mb-6">
                  <Badge className="bg-white/20 text-white">Limited Time</Badge>
                  <Badge className="bg-white/20 text-white">Premium Reward</Badge>
                </div>
                <Button className="bg-white text-amber-700 hover:bg-amber-50">
                  <Download className="mr-2 h-4 w-4" />
                  View Requirements
                </Button>
              </div>
              <div className="col-span-2 bg-amber-200 hidden md:flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl mb-2">🏆</div>
                  <div className="text-amber-800 font-bold">Premium Reward</div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Coming Soon Rewards */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Coming Soon</h2>
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">New Rewards Coming Soon!</h3>
                    <p className="text-gray-600">We're adding exciting new rewards next week</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                    <h4 className="font-medium text-gray-800 mb-1">Premium Badges</h4>
                    <p className="text-sm text-gray-600">Special badges for top achievers</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <BadgePlus className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                    <h4 className="font-medium text-gray-800 mb-1">Custom Avatars</h4>
                    <p className="text-sm text-gray-600">Design your own character</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <Crown className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                    <h4 className="font-medium text-gray-800 mb-1">Leaderboard Rewards</h4>
                    <p className="text-sm text-gray-600">Special prizes for top students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default MyRewards; 