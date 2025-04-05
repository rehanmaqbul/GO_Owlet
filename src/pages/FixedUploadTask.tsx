import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertCircle, Camera, Upload, CheckCircle2, ImageIcon, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Textarea } from '@/components/ui/textarea';
import { MultipleChoiceQuestion, FillBlankQuestion, QuestionNavigation } from '@/components/task-detail';
import { Question } from '@/lib/types';

/**
 * Fixed implementation for an Upload Activity Task
 * This component allows children to complete an activity outside of the app and upload an image of their work
 */
const FixedUploadTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('instructions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [reflection, setReflection] = useState('');
  
  // Activity details
  const activity = {
    title: "Create a Nature Collage",
    description: "Collect leaves, flowers, and other natural items to create a colorful collage.",
    instructions: [
      "Go outside and collect at least 5 different natural items (leaves, flowers, twigs, etc.)",
      "Arrange them on a piece of paper to create a picture or pattern",
      "Glue the items down to create your collage",
      "Add any additional details with markers or crayons if you wish",
      "Take a photo of your completed collage and upload it here"
    ],
    materials: [
      "Paper (white or colored)",
      "Leaves, flowers, and other natural items",
      "Glue or glue stick",
      "Scissors (optional)",
      "Markers or crayons (optional)"
    ],
    tips: [
      "Try to find items with different colors and textures",
      "Pressing the leaves between books for a day will make them flat and easier to glue",
      "You can create a picture like a tree or animal, or make an abstract pattern",
      "Make sure to handle delicate flowers carefully"
    ]
  };
  
  // Reflection questions about the activity
  const practiceQuestions: Question[] = [
    {
      id: "q1",
      text: "Which natural material did you enjoy working with the most?",
      type: "multiple_choice",
      options: [
        "Leaves", 
        "Flowers", 
        "Twigs/Sticks", 
        "Seeds/Nuts"
      ],
      correctAnswer: "Leaves", // This doesn't matter for reflection questions
      subject: "Art" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "q2",
      text: "What was the most challenging part of creating your collage?",
      type: "multiple_choice",
      options: [
        "Finding enough materials", 
        "Arranging the items", 
        "Gluing the items down", 
        "Taking a good photo"
      ],
      correctAnswer: "Arranging the items", // This doesn't matter for reflection questions
      subject: "Art" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "q3",
      text: "Fill in the blank: My favorite part of this activity was _______.",
      type: "fill_blank",
      correctAnswer: "", // This will be open-ended for reflection
      subject: "Art" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "q4",
      text: "What would you do differently if you created another nature collage?",
      type: "multiple_choice",
      options: [
        "Use different materials", 
        "Create a different design", 
        "Spend more time on it", 
        "Add more colors"
      ],
      correctAnswer: "Use different materials", // This doesn't matter for reflection questions
      subject: "Art" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "q5",
      text: "Fill in the blank: I learned that nature has many _______ that can be used in art.",
      type: "fill_blank",
      correctAnswer: "textures", // Example answer, but any reasonable answer is fine
      subject: "Art" as any,
      curriculum: "Elementary" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Loading message options
  const loadingMessages = [
    "Setting up your creative activity...",
    "Preparing your nature exploration...",
    "Getting your art supplies ready...",
    "Crafting a fun experience...",
    "Arranging your creative canvas..."
  ];
  
  // Choose a random loading message
  const [loadingMessage] = useState(
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );
  
  // Set loading to false immediately without delay
  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Simulate upload process
      setIsUploading(true);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Simulate upload completion
      setTimeout(() => {
        setIsUploading(false);
        setHasUploaded(true);
      }, 2000);
    }
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
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
    window.alert("Great job! Your collage and reflection have been submitted!");
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
              Preparing Activity...
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 bg-amber-100/50 text-amber-800 py-1 px-3 rounded-full text-sm inline-block"
            >
              Creative Project
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
  
  // Current question for reflection section
  const currentQuestion = practiceQuestions[currentQuestionIndex];
  
  // Main content
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to right, #dfd6c8, #e8d5c4)" }}>
      <Navbar />
      
      {/* Hidden file input for image upload */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <main className="pt-24 px-4 pb-16 max-w-4xl mx-auto">
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
                <h1 className="text-3xl font-bold text-white">{activity.title}</h1>
                <p className="text-white/90 mt-2">
                  {activity.description}
                </p>
                
                <div className="mt-4 bg-white/20 px-3 py-2 rounded-lg w-fit flex items-center gap-2 text-white">
                  <Camera className="h-4 w-4" />
                  <span>Offline Activity with Upload</span>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
          </div>
          
          {/* Activity tabs */}
          <Tabs defaultValue="instructions" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-amber-100 w-full justify-start mb-4">
              <TabsTrigger value="instructions" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                Instructions
              </TabsTrigger>
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              >
                Upload
              </TabsTrigger>
              <TabsTrigger 
                value="reflection" 
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                disabled={!hasUploaded}
              >
                Reflection
              </TabsTrigger>
            </TabsList>
            
            {/* Instructions Tab */}
            <TabsContent value="instructions" className="space-y-6">
              <Card>
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                  <CardTitle className="text-xl text-gray-800">
                    Activity Instructions
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Follow these steps to complete your nature collage
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 bg-white">
                  <div className="space-y-6">
                    {/* Instructions */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Steps:</h3>
                      <ul className="space-y-3">
                        {activity.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-amber-700">{index + 1}</span>
                            </div>
                            <p className="text-gray-700">{instruction}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Materials needed */}
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Materials Needed:</h3>
                      <ul className="space-y-2">
                        {activity.materials.map((material, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Tips */}
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                      <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <Info className="h-5 w-5 text-yellow-600" />
                        Helpful Tips:
                      </h3>
                      <ul className="space-y-2">
                        {activity.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="mt-1 text-yellow-600">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
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
                      onClick={() => setActiveTab('upload')}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Continue to Upload
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                  <CardTitle className="text-xl text-gray-800">
                    Upload Your Collage
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Take a photo of your completed work and upload it here
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 bg-white">
                  <div className="space-y-6">
                    {/* Upload area */}
                    {!imagePreview ? (
                      <div 
                        onClick={triggerFileUpload}
                        className="border-2 border-dashed border-amber-300 rounded-xl p-10 bg-amber-50 text-center cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        <div className="mx-auto w-16 h-16 mb-4 text-amber-400">
                          <Upload className="w-16 h-16" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Your Photo</h3>
                        <p className="text-gray-600 mb-4">
                          Click here to select a photo of your completed collage
                        </p>
                        <Button 
                          variant="outline"
                          className="border-amber-300 text-amber-700"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Select Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Uploaded collage" 
                            className="w-full h-64 object-contain bg-amber-50 rounded-lg border border-amber-200" 
                          />
                          
                          {isUploading && (
                            <div className="absolute inset-0 bg-amber-900/50 flex items-center justify-center rounded-lg">
                              <div className="bg-white p-4 rounded-lg flex items-center gap-3">
                                <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
                                <span className="text-gray-800 font-medium">Uploading...</span>
                              </div>
                            </div>
                          )}
                          
                          {hasUploaded && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 px-2 rounded flex items-center gap-1 text-sm">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Uploaded</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button
                            onClick={triggerFileUpload}
                            variant="outline"
                            className="border-amber-200"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Change Photo
                          </Button>
                          
                          {hasUploaded && (
                            <Button
                              onClick={() => setActiveTab('reflection')}
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Continue to Reflection
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Instructions reminder */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <h3 className="text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Remember to:
                      </h3>
                      <ul className="space-y-1 text-sm">
                        <li className="text-gray-700">• Take a clear photo in good lighting</li>
                        <li className="text-gray-700">• Make sure your entire collage is visible</li>
                        <li className="text-gray-700">• Upload only your own work</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 border-t border-amber-100 bg-amber-50">
                  <div className="w-full flex justify-between">
                    <Button
                      onClick={() => setActiveTab('instructions')}
                      variant="outline"
                      className="border-amber-200"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Instructions
                    </Button>
                    
                    {hasUploaded && (
                      <Button
                        onClick={() => setActiveTab('reflection')}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Continue to Reflection
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Reflection Tab */}
            <TabsContent value="reflection" className="space-y-6">
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
                        Reflection Question {currentQuestionIndex + 1}
                      </CardTitle>
                      <CardDescription className="text-amber-700">
                        Think about your experience creating the collage
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
              
              {currentQuestionIndex === practiceQuestions.length - 1 && (
                <Card>
                  <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                    <CardTitle className="text-xl text-gray-800">Final Thoughts</CardTitle>
                    <CardDescription className="text-amber-700">
                      Share any additional thoughts about your collage
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 bg-white">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What else would you like to share about your nature collage?
                      </label>
                      <Textarea
                        placeholder="I enjoyed creating this collage because..."
                        className="min-h-[120px]"
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Button
                    onClick={() => setActiveTab('upload')}
                    variant="outline"
                    size="sm"
                    className="mt-1 border-amber-200"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    View Upload
                  </Button>
                  <p className="text-amber-700 text-sm">
                    You can go back to view your uploaded collage at any time.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default FixedUploadTask; 