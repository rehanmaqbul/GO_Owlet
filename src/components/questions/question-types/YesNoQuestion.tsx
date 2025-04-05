
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionFormValues } from '@/data/curriculum-data';

interface YesNoQuestionProps {
  question: QuestionFormValues;
  questionIndex: number;
  qIndex: number;
  onQuestionChange: (index: number, field: keyof QuestionFormValues, value: string) => void;
}

export const YesNoQuestion = ({
  question,
  questionIndex,
  qIndex,
  onQuestionChange
}: YesNoQuestionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`correct-${question.type}-${qIndex}`} className="text-[#403E43]">Correct Answer</Label>
      <Select 
        onValueChange={(value) => onQuestionChange(questionIndex, 'correctAnswer', value)}
        value={question.correctAnswer}
      >
        <SelectTrigger id={`correct-${question.type}-${qIndex}`} className="bg-white/50 border-white/20 text-[#403E43]">
          <SelectValue placeholder="Select correct answer" />
        </SelectTrigger>
        <SelectContent className="bg-[#e8d5c4]/80 backdrop-blur-md border-white/20">
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
