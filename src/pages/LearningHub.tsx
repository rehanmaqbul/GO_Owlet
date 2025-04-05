import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Video, 
  FileText, 
  ArrowLeft, 
  Star, 
  BookMarked, 
  Clock, 
  Puzzle, 
  Brain,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ActionCard } from '@/components/ui/ActionCard';

// Mock data for learning activities
const learningActivities = [
  {
    id: 1,
    title: "Introduction to Fractions",
    subject: "Mathematics",
    type: "Lesson",
    duration: "15 min",
    level: "Beginner",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700"
  },
  {
    id: 2,
    title: "Solar System Adventure",
    subject: "Science",
    type: "Interactive",
    duration: "20 min",
    level: "Intermediate",
    icon: Puzzle,
    color: "bg-green-100 text-green-700"
  },
  {
    id: 3,
    title: "Story Time: The Little Prince",
    subject: "English",
    type: "Reading",
    duration: "25 min",
    level: "Beginner",
    icon: BookMarked,
    color: "bg-purple-100 text-purple-700"
  },
  {
    id: 4,
    title: "World Geography Quiz",
    subject: "Social Studies",
    type: "Quiz",
    duration: "10 min",
    level: "Advanced",
    icon: Brain,
    color: "bg-amber-100 text-amber-700"
  },
  {
    id: 5,
    title: "Art of Color Mixing",
    subject: "Art",
    type: "Video",
    duration: "12 min",
    level: "Beginner",
    icon: Video,
    color: "bg-red-100 text-red-700"
  },
  {
    id: 6,
    title: "Musical Notes Introduction",
    subject: "Music",
    type: "Interactive",
    duration: "15 min",
    level: "Beginner",
    icon: FileText,
    color: "bg-indigo-100 text-indigo-700"
  }
];

// Featured special activities
const featuredActivities = [
  {
    title: "Daily Challenge",
    description: "Complete today's special challenge",
    icon: Star,
    buttonText: "Take Challenge",
    onClick: () => {}
  },
  {
    title: "Recommended for You",
    description: "Personalized learning activities",
    icon: Lightbulb,
    buttonText: "Explore",
    onClick: () => {}
  },
  {
    title: "Quick Exercise",
    description: "5-minute brain boosters",
    icon: Clock,
    buttonText: "Start Now",
    onClick: () => {}
  }
];

// Subject filters
const subjects = [
  "All Subjects",
  "Mathematics",
  "Science",
  "English",
  "Social Studies",
  "Art",
  "Music"
];

const LearningHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  
  // Redirect if not authenticated or not a child
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (user.role !== 'child') {
    navigate('/dashboard');
    return null;
  }
  
  // Filter activities by selected subject
  const filteredActivities = selectedSubject === "All Subjects" 
    ? learningActivities 
    : learningActivities.filter(activity => activity.subject === selectedSubject);
  
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
              <h1 className="text-2xl font-bold text-gray-800">Learning Hub</h1>
              <p className="text-gray-600">Discover fun activities and lessons</p>
            </div>
          </div>
          
          {/* Featured Activities */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Featured Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredActivities.map((activity, index) => (
                <ActionCard
                  key={index}
                  title={activity.title}
                  description={activity.description}
                  icon={activity.icon}
                  buttonText={activity.buttonText}
                  onClick={activity.onClick}
                />
              ))}
            </div>
          </section>
          
          {/* Subject Filters */}
          <section>
            <div className="flex flex-wrap gap-2 mb-4">
              {subjects.map(subject => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "outline"}
                  className={selectedSubject === subject 
                    ? "bg-amber-600 hover:bg-amber-700 text-white" 
                    : "border-amber-200 text-amber-700 hover:bg-amber-100"
                  }
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </Button>
              ))}
            </div>
          </section>
          
          {/* Learning Activities */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedSubject === "All Subjects" ? "All Learning Activities" : `${selectedSubject} Activities`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map(activity => (
                <Card key={activity.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`${activity.color} p-4 flex items-center gap-3`}>
                    <activity.icon className="h-6 w-6" />
                    <div>
                      <Badge className="bg-white/80 text-gray-700">{activity.type}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{activity.subject}</p>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span>{activity.level}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Start Activity
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {filteredActivities.length === 0 && (
                <div className="col-span-3 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No Activities Found</h3>
                  <p className="text-gray-600 mb-3">
                    We couldn't find any activities for {selectedSubject}.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-amber-200 text-amber-700 hover:bg-amber-100"
                    onClick={() => setSelectedSubject("All Subjects")}
                  >
                    View All Activities
                  </Button>
                </div>
              )}
            </div>
          </section>
          
          {/* Progress Section */}
          <section className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Your Learning Journey</h2>
                <p className="text-gray-600">You've completed 12 activities this week!</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Weekly Goal</p>
                    <p className="font-bold text-gray-800">12/15 Activities</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default LearningHub; 