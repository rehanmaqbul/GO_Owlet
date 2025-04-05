
import { Task, Question } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TaskSummaryProps {
  task: Task;
  taskQuestions: Question[];
  answers: Record<string, string>;
}

export const TaskSummary = ({ task, taskQuestions, answers }: TaskSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Summary</CardTitle>
        <CardDescription>
          Completed on {new Date(task.updatedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-owl-blue-light flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-owl-blue-dark">
                {task.results?.score}/{task.results?.total}
              </div>
              <div className="text-sm text-owl-blue-dark mt-1">Score</div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-4">
          {taskQuestions.map((question, index) => {
            const isAnswerCorrect = answers[question.id] === question.correctAnswer;
            
            return (
              <div 
                key={question.id} 
                className={cn(
                  "p-3 rounded-lg",
                  isAnswerCorrect ? "bg-green-50" : "bg-red-50"
                )}
              >
                <div className="flex items-start gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    isAnswerCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">{question.text}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span>
                        Your answer: <span className={cn(
                          "font-medium",
                          isAnswerCorrect ? "text-green-600" : "text-red-600"
                        )}>
                          {answers[question.id]}
                        </span>
                      </span>
                      
                      {!isAnswerCorrect && (
                        <span>
                          Correct answer: <span className="font-medium text-green-600">
                            {question.correctAnswer}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
