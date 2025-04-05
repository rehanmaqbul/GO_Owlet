import { useMemo } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Question } from '@/components/parent/check-tasks/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChartPieIcon, InfoIcon } from "lucide-react";

interface QuestionOption {
  label: string;
  count: number;
  percentage: number;
  isCorrect: boolean;
}

interface QuestionAnalysisProps {
  questions: Question[];
  totalStudents: number;
}

export const QuestionAnalysisPieChart = ({ questions, totalStudents }: QuestionAnalysisProps) => {
  // Generate mock distribution data for each question
  const questionsWithDistribution = useMemo(() => {
    return questions.map(question => {
      const options = question.type === 'multiple_choice' || question.type === 'true_false'
        ? question.options || []
        : [question.correctAnswer, 'Other'];
      
      // For each option, generate a random count (ensuring correct answer has higher probability)
      const totalResponses = totalStudents;
      let remainingStudents = totalResponses;
      
      // Higher probability (40-70%) for the correct answer
      const correctAnswerProbability = 0.4 + (Math.random() * 0.3);
      const correctCount = Math.floor(totalResponses * correctAnswerProbability);
      
      const distribution: QuestionOption[] = [];
      
      options.forEach((option, index) => {
        const isCorrect = option === question.correctAnswer;
        let count = 0;
        
        if (isCorrect) {
          count = correctCount;
        } else {
          if (index === options.length - 1) {
            // Last incorrect option gets all remaining students
            count = remainingStudents;
          } else {
            // Distribute remaining students between incorrect options
            count = Math.floor(Math.random() * (remainingStudents / 2));
          }
        }
        
        remainingStudents -= count;
        
        distribution.push({
          label: option,
          count,
          percentage: Math.round((count / totalResponses) * 100),
          isCorrect
        });
      });
      
      return {
        ...question,
        distribution
      };
    });
  }, [questions, totalStudents]);
  
  // Get background and text colors for pie segments
  const getOptionColors = (option: QuestionOption, index: number) => {
    if (option.isCorrect) {
      return {
        bg: 'rgba(34, 197, 94, 0.8)',
        text: 'text-white'
      };
    }
    
    // Different colors for incorrect options
    const incorrectColors = [
      { bg: 'rgba(59, 130, 246, 0.8)', text: 'text-white' },
      { bg: 'rgba(249, 115, 22, 0.8)', text: 'text-white' },
      { bg: 'rgba(234, 179, 8, 0.8)', text: 'text-white' },
      { bg: 'rgba(239, 68, 68, 0.8)', text: 'text-white' },
    ];
    
    return incorrectColors[index % incorrectColors.length];
  };
  
  return (
    <Card className="mt-8">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <ChartPieIcon className="h-5 w-5 text-indigo-500" />
          Question Response Analysis
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <InfoIcon className="h-3.5 w-3.5 text-blue-500" />
          Shows how students answered each question
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionsWithDistribution.map((question, qIndex) => (
            <div key={question.id} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                    Question {qIndex + 1}
                  </Badge>
                  <Badge variant="outline" className={cn(
                    "bg-opacity-20",
                    question.type === 'multiple_choice' ? "bg-blue-100 text-blue-700 border-blue-200" :
                    question.type === 'true_false' ? "bg-purple-100 text-purple-700 border-purple-200" :
                    question.type === 'fill_blank' ? "bg-green-100 text-green-700 border-green-200" :
                    "bg-gray-100 text-gray-700 border-gray-200"
                  )}>
                    {question.type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700 line-clamp-2">{question.text}</p>
              </div>
              
              <div className="p-4">
                <div className="flex justify-center mb-4">
                  {/* Pie chart visualization */}
                  <div className="relative w-32 h-32">
                    {question.distribution.length > 0 && (
                      <svg width="100%" height="100%" viewBox="0 0 42 42" className="circular-chart">
                        {/* Calculate segments of the pie chart */}
                        {(() => {
                          let currentAngle = 0;
                          const radius = 21;
                          const center = 21;
                          
                          return question.distribution.map((option, index) => {
                            // Skip if percentage is 0
                            if (option.percentage === 0) return null;
                            
                            const angle = (option.percentage / 100) * 360;
                            const largeArcFlag = angle > 180 ? 1 : 0;
                            
                            // Calculate start and end coordinates
                            const startX = center + radius * Math.cos((currentAngle - 90) * Math.PI / 180);
                            const startY = center + radius * Math.sin((currentAngle - 90) * Math.PI / 180);
                            const endX = center + radius * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
                            const endY = center + radius * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
                            
                            // Create path
                            const path = `M ${center},${center} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
                            
                            // Calculate label position (in the middle of the segment)
                            const labelAngle = currentAngle + (angle / 2);
                            const labelX = center + (radius * 0.65) * Math.cos((labelAngle - 90) * Math.PI / 180);
                            const labelY = center + (radius * 0.65) * Math.sin((labelAngle - 90) * Math.PI / 180);
                            
                            // Get color for this segment
                            const { bg, text } = getOptionColors(option, index);
                            
                            // Update current angle for next segment
                            const result = (
                              <g key={index}>
                                <path 
                                  d={path} 
                                  fill={bg}
                                />
                                {option.percentage >= 8 && (
                                  <text 
                                    x={labelX} 
                                    y={labelY} 
                                    textAnchor="middle" 
                                    dominantBaseline="middle"
                                    className="text-[0.5rem] font-medium text-white"
                                  >
                                    {option.percentage > 10 ? `${option.percentage}%` : ''}
                                  </text>
                                )}
                              </g>
                            );
                            
                            currentAngle += angle;
                            return result;
                          });
                        })()}
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="space-y-2">
                  {question.distribution.map((option, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-sm mr-2" 
                          style={{ backgroundColor: getOptionColors(option, index).bg }}
                        />
                        <span className={cn(
                          "text-sm",
                          option.isCorrect ? "font-medium text-green-700" : "text-gray-600"
                        )}>
                          {option.label} {option.isCorrect && '(Correct)'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {option.count} ({option.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
                  Total responses: {totalStudents} students
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 