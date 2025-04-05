import { useState, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  ArrowUpDownIcon, 
  DownloadIcon, 
  SearchIcon,
  UsersIcon,
  SlidersHorizontal,
  BarChart
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StudentPerformance {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  submissionTime: string;
  grade: string; // A, B, C, D, F
  totalSubmissions?: number;
  completedSubmissions?: number;
}

interface StudentPerformanceTableProps {
  subjectName: string;
  students: StudentPerformance[];
  onDownloadPdf?: () => void;
  onViewStudentDetails?: (studentId: string) => void;
}

interface StudentWithSubmissions {
  id: number | string;
  name: string;
  grade: string;
  score: number;
  totalSubmissions: {
    day: number;
    week: number;
    month: number;
  };
  completedSubmissions: {
    day: number;
    week: number;
    month: number;
  };
  onViewDetails?: () => void;
}

interface GradeReportProps {
  students: StudentWithSubmissions[];
  selectedTimeframe: string;
}

type SortField = 'name' | 'score' | 'correctAnswers' | 'totalSubmissions';
type SortDirection = 'asc' | 'desc';

export const GradeReport = ({ students, selectedTimeframe }: GradeReportProps) => {
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const getTimeframePeriod = (timeframe: string): 'day' | 'week' | 'month' => {
    if (timeframe.includes('Today')) return 'day';
    if (timeframe.includes('Week')) return 'week';
    return 'month';
  };
  
  const period = getTimeframePeriod(selectedTimeframe);
  
  const sortedAndFilteredStudents = useMemo(() => {
    // Filter students by search term
    let filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort students
    return filtered.sort((a, b) => {
      let valueA, valueB;
      
      if (sortField === 'name') {
        valueA = a.name;
        valueB = b.name;
      } else if (sortField === 'grade') {
        valueA = a.grade;
        valueB = b.grade;
      } else if (sortField === 'score') {
        valueA = a.score;
        valueB = b.score;
      } else if (sortField === 'totalSubmissions') {
        valueA = a.totalSubmissions[period];
        valueB = b.totalSubmissions[period];
      } else if (sortField === 'completionRate') {
        const rateA = a.completedSubmissions[period] / (a.totalSubmissions[period] || 1) * 100;
        const rateB = b.completedSubmissions[period] / (b.totalSubmissions[period] || 1) * 100;
        valueA = rateA;
        valueB = rateB;
      } else {
        valueA = a.name;
        valueB = b.name;
      }
      
      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      // Handle number comparison
      return sortDirection === 'asc' 
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    });
  }, [students, searchTerm, sortField, sortDirection, period]);
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Calculate class statistics
  const classStats = useMemo(() => {
    if (students.length === 0) return { avgScore: 0, avgCompletion: 0 };
    
    const totalScore = students.reduce((sum, student) => sum + student.score, 0);
    const avgScore = Math.round(totalScore / students.length);
    
    const totalCompletionRate = students.reduce((sum, student) => {
      const rate = student.completedSubmissions[period] / 
        (student.totalSubmissions[period] || 1) * 100;
      return sum + rate;
    }, 0);
    const avgCompletion = Math.round(totalCompletionRate / students.length);
    
    return { avgScore, avgCompletion };
  }, [students, period]);
  
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-indigo-500" />
              Grade Report
            </CardTitle>
            <CardDescription>
              Student performance and task completion metrics
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Class Average: {classStats.avgScore}%
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Completion Rate: {classStats.avgCompletion}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="relative w-72">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Student Name {getSortIcon('name')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-center"
                  onClick={() => handleSort('grade')}
                >
                  Grade {getSortIcon('grade')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-center"
                  onClick={() => handleSort('score')}
                >
                  Score {getSortIcon('score')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-center"
                  onClick={() => handleSort('totalSubmissions')}
                >
                  Total Submissions {getSortIcon('totalSubmissions')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-center"
                  onClick={() => handleSort('completionRate')}
                >
                  Completion Rate {getSortIcon('completionRate')}
                </TableHead>
                <TableHead className="text-center w-24">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {sortedAndFilteredStudents.map((student) => {
                const completionRate = Math.round(
                  (student.completedSubmissions[period] / 
                    (student.totalSubmissions[period] || 1)) * 100
                );
                
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={
                        student.grade.startsWith('A') ? "bg-green-50 text-green-700 border-green-200" :
                        student.grade.startsWith('B') ? "bg-blue-50 text-blue-700 border-blue-200" :
                        student.grade.startsWith('C') ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }>
                        {student.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {student.score}%
                    </TableCell>
                    <TableCell className="text-center">
                      {student.totalSubmissions[period]}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={
                          completionRate > 85 ? "text-green-600" : 
                          completionRate > 70 ? "text-blue-600" : 
                          completionRate > 50 ? "text-yellow-600" : 
                          "text-red-600"
                        }>
                          {completionRate}%
                        </span>
                        <span className="text-xs text-gray-500">
                          ({student.completedSubmissions[period]}/{student.totalSubmissions[period]})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={student.onViewDetails}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {sortedAndFilteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No students found with the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t text-sm text-gray-500 flex justify-between items-center">
          <span>Showing {sortedAndFilteredStudents.length} of {students.length} students</span>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4 text-indigo-500" />
            <span className="text-indigo-700">
              Time Period: <span className="font-medium">{selectedTimeframe}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StudentPerformanceTable = ({ 
  subjectName, 
  students, 
  onDownloadPdf,
  onViewStudentDetails 
}: StudentPerformanceTableProps) => {
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const sortedAndFilteredStudents = useMemo(() => {
    // Filter students by search term
    let filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort students
    return filtered.sort((a, b) => {
      let valueA, valueB;
      
      if (sortField === 'name') {
        valueA = a.name;
        valueB = b.name;
      } else if (sortField === 'score') {
        valueA = a.score;
        valueB = b.score;
      } else if (sortField === 'totalQuestions') {
        valueA = a.totalQuestions;
        valueB = b.totalQuestions;
      } else if (sortField === 'correctAnswers') {
        valueA = a.correctAnswers;
        valueB = b.correctAnswers;
      } else if (sortField === 'submissionTime') {
        valueA = new Date(a.submissionTime).getTime();
        valueB = new Date(b.submissionTime).getTime();
      } else {
        valueA = a.name;
        valueB = b.name;
      }
      
      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      // Handle number comparison
      return sortDirection === 'asc' 
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    });
  }, [students, searchTerm, sortField, sortDirection]);
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-indigo-500" />
              {subjectName} - Student Performance
            </CardTitle>
            <CardDescription>
              Individual student performance and submission details
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onDownloadPdf && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDownloadPdf}
                className="flex items-center gap-1"
              >
                Download PDF
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="relative w-72">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Student Name {getSortIcon('name')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-center"
                  onClick={() => handleSort('score')}
                >
                  Score {getSortIcon('score')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-center"
                  onClick={() => handleSort('correctAnswers')}
                >
                  Correct Answers {getSortIcon('correctAnswers')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-center"
                  onClick={() => handleSort('totalQuestions')}
                >
                  Total Questions {getSortIcon('totalQuestions')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-center"
                  onClick={() => handleSort('submissionTime')}
                >
                  Submission Time {getSortIcon('submissionTime')}
                </TableHead>
                <TableHead className="text-center">
                  Grade
                </TableHead>
                <TableHead className="text-center w-24">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {sortedAndFilteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-center">{student.score}%</TableCell>
                  <TableCell className="text-center">{student.correctAnswers}</TableCell>
                  <TableCell className="text-center">{student.totalQuestions}</TableCell>
                  <TableCell className="text-center">{formatTime(student.submissionTime)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={
                      student.grade === 'A' ? "bg-green-50 text-green-700 border-green-200" :
                      student.grade === 'B' ? "bg-blue-50 text-blue-700 border-blue-200" :
                      student.grade === 'C' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }>
                      {student.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewStudentDetails ? onViewStudentDetails(student.id) : alert(`Viewing details for ${student.name} (ID: ${student.id})`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {sortedAndFilteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No students found with the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t text-sm text-gray-500">
          Showing {sortedAndFilteredStudents.length} of {students.length} students
        </div>
      </CardContent>
    </Card>
  );
}; 