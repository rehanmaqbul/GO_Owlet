import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { ArrowLeft, BookOpen, Video, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

// Mock data for suggestions
const mockArticles = [
  { 
    id: '1', 
    title: 'How to Improve Your Math Skills', 
    description: 'Tips and tricks to get better at mathematics and problem solving',
    source: 'Educational Blog',
    date: '2023-06-15',
    url: 'https://example.com/math-skills'
  },
  { 
    id: '2', 
    title: 'Learning French: The Basics', 
    description: 'A beginner-friendly guide to start learning French vocabulary and grammar',
    source: 'Language Learning Hub',
    date: '2023-07-02',
    url: 'https://example.com/french-basics'
  },
  { 
    id: '3', 
    title: 'Understanding Science Concepts', 
    description: 'Explaining complex science concepts in simple terms for young learners',
    source: 'Science for Kids',
    date: '2023-08-10',
    url: 'https://example.com/science-concepts'
  },
];

const mockVideos = [
  { 
    id: '1', 
    title: 'Math Multiplication Tricks', 
    description: 'Learn easy tricks to multiply numbers faster',
    duration: '10:25',
    source: 'Educational YouTube Channel',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Math+Video',
    url: 'https://example.com/video/math-tricks'
  },
  { 
    id: '2', 
    title: 'French Pronunciation Guide', 
    description: 'Master French pronunciation with this detailed guide',
    duration: '15:45',
    source: 'Language Learning Platform',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=French+Video',
    url: 'https://example.com/video/french-pronunciation'
  },
  { 
    id: '3', 
    title: 'Science Experiments at Home', 
    description: 'Fun and safe science experiments you can do at home',
    duration: '20:30',
    source: 'Science Kids Channel',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Science+Video',
    url: 'https://example.com/video/science-experiments'
  },
];

const ChildSuggestions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-owl-neutral flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/child-dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-owl-slate-dark">Suggestions from Parent</h1>
            <p className="text-owl-slate">Articles and videos shared with you</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <motion.div 
          className="w-full max-w-6xl mx-auto space-y-6"
          {...fadeIn}
        >
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Videos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 flex-1">
                      <p className="text-sm text-muted-foreground">{article.description}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{article.source}</span>
                        <span>{article.date}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full flex items-center gap-2"
                        onClick={() => openExternalLink(article.url)}
                      >
                        Read Article
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockVideos.map((video) => (
                  <Card key={video.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-video bg-muted">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="object-cover w-full h-full" 
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 flex-1">
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                      <div className="mt-4 text-xs text-muted-foreground">
                        <span>{video.source}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full flex items-center gap-2"
                        onClick={() => openExternalLink(video.url)}
                      >
                        Watch Video
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <footer className="py-6 text-center text-owl-slate">
        <p>© {new Date().getFullYear()} Guardian Owlet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ChildSuggestions;
