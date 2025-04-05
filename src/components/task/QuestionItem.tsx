
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Question } from '@/lib/types';

interface QuestionItemProps {
  question: Question;
  isSelected: boolean;
  onToggle: () => void;
}

const QuestionItem = ({ question, isSelected, onToggle }: QuestionItemProps) => {
  return (
    <motion.div {...slideUp}>
      <Card className={`shadow-md transition-colors ${
        isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onToggle}
                className="border-gray-400"
              />
            </div>
            <div className="flex-1" onClick={onToggle}>
              <div className="flex flex-col sm:flex-row justify-between mb-2">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {question.subject}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {question.curriculum}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {question.type === 'multiple_choice' && 'Multiple Choice'}
                  {question.type === 'fill_blank' && 'Fill in the Blank'}
                  {question.type === 'true_false' && 'True/False'}
                  {question.type === 'yes_no' && 'Yes/No'}
                </span>
              </div>
              
              <p className="font-medium text-gray-800">{question.text}</p>
              
              {question.options && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {question.options.map((option, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {String.fromCharCode(65 + index)}. {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuestionItem;
