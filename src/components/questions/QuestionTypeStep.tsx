
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { QuestionType } from '@/lib/types';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { questionTypes } from '@/data/curriculum-data';
import { useToast } from '@/hooks/use-toast';

interface QuestionTypeStepProps {
  selectedQuestionTypes: QuestionType[];
  onQuestionTypeToggle: (type: QuestionType) => void;
  onNext: () => void;
}

export const QuestionTypeStep = ({ 
  selectedQuestionTypes, 
  onQuestionTypeToggle, 
  onNext
}: QuestionTypeStepProps) => {
  const { toast } = useToast();
  
  const handleProceedToCreate = () => {
    if (selectedQuestionTypes.length === 0) {
      toast({
        title: "Please select at least one question type",
        variant: "destructive",
      });
      return;
    }
    
    onNext();
  };

  return (
    <motion.div {...slideUp}>
      <Card className="shadow-subtle backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle>Select Question Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {questionTypes.map(type => (
              <div key={type.id} className="flex items-center space-x-2 bg-[#e8d5c4]/60 backdrop-blur-md p-3 rounded-md">
                <Checkbox 
                  id={type.id} 
                  checked={selectedQuestionTypes.includes(type.id)}
                  onCheckedChange={() => onQuestionTypeToggle(type.id)}
                />
                <Label htmlFor={type.id} className="text-[#403E43]">{type.name}</Label>
              </div>
            ))}
          </div>
          
          <Button onClick={handleProceedToCreate} className="bg-[#e8d5c4] hover:bg-[#dcc7b7] text-[#403E43] border border-white/20 rounded-xl">
            Continue
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
