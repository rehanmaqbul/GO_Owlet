import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  FileText,
  Video,
  Image,
  File,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for content items
const mockContentItems = [
  { 
    id: 1, 
    title: 'Introduction to Algebra', 
    type: 'lesson', 
    format: 'article',
    subject: 'Mathematics', 
    grade: 'Grade 5', 
    status: 'published',
    created: '2023-10-15',
    views: 4280
  },
  { 
    id: 2, 
    title: 'Photosynthesis Explained', 
    type: 'lesson', 
    format: 'video',
    subject: 'Science', 
    grade: 'Grade 4', 
    status: 'published',
    created: '2023-09-22',
    views: 3150
  },
  { 
    id: 3, 
    title: 'Ancient Egypt Civilization', 
    type: 'resource', 
    format: 'article',
    subject: 'History', 
    grade: 'Grade 6', 
    status: 'published',
    created: '2023-11-05',
    views: 2840
  },
  { 
    id: 4, 
    title: 'Parts of Speech Interactive Quiz', 
    type: 'quiz', 
    format: 'interactive',
    subject: 'English', 
    grade: 'Grade 3', 
    status: 'draft',
    created: '2023-11-20',
    views: 0
  },
  { 
    id: 5, 
    title: 'Introduction to Fractions', 
    type: 'lesson', 
    format: 'video',
    subject: 'Mathematics', 
    grade: 'Grade 3', 
    status: 'published',
    created: '2023-10-08',
    views: 5670
  },
  { 
    id: 6, 
    title: 'World Geography Atlas', 
    type: 'resource', 
    format: 'interactive',
    subject: 'Geography', 
    grade: 'All Grades', 
    status: 'published',
    created: '2023-09-15',
    views: 7320
  },
  { 
    id: 7, 
    title: 'Creative Writing Prompts', 
    type: 'resource', 
    format: 'document',
    subject: 'English', 
    grade: 'Grade 5', 
    status: 'published',
    created: '2023-08-30',
    views: 3980
  },
  { 
    id: 8, 
    title: 'Chemical Reactions Lab', 
    type: 'lesson', 
    format: 'document',
    subject: 'Science', 
    grade: 'Grade 6', 
    status: 'draft',
    created: '2023-11-25',
    views: 0
  }
];

// Mock data for subjects
const mockSubjects = [
  'All Subjects',
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Art',
  'Music'
];

// Mock data for grades
const mockGrades = [
  'All Grades',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6'
];

// Function to get content type icon and color
const getContentTypeInfo = (type: string, format: string) => {
  let icon = FileText;
  let color = 'text-blue-600';
  let bgColor = 'bg-blue-100';
  
  if (format === 'video') {
    icon = Video;
    color = 'text-purple-600';
    bgColor = 'bg-purple-100';
  } else if (format === 'interactive') {
    icon = LayoutGrid;
    color = 'text-green-600';
    bgColor = 'bg-green-100';
  } else if (format === 'document') {
    icon = File;
    color = 'text-amber-600';
    bgColor = 'bg-amber-100';
  } else if (format === 'image') {
    icon = Image;
    color = 'text-pink-600';
    bgColor = 'bg-pink-100';
  }
  
  return { icon, color, bgColor };
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'published':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Published</Badge>;
    case 'draft':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Draft</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">{status}</Badge>;
  }
};

const AdminContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [gradeFilter, setGradeFilter] = useState('All Grades');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
  // Filter content based on search term and filters
  const filteredContent = mockContentItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesSubject = subjectFilter === 'All Subjects' || item.subject === subjectFilter;
    const matchesGrade = gradeFilter === 'All Grades' || item.grade === gradeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesSubject && matchesGrade && matchesStatus;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin-dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
              <p className="text-gray-500">Manage educational content, resources, and quizzes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/bulk-upload')} 
              variant="outline" 
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button onClick={() => navigate('/admin/content/new')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Content</p>
                <p className="text-xl font-bold text-blue-600">{mockContentItems.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-md text-green-600">
                <LayoutGrid size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lessons</p>
                <p className="text-xl font-bold text-green-600">
                  {mockContentItems.filter(item => item.type === 'lesson').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-md text-purple-600">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resources</p>
                <p className="text-xl font-bold text-purple-600">
                  {mockContentItems.filter(item => item.type === 'resource').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-md text-amber-600">
                <Edit size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Quizzes</p>
                <p className="text-xl font-bold text-amber-600">
                  {mockContentItems.filter(item => item.type === 'quiz').length}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Filters */}
        <Card className="p-5 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search content..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lesson">Lessons</SelectItem>
                  <SelectItem value="resource">Resources</SelectItem>
                  <SelectItem value="quiz">Quizzes</SelectItem>
                </SelectContent>
              </Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[150px]">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  {mockGrades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-md border border-gray-200 overflow-hidden">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="sm" 
                  className={`rounded-none ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="sm" 
                  className={`rounded-none ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Content Display */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredContent.map(item => {
                  const { icon: ContentIcon, color, bgColor } = getContentTypeInfo(item.type, item.format);
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className={`h-3 ${item.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className={`${bgColor} p-2 rounded-md ${color}`}>
                            <ContentIcon size={16} />
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                        <h3 className="font-semibold mb-1 line-clamp-2">{item.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-blue-50">
                            {item.subject}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50">
                            {item.grade}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{item.views.toLocaleString()} views</span>
                          <span className="mx-2">•</span>
                          <span>Created {item.created}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => navigate(`/admin/content/${item.id}`)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => navigate(`/admin/content/${item.id}/preview`)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContent.length > 0 ? (
                        filteredContent.map((item) => {
                          const { icon: ContentIcon, color } = getContentTypeInfo(item.type, item.format);
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <ContentIcon className={`h-4 w-4 ${color}`} />
                                  <span className="capitalize">{item.type}</span>
                                </div>
                              </TableCell>
                              <TableCell>{item.subject}</TableCell>
                              <TableCell>{item.grade}</TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>{item.views.toLocaleString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => navigate(`/admin/content/${item.id}/preview`)}
                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => navigate(`/admin/content/${item.id}`)}
                                    className="h-8 w-8"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => console.log('Delete content', item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                            No content found matching your filters
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="lessons" className="mt-0">
            {/* Lessons content - similar to all but filtered */}
            <div className="text-center p-8">
              <h2 className="text-xl font-bold mb-2">Lessons View</h2>
              <p className="text-gray-500">Showing only lesson content</p>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            {/* Resources content - similar to all but filtered */}
            <div className="text-center p-8">
              <h2 className="text-xl font-bold mb-2">Resources View</h2>
              <p className="text-gray-500">Showing only resource content</p>
            </div>
          </TabsContent>
          
          <TabsContent value="quizzes" className="mt-0">
            {/* Quizzes content - similar to all but filtered */}
            <div className="text-center p-8">
              <h2 className="text-xl font-bold mb-2">Quizzes View</h2>
              <p className="text-gray-500">Showing only quiz content</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContent; 