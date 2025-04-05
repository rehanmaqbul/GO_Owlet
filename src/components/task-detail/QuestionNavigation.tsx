
import { Button } from '@/components/ui/button';

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  handlePreviousQuestion: () => void;
  handleNextQuestion: () => void;
  handleSubmitTask: () => void;
  isSubmitting: boolean;
  isCompleted: boolean;
}

export const QuestionNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  handlePreviousQuestion,
  handleNextQuestion,
  handleSubmitTask,
  isSubmitting,
  isCompleted
}: QuestionNavigationProps) => {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={handlePreviousQuestion}
        disabled={currentQuestionIndex === 0}
      >
        Previous
      </Button>
      
      <div className="flex gap-2">
        {currentQuestionIndex === totalQuestions - 1 && !isCompleted ? (
          <Button
            onClick={handleSubmitTask}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Task"}
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
