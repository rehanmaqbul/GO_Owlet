
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

interface TaskQuestion {
  id: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface StudentTaskData {
  id: string;
  name: string;
  subject: string;
  grade: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  questions: TaskQuestion[];
}

const mockStudentTask: StudentTaskData = {
  id: 'task-1',
  name: 'Student 1',
  subject: 'Math',
  grade: 'Grade 5',
  submittedAt: new Date().toLocaleDateString(),
  score: 85,
  totalQuestions: 10,
  questions: Array.from({ length: 10 }, (_, i) => ({
    id: `q-${i + 1}`,
    question: `Sample question ${i + 1} for this task?`,
    studentAnswer: `Student answer for question ${i + 1}`,
    correctAnswer: `Correct answer for question ${i + 1}`,
    isCorrect: Math.random() > 0.3,
  })),
};

const StudentTaskPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('id') || '';
  const subject = searchParams.get('subject') || 'Unknown Subject';
  
  const [taskData, setTaskData] = useState<StudentTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Customize mock data with the subject from URL
      const customizedData = {
        ...mockStudentTask,
        subject: subject
      };
      setTaskData(customizedData);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [studentId, subject]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-warm-neutral flex items-center justify-center">
        <p>Loading task data...</p>
      </div>
    );
  }
  
  if (!taskData) {
    return (
      <div className="min-h-screen bg-warm-neutral flex items-center justify-center">
        <p>Task not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-warm-neutral">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={handleGoBack}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Student Task and Results</h1>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{taskData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{taskData.subject}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className="font-medium">{taskData.grade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted Date</p>
                <p className="font-medium">{taskData.submittedAt}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="font-medium">
                  {taskData.score}% ({Math.round(taskData.score / 100 * taskData.totalQuestions)}/{taskData.totalQuestions} correct)
                </p>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Task Questions and Answers</h2>
          
          <div className="space-y-6">
            {taskData.questions.map((question, index) => (
              <Card key={question.id} className={question.isCorrect ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}>
                <CardHeader>
                  <CardTitle className="text-base flex items-start">
                    <span className="mr-2">{index + 1}.</span> 
                    <span>{question.question}</span>
                    {question.isCorrect ? 
                      <Check className="ml-auto text-green-500 h-5 w-5" /> : 
                      <X className="ml-auto text-red-500 h-5 w-5" />
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Student's Answer:</p>
                    <p className={question.isCorrect ? "font-medium text-green-700" : "font-medium text-red-700"}>
                      {question.studentAnswer}
                    </p>
                  </div>
                  
                  {!question.isCorrect && (
                    <div>
                      <p className="text-sm text-muted-foreground">Correct Answer:</p>
                      <p className="font-medium text-green-700">{question.correctAnswer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentTaskPage;
