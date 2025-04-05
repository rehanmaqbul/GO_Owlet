import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { getFallbackTask, getFallbackQuestions } from '@/components/task-detail/FallbackTaskData';
import { 
  MultipleChoiceQuestion,
  FillBlankQuestion,
  TrueFalseQuestion,
  YesNoQuestion,
  QuestionNavigation
} from '@/components/task-detail';
import { Task, Question } from '@/lib/types';

/**
 * Fixed implementation for Task 3
 * This component uses hardcoded data directly without URL parameters
 */
const FixedTask3 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Hardcode the taskId to '3'
  const taskId = '3';
  
  const [isLoading, setIsLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  
  // Loading message options
  const loadingMessages = [
    "Gathering all your questions...",
    "Preparing your learning adventure...",
    "Setting up your mission...",
    "Almost ready for takeoff!",
    "Sorting out the challenges ahead..."
  ];
  
  // Choose a random loading message
  const [loadingMessage] = useState(
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );
  
  useEffect(() => {
    const loadTaskData = async () => {
      try {
        // Set initial loading state
        setIsLoading(true);
        
        // Controlled loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get the fixed task data for task 3
        const taskData = getFallbackTask('3');
        if (!taskData) {
          setError(`Task data could not be loaded`);
          setIsLoading(false);
          return;
        }
        
        // Set task data
        setTask(taskData);
        
        // Get questions for the task
        if (taskData.questions && taskData.questions.length > 0) {
          const questionsData = getFallbackQuestions(taskData.questions);
          setQuestions(questionsData);
        }
        
        // Complete loading
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading task:', err);
        setError('An unexpected error occurred while loading the task');
        setIsLoading(false);
      }
    };
    
    loadTaskData();
  }, []);
  
  // Navigation handlers
  const handleGoBack = () => navigate('/child-tasks');
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
          <div className="max-w-md mx-auto bg-[#e8d5c4]/30 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-amber-200 text-center">
            <div className="relative mx-auto mb-8 w-24 h-24">
              {/* Pulsing background circle */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.3, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 bg-amber-200 rounded-full"
              />
              
              {/* Spinner */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Loader2 className="w-16 h-16 text-amber-600" />
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              Loading Task...
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 bg-amber-100/50 text-amber-800 py-1 px-3 rounded-full text-sm inline-block"
            >
              Science Project
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-lg mb-4"
            >
              Please wait while we prepare your mission.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-amber-600 text-sm italic"
            >
              {loadingMessage}
            </motion.p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error screen
  if (error || !task || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
          <div className="bg-[#e8d5c4]/30 backdrop-blur-md rounded-xl shadow-md p-8 text-center border border-amber-200">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {error || "There was a problem loading the task"}
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but we couldn't load this Science Project task.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleGoBack}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Go Back to Tasks
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // No questions state
  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 mb-8 shadow-lg">
            <div className="relative z-10 flex items-start gap-4">
              <Button 
                onClick={handleGoBack}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">{task.name || 'Science Project'}</h1>
                <p className="text-white/90 mt-2">
                  {task.subject} • Not Started
                </p>
              </div>
            </div>
            
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-amber-100">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Questions Found</h2>
            <p className="text-gray-600 mb-6">This task doesn't have any questions assigned to it.</p>
            <Button 
              onClick={handleGoBack}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Go Back to Tasks
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  // Helper to render the question component based on type
  const renderQuestionContent = () => {
    if (!currentQuestion) return null;
    
    const userAnswer = answers[currentQuestion.id] || '';
    
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={false}
            onChange={handleAnswerChange}
          />
        );
      
      case 'fill_blank':
        return (
          <FillBlankQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={false}
            isCorrect={false}
            isIncorrect={false}
            onChange={handleAnswerChange}
          />
        );
      
      case 'true_false':
        return (
          <TrueFalseQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={false}
            onChange={handleAnswerChange}
          />
        );
        
      case 'yes_no':
        return (
          <YesNoQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={false}
            onChange={handleAnswerChange}
          />
        );
      
      default:
        return <p>Unsupported question type</p>;
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Main content
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to right, #dfd6c8, #e8d5c4)" }}>
      <Navbar />
      
      <main className="pt-20 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div className="space-y-6" {...fadeIn}>
            {/* Task header with back button and progress */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 mb-8 shadow-lg">
              <div className="relative z-10 flex items-start gap-4">
                <Button 
                  onClick={handleGoBack}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">{task.name}</h1>
                  <p className="text-white/90 mt-2">
                    {task.subject} • In Progress
                  </p>
                  
                  <div className="mt-4 bg-white/20 px-3 py-2 rounded-lg w-fit flex items-center gap-2 text-white">
                    <Clock className="h-4 w-4" />
                    <span>{questions.length} Questions</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            </div>
            
            {/* Progress bar */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
              <div className="flex justify-between text-sm mb-2 text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-amber-100" indicatorClassName="bg-amber-600" />
            </div>
            
            {currentQuestion ? (
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <CardTitle className="text-xl text-gray-800">
                        Question {currentQuestionIndex + 1}
                      </CardTitle>
                      <CardDescription className="text-amber-700">
                        {currentQuestion.subject} • {currentQuestion.curriculum || 'Standard'} curriculum
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 bg-white">
                  <div className="text-lg font-medium text-gray-800 mb-6">{currentQuestion.text}</div>
                  {renderQuestionContent()}
                </CardContent>
                
                <CardFooter className="p-4 border-t border-amber-100 bg-amber-50">
                  <QuestionNavigation
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={questions.length}
                    handlePreviousQuestion={handlePreviousQuestion}
                    handleNextQuestion={handleNextQuestion}
                    handleSubmitTask={() => {
                      // Simple submit function
                      window.alert("Thank you for completing this task!");
                      navigate('/child-tasks');
                    }}
                    isSubmitting={false}
                    isCompleted={false}
                  />
                </CardFooter>
              </Card>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 text-center border border-amber-100">
                <p className="text-gray-600">Question not found. Please try another question.</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FixedTask3; 