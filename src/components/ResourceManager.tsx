
import { useState } from 'react';
import { Resource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, ExternalLink, Video, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const generateId = () => `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const ResourceManager = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    type: 'article',
    title: '',
    description: '',
    url: '',
    thumbnailUrl: '',
  });
  
  const [filter, setFilter] = useState('all');

  const handleAddResource = () => {
    // Validation
    if (!newResource.title || !newResource.description || !newResource.url) {
      toast({
        title: "Incomplete Resource",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // URL validation
    try {
      new URL(newResource.url);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }

    const resource: Resource = {
      id: generateId(),
      type: newResource.type as 'article' | 'video',
      title: newResource.title,
      description: newResource.description,
      url: newResource.url,
      thumbnailUrl: newResource.thumbnailUrl || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setResources([...resources, resource]);
    
    // Reset form
    setNewResource({
      type: 'article',
      title: '',
      description: '',
      url: '',
      thumbnailUrl: '',
    });

    toast({
      title: "Resource Added",
      description: "Your resource has been added to the library.",
    });
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
    toast({
      title: "Resource Removed",
      description: "The resource has been removed from the library.",
    });
  };

  const filteredResources = resources.filter(resource => {
    if (filter === 'all') return true;
    return resource.type === filter;
  });

  const getYouTubeVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return new URLSearchParams(urlObj.search).get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const getThumbnailFromUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return '';
  };

  return (
    <div className="space-y-8">
      {/* Resource Form */}
      <div className="bg-white rounded-xl shadow-subtle p-6 space-y-6">
        <h3 className="text-lg font-medium">Add New Resource</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Resource Type</label>
            <RadioGroup 
              value={newResource.type} 
              onValueChange={(value) => setNewResource({ ...newResource, type: value as 'article' | 'video' })}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="article" id="article" />
                <Label htmlFor="article" className="flex items-center cursor-pointer">
                  <FileText size={16} className="mr-1 text-owl-slate" />
                  Article
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center cursor-pointer">
                  <Video size={16} className="mr-1 text-owl-slate" />
                  Video
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input 
                  placeholder="Resource title" 
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <Input 
                  placeholder={newResource.type === 'video' ? "YouTube URL" : "Article URL"}
                  value={newResource.url}
                  onChange={(e) => {
                    const url = e.target.value;
                    const newResourceData: Partial<Resource> = { ...newResource, url };
                    
                    // Auto-generate thumbnail for YouTube videos
                    if (newResource.type === 'video') {
                      newResourceData.thumbnailUrl = getThumbnailFromUrl(url);
                    }
                    
                    setNewResource(newResourceData);
                  }}
                />
              </div>
              
              {newResource.type === 'article' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail URL (Optional)</label>
                  <Input 
                    placeholder="Image URL for thumbnail" 
                    value={newResource.thumbnailUrl}
                    onChange={(e) => setNewResource({ ...newResource, thumbnailUrl: e.target.value })}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea 
                placeholder="Brief description of the resource..." 
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                className="h-32 resize-none"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button onClick={handleAddResource} className="w-full sm:w-auto">
            <PlusCircle size={18} className="mr-2" />
            Add Resource
          </Button>
        </div>
      </div>
      
      {/* Resources List */}
      <div className="bg-white rounded-xl shadow-subtle p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-medium">Resource Library</h3>
          
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('all')}
              className="h-9"
            >
              All
            </Button>
            <Button 
              variant={filter === 'article' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('article')}
              className="h-9"
            >
              <FileText size={16} className="mr-1" />
              Articles
            </Button>
            <Button 
              variant={filter === 'video' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('video')}
              className="h-9"
            >
              <Video size={16} className="mr-1" />
              Videos
            </Button>
          </div>
        </div>
        
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No resources added yet. Use the form above to add resources.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id} 
                className="border border-border rounded-lg overflow-hidden hover:shadow-owlet transition-shadow"
              >
                <div className="aspect-video relative overflow-hidden bg-owl-neutral">
                  {resource.thumbnailUrl ? (
                    <img 
                      src={resource.thumbnailUrl} 
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {resource.type === 'article' ? (
                        <FileText size={48} className="text-owl-slate/40" />
                      ) : (
                        <Video size={48} className="text-owl-slate/40" />
                      )}
                    </div>
                  )}
                  <div 
                    className={cn(
                      "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium",
                      resource.type === 'article' 
                        ? "bg-blue-500/10 text-blue-600" 
                        : "bg-red-500/10 text-red-600"
                    )}
                  >
                    {resource.type === 'article' ? 'Article' : 'Video'}
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <h4 className="font-medium line-clamp-1">{resource.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <div className="flex justify-between pt-2">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-sm text-owl-blue hover:text-owl-blue-dark"
                    >
                      View Resource
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveResource(resource.id)}
                      className="h-8 w-8 text-owl-slate hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceManager;
