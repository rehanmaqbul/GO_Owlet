
import { Question } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FillBlankQuestionProps {
  question: Question;
  userAnswer: string;
  isCompleted: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  onChange: (questionId: string, answer: string) => void;
}

export const FillBlankQuestion = ({ 
  question, 
  userAnswer, 
  isCompleted, 
  isCorrect,
  isIncorrect,
  onChange 
}: FillBlankQuestionProps) => {
  return (
    <div className="space-y-3">
      <Input
        type="text"
        placeholder="Enter your answer"
        value={userAnswer || ''}
        onChange={(e) => onChange(question.id, e.target.value)}
        disabled={isCompleted}
        className={cn(
          isCorrect && "border-green-500",
          isIncorrect && "border-red-500"
        )}
      />
      
      {isCompleted && (
        <div className={cn(
          "p-3 rounded-md",
          isCorrect ? "bg-green-50" : "bg-red-50"
        )}>
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <Check className="mt-0.5 h-4 w-4 text-green-500" />
            ) : (
              <X className="mt-0.5 h-4 w-4 text-red-500" />
            )}
            <div>
              <p className={cn(
                "font-medium",
                isCorrect ? "text-green-600" : "text-red-600"
              )}>
                {isCorrect ? "Correct answer" : "Incorrect answer"}
              </p>
              {isIncorrect && (
                <p className="mt-1 text-sm">
                  The correct answer is: <span className="font-medium">{question.correctAnswer}</span>
                </p>
              )}
              {isIncorrect && question.type === 'fill_blank' && userAnswer && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Note: Fill in the blank answers are case-insensitive.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
