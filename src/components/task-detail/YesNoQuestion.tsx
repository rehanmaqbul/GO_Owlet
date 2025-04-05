
import { Question } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YesNoQuestionProps {
  question: Question;
  userAnswer: string;
  isCompleted: boolean;
  onChange: (questionId: string, answer: string) => void;
}

export const YesNoQuestion = ({ 
  question, 
  userAnswer, 
  isCompleted, 
  onChange 
}: YesNoQuestionProps) => {
  return (
    <div className="space-y-3">
      <RadioGroup
        value={userAnswer}
        onValueChange={(value) => onChange(question.id, value)}
        disabled={isCompleted}
      >
        {['Yes', 'No'].map((option, index) => (
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
  );
};
