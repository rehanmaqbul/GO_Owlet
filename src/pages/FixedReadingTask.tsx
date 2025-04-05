import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, AlertCircle, Clock, Loader2, Mic, StopCircle, Play, CheckCircle, RefreshCcw, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { MultipleChoiceQuestion, FillBlankQuestion, QuestionNavigation } from '@/components/task-detail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Task, Question } from '@/lib/types';

/**
 * Fixed implementation for a Reading Activity Task
 * This component provides a reading aloud experience with audio recording and practice questions
 */
const FixedReadingTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeTab, setActiveTab] = useState('reading');
  const recordingTimerRef = useRef<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Sample reading passage
  const readingPassage = {
    title: "The Magic of Reading",
    level: "Intermediate",
    text: `Once upon a time, in a quiet village nestled between rolling green hills, there lived a young girl named Lily. Lily loved to read more than anything else in the world. Every afternoon, after finishing her chores, she would climb the tallest oak tree in her garden with a book tucked under her arm.

From her perch high among the leaves, Lily could see the entire village spread out below her. But most of the time, she didn't notice the view at all. She was too busy traveling to far-off lands, meeting fascinating characters, and experiencing amazing adventures—all through the pages of her books.

Lily's parents worried that she spent too much time reading alone. "Why don't you play with the other children?" her mother would ask. But Lily knew something that her parents didn't understand: she was never alone when she read. She had hundreds of friends living in her books.

One rainy day, as Lily was reading about a magical library where books could talk, something extraordinary happened. She heard a small voice whisper, "Hello, Lily." Startled, she looked around her room, but no one was there. The voice came again, "Down here, in your hands!"

Lily looked down at her book in amazement. The characters on the page were moving, waving at her! "We've been waiting for someone like you," they said. "Someone who truly loves stories with all their heart."

From that day forward, Lily discovered that reading wasn't just an escape—it was a kind of magic that connected all the stories in the world. And she was part of that magic too.`
  };
  
  // Reading questions
  const readingQuestions: Question[] = [
    {
      id: "r1",
      text: "What was the main character of the story?",
      type: "multiple_choice",
      options: [
        "A dog", 
        "A cat", 
        "A bird", 
        "A rabbit"
      ],
      correctAnswer: "A dog",
      subject: "English" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "r2",
      text: "What did the dog find in the park?",
      type: "multiple_choice",
      options: [
        "A ball", 
        "A bone", 
        "A stick", 
        "A toy"
      ],
      correctAnswer: "A stick",
      subject: "English" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "r3",
      text: "Fill in the blank: The dog's name was _______.",
      type: "fill_blank",
      correctAnswer: "Buddy",
      subject: "English" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "r4",
      text: "How did the dog feel at the end of the story?",
      type: "multiple_choice",
      options: [
        "Happy", 
        "Sad", 
        "Angry", 
        "Scared"
      ],
      correctAnswer: "Happy",
      subject: "English" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "r5",
      text: "Fill in the blank: The dog played in the park for _______ hours.",
      type: "fill_blank",
      correctAnswer: "two",
      subject: "English" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Sample practice questions
  const practiceQuestions: Question[] = [
    {
      id: "q1",
      text: "What did Lily love more than anything else in the world?",
      type: "multiple_choice",
      options: ["Playing with friends", "Climbing trees", "Reading books", "Doing chores"],
      correctAnswer: "Reading books",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q2",
      text: "Where would Lily go to read her books?",
      type: "multiple_choice",
      options: ["In her bedroom", "At the village library", "In a tall oak tree", "By the river"],
      correctAnswer: "In a tall oak tree",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q3",
      text: "Fill in the blank: Lily's parents worried that she spent too much time _______ alone.",
      type: "fill_blank",
      correctAnswer: "reading",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q4",
      text: "What extraordinary thing happened to Lily on the rainy day?",
      type: "multiple_choice",
      options: [
        "She found a magical library", 
        "She heard a voice from her book", 
        "She met other children who liked reading", 
        "Her parents bought her new books"
      ],
      correctAnswer: "She heard a voice from her book",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q5",
      text: "According to the story, reading is described as a kind of:",
      type: "fill_blank",
      correctAnswer: "magic",
      subject: "English" as any,
      curriculum: "Elementary" as any
    }
  ];
  
  // Loading message options
  const loadingMessages = [
    "Preparing your reading adventure...",
    "Getting your story ready...",
    "Opening the book of wonders...",
    "Warming up your reading skills...",
    "Creating your learning journey..."
  ];
  
  // Choose a random loading message
  const [loadingMessage] = useState(
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );
  
  // Set up audio recording capabilities
  useEffect(() => {
    const setupMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        
        recorder.onstart = () => {
          setAudioChunks([]);
          setIsRecording(true);
          startRecordingTimer();
        };
        
        recorder.ondataavailable = (e) => {
          setAudioChunks((chunks) => [...chunks, e.data]);
        };
        
        recorder.onstop = () => {
          setIsRecording(false);
          stopRecordingTimer();
          
          // Create audio blob and URL
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        };
        
        setMediaRecorder(recorder);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Unable to access your microphone. Please check your browser permissions.");
      }
    };
    
    setupMediaRecorder();
    
    // Set loading to false immediately without delay
    setIsLoading(false);
    
    // Cleanup function
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioChunks]);
  
  // Functions to handle the recording timer
  const startRecordingTimer = () => {
    setRecordingTime(0);
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
  };
  
  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };
  
  // Start recording
  const handleStartRecording = () => {
    if (mediaRecorder && !isRecording) {
      setAudioUrl(null); // Clear previous recording
      mediaRecorder.start();
    }
  };
  
  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };
  
  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    window.alert("Great job! Your reading activity has been submitted.");
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
              Loading Reading Activity...
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 bg-amber-100/50 text-amber-800 py-1 px-3 rounded-full text-sm inline-block"
            >
              Reading Aloud Practice
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-lg mb-4"
            >
              Please wait while we prepare your activity.
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
  
  // Main reading activity content
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to right, #dfd6c8, #e8d5c4)" }}>
      <Navbar />
      
      <main className="pt-20 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div className="space-y-6" {...fadeIn}>
            {/* Reading activity header with back button and status */}
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
                  <h1 className="text-3xl font-bold text-white">Reading Activity</h1>
                  <p className="text-white/90 mt-2">
                    Practice reading aloud and answer questions
                  </p>
                  
                  <div className="mt-4 bg-white/20 px-3 py-2 rounded-lg w-fit flex items-center gap-2 text-white">
                    <BookOpen className="h-4 w-4" />
                    <span>Reading Level: Intermediate</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            </div>
            
            {/* Activity tabs */}
            <Tabs defaultValue="reading" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-amber-100 w-full justify-start mb-4">
                <TabsTrigger value="reading" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                  Reading
                </TabsTrigger>
                <TabsTrigger value="practice" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                  Practice Questions
                </TabsTrigger>
              </TabsList>
              
              {/* Reading Tab */}
              <TabsContent value="reading" className="space-y-6">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl text-gray-800">
                          {readingPassage.title}
                        </CardTitle>
                        <CardDescription className="text-amber-700">
                          Read this passage aloud and record yourself
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 bg-white">
                    <div className="prose prose-amber max-w-none mb-6">
                      <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
                        {readingPassage.text}
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        Recording Instructions
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Find a quiet place without background noise</li>
                        <li>• Read the passage at a comfortable pace</li>
                        <li>• Speak clearly and use appropriate expression</li>
                        <li>• You can re-record as many times as needed</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white border border-amber-200 rounded-lg shadow-sm p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800">Your Recording</h3>
                        {isRecording && (
                          <div className="flex items-center gap-2">
                            <span className="animate-pulse text-red-500">●</span>
                            <span className="text-gray-700 font-medium">{formatTime(recordingTime)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        {!isRecording ? (
                          <Button 
                            onClick={handleStartRecording}
                            className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
                            disabled={isRecording}
                          >
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleStopRecording}
                            className="bg-red-600 hover:bg-red-700 text-white flex-1"
                            disabled={!isRecording}
                          >
                            <StopCircle className="h-4 w-4 mr-2" />
                            Stop Recording
                          </Button>
                        )}
                        
                        {audioUrl && (
                          <Button 
                            onClick={() => setAudioUrl(null)}
                            variant="outline"
                            className="border-amber-200"
                          >
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Clear
                          </Button>
                        )}
                      </div>
                      
                      {audioUrl && (
                        <div className="border border-amber-100 rounded-lg p-3 bg-amber-50">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Recording</h4>
                          <audio 
                            src={audioUrl} 
                            controls 
                            className="w-full h-10"
                          ></audio>
                          
                          <div className="flex justify-end mt-3">
                            <div className="text-sm text-amber-700 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Recording saved
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 border-t border-amber-100 bg-amber-50 flex justify-between">
                    <Button
                      onClick={handleGoBack}
                      variant="outline"
                      className="border-amber-200"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    
                    <Button
                      onClick={() => setActiveTab('practice')}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                      disabled={!audioUrl}
                    >
                      Continue to Questions
                    </Button>
                  </CardFooter>
                </Card>
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
                          {currentQuestion.subject} • {currentQuestion.curriculum} curriculum
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

export default FixedReadingTask; 