
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { Task, User, Class } from '@/lib/types';
import { ArrowLeft, Download, BarChart, Calendar } from 'lucide-react';

// Mock data
const mockStudents: User[] = [
  {
    id: 'child-1',
    email: 'student1@example.com',
    name: 'Alex Johnson',
    role: 'child',
    parentId: 'parent-1'
  },
  {
    id: 'child-2',
    email: 'student2@example.com',
    name: 'Taylor Smith',
    role: 'child',
    parentId: 'parent-2'
  },
  {
    id: 'child-3',
    email: 'student3@example.com',
    name: 'Jordan Brown',
    role: 'child',
    parentId: 'parent-3'
  }
];

const mockClasses: Class[] = [
  {
    id: 'class-1',
    name: 'Grade 5 Science',
    teacherId: 'teacher-1',
    curriculum: 'american',
    studentIds: ['child-1', 'child-2', 'child-3'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'class-2',
    name: 'Grade 4 Mathematics',
    teacherId: 'teacher-1',
    curriculum: 'american',
    studentIds: ['child-4', 'child-5', 'child-6', 'child-7'],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
];

const mockTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Science Exploration',
    childId: 'class-1', // Assigned to entire class
    assignedById: 'teacher-1',
    assignedByRole: 'teacher',
    subject: 'science',
    curriculum: 'american',
    questions: ['q-1', 'q-2', 'q-3'],
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'task-2',
    name: 'Math Quiz',
    childId: 'child-1', // Assigned to individual student
    assignedById: 'teacher-1',
    assignedByRole: 'teacher',
    subject: 'math',
    curriculum: 'american',
    questions: ['q-4', 'q-5'],
    status: 'completed',
    results: {
      score: 2,
      total: 2,
      answers: { 'q-4': 'option-a', 'q-5': 'true' }
    },
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

const CreateReport = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<'student' | 'class'>('student');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [includeTasks, setIncludeTasks] = useState<string[]>([]);
  const [includeGraphs, setIncludeGraphs] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only teachers should access this page
    if (user?.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  
  useEffect(() => {
    // Reset selections when changing report type
    if (reportType === 'student') {
      setSelectedClassId('');
    } else {
      setSelectedStudentId('');
    }
  }, [reportType]);
  
  // Get available tasks based on selection
  const availableTasks = mockTasks.filter(task => {
    if (reportType === 'student' && selectedStudentId) {
      return task.childId === selectedStudentId || 
        (task.childId.startsWith('class') && 
         mockClasses.find(c => c.id === task.childId)?.studentIds.includes(selectedStudentId));
    } else if (reportType === 'class' && selectedClassId) {
      return task.childId === selectedClassId;
    }
    return false;
  });

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportTitle.trim()) {
      toast({
        title: "Report title required",
        description: "Please enter a title for the report.",
        variant: "destructive",
      });
      return;
    }
    
    if (reportType === 'student' && !selectedStudentId) {
      toast({
        title: "Student selection required",
        description: "Please select a student for the report.",
        variant: "destructive",
      });
      return;
    }
    
    if (reportType === 'class' && !selectedClassId) {
      toast({
        title: "Class selection required",
        description: "Please select a class for the report.",
        variant: "destructive",
      });
      return;
    }
    
    if (includeTasks.length === 0) {
      toast({
        title: "Task selection required",
        description: "Please select at least one task to include in the report.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate PDF generation (in a real app, this would call a PDF generator)
    setTimeout(() => {
      toast({
        title: "Report generated",
        description: "Your PDF report has been generated successfully.",
      });
      
      setIsGenerating(false);
      navigate('/teacher-dashboard', { state: { reportGenerated: true } });
    }, 2000);
  };
  
  const handleSelectTask = (taskId: string) => {
    setIncludeTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  const handleGoBack = () => {
    navigate('/teacher-dashboard');
  };

  if (!user || user.role !== 'teacher') return null;

  return (
    <div className="min-h-screen bg-owl-neutral">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-4xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          <Button 
            variant="ghost" 
            className="flex items-center text-owl-slate hover:text-owl-slate-dark"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        
          <div>
            <h1 className="text-2xl font-medium text-owl-slate-dark">Generate Report</h1>
            <p className="text-owl-slate mt-1">
              Create a detailed PDF report for student or class performance
            </p>
          </div>
          
          <form onSubmit={handleGenerateReport} className="space-y-6">
            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-owl-blue" />
                  Report Settings
                </CardTitle>
                <CardDescription>
                  Configure your performance report
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reportTitle">Report Title</Label>
                  <Input
                    id="reportTitle"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g., Science Class Performance Q1 2023"
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={reportType === 'student' ? 'default' : 'outline'}
                      onClick={() => setReportType('student')}
                    >
                      Individual Student
                    </Button>
                    <Button
                      type="button"
                      variant={reportType === 'class' ? 'default' : 'outline'}
                      onClick={() => setReportType('class')}
                    >
                      Entire Class
                    </Button>
                  </div>
                </div>
                
                {reportType === 'student' ? (
                  <div className="space-y-2">
                    <Label htmlFor="studentSelect">Select Student</Label>
                    <Select 
                      value={selectedStudentId} 
                      onValueChange={setSelectedStudentId}
                    >
                      <SelectTrigger id="studentSelect" className="h-12">
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStudents.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="classSelect">Select Class</Label>
                    <Select 
                      value={selectedClassId} 
                      onValueChange={setSelectedClassId}
                    >
                      <SelectTrigger id="classSelect" className="h-12">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClasses.map(cls => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Time Period</Label>
                  <Select 
                    value={dateRange} 
                    onValueChange={setDateRange}
                  >
                    <SelectTrigger id="dateRange" className="h-12">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="180">Last 6 months</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-owl-blue" />
                  Tasks to Include
                </CardTitle>
                <CardDescription>
                  Select tasks to include in the report
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {availableTasks.length > 0 ? (
                  <div className="space-y-4">
                    {availableTasks.map(task => (
                      <div key={task.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={includeTasks.includes(task.id)}
                          onCheckedChange={() => handleSelectTask(task.id)}
                        />
                        <div className="grid gap-1.5">
                          <Label 
                            htmlFor={`task-${task.id}`}
                            className="font-medium"
                          >
                            Task {task.id.split('-')[1]}
                          </Label>
                          <p className="text-sm text-owl-slate">
                            {task.questions.length} questions • 
                            {task.status === 'completed' 
                              ? ` Completed (Score: ${task.results?.score}/${task.results?.total})` 
                              : ' Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-owl-slate">
                    <p>
                      {reportType === 'student' && !selectedStudentId 
                        ? 'Select a student to see available tasks' 
                        : reportType === 'class' && !selectedClassId
                          ? 'Select a class to see available tasks'
                          : 'No tasks available for the selected criteria'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle>Report Content</CardTitle>
                <CardDescription>
                  Choose what to include in your report
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="includeGraphs"
                    checked={includeGraphs}
                    onCheckedChange={(checked) => 
                      setIncludeGraphs(checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label 
                      htmlFor="includeGraphs"
                      className="font-medium"
                    >
                      Performance Graphs
                    </Label>
                    <p className="text-sm text-owl-slate">
                      Include visual charts showing performance trends
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="includeDetails"
                    checked={includeDetails}
                    onCheckedChange={(checked) => 
                      setIncludeDetails(checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label 
                      htmlFor="includeDetails"
                      className="font-medium"
                    >
                      Detailed Question Analysis
                    </Label>
                    <p className="text-sm text-owl-slate">
                      Include breakdown of each question and response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              type="submit" 
              className="w-full h-12"
              disabled={isGenerating}
            >
              {isGenerating ? (
                "Generating Report..."
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF Report
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateReport;
