
import { Question } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface LearningFromStoryQuestionProps {
  question: Question;
  userAnswer: string;
  isCompleted: boolean;
  onChange: (questionId: string, answer: string) => void;
}

export const LearningFromStoryQuestion = ({ 
  question, 
  userAnswer, 
  isCompleted, 
  onChange 
}: LearningFromStoryQuestionProps) => {
  return (
    <div className="space-y-4">
      {question.storyText && (
        <Card className="p-4 bg-blue-50 border-blue-200 mb-4">
          <p className="whitespace-pre-line text-blue-900">{question.storyText}</p>
        </Card>
      )}
      
      <div className="space-y-3">
        <RadioGroup
          value={userAnswer}
          onValueChange={(value) => onChange(question.id, value)}
          disabled={isCompleted}
        >
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option}
                id={`option-${question.id}-${index}`}
                disabled={isCompleted}
                className={cn(
                  isCompleted && option === question.correctAnswer && "border-green-500",
                  isCompleted && userAnswer === option && option !== question.correctAnswer && "border-red-500"
                )}
              />
              <Label
                htmlFor={`option-${question.id}-${index}`}
                className={cn(
                  "flex-1 cursor-pointer",
                  isCompleted && option === question.correctAnswer && "text-green-600 font-medium",
                  isCompleted && userAnswer === option && option !== question.correctAnswer && "text-red-600 font-medium"
                )}
              >
                {option}
                {isCompleted && option === question.correctAnswer && (
                  <CheckCircle className="inline-block ml-2 h-4 w-4 text-green-500" />
                )}
                {isCompleted && userAnswer === option && option !== question.correctAnswer && (
                  <XCircle className="inline-block ml-2 h-4 w-4 text-red-500" />
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
