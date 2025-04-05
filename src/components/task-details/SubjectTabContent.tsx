import { SubjectDetail } from '@/services/mockData';
import { SubjectPerformance } from './SubjectPerformance';
import { QuestionBreakdown } from './QuestionBreakdown';

interface SubjectTabContentProps {
  subject: SubjectDetail;
}

export const SubjectTabContent = ({ subject }: SubjectTabContentProps) => {
  return (
    <div className="space-y-6">
      <SubjectPerformance subject={subject} />
      <QuestionBreakdown subject={subject} />
    </div>
  );
};
