import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, Clock, FileText, Download, MessageSquare, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for submissions
const mockSubmissions = [
  {
    id: '1',
    studentName: 'John Doe',
    grade: 'Grade 1',
    submissionDate: '2024-04-01',
    status: 'submitted',
    score: 85,
    feedback: 'Good work! Keep it up.',
    fileUrl: '#',
    comments: [
      { id: '1', author: 'Teacher', text: 'Well done!', date: '2024-04-01' },
      { id: '2', author: 'John Doe', text: 'Thank you!', date: '2024-04-02' }
    ]
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    grade: 'Grade 1',
    submissionDate: '2024-04-02',
    status: 'late',
    score: 78,
    feedback: 'Please pay attention to details.',
    fileUrl: '#',
    comments: []
  },
  {
    id: '3',
    studentName: 'Mike Johnson',
    grade: 'Grade 2',
    submissionDate: '2024-04-03',
    status: 'pending',
    score: null,
    feedback: null,
    fileUrl: '#',
    comments: []
  }
];

const ViewSubmissionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'submitted' && submission.status === 'submitted') ||
                      (selectedTab === 'late' && submission.status === 'late') ||
                      (selectedTab === 'pending' && submission.status === 'pending');
    return matchesSearch && matchesTab;
  });

  const handleDownload = (fileUrl: string) => {
    toast({
      title: "Download Started",
      description: "The submission file is being downloaded.",
    });
  };

  const handleAddComment = (submissionId: string) => {
    if (!newComment.trim()) return;
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added successfully.",
    });
    setNewComment('');
  };

  const handleGradeSubmission = (submissionId: string, score: number) => {
    toast({
      title: "Grade Updated",
      description: `Score of ${score} has been recorded.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">View Submissions</CardTitle>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back to Tasks
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by student name or grade"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-1/3"
              />
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full md:w-2/3">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="submitted">Submitted</TabsTrigger>
                  <TabsTrigger value="late">Late</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Submissions List */}
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{submission.studentName}</h3>
                            <Badge variant="outline">{submission.grade}</Badge>
                            {submission.status === 'submitted' && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Submitted
                              </Badge>
                            )}
                            {submission.status === 'late' && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Late
                              </Badge>
                            )}
                            {submission.status === 'pending' && (
                              <Badge className="bg-gray-100 text-gray-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Submitted on: {submission.submissionDate}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(submission.fileUrl)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(
                              selectedSubmission === submission.id ? null : submission.id
                            )}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Comments
                          </Button>
                          {submission.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGradeSubmission(submission.id, 85)}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Grade
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Comments Section */}
                      {selectedSubmission === submission.id && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="space-y-4">
                            {submission.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-2">
                                <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">{comment.author}</span>
                                    <span className="text-gray-500">{comment.date}</span>
                                  </div>
                                  <p className="mt-1">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              />
                              <Button
                                onClick={() => handleAddComment(submission.id)}
                                disabled={!newComment.trim()}
                              >
                                Send
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewSubmissionsPage; 