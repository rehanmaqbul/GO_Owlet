
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionFormValues } from '@/data/curriculum-data';

interface MultipleChoiceQuestionProps {
  question: QuestionFormValues;
  questionIndex: number;
  qIndex: number;
  onQuestionChange: (index: number, field: keyof QuestionFormValues, value: string) => void;
  onOptionChange: (questionIndex: number, optionIndex: number, value: string) => void;
}

export const MultipleChoiceQuestion = ({
  question,
  questionIndex,
  qIndex,
  onQuestionChange,
  onOptionChange
}: MultipleChoiceQuestionProps) => {
  return (
    <div className="space-y-4">
      {question.options.map((option, i) => (
        <div key={i} className="space-y-2">
          <Label htmlFor={`option-${question.type}-${qIndex}-${i}`} className="text-[#403E43]">
            Insert Option {i + 1}
          </Label>
          <Input 
            id={`option-${question.type}-${qIndex}-${i}`}
            value={option}
            onChange={(e) => onOptionChange(questionIndex, i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            className="bg-white/50 border-white/20 text-[#403E43]"
          />
        </div>
      ))}
      
      <div className="space-y-2">
        <Label htmlFor={`correct-${question.type}-${qIndex}`} className="text-[#403E43]">Correct Answer</Label>
        <Select 
          onValueChange={(value) => onQuestionChange(questionIndex, 'correctAnswer', value)}
          value={question.correctAnswer}
        >
          <SelectTrigger id={`correct-${question.type}-${qIndex}`} className="bg-white/50 border-white/20 text-[#403E43]">
            <SelectValue placeholder="Select correct option" />
          </SelectTrigger>
          <SelectContent className="bg-[#e8d5c4]/80 backdrop-blur-md border-white/20">
            {question.options.map((opt, i) => (
              opt ? (
                <SelectItem key={i} value={opt}>
                  Option {i + 1}: {opt.substring(0, 20)}
                </SelectItem>
              ) : null
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
