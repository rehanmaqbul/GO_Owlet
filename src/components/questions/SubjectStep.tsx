
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Subject } from '@/lib/types';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';

interface SubjectStepProps {
  onSubjectSelect: (subject: Subject) => void;
}

export const SubjectStep = ({ onSubjectSelect }: SubjectStepProps) => {
  // Extended subject list with all required subjects
  const extendedSubjects = [
    { id: 'math' as Subject, name: 'Math' },
    { id: 'french' as Subject, name: 'French' },
    { id: 'science' as Subject, name: 'Science' },
    { id: 'english' as Subject, name: 'English' },
    { id: 'social_studies' as Subject, name: 'Social Studies' },
    { id: 'critical_thinking' as Subject, name: 'Critical Thinking' },
    { id: 'mindset' as Subject, name: 'Mindset' },
    { id: 'arts' as Subject, name: 'Arts' },
    { id: 'decision_making' as Subject, name: 'Decision Making Skills' },
    { id: 'general_skills' as Subject, name: 'General Skills' }
  ];

  return (
    <motion.div {...slideUp}>
      <Card className="shadow-md border border-white/30 glass-morphism">
        <CardHeader>
          <CardTitle className="text-[#403E43]">Select Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {extendedSubjects.map(subject => (
              <Button 
                key={subject.id}
                variant="subject"
                onClick={() => onSubjectSelect(subject.id)}
                className="bg-[#e8d5c4] hover:bg-[#dcc7b7] text-[#403E43] font-medium shadow-md"
              >
                {subject.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
