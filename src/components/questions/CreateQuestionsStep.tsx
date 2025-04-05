import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionType } from '@/lib/types';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { Plus, Save, Upload } from 'lucide-react';
import { QuestionFormValues, questionTypes } from '@/data/curriculum-data';
import { MultipleChoiceQuestion } from './question-types/MultipleChoiceQuestion';
import { FillBlankQuestion } from './question-types/FillBlankQuestion';
import { TrueFalseQuestion } from './question-types/TrueFalseQuestion';
import { YesNoQuestion } from './question-types/YesNoQuestion';
import { EmptyQuestionTypeMessage } from './EmptyQuestionTypeMessage';
import { FileUpload } from './FileUpload';
import { questionService } from '@/services/questionService';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CreateQuestionsStepProps {
  selectedQuestionTypes: QuestionType[];
  questions: QuestionFormValues[];
  onQuestionChange: (index: number, field: keyof QuestionFormValues, value: string) => void;
  onOptionChange: (questionIndex: number, optionIndex: number, value: string) => void;
  onAddQuestion: (type: QuestionType) => void;
  onSaveQuestions: () => void;
}

export const CreateQuestionsStep = ({
  selectedQuestionTypes,
  questions,
  onQuestionChange,
  onOptionChange,
  onAddQuestion,
  onSaveQuestions
}: CreateQuestionsStepProps) => {
  const { user } = useAuth();
  
  if (selectedQuestionTypes.length === 0) {
    return <EmptyQuestionTypeMessage />;
  }

  return (
    <motion.div {...slideUp}>
      <Card className="shadow-subtle border border-white/20">
        <CardHeader>
          <CardTitle>Create Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <QuestionTabs 
            selectedQuestionTypes={selectedQuestionTypes}
            questions={questions}
            onQuestionChange={onQuestionChange}
            onOptionChange={onOptionChange}
            onAddQuestion={onAddQuestion}
          />
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="default"
              className="flex items-center bg-[#e8d5c4] hover:bg-[#dcc7b7] text-[#403E43] border border-white/20"
              onClick={onSaveQuestions}
            >
              <Save className="mr-2 h-4 w-4" />
              Save the Subject with Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface QuestionTabsProps {
  selectedQuestionTypes: QuestionType[];
  questions: QuestionFormValues[];
  onQuestionChange: (index: number, field: keyof QuestionFormValues, value: string) => void;
  onOptionChange: (questionIndex: number, optionIndex: number, value: string) => void;
  onAddQuestion: (type: QuestionType) => void;
}

const QuestionTabs = ({ 
  selectedQuestionTypes,
  questions,
  onQuestionChange,
  onOptionChange, 
  onAddQuestion
}: QuestionTabsProps) => {
  return (
    <Tabs defaultValue={selectedQuestionTypes[0]}>
      <TabsList 
        className="grid bg-[#e8d5c4]/40" 
        style={{ gridTemplateColumns: `repeat(${selectedQuestionTypes.length}, minmax(0, 1fr))` }}
      >
        {selectedQuestionTypes.map(type => (
          <TabsTrigger key={type} value={type} className="data-[state=active]:bg-[#e8d5c4] data-[state=active]:text-[#403E43]">
            {questionTypes.find(t => t.id === type)?.name || type}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {selectedQuestionTypes.map(type => (
        <TabsContent key={type} value={type} className="space-y-6">
          <QuestionList 
            type={type}
            questions={questions}
            onQuestionChange={onQuestionChange}
            onOptionChange={onOptionChange}
          />
          
          <Button 
            variant="outline" 
            className="flex items-center border-[#e8d5c4] text-[#403E43] hover:bg-[#e8d5c4]/30"
            onClick={() => onAddQuestion(type)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another {questionTypes.find(t => t.id === type)?.name || type} Question
          </Button>
        </TabsContent>
      ))}
    </Tabs>
  );
};

interface QuestionListProps {
  type: QuestionType;
  questions: QuestionFormValues[];
  onQuestionChange: (index: number, field: keyof QuestionFormValues, value: string) => void;
  onOptionChange: (questionIndex: number, optionIndex: number, value: string) => void;
}

const QuestionList = ({ type, questions, onQuestionChange, onOptionChange }: QuestionListProps) => {
  const filteredQuestions = questions.filter(q => q.type === type);
  
  return (
    <>
      {filteredQuestions.map((question, qIndex) => {
        const questionIndex = questions.findIndex(
          (q, i) => q.type === type && i === questions.filter(
            filterQ => filterQ.type === type
          ).indexOf(question)
        );
        
        return (
          <QuestionItem
            key={qIndex}
            question={question}
            questionIndex={questionIndex}
            qIndex={qIndex}
            onQuestionChange={onQuestionChange}
            onOptionChange={onOptionChange}
          />
        );
      })}
    </>
  );
};

interface QuestionItemProps {
  question: QuestionFormValues;
  questionIndex: number;
  qIndex: number;
  onQuestionChange: (index: number, field: keyof QuestionFormValues, value: string) => void;
  onOptionChange: (questionIndex: number, optionIndex: number, value: string) => void;
}

const QuestionItem = ({ 
  question, 
  questionIndex, 
  qIndex, 
  onQuestionChange, 
  onOptionChange 
}: QuestionItemProps) => {
  const { user } = useAuth();
  
  const handleFileUpload = async (file: File) => {
    try {
      const tempId = question.id || `temp-${Date.now()}`;
      
      await questionService.uploadAttachment(tempId, file);
      
      if (file.type.startsWith('image/')) {
        onQuestionChange(questionIndex, 'imageUrl', 'uploaded');
      } else if (file.type.startsWith('audio/')) {
        onQuestionChange(questionIndex, 'audioUrl', 'uploaded');
      } else if (file.type.startsWith('video/')) {
        onQuestionChange(questionIndex, 'videoUrl', 'uploaded');
      }
      
      toast({
        title: "File uploaded successfully",
        description: "The file has been attached to this question.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your file. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 border border-white/20 rounded-md space-y-4 bg-[#e8d5c4]/40 backdrop-blur-sm">
      <QuestionTextInput 
        question={question}
        questionIndex={questionIndex}
        qIndex={qIndex}
        onQuestionChange={onQuestionChange}
      />
      
      {question.type === 'multiple_choice' && (
        <MultipleChoiceQuestion
          question={question}
          questionIndex={questionIndex}
          qIndex={qIndex}
          onQuestionChange={onQuestionChange}
          onOptionChange={onOptionChange}
        />
      )}
      
      {question.type === 'fill_blank' && (
        <FillBlankQuestion
          question={question}
          questionIndex={questionIndex}
          qIndex={qIndex}
          onQuestionChange={onQuestionChange}
        />
      )}
      
      {question.type === 'true_false' && (
        <TrueFalseQuestion
          question={question}
          questionIndex={questionIndex}
          qIndex={qIndex}
          onQuestionChange={onQuestionChange}
        />
      )}
      
      {question.type === 'yes_no' && (
        <YesNoQuestion
          question={question}
          questionIndex={questionIndex}
          qIndex={qIndex}
          onQuestionChange={onQuestionChange}
        />
      )}
      
      <div className="mt-4 space-y-2">
        <Label className="text-[#403E43]">Attach Files (Images, Audio, Video)</Label>
        <FileUpload 
          onUpload={handleFileUpload}
          accept="image/*,audio/*,video/*"
          maxSize={10}
          label="Upload attachment for this question"
        />
      </div>
    </div>
  );
};

interface QuestionTextInputProps {
  question: QuestionFormValues;
  questionIndex: number;
  qIndex: number;
  onQuestionChange: (index: number, field: keyof QuestionFormValues, value: string) => void;
}

const QuestionTextInput = ({ 
  question, 
  questionIndex, 
  qIndex, 
  onQuestionChange 
}: QuestionTextInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`question-${question.type}-${qIndex}`} className="text-[#403E43]">Insert Question</Label>
      <Input 
        id={`question-${question.type}-${qIndex}`}
        value={question.text}
        onChange={(e) => onQuestionChange(questionIndex, 'text', e.target.value)}
        placeholder="Enter your question here"
        className="bg-white/50 border-white/20 text-[#403E43]"
      />
    </div>
  );
};
