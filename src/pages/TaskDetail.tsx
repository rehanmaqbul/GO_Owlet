import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Award } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskDetail } from '@/hooks/task-detail/useTaskDetail';
import { 
  TaskDetailHeader,
  QuestionNavigation,
  MultipleChoiceQuestion,
  FillBlankQuestion,
  TrueFalseQuestion,
  YesNoQuestion,
  ReadingQuestion,
  ListeningQuestion,
  LearningFromStoryQuestion,
  TaskSummary,
  QuestionStatusBadge,
  TaskLoadingScreen
} from '@/components/task-detail';

const TaskDetail = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const {
    user,
    task,
    taskQuestions,
    answers,
    currentQuestionIndex,
    isSubmitting,
    isLoading,
    loadingError,
    handleAnswerChange,
    handleNextQuestion,
    handlePreviousQuestion,
    isAnswerCorrect,
    handleSubmitTask,
    handleAudioRecording
  } = useTaskDetail();

  const handleGoBack = () => {
    navigate('/child-tasks');
  };
  
  // Loading state
  if (isLoading) {
    return <TaskLoadingScreen taskId={taskId} />;
  }

  // Error state
  if (loadingError || !user || !task) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
          <div className="bg-[#e8d5c4]/30 backdrop-blur-md rounded-xl shadow-md p-8 text-center border border-amber-200">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {loadingError || "There was a problem loading the task"}
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load this task. It might not exist or there was a connection issue.
            </p>
            <div className="space-y-3">
              <p className="text-amber-600 text-sm">
                {taskId ? `Task ID: ${taskId}` : "No task ID provided"}
              </p>
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

  const currentQuestion = taskQuestions[currentQuestionIndex];
  const isCompleted = task.status === 'completed';
  
  const renderQuestionContent = () => {
    if (!currentQuestion) return null;
    
    const userAnswer = answers[currentQuestion.id] || '';
    const isCorrect = isCompleted && isAnswerCorrect(userAnswer, currentQuestion.correctAnswer, currentQuestion.type);
    const isIncorrect = isCompleted && !isCorrect;
    
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={isCompleted}
            onChange={handleAnswerChange}
          />
        );
      
      case 'fill_blank':
        return (
          <FillBlankQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={isCompleted}
            isCorrect={!!isCorrect}
            isIncorrect={!!isIncorrect}
            onChange={handleAnswerChange}
          />
        );
      
      case 'true_false':
        return (
          <TrueFalseQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={isCompleted}
            onChange={handleAnswerChange}
          />
        );
        
      case 'yes_no':
        return (
          <YesNoQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={isCompleted}
            onChange={handleAnswerChange}
          />
        );
        
      case 'reading':
        return (
          <ReadingQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={isCompleted}
            onChange={handleAnswerChange}
            onRecordAudio={handleAudioRecording}
          />
        );
        
      case 'listening':
        return (
          <ListeningQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={isCompleted}
            isCorrect={!!isCorrect}
            isIncorrect={!!isIncorrect}
            onChange={handleAnswerChange}
          />
        );
        
      case 'learning_from_story':
        return (
          <LearningFromStoryQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            isCompleted={isCompleted}
            onChange={handleAnswerChange}
          />
        );
      
      default:
        return <p>Unsupported question type</p>;
    }
  };

  // No questions state
  if (!taskQuestions.length) {
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
                <h1 className="text-3xl font-bold text-white">{task.name || 'Task'}</h1>
                <p className="text-white/90 mt-2">
                  {task.subject || 'Subject'} • {isCompleted ? 'Completed' : 'In Progress'}
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

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / taskQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          {/* Task header with back button and status */}
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
                <h1 className="text-3xl font-bold text-white">{task.name || 'Task'}</h1>
                <p className="text-white/90 mt-2">
                  {task.subject || 'Subject'} • {isCompleted ? 'Completed' : 'In Progress'}
                </p>
                
                <div className="mt-4 bg-white/20 px-3 py-2 rounded-lg w-fit flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4" />
                  <span>{taskQuestions.length} Questions</span>
                </div>
              </div>
              
              {isCompleted && (
                <div className="bg-white/20 px-3 py-2 rounded-lg flex items-center gap-2 text-white">
                  <Award className="h-4 w-4" />
                  <span>+50 Points</span>
                </div>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
          </div>
          
          {/* Progress bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {taskQuestions.length}</span>
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
                  
                  {isCompleted && currentQuestion.type !== 'reading' && (
                    <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${answers[currentQuestion.id] === currentQuestion.correctAnswer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {answers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Correct</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Incorrect</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-6 bg-white">
                <div className="text-lg font-medium text-gray-800 mb-6">{currentQuestion.text}</div>
                {renderQuestionContent()}
              </CardContent>
              
              <CardFooter className="p-4 border-t border-amber-100 bg-amber-50">
                <QuestionNavigation
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={taskQuestions.length}
                  handlePreviousQuestion={handlePreviousQuestion}
                  handleNextQuestion={handleNextQuestion}
                  handleSubmitTask={handleSubmitTask}
                  isSubmitting={isSubmitting}
                  isCompleted={isCompleted}
                />
              </CardFooter>
            </Card>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 text-center border border-amber-100">
              <p className="text-gray-600">Question not found. Please try another question.</p>
            </div>
          )}
          
          {isCompleted && (
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl shadow-sm p-6 border border-amber-200">
              <h2 className="text-xl font-bold text-amber-800 mb-4">Task Summary</h2>
              <TaskSummary 
                task={task} 
                taskQuestions={taskQuestions} 
                answers={answers} 
              />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default TaskDetail;
