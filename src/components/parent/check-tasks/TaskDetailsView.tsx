import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getSubjectDetails } from '../../../components/parent/check-tasks/mockData';
import { 
  Book, 
  CheckCircle2, 
  Clock, 
  X, 
  ChevronDown, 
  FileText, 
  MessageSquare, 
  Calendar, 
  CheckSquare,
  BookOpen,
  ScrollText,
  PenTool,
  Info,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import TaskProgressChart from './TaskProgressChart';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TaskDetailsViewProps {
  childId: string;
  subjectId: string;
  onBack: () => void;
}

const QuestionStatus = ({ isCorrect }: { isCorrect?: boolean }) => {
  if (isCorrect === undefined) return null;
  
  return isCorrect ? (
    <div className="flex items-center gap-1 text-green-600 bg-green-50 py-1 px-2 rounded-full text-xs">
      <CheckCircle2 className="h-3 w-3" />
      <span>Correct</span>
    </div>
  ) : (
    <div className="flex items-center gap-1 text-red-500 bg-red-50 py-1 px-2 rounded-full text-xs">
      <X className="h-3 w-3" />
      <span>Incorrect</span>
    </div>
  );
};

const QuestionTypeTag = ({ type }: { type: string }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return { icon: <HelpCircle className="h-3 w-3" />, label: 'Multiple Choice', bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
      case 'fill_blank':
        return { icon: <PenTool className="h-3 w-3" />, label: 'Fill in the Blank', bgColor: 'bg-purple-50', textColor: 'text-purple-600' };
      case 'true_false':
        return { icon: <CheckSquare className="h-3 w-3" />, label: 'True/False', bgColor: 'bg-teal-50', textColor: 'text-teal-600' };
      case 'reading':
        return { icon: <BookOpen className="h-3 w-3" />, label: 'Reading Activity', bgColor: 'bg-amber-50', textColor: 'text-amber-600' };
      default:
        return { icon: <Info className="h-3 w-3" />, label: 'Other', bgColor: 'bg-gray-50', textColor: 'text-gray-600' };
    }
  };

  const { icon, label, bgColor, textColor } = getTypeConfig(type);
  
  return (
    <div className={`flex items-center gap-1 ${textColor} ${bgColor} py-1 px-2 rounded-full text-xs`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

const TaskDetailsView = ({ childId, subjectId, onBack }: TaskDetailsViewProps) => {
  const [activeTab, setActiveTab] = useState('questions');
  
  // Get subject details from the mock data
  const subjectDetails = getSubjectDetails(subjectId);
  
  if (!subjectDetails) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md text-center">
        <div className="bg-amber-50 p-4 rounded-full inline-block mb-4">
          <X className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Subject Not Found</h3>
        <p className="text-gray-600 mb-6">
          The requested subject details could not be found.
        </p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  // Separate practice questions from activity questions
  const practiceQuestions = subjectDetails.questions.filter(q => q.type !== 'reading');
  const activityQuestions = subjectDetails.questions.filter(q => q.type === 'reading');
  
  // Calculate stats for practice questions
  const practiceStats = {
    total: practiceQuestions.length,
    correct: practiceQuestions.filter(q => q.isCorrect).length,
    incorrect: practiceQuestions.filter(q => q.isCorrect === false).length
  };
  
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronDown className="h-4 w-4 rotate-90" />
          Back to Tasks
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Last updated: Today, 2:30 PM</span>
        </div>
      </div>
      
      {/* Subject overview card */}
      <Card className="p-6 border-amber-200">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 rounded-lg bg-amber-50">
                <Book className="h-6 w-6 text-amber-500" />
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{subjectDetails.name}</h2>
                <p className="text-gray-600">
                  {subjectDetails.category === 'educational' ? 'Educational Subject' : 'Skill Development'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Completion Progress</span>
                  <span className="text-sm font-medium text-amber-600">{subjectDetails.percentage}%</span>
                </div>
                <Progress value={subjectDetails.percentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-700">{subjectDetails.correctAnswers}</div>
                  <div className="text-xs text-green-600">Correct</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-red-700">{subjectDetails.wrongAnswers}</div>
                  <div className="text-xs text-red-600">Incorrect</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-700">{subjectDetails.totalQuestions}</div>
                  <div className="text-xs text-blue-600">Total</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3 border-l border-gray-100 pl-6">
            <TaskProgressChart 
              completed={subjectDetails.correctAnswers}
              inProgress={subjectDetails.totalQuestions - subjectDetails.correctAnswers - subjectDetails.wrongAnswers}
              notStarted={0}
              total={subjectDetails.totalQuestions}
            />
          </div>
        </div>
      </Card>
      
      {/* Tabs for different views */}
      <Tabs defaultValue="questions" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-amber-50 mb-6">
          <TabsTrigger 
            value="questions" 
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="feedback" 
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions" className="mt-0">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-amber-500" />
              Questions Review
            </h3>
            
            <div className="flex items-center justify-between mb-4 bg-amber-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-800">Practice Questions Performance</span>
              </div>
              <div className="flex gap-3">
                <div className="text-xs flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Correct: {practiceStats.correct}</span>
                </div>
                <div className="text-xs flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Incorrect: {practiceStats.incorrect}</span>
                </div>
                <div className="text-xs flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span>Total: {practiceStats.total}</span>
                </div>
              </div>
            </div>
            
            {/* Activity Questions Section */}
            {activityQuestions.length > 0 && (
              <div className="mb-6">
                <div className="bg-amber-100 p-3 rounded-lg mb-4">
                  <h4 className="font-medium flex items-center gap-2 text-amber-800">
                    <BookOpen className="h-5 w-5 text-amber-600" />
                    Activity-Based Questions
                  </h4>
                </div>
                
                {activityQuestions.map((question, index) => (
                  <Collapsible key={question.id} className="mb-4 border rounded-lg overflow-hidden">
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-100 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium text-amber-800">
                          A{index + 1}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{question.text}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <QuestionTypeTag type={question.type} />
                        {question.isCorrect !== undefined && <QuestionStatus isCorrect={question.isCorrect} />}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-t bg-gray-50 p-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium text-gray-700">Activity Details:</div>
                          <div className="bg-white p-3 rounded border mt-1">
                            <p>{question.activityContent || question.correctAnswer}</p>
                          </div>
                        </div>
                        
                        {question.childAnswer && (
                          <div>
                            <div className="text-sm font-medium text-gray-700">Child's Response:</div>
                            <div className="bg-white p-3 rounded border mt-1">
                              <p>{question.childAnswer}</p>
                            </div>
                          </div>
                        )}
                        
                        {question.relatedQuestions && question.relatedQuestions.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-gray-700">Related Practice Questions:</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {question.relatedQuestions.map(qId => {
                                const relatedQuestion = practiceQuestions.find(q => q.id === qId);
                                if (!relatedQuestion) return null;
                                
                                return (
                                  <div key={qId} className="bg-white p-2 rounded border flex items-start gap-2">
                                    <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${
                                      relatedQuestion.isCorrect ? 'bg-green-500' : relatedQuestion.isCorrect === false ? 'bg-red-500' : 'bg-gray-300'
                                    }`}>
                                      {relatedQuestion.isCorrect ? '✓' : relatedQuestion.isCorrect === false ? '×' : '?'}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-xs font-medium">{relatedQuestion.text}</div>
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        {relatedQuestion.childAnswer ? `Answer: ${relatedQuestion.childAnswer}` : 'Not attempted'}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
            
            {/* Practice Questions Section */}
            {practiceQuestions.length > 0 && (
              <div>
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <h4 className="font-medium flex items-center gap-2 text-blue-800">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Practice Questions
                  </h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {practiceQuestions.map((question, index) => (
                    <Card key={question.id} className="overflow-hidden border border-gray-200">
                      <div className="bg-gray-50 p-3 flex justify-between items-center border-b">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium text-blue-800">
                            Q{index + 1}
                          </div>
                          <QuestionTypeTag type={question.type} />
                        </div>
                        <QuestionStatus isCorrect={question.isCorrect} />
                      </div>
                      
                      <div className="p-4">
                        <div className="font-medium mb-3">{question.text}</div>
                        
                        {question.options && (
                          <div className="mb-3 space-y-2">
                            {question.options.map((option, idx) => (
                              <div 
                                key={idx} 
                                className={`p-2 border rounded-md flex items-center ${
                                  option === question.correctAnswer 
                                    ? 'bg-green-50 border-green-200' 
                                    : option === question.childAnswer && option !== question.correctAnswer
                                      ? 'bg-red-50 border-red-200'
                                      : 'bg-white'
                                }`}
                              >
                                <span className="h-4 w-4 rounded-full border inline-flex items-center justify-center mr-2 text-xs">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span>{option}</span>
                                {option === question.correctAnswer && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                                )}
                                {option === question.childAnswer && option !== question.correctAnswer && (
                                  <X className="h-4 w-4 text-red-500 ml-auto" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {!question.options && (
                          <>
                            <div className="mb-2">
                              <div className="text-xs text-gray-500">Child's Answer:</div>
                              <div className={`p-2 border rounded-md mt-1 ${question.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                {question.childAnswer || '(No answer provided)'}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs text-gray-500">Correct Answer:</div>
                              <div className="p-2 bg-green-50 border border-green-200 rounded-md mt-1">
                                {question.correctAnswer}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="overview" className="mt-0">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-500" />
              Task Overview
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Assignment Details</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Assigned: </span>
                    <span className="font-medium">March 15, 2023</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Due date: </span>
                    <span className="font-medium">March 22, 2023</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckSquare className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Status: </span>
                    <span className="font-medium text-amber-600">In Progress</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    <div className="flex items-center justify-between">
                      <span>Completed question 3/5</span>
                      <span className="text-xs text-gray-500">Today, 2:30 PM</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    <div className="flex items-center justify-between">
                      <span>Started assignment</span>
                      <span className="text-xs text-gray-500">Yesterday, 4:15 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-0">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              Teacher Feedback
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 italic">
                "Alex is making good progress in this subject. He understands most concepts but needs more practice on specific topics. I've provided additional resources for the areas where he's struggling."
              </p>
              <div className="text-right mt-2 text-sm text-gray-500">
                - Mrs. Johnson, Science Teacher
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-800 mb-2">Areas for Improvement</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Understanding the carbon cycle</li>
                <li>Plant cell structure</li>
                <li>Scientific terminology</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-800 mb-2">Strengths</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Excellent grasp of the scientific method</li>
                <li>Good at conducting experiments</li>
                <li>Strong analytical skills</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetailsView; 