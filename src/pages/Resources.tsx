
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { Plus, Save, Link as LinkIcon, FileText, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArticleForm {
  id: string;
  title: string;
  content: string;
}

interface VideoForm {
  id: string;
  title: string;
  url: string;
}

const Resources = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [articles, setArticles] = useState<ArticleForm[]>([
    { id: '1', title: '', content: '' }
  ]);
  
  const [videos, setVideos] = useState<VideoForm[]>([
    { id: '1', title: '', url: '' }
  ]);
  
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only admins and teachers should manage resources
    if (user?.role !== 'admin' && user?.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleAddArticle = () => {
    setArticles(prev => [
      ...prev,
      { id: String(Date.now()), title: '', content: '' }
    ]);
  };

  const handleAddVideo = () => {
    setVideos(prev => [
      ...prev,
      { id: String(Date.now()), title: '', url: '' }
    ]);
  };

  const handleUpdateArticle = (id: string, field: keyof ArticleForm, value: string) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === id ? { ...article, [field]: value } : article
      )
    );
  };

  const handleUpdateVideo = (id: string, field: keyof VideoForm, value: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === id ? { ...video, [field]: value } : video
      )
    );
  };

  const handleSaveArticles = () => {
    // In a real app, this would save to a database
    toast({
      title: "Articles saved successfully",
      description: `${articles.length} articles have been saved.`,
    });
  };

  const handleSaveVideos = () => {
    // In a real app, this would save to a database
    toast({
      title: "Videos saved successfully",
      description: `${videos.length} video links have been saved.`,
    });
  };

  if (!user || (user.role !== 'admin' && user.role !== 'teacher')) return null;

  const userRoleText = user.role === 'admin' ? 'Parental Tips and Info' : 'Student Tips & Info';
  
  return (
    <div className="min-h-screen bg-owl-neutral">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          <div>
            <h1 className="text-2xl font-medium text-owl-slate-dark">{userRoleText}</h1>
            <p className="text-owl-slate mt-1">
              Manage educational resources for {user.role === 'admin' ? 'parents and children' : 'students'}
            </p>
          </div>
          
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Add Educational Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'articles' | 'videos')}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="articles">
                    <FileText className="mr-2 h-4 w-4" />
                    Insert Article
                  </TabsTrigger>
                  <TabsTrigger value="videos">
                    <Video className="mr-2 h-4 w-4" />
                    Insert Video Link
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="articles" className="space-y-6">
                  {articles.map((article, index) => (
                    <motion.div 
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 border rounded-md space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor={`article-title-${article.id}`}>Article Title</Label>
                        <Input
                          id={`article-title-${article.id}`}
                          value={article.title}
                          onChange={(e) => handleUpdateArticle(article.id, 'title', e.target.value)}
                          placeholder="Enter article title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`article-content-${article.id}`}>Article Content</Label>
                        <Textarea
                          id={`article-content-${article.id}`}
                          value={article.content}
                          onChange={(e) => handleUpdateArticle(article.id, 'content', e.target.value)}
                          placeholder="Enter article content"
                          rows={6}
                        />
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      className="flex items-center"
                      onClick={handleAddArticle}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Insert More
                    </Button>
                    
                    <Button
                      variant="default"
                      className="flex items-center"
                      onClick={handleSaveArticles}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Articles
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="videos" className="space-y-6">
                  {videos.map((video, index) => (
                    <motion.div 
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 border rounded-md space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor={`video-title-${video.id}`}>Video Title</Label>
                        <Input
                          id={`video-title-${video.id}`}
                          value={video.title}
                          onChange={(e) => handleUpdateVideo(video.id, 'title', e.target.value)}
                          placeholder="Enter video title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`video-url-${video.id}`}>Video Link</Label>
                        <div className="flex">
                          <div className="bg-muted p-2 flex items-center rounded-l-md border-y border-l">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            id={`video-url-${video.id}`}
                            value={video.url}
                            onChange={(e) => handleUpdateVideo(video.id, 'url', e.target.value)}
                            placeholder="https://example.com/video"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      className="flex items-center"
                      onClick={handleAddVideo}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Insert More
                    </Button>
                    
                    <Button
                      variant="default"
                      className="flex items-center"
                      onClick={handleSaveVideos}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Videos
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Resources;
