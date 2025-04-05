import { SubjectDetail } from '@/services/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InfoIcon, Users } from 'lucide-react';
import { QuestionDisplay } from './QuestionDisplay';

interface ResponseDistribution {
  label: string;
  count: number;
  percentage: number;
  isCorrect: boolean;
}

interface QuestionBreakdownProps {
  subject: SubjectDetail;
}

export const QuestionBreakdown = ({ subject }: QuestionBreakdownProps) => {
  // Generate some mock data for how many students chose each answer
  // In a real app, this would come from the backend
  const generateMockResponses = (questionIndex: number) => {
    const totalStudents = 25; // Mock total number of students
    const distributionMap = new Map<string, number>();
    
    // If the question has options, distribute responses among them
    if (subject.questions[questionIndex].options) {
      const options = subject.questions[questionIndex].options!;
      const correctAnswer = subject.questions[questionIndex].correctAnswer;
      
      // Assign more students to the correct answer (between 40-80% depending on overall subject performance)
      const correctAnswerPercentage = Math.min(0.8, Math.max(0.4, subject.percentage / 100));
      const correctCount = Math.floor(totalStudents * correctAnswerPercentage);
      
      // Assign the rest to other options
      let remainingStudents = totalStudents - correctCount;
      
      options.forEach((option) => {
        if (option === correctAnswer) {
          distributionMap.set(option, correctCount);
        } else {
          const count = remainingStudents > 0 ? 
            (option === options[options.length - 1]) ? 
              remainingStudents : // Last option gets all remaining students
              Math.min(Math.floor(Math.random() * remainingStudents) + 1, remainingStudents) 
            : 0;
          
          distributionMap.set(option, count);
          remainingStudents -= count;
        }
      });
    } else {
      // For fill-in-the-blank or other types, just assign correct and incorrect counts
      const correctAnswer = subject.questions[questionIndex].correctAnswer;
      const correctCount = Math.floor(totalStudents * (subject.percentage / 100));
      distributionMap.set(correctAnswer, correctCount);
      distributionMap.set('incorrect', totalStudents - correctCount);
    }
    
    // Convert Map to array of distribution objects
    const distribution: ResponseDistribution[] = Array.from(distributionMap.entries()).map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / totalStudents) * 100),
      isCorrect: label === subject.questions[questionIndex].correctAnswer
    }));
    
    return {
      totalStudents,
      distribution
    };
  };

  return (
    <Card>
      <CardHeader className="border-b py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-indigo-500" />
          Class Response Analysis
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <InfoIcon className="h-3 w-3 text-blue-500" />
          Shows how the entire class answered each question
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 chart-content">
        <style>
          {`
            .chart-content .recharts-pie-label-text {
              font-size: 10px;
            }
          `}
        </style>
        {subject.questions.map((question, index) => {
          const responses = generateMockResponses(index);
          
          return (
            <div key={question.id} className="border-b last:border-0 p-6">
              <QuestionDisplay 
                question={question} 
                index={index}
                responses={responses}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
