
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const EmptyQuestionTypeMessage = () => {
  return (
    <Card className="shadow-subtle">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-[#403E43]">No Question Types Selected</h3>
        <p className="text-[#403E43]/70 max-w-md">
          Please go back and select at least one question type to continue creating questions.
        </p>
      </CardContent>
    </Card>
  );
};
