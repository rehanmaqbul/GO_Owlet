import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, AlertCircle, Clock, Loader2, BookOpen, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { MultipleChoiceQuestion, FillBlankQuestion, QuestionNavigation } from '@/components/task-detail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Question } from '@/lib/types';

/**
 * Fixed implementation for a Story Reading Activity
 * This component provides a story for children to read with illustrations and practice questions
 */
const FixedStoryTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('story');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pagesRead, setPagesRead] = useState<number[]>([]);
  
  // Story content
  const story = {
    title: "The Brave Little Turtle",
    author: "Children's Stories",
    pages: [
      {
        text: "Once upon a time, there was a little turtle named Tim. Tim lived in a small pond at the edge of a beautiful forest. Unlike the other turtles who were content to swim slowly and bask in the sun, Tim dreamed of adventure.",
        image: "🐢🌳🌞"
      },
      {
        text: "One morning, Tim decided it was time for an adventure. 'I'm going to explore beyond our pond,' he told his friends. The other turtles laughed. 'You're too small,' they said. 'And the world out there is too big and dangerous.'",
        image: "🐢💭🌍"
      },
      {
        text: "But Tim was determined. He slowly made his way out of the pond and into the forest. At first, he was scared. The trees were tall, and the sounds were unfamiliar. But soon, curiosity replaced his fear.",
        image: "🐢🌲🌳"
      },
      {
        text: "Tim met a friendly rabbit who showed him a patch of delicious berries. He met a wise old owl who told him stories about the stars. He even climbed to the top of a small hill to watch the sunset.",
        image: "🐢🐰🦉"
      },
      {
        text: "When night fell, Tim found a safe spot under a leafy plant. As he looked up at the stars, he felt proud. He had been brave enough to follow his dreams, even when others doubted him.",
        image: "🐢🌿✨"
      },
      {
        text: "The next day, Tim returned to the pond. 'Where have you been?' asked the other turtles. Tim smiled and began to share his adventures. This time, instead of laughing, the turtles listened with wonder in their eyes.",
        image: "🐢🗣️🐢"
      },
      {
        text: "From that day on, Tim became known as the Brave Little Turtle. Other turtles began to venture out too, discovering their own courage. And Tim learned that sometimes, the biggest adventure is simply having the courage to try something new.",
        image: "🐢👑💖"
      }
    ]
  };
  
  // Practice questions
  const practiceQuestions: Question[] = [
    {
      id: "q1",
      text: "What was Tim unlike the other turtles?",
      type: "multiple_choice",
      options: [
        "He was faster than the others", 
        "He dreamed of adventure", 
        "He was bigger than the others", 
        "He didn't like swimming"
      ],
      correctAnswer: "He dreamed of adventure",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q2",
      text: "Why did the other turtles laugh at Tim's idea?",
      type: "multiple_choice",
      options: [
        "They thought he was too small", 
        "They thought he was silly", 
        "They were jealous of him", 
        "They wanted to join him"
      ],
      correctAnswer: "They thought he was too small",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q3",
      text: "Fill in the blank: Tim met a _______ rabbit who showed him berries.",
      type: "fill_blank",
      correctAnswer: "friendly",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q4",
      text: "What important lesson did Tim learn?",
      type: "multiple_choice",
      options: [
        "Never leave home", 
        "Don't listen to friends", 
        "The courage to try something new is important", 
        "Ponds are better than forests"
      ],
      correctAnswer: "The courage to try something new is important",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q5",
      text: "At the end of the story, what did the other turtles begin to do?",
      type: "fill_blank",
      correctAnswer: "venture out",
      subject: "English" as any,
      curriculum: "Elementary" as any
    }
  ];
  
  // Loading message options
  const loadingMessages = [
    "Opening your storybook...",
    "Turning the pages...",
    "Preparing a wonderful story...",
    "Getting your adventure ready...",
    "Setting the scene..."
  ];
  
  // Choose a random loading message
  const [loadingMessage] = useState(
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );
  
  // Current page being viewed
  const [currentPage, setCurrentPage] = useState(0);
  
  useEffect(() => {
    // Set loading to false immediately without delay
    setIsLoading(false);
  }, []);
  
  // Mark page as read
  const markPageAsRead = (pageIndex: number) => {
    if (!pagesRead.includes(pageIndex)) {
      setPagesRead([...pagesRead, pageIndex]);
    }
  };
  
  // Check if all pages have been read
  const allPagesRead = pagesRead.length === story.pages.length;
  
  // Navigate to next page
  const goToNextPage = () => {
    if (currentPage < story.pages.length - 1) {
      markPageAsRead(currentPage);
      setCurrentPage(currentPage + 1);
    } else {
      markPageAsRead(currentPage);
    }
  };
  
  // Navigate to previous page
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Navigate back to tasks
  const handleGoBack = () => navigate('/child-tasks');
  
  // Navigation handlers for practice questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
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
  
  const handleSubmitTask = () => {
    window.alert("Great job! You've completed the story activity!");
    navigate('/child-tasks');
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
              Loading Story...
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 bg-amber-100/50 text-amber-800 py-1 px-3 rounded-full text-sm inline-block"
            >
              Story Reading Activity
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-lg mb-4"
            >
              Please wait while we prepare your story.
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
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
          <div className="bg-[#e8d5c4]/30 backdrop-blur-md rounded-xl shadow-md p-8 text-center border border-amber-200">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {error}
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but we encountered an issue with this activity.
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
  
  // Current question for practice section
  const currentQuestion = practiceQuestions[currentQuestionIndex];
  
  // Main story activity content
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to right, #dfd6c8, #e8d5c4)" }}>
      <Navbar />
      
      <main className="pt-20 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div className="space-y-6" {...fadeIn}>
            {/* Activity header with back button and status */}
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
                  <h1 className="text-3xl font-bold text-white">Story Time</h1>
                  <p className="text-white/90 mt-2">
                    Read the story and answer questions
                  </p>
                  
                  <div className="mt-4 bg-white/20 px-3 py-2 rounded-lg w-fit flex items-center gap-2 text-white">
                    <BookOpen className="h-4 w-4" />
                    <span>Reading Level: Elementary</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            </div>
            
            {/* Activity tabs */}
            <Tabs defaultValue="story" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-amber-100 w-full justify-start mb-4">
                <TabsTrigger value="story" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                  Story
                </TabsTrigger>
                <TabsTrigger 
                  value="practice" 
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                  disabled={!allPagesRead}
                >
                  Questions
                </TabsTrigger>
              </TabsList>
              
              {/* Story Tab */}
              <TabsContent value="story" className="space-y-6">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl text-gray-800">
                          {story.title}
                        </CardTitle>
                        <CardDescription className="text-amber-700">
                          By: {story.author}
                        </CardDescription>
                      </div>
                      <div className="text-sm text-amber-600">
                        Page {currentPage + 1} of {story.pages.length}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 bg-white">
                    {/* Story page content */}
                    <div className="flex flex-col items-center space-y-6">
                      {/* Illustration */}
                      <div className="w-full max-w-md aspect-video bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200 text-6xl p-6">
                        {story.pages[currentPage].image}
                      </div>
                      
                      {/* Story text */}
                      <div className="prose prose-amber max-w-none w-full">
                        <p className="text-xl leading-relaxed text-gray-800">
                          {story.pages[currentPage].text}
                        </p>
                      </div>
                      
                      {/* Page progress */}
                      <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden mt-6">
                        <div 
                          className="bg-amber-500 h-full transition-all duration-300 ease-in-out"
                          style={{ width: `${((currentPage + 1) / story.pages.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 border-t border-amber-100 bg-amber-50 flex justify-between">
                    <Button
                      onClick={goToPreviousPage}
                      variant="outline"
                      className="border-amber-200"
                      disabled={currentPage === 0}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous Page
                    </Button>
                    
                    {currentPage < story.pages.length - 1 ? (
                      <Button
                        onClick={goToNextPage}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Next Page
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setActiveTab('practice')}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                        disabled={!allPagesRead}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Continue to Questions
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                
                {!allPagesRead && currentPage === story.pages.length - 1 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <p className="text-amber-700">
                      Great job! You've finished the story. Click "Continue to Questions" to answer some questions about what you've read.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* Practice Questions Tab */}
              <TabsContent value="practice" className="space-y-6">
                {/* Progress bar */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
                  <div className="flex justify-between text-sm mb-2 text-gray-600">
                    <span>Question {currentQuestionIndex + 1} of {practiceQuestions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / practiceQuestions.length) * 100)}% Complete</span>
                  </div>
                  <Progress 
                    value={((currentQuestionIndex + 1) / practiceQuestions.length) * 100} 
                    className="h-2 bg-amber-100" 
                    indicatorClassName="bg-amber-600" 
                  />
                </div>
                
                <Card className="border-none shadow-md overflow-hidden">
                  <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <CardTitle className="text-xl text-gray-800">
                          Question {currentQuestionIndex + 1}
                        </CardTitle>
                        <CardDescription className="text-amber-700">
                          About "{story.title}"
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 bg-white">
                    <div className="text-lg font-medium text-gray-800 mb-6">{currentQuestion.text}</div>
                    
                    {currentQuestion.type === 'multiple_choice' ? (
                      <MultipleChoiceQuestion
                        question={currentQuestion}
                        userAnswer={answers[currentQuestion.id] || ''}
                        isCompleted={false}
                        onChange={handleAnswerChange}
                      />
                    ) : currentQuestion.type === 'fill_blank' ? (
                      <FillBlankQuestion
                        question={currentQuestion}
                        userAnswer={answers[currentQuestion.id] || ''}
                        isCompleted={false}
                        isCorrect={false}
                        isIncorrect={false}
                        onChange={handleAnswerChange}
                      />
                    ) : (
                      <p>Unsupported question type</p>
                    )}
                  </CardContent>
                  
                  <CardFooter className="p-4 border-t border-amber-100 bg-amber-50">
                    <QuestionNavigation
                      currentQuestionIndex={currentQuestionIndex}
                      totalQuestions={practiceQuestions.length}
                      handlePreviousQuestion={handlePreviousQuestion}
                      handleNextQuestion={handleNextQuestion}
                      handleSubmitTask={handleSubmitTask}
                      isSubmitting={false}
                      isCompleted={false}
                    />
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FixedStoryTask; 