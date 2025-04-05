
import { cn } from '@/lib/utils';

interface QuestionStatusBadgeProps {
  isCorrect: boolean | null;
}

export const QuestionStatusBadge = ({ isCorrect }: QuestionStatusBadgeProps) => {
  if (isCorrect === null) return null;
  
  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-sm font-medium",
      isCorrect
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    )}>
      {isCorrect ? "Correct" : "Incorrect"}
    </div>
  );
};
