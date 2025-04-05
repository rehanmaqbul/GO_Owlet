
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QuestionFormValues } from '@/data/curriculum-data';

interface FillBlankQuestionProps {
  question: QuestionFormValues;
  questionIndex: number;
  qIndex: number;
  onQuestionChange: (index: number, field: keyof QuestionFormValues, value: string) => void;
}

export const FillBlankQuestion = ({
  question,
  questionIndex,
  qIndex,
  onQuestionChange
}: FillBlankQuestionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`answer-${question.type}-${qIndex}`} className="text-[#403E43]">Correct Answer</Label>
      <Input 
        id={`answer-${question.type}-${qIndex}`}
        value={question.correctAnswer}
        onChange={(e) => onQuestionChange(questionIndex, 'correctAnswer', e.target.value)}
        placeholder="Enter the correct answer"
        className="bg-white/50 border-white/20 text-[#403E43]"
      />
    </div>
  );
};
