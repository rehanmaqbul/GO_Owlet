
import React from 'react';
import { Card } from '@/components/ui/card';
import QuestionTabs from '@/components/parent/task/QuestionTabs';
import { Question } from '@/lib/types';

interface QuestionsPanelProps {
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredQuestions: Question[];
  selectedQuestions: string[];
  handleQuestionToggle: (questionId: string) => void;
}

const QuestionsPanel = ({
  isLoading,
  activeTab,
  setActiveTab,
  filteredQuestions,
  selectedQuestions,
  handleQuestionToggle
}: QuestionsPanelProps) => {
  return (
    <div className="lg:col-span-2">
      <Card className="border-gray-200 shadow-md">
        <div className="p-4 border-b border-gray-200">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading questions...</p>
            </div>
          ) : (
            <QuestionTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filteredQuestions={filteredQuestions}
              selectedQuestions={selectedQuestions}
              handleQuestionToggle={handleQuestionToggle}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuestionsPanel;
