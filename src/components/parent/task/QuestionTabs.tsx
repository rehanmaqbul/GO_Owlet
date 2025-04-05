
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import QuestionTab from "./QuestionTab";
import QuestionsList from "./QuestionsList";
import { Question } from "@/lib/types";

interface QuestionTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  filteredQuestions: Question[];
  selectedQuestions: string[];
  handleQuestionToggle: (questionId: string) => void;
}

interface TabConfig {
  value: string;
  label: string;
}

const QUESTION_TABS: TabConfig[] = [
  { value: 'mcqs', label: 'MCQs' },
  { value: 'yes_no', label: 'Yes/No' },
  { value: 'true_false', label: 'True/False' },
  { value: 'fill_blank', label: 'Fill Blank' },
  { value: 'reading', label: 'Reading' },
  { value: 'listening', label: 'Listening' },
  { value: 'learning', label: 'Learning' }
];

const QuestionTabs = ({
  activeTab,
  setActiveTab,
  filteredQuestions,
  selectedQuestions,
  handleQuestionToggle
}: QuestionTabsProps) => {
  return (
    <Tabs defaultValue="mcqs" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full">
        {QUESTION_TABS.map((tab) => (
          <QuestionTab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </TabsList>
      
      {QUESTION_TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4 mt-4">
          <QuestionsList 
            questions={filteredQuestions}
            selectedQuestions={selectedQuestions}
            handleQuestionToggle={handleQuestionToggle}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default QuestionTabs;
