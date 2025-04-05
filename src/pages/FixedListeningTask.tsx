import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertCircle, Volume2, Pause, Play, RotateCcw, VolumeX, Loader2, Headphones } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { MultipleChoiceQuestion, FillBlankQuestion, QuestionNavigation } from '@/components/task-detail';
import { Question } from '@/lib/types';
import { Slider } from '@/components/ui/slider';

/**
 * Fixed implementation for an Audio Listening Task
 * This component provides an audio player with practice questions
 */
const FixedListeningTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('listen');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [hasListened, setHasListened] = useState(false);
  
  // Audio content - in a real app you would fetch this from an API
  const audioContent = {
    title: "Sounds of the Forest",
    description: "Listen to the sounds of a forest and try to identify the different animals and natural elements.",
    audioSrc: "https://ia800203.us.archive.org/14/items/soundsofforest/Nature_Sounds_Of_A_Forest.mp3",
    transcriptSections: [
      { 
        time: "0:00 - 0:30", 
        text: "The audio begins with the gentle rustling of leaves in the wind. Birds can be heard chirping in the background, creating a peaceful forest ambiance." 
      },
      { 
        time: "0:30 - 1:00", 
        text: "The sound of a nearby stream or small waterfall becomes more prominent. More bird calls can be heard, some close by and others in the distance." 
      },
      { 
        time: "1:00 - 1:30", 
        text: "A woodpecker can be heard tapping on a tree trunk. The wind picks up slightly, causing more movement in the tree branches above." 
      },
      { 
        time: "1:30 - 2:00", 
        text: "Several animals can be heard moving through underbrush. The water sounds continue, along with various bird songs that create a natural forest symphony." 
      }
    ]
  };
  
  // Practice questions about the audio
  const practiceQuestions: Question[] = [
    {
      id: "q1",
      text: "Which animal sound can be heard tapping on a tree around 1 minute into the audio?",
      type: "multiple_choice",
      options: [
        "An owl", 
        "A woodpecker", 
        "A squirrel", 
        "A frog"
      ],
      correctAnswer: "A woodpecker",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q2",
      text: "What sound becomes more prominent around 30 seconds into the recording?",
      type: "multiple_choice",
      options: [
        "Wind", 
        "Rain", 
        "A stream or waterfall", 
        "Animal footsteps"
      ],
      correctAnswer: "A stream or waterfall",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q3",
      text: "Fill in the blank: The audio begins with the gentle _______ of leaves in the wind.",
      type: "fill_blank",
      correctAnswer: "rustling",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q4",
      text: "What creates the 'natural forest symphony' mentioned in the transcript?",
      type: "multiple_choice",
      options: [
        "Musical instruments", 
        "Various bird songs", 
        "Human singing", 
        "Electronic sounds"
      ],
      correctAnswer: "Various bird songs",
      subject: "English" as any,
      curriculum: "Elementary" as any
    },
    {
      id: "q5",
      text: "Fill in the blank: Around 1:30, several animals can be heard moving through _______.",
      type: "fill_blank",
      correctAnswer: "underbrush",
      subject: "English" as any,
      curriculum: "Elementary" as any
    }
  ];
  
  // Loading message options
  const loadingMessages = [
    "Preparing your audio...",
    "Setting up the listening activity...",
    "Tuning into nature sounds...",
    "Loading forest ambiance...",
    "Getting your headphones ready..."
  ];
  
  // Choose a random loading message
  const [loadingMessage] = useState(
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );
  
  // Initialize audio and cleanup
  useEffect(() => {
    // Set loading to false immediately without delay
    setIsLoading(false);
    
    // Setup audio event listeners
    const audio = audioRef.current;
    
    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setHasListened(true);
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      
      audio.volume = volume;
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);
  
  // Update audio volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Audio control functions
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Navigation handlers
  const handleGoBack = () => navigate('/child-tasks');
  
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
    window.alert("Great job! You've completed the listening activity!");
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
              Loading Audio...
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 bg-amber-100/50 text-amber-800 py-1 px-3 rounded-full text-sm inline-block"
            >
              Listening Activity
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-lg mb-4"
            >
              Please wait while we prepare your audio.
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
  
  // Main audio player and activity content
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to right, #dfd6c8, #e8d5c4)" }}>
      <Navbar />
      
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioContent.audioSrc} preload="metadata" />
      
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
                  <h1 className="text-3xl font-bold text-white">Listening Activity</h1>
                  <p className="text-white/90 mt-2">
                    Listen carefully and answer questions
                  </p>
                  
                  <div className="mt-4 bg-white/20 px-3 py-2 rounded-lg w-fit flex items-center gap-2 text-white">
                    <Headphones className="h-4 w-4" />
                    <span>Audio: {audioContent.title}</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            </div>
            
            {/* Activity tabs */}
            <Tabs defaultValue="listen" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-amber-100 w-full justify-start mb-4">
                <TabsTrigger value="listen" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                  Listen
                </TabsTrigger>
                <TabsTrigger 
                  value="practice" 
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                  disabled={!hasListened}
                >
                  Questions
                </TabsTrigger>
              </TabsList>
              
              {/* Listen Tab */}
              <TabsContent value="listen" className="space-y-6">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                    <CardTitle className="text-xl text-gray-800">
                      {audioContent.title}
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      {audioContent.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 bg-white">
                    <div className="space-y-8">
                      {/* Audio player */}
                      <div className="p-6 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center space-x-4 mb-4">
                          {/* Play/Pause button */}
                          <Button
                            onClick={togglePlayPause}
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full border-amber-300 text-amber-700 hover:bg-amber-100"
                          >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </Button>
                          
                          {/* Time and progress slider */}
                          <div className="flex-1">
                            <div className="flex justify-between text-sm text-amber-700 mb-1">
                              <span>{formatTime(currentTime)}</span>
                              <span>{formatTime(duration)}</span>
                            </div>
                            <Slider
                              value={[currentTime]}
                              min={0}
                              max={duration || 100}
                              step={1}
                              onValueChange={handleSeek}
                              className="cursor-pointer"
                            />
                          </div>
                          
                          {/* Restart button */}
                          <Button
                            onClick={handleRestart}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:bg-amber-100"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          
                          {/* Volume slider */}
                          <div className="relative flex items-center w-24">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 min-w-8 text-amber-600 hover:bg-amber-100"
                              onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                            >
                              {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                            <Slider
                              value={[volume]}
                              min={0}
                              max={1}
                              step={0.01}
                              onValueChange={handleVolumeChange}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        
                        {hasListened ? (
                          <div className="bg-green-100 text-green-800 rounded-lg p-3 text-sm flex items-center gap-2">
                            <span className="bg-green-600 h-2 w-2 rounded-full" />
                            You've listened to this audio! You can proceed to the questions.
                          </div>
                        ) : (
                          <div className="bg-amber-100 text-amber-800 rounded-lg p-3 text-sm flex items-center gap-2">
                            <span className="bg-amber-600 h-2 w-2 rounded-full animate-pulse" />
                            Please listen to the audio before proceeding to the questions.
                          </div>
                        )}
                      </div>
                      
                      {/* Transcript sections */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Audio Transcript</h3>
                        <div className="space-y-4">
                          {audioContent.transcriptSections.map((section, index) => (
                            <div key={index} className="bg-white rounded-lg border border-amber-100 p-4">
                              <div className="text-sm font-medium text-amber-600 mb-2">{section.time}</div>
                              <p className="text-gray-700">{section.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 border-t border-amber-100 bg-amber-50">
                    <div className="w-full flex justify-between">
                      <Button
                        onClick={handleGoBack}
                        variant="outline"
                        className="border-amber-200"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Tasks
                      </Button>
                      
                      <Button
                        onClick={() => setActiveTab('practice')}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                        disabled={!hasListened}
                      >
                        Continue to Questions
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                
                {!hasListened && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-700">
                      You need to listen to the audio at least once before proceeding to the questions.
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
                          About "{audioContent.title}"
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
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Button
                      onClick={() => setActiveTab('listen')}
                      variant="outline"
                      size="sm"
                      className="mt-1 border-amber-200"
                    >
                      <Headphones className="h-4 w-4 mr-2" />
                      Listen Again
                    </Button>
                    <p className="text-amber-700 text-sm">
                      You can go back to listen to the audio again if you need help with the questions.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FixedListeningTask; 