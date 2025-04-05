import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Book,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  User,
  GraduationCap,
  BarChart
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string | number;
    name: string;
    grade: string;
    score: number;
    performance?: {
      history: number[];
      improvement: number;
      strengths: string[];
      areasForImprovement: string[];
    };
    completedSubmissions?: {
      day: number;
      week: number;
      month: number;
    };
    totalSubmissions?: {
      day: number;
      week: number;
      month: number;
    };
    subjectScores?: {
      name: string;
      score: number;
      color: string;
    }[];
    recentActivity?: {
      date: string;
      action: string;
      subject: string;
      score?: number;
    }[];
  } | null;
}

// Mock data for student details if not provided from props
const getDefaultPerformanceData = () => ({
  history: [65, 72, 78, 82, 79, 85, 92],
  improvement: 14,
  strengths: ["Fractions", "Reading Comprehension", "Spelling"],
  areasForImprovement: ["Grammar", "Division", "Historical Facts"]
});

const getDefaultSubjectScores = () => [
  { name: "Math", score: 88, color: "bg-blue-500" },
  { name: "Science", score: 92, color: "bg-green-500" },
  { name: "English", score: 76, color: "bg-yellow-500" },
  { name: "Social Studies", score: 84, color: "bg-purple-500" }
];

const getDefaultRecentActivity = () => [
  { date: "2023-09-28", action: "Completed Assignment", subject: "Math", score: 92 },
  { date: "2023-09-26", action: "Completed Quiz", subject: "Science", score: 88 },
  { date: "2023-09-24", action: "Started Assignment", subject: "English" },
  { date: "2023-09-22", action: "Completed Assignment", subject: "Social Studies", score: 76 },
  { date: "2023-09-20", action: "Completed Quiz", subject: "Math", score: 84 }
];

export function StudentDetailsModal({ isOpen, onClose, student }: StudentDetailsModalProps) {
  if (!student) return null;

  // Use mock data if the student doesn't have it
  const performance = student.performance || getDefaultPerformanceData();
  const subjectScores = student.subjectScores || getDefaultSubjectScores();
  const recentActivity = student.recentActivity || getDefaultRecentActivity();
  
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800 border-green-200";
    if (grade.startsWith('B')) return "bg-blue-100 text-blue-800 border-blue-200";
    if (grade.startsWith('C')) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const renderPerformanceHistory = () => {
    const max = Math.max(...performance.history);
    return (
      <div className="flex items-end h-20 gap-1 mt-2">
        {performance.history.map((value, index) => (
          <div 
            key={index}
            className="bg-indigo-500 rounded-t w-full"
            style={{ 
              height: `${(value / max) * 100}%`,
              opacity: 0.5 + (index / performance.history.length) * 0.5
            }}
            title={`Week ${index + 1}: ${value}%`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6 text-indigo-500" />
            {student.name}
          </DialogTitle>
          <DialogDescription>
            Detailed performance metrics and activity history
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-indigo-700">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{student.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={cn("mt-1", getGradeColor(student.grade))}
                  >
                    Grade: {student.grade}
                  </Badge>
                  <div className="mt-4 w-full">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Current Score:</span>
                      <span className="font-medium">{student.score}%</span>
                    </div>
                    <Progress value={student.score} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-1.5 mb-4">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  Performance Trend
                </h3>
                {renderPerformanceHistory()}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last 7 Weeks</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {performance.improvement > 0 ? '+' : ''}{performance.improvement}% Improvement
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-1.5 mb-4">
                  <GraduationCap className="h-4 w-4 text-indigo-500" />
                  Learning Focus
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      Strengths
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {performance.strengths.map((strength, i) => (
                        <Badge key={i} variant="outline" className="bg-green-50 text-green-700">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                      Areas for Improvement
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {performance.areasForImprovement.map((area, i) => (
                        <Badge key={i} variant="outline" className="bg-yellow-50 text-yellow-700">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart className="h-5 w-5 text-indigo-500" />
            Subject Performance
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {subjectScores.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <span className="text-sm">{subject.score}%</span>
                </div>
                <Progress 
                  value={subject.score} 
                  className="h-2.5" 
                  indicatorClassName={subject.color}
                />
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            Recent Activity
          </h3>

          <div className="space-y-4 mb-6">
            {recentActivity.map((activity, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <Book className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-gray-700">{activity.subject}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(activity.date)}
                    </div>
                    {activity.score && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          activity.score >= 90 ? "bg-green-50 text-green-700" :
                          activity.score >= 80 ? "bg-blue-50 text-blue-700" :
                          activity.score >= 70 ? "bg-yellow-50 text-yellow-700" :
                          "bg-red-50 text-red-700"
                        )}
                      >
                        Score: {activity.score}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Submissions (Today):</span>
              <span className="font-medium">
                {student.completedSubmissions?.day || 0}/{student.totalSubmissions?.day || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submissions (Week):</span>
              <span className="font-medium">
                {student.completedSubmissions?.week || 0}/{student.totalSubmissions?.week || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submissions (Month):</span>
              <span className="font-medium">
                {student.completedSubmissions?.month || 0}/{student.totalSubmissions?.month || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completion Rate:</span>
              <span className="font-medium">
                {Math.round((
                  (student.completedSubmissions?.week || 0) / 
                  Math.max(student.totalSubmissions?.week || 1, 1) * 100
                ))}%
              </span>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Student ID: {student.id}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button>
                Send Message
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 