
import { Check } from "lucide-react";
import { Question } from "@/lib/types";

interface QuestionsListProps {
  questions: Question[];
  selectedQuestions: string[];
  handleQuestionToggle: (questionId: string) => void;
}

// Helper function to format display strings
const formatDisplayString = (str: string): string => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const QuestionsList = ({ 
  questions, 
  selectedQuestions, 
  handleQuestionToggle 
}: QuestionsListProps) => {
  return (
    <>
      {questions.length > 0 ? (
        questions.map(question => (
          <div 
            key={question.id}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedQuestions.includes(question.id) 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleQuestionToggle(question.id)}
          >
            <div className="flex gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedQuestions.includes(question.id) 
                  ? 'bg-blue-500 text-white' 
                  : 'border border-gray-300'
              }`}>
                {selectedQuestions.includes(question.id) && <Check className="h-3 w-3" />}
              </div>
              <div>
                <p className="text-sm font-medium">{question.text}</p>
                <div className="flex mt-1 gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {formatDisplayString(question.type)}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {formatDisplayString(question.subject)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No questions match your filters.</p>
        </div>
      )}
    </>
  );
};

export default QuestionsList;
