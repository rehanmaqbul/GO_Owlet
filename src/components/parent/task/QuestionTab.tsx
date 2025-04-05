
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";

interface QuestionTabProps {
  value: string;
  label: string;
}

const QuestionTab = ({ value, label }: QuestionTabProps) => {
  return (
    <TabsTrigger value={value}>{label}</TabsTrigger>
  );
};

export default QuestionTab;
