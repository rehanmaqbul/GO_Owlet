import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { SubjectPerformance } from './SubjectPerformance';
import { QuestionBreakdown } from './QuestionBreakdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, FileText, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockSubjectDetails } from '@/components/parent/check-tasks/mockData';
import { StudentPerformanceTable } from './StudentPerformanceTable';
import { 
  generatePdf, 
  SubjectData, 
  StudentData, 
  QuestionData
} from './PdfExportService';

// Mock student data
const mockStudents = [
  {
    id: 's1',
    name: 'Emily Johnson',
    score: 92,
    totalQuestions: 15,
    correctAnswers: 14,
    submissionTime: '2023-05-15T09:30:00',
    grade: 'A'
  },
  {
    id: 's2',
    name: 'Michael Williams',
    score: 85,
    totalQuestions: 15,
    correctAnswers: 13,
    submissionTime: '2023-05-15T10:15:00',
    grade: 'B'
  },
  {
    id: 's3',
    name: 'Sophia Brown',
    score: 77,
    totalQuestions: 15,
    correctAnswers: 12,
    submissionTime: '2023-05-15T09:45:00',
    grade: 'C'
  },
  {
    id: 's4',
    name: 'William Jones',
    score: 68,
    totalQuestions: 15,
    correctAnswers: 10,
    submissionTime: '2023-05-15T11:00:00',
    grade: 'D'
  },
  {
    id: 's5',
    name: 'Olivia Davis',
    score: 95,
    totalQuestions: 15,
    correctAnswers: 14,
    submissionTime: '2023-05-15T09:20:00',
    grade: 'A'
  },
  {
    id: 's6',
    name: 'James Miller',
    score: 72,
    totalQuestions: 15,
    correctAnswers: 11,
    submissionTime: '2023-05-15T10:30:00',
    grade: 'C'
  },
  {
    id: 's7',
    name: 'Ava Wilson',
    score: 88,
    totalQuestions: 15,
    correctAnswers: 13,
    submissionTime: '2023-05-15T09:50:00',
    grade: 'B'
  },
  {
    id: 's8',
    name: 'Benjamin Moore',
    score: 53,
    totalQuestions: 15,
    correctAnswers: 8,
    submissionTime: '2023-05-15T10:45:00',
    grade: 'F'
  },
  {
    id: 's9',
    name: 'Charlotte Taylor',
    score: 91,
    totalQuestions: 15,
    correctAnswers: 14,
    submissionTime: '2023-05-15T09:15:00',
    grade: 'A'
  },
  {
    id: 's10',
    name: 'Mason Anderson',
    score: 80,
    totalQuestions: 15,
    correctAnswers: 12,
    submissionTime: '2023-05-15T11:15:00',
    grade: 'B'
  },
  {
    id: 's11',
    name: 'Amelia Thomas',
    score: 63,
    totalQuestions: 15,
    correctAnswers: 9,
    submissionTime: '2023-05-15T10:00:00',
    grade: 'D'
  },
  {
    id: 's12',
    name: 'Elijah Jackson',
    score: 75,
    totalQuestions: 15,
    correctAnswers: 11,
    submissionTime: '2023-05-15T09:40:00',
    grade: 'C'
  },
  {
    id: 's13',
    name: 'Harper White',
    score: 48,
    totalQuestions: 15,
    correctAnswers: 7,
    submissionTime: '2023-05-15T11:30:00',
    grade: 'F'
  },
  {
    id: 's14',
    name: 'Lucas Harris',
    score: 82,
    totalQuestions: 15,
    correctAnswers: 12,
    submissionTime: '2023-05-15T10:20:00',
    grade: 'B'
  },
  {
    id: 's15',
    name: 'Evelyn Martin',
    score: 97,
    totalQuestions: 15,
    correctAnswers: 15,
    submissionTime: '2023-05-15T09:10:00',
    grade: 'A'
  }
];

const TaskDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('performance');
  
  // In a real app, these subjects would be fetched from an API
  // based on the subject IDs in the URL params
  const subjects = mockSubjectDetails;
  const subject = subjects.length > 0 ? subjects[0] : null;
  
  const handleBack = () => {
    navigate('/check-tasks');
  };
  
  const handleDownloadPdf = () => {
    if (!subject) return;
    
    // Convert subject to the format expected by the PDF service
    const subjectData: SubjectData = {
      name: subject.name,
      percentage: subject.percentage,
      totalQuestions: subject.totalQuestions,
      correctAnswers: subject.correctAnswers,
      wrongAnswers: subject.wrongAnswers
    };
    
    // Convert questions to the format expected by the PDF service
    const questionData: QuestionData[] = subject.questions.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type,
      isCorrect: q.isCorrect,
      correctAnswer: q.correctAnswer
    }));
    
    // Generate and download the PDF
    generatePdf(
      subjectData,
      mockStudents, 
      questionData,
      {
        teacherName: "Ms. Sarah Johnson",
        className: "Grade 5 - Science",
        schoolName: "Owlet Elementary School",
        dateRange: "May 10 - May 17, 2023"
      }
    );
    
    console.log('Downloading PDF report...');
  };
  
  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
        <Navbar />
        <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
          <div className="text-center p-8">
            <h1 className="text-xl font-medium mb-4">Subject not found</h1>
            <Button onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Check Tasks
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <button 
              onClick={handleBack}
              className="flex items-center text-sm text-gray-600 hover:text-indigo-600 mb-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Check Tasks
            </button>
            <h1 className="text-2xl font-bold">{subject.name} - Task Details</h1>
            <p className="text-sm text-owl-slate mt-1">
              Review detailed performance for this subject
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center h-9">
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            <Button 
              className="flex items-center h-9 bg-indigo-600 hover:bg-indigo-700"
              onClick={handleDownloadPdf}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="questions">Question Analysis</TabsTrigger>
            <TabsTrigger value="students">Student Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <div className="space-y-6">
              <SubjectPerformance subject={subject} />
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Report Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-md flex items-start">
                    <FileText className="h-5 w-5 mr-3 text-indigo-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-indigo-900">Complete Analytics</h3>
                      <p className="text-sm text-indigo-700 mt-1">Download a detailed PDF report with all metrics and performance data</p>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md flex items-start">
                    <Download className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-900">Student Data</h3>
                      <p className="text-sm text-green-700 mt-1">View individual student performance broken down by question</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-md flex items-start">
                    <Printer className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900">Print Friendly</h3>
                      <p className="text-sm text-blue-700 mt-1">Reports are formatted for easy printing and sharing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="questions">
            <QuestionBreakdown subject={subject} />
          </TabsContent>
          
          <TabsContent value="students">
            <StudentPerformanceTable 
              subjectName={subject.name}
              students={mockStudents}
              onDownloadPdf={handleDownloadPdf}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TaskDetailsPage; 