import { SubjectDetail } from '@/services/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, DonutChart } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SubjectPerformanceProps {
  subject: SubjectDetail;
}

export const SubjectPerformance = ({ subject }: SubjectPerformanceProps) => {
  // Mock data for class-wide performance (in a real app, this would come from the API)
  const classData = {
    totalStudents: 25,
    averageScore: subject.percentage,
    highScore: Math.min(100, subject.percentage + Math.floor(Math.random() * 20) + 5),
    lowScore: Math.max(0, subject.percentage - Math.floor(Math.random() * 30) - 10),
    gradeDistribution: {
      A: Math.floor(Math.random() * 8) + 4, // 4-12 students
      B: Math.floor(Math.random() * 8) + 5, // 5-13 students
      C: Math.floor(Math.random() * 6) + 3, // 3-9 students
      D: Math.floor(Math.random() * 4) + 1, // 1-5 students
      F: Math.floor(Math.random() * 3)      // 0-3 students
    }
  };

  return (
    <Card className="w-full">
      <style>
        {`
          .recharts-pie-label-text {
            font-size: 9px !important;
            font-weight: 500 !important;
          }
        `}
      </style>
      
      <CardHeader className="border-b py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-indigo-500" />
          Subject Performance
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Badge variant="outline" className="px-2 py-0.5 text-xs">
            {subject.name}
          </Badge>
          <Badge variant="outline" className="px-2 py-0.5 text-xs">
            {subject.grade}
          </Badge>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex justify-between mb-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Total Students</div>
            <div className="font-semibold text-xs">{classData.totalStudents}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Average Score</div>
            <div className="font-semibold text-xs">{classData.averageScore}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Completion Rate</div>
            <div className="font-semibold text-xs">{subject.percentage}%</div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-xs font-medium">Performance Distribution</h4>
          <BarChart 
            data={[
              {
                name: "Class Average",
                "Total Questions": subject.totalQuestions,
                "Correct Answers": subject.correctAnswers,
                "Wrong Answers": subject.wrongAnswers
              }
            ]}
            index="name"
            categories={["Total Questions", "Correct Answers", "Wrong Answers"]}
            colors={["#94a3b8", "#22c55e", "#ef4444"]}
            valueFormatter={(value) => `${value}`}
          />
          <p className="text-xs text-center text-gray-500 mt-2">
            Based on {subject.totalQuestions} questions across {classData.totalStudents} students
          </p>
        </div>
        
        <div className="mt-4">
          <h4 className="text-xs font-medium">Class Grade Distribution</h4>
          <div className="grid grid-cols-3 gap-1 mt-3">
            {Object.entries(classData.gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex flex-col items-center">
                <Badge 
                  className={`w-full py-0.5 text-xs text-center ${
                    grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                    grade === 'B' ? 'bg-blue-100 text-blue-800' :
                    grade === 'C' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}
                >
                  {grade}
                </Badge>
                <span className="text-xs mt-1">{count} students</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round((count / classData.totalStudents) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Score Range</span>
            <span>Students</span>
          </div>
          {[
            { range: "90-100%", count: 8, percentage: 32 },
            { range: "80-89%", count: 7, percentage: 28 },
            { range: "70-79%", count: 5, percentage: 20 },
            { range: "60-69%", count: 3, percentage: 12 },
            { range: "Below 60%", count: 2, percentage: 8 }
          ].map((score, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>{score.range}</span>
                <span className="font-medium">{score.count} ({score.percentage}%)</span>
              </div>
              <Progress value={score.percentage} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
