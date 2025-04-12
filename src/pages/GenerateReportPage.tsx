import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, FileText, Users, User, BarChart2, PieChart, LineChart, Table2, Filter, ChevronDown, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Mock data for grades and students
const grades = [
  { id: 'grade-1', name: 'Grade 1', totalStudents: 25, completionRate: 85, avgScore: 78, attendance: 92 },
  { id: 'grade-2', name: 'Grade 2', totalStudents: 30, completionRate: 78, avgScore: 82, attendance: 88 },
  { id: 'grade-3', name: 'Grade 3', totalStudents: 28, completionRate: 92, avgScore: 85, attendance: 95 },
  { id: 'grade-4', name: 'Grade 4', totalStudents: 32, completionRate: 88, avgScore: 80, attendance: 90 },
];

const students = [
  { id: 'student-1', name: 'John Doe', grade: 'Grade 1', completionRate: 90, totalTasks: 20, completedTasks: 18, avgScore: 85, attendance: 95 },
  { id: 'student-2', name: 'Jane Smith', grade: 'Grade 1', completionRate: 85, totalTasks: 20, completedTasks: 17, avgScore: 88, attendance: 92 },
  { id: 'student-3', name: 'Mike Johnson', grade: 'Grade 2', completionRate: 95, totalTasks: 20, completedTasks: 19, avgScore: 92, attendance: 98 },
  { id: 'student-4', name: 'Sarah Williams', grade: 'Grade 2', completionRate: 80, totalTasks: 20, completedTasks: 16, avgScore: 78, attendance: 85 },
];

const reportTypes = [
  { value: 'completion', label: 'Task Completion Report', icon: FileText },
  { value: 'performance', label: 'Performance Report', icon: BarChart2 },
  { value: 'attendance', label: 'Attendance Report', icon: PieChart },
  { value: 'progress', label: 'Progress Report', icon: LineChart },
  { value: 'comprehensive', label: 'Comprehensive Report', icon: Table2 },
];

const reportFormats = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
];

const visualElements = [
  { id: 'bar_chart', label: 'Bar Charts', icon: BarChart2 },
  { id: 'pie_chart', label: 'Pie Charts', icon: PieChart },
  { id: 'line_chart', label: 'Line Graphs', icon: LineChart },
  { id: 'progress_bars', label: 'Progress Bars', icon: Progress },
  { id: 'tables', label: 'Data Tables', icon: Table2 },
];

const GenerateReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reportType, setReportType] = useState('completion');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [selectedScope, setSelectedScope] = useState<'grade' | 'student'>('grade');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisuals, setSelectedVisuals] = useState<string[]>(['bar_chart', 'tables']);
  const [showPreview, setShowPreview] = useState(false);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedGrade || student.grade === selectedGrade)
  );

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setReportGenerated(true);
      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = () => {
    toast({
      title: "Download Started",
      description: "Your report download has started.",
    });
  };

  const toggleVisual = (visualId: string) => {
    setSelectedVisuals(prev => 
      prev.includes(visualId)
        ? prev.filter(id => id !== visualId)
        : [...prev, visualId]
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Scope Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Scope</label>
              <div className="flex space-x-4">
                <Button
                  variant={selectedScope === 'grade' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setSelectedScope('grade')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Grade-wise Report
                </Button>
                <Button
                  variant={selectedScope === 'student' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setSelectedScope('student')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Student-wise Report
                </Button>
              </div>
            </div>

            {/* Grade/Student Selection */}
            {selectedScope === 'grade' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Grade</label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] bg-white">
                    <ScrollArea className="h-[180px]">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 font-medium">Grades</SelectLabel>
                        {grades.map((grade) => (
                          <SelectItem 
                            key={grade.id} 
                            value={grade.name}
                            className="py-1.5 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                          >
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </ScrollArea>
                  </SelectContent>
                </Select>
                {selectedGrade && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">{selectedGrade} Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Students:</span>
                          <span className="font-medium">{grades.find(g => g.name === selectedGrade)?.totalStudents}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Completion Rate:</span>
                            <span className="font-medium">{grades.find(g => g.name === selectedGrade)?.completionRate}%</span>
                          </div>
                          <Progress value={grades.find(g => g.name === selectedGrade)?.completionRate} className="h-2" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average Score:</span>
                          <span className="font-medium">{grades.find(g => g.name === selectedGrade)?.avgScore}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Attendance:</span>
                            <span className="font-medium">{grades.find(g => g.name === selectedGrade)?.attendance}%</span>
                          </div>
                          <Progress value={grades.find(g => g.name === selectedGrade)?.attendance} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Student</label>
                  <Input
                    placeholder="Search by student name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Grade</label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Filter by grade" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 font-medium">Grades</SelectLabel>
                        {grades.map((grade) => (
                          <SelectItem 
                            key={grade.id} 
                            value={grade.name}
                            className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                          >
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Student</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 font-medium">Students</SelectLabel>
                        {filteredStudents.map((student) => (
                          <SelectItem 
                            key={student.id} 
                            value={student.id}
                            className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                          >
                            {student.name} ({student.grade})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {selectedStudent && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Student Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Name:</span>
                          <span className="font-medium">{students.find(s => s.id === selectedStudent)?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Grade:</span>
                          <span className="font-medium">{students.find(s => s.id === selectedStudent)?.grade}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Completion Rate:</span>
                            <span className="font-medium">{students.find(s => s.id === selectedStudent)?.completionRate}%</span>
                          </div>
                          <Progress value={students.find(s => s.id === selectedStudent)?.completionRate} className="h-2" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average Score:</span>
                          <span className="font-medium">{students.find(s => s.id === selectedStudent)?.avgScore}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Attendance:</span>
                          <span className="font-medium">{students.find(s => s.id === selectedStudent)?.attendance}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Tasks Completed:</span>
                            <span className="font-medium">{students.find(s => s.id === selectedStudent)?.completedTasks}/{students.find(s => s.id === selectedStudent)?.totalTasks}</span>
                          </div>
                          <Progress value={(students.find(s => s.id === selectedStudent)?.completedTasks || 0) / (students.find(s => s.id === selectedStudent)?.totalTasks || 1) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Report Type and Format */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel className="text-gray-500 font-medium">Report Types</SelectLabel>
                      {reportTypes.map((type) => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                        >
                          <div className="flex items-center">
                            <type.icon className="mr-2 h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Report Format</label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel className="text-gray-500 font-medium">Formats</SelectLabel>
                      {reportFormats.map((format) => (
                        <SelectItem 
                          key={format.value} 
                          value={format.value}
                          className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                        >
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Visual Elements Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Visual Elements</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {visualElements.map((visual) => (
                  <div
                    key={visual.id}
                    className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer ${
                      selectedVisuals.includes(visual.id)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200'
                    }`}
                    onClick={() => toggleVisual(visual.id)}
                  >
                    <Checkbox
                      id={visual.id}
                      checked={selectedVisuals.includes(visual.id)}
                      onCheckedChange={() => toggleVisual(visual.id)}
                    />
                    <Label htmlFor={visual.id} className="flex items-center cursor-pointer">
                      <visual.icon className="mr-2 h-4 w-4" />
                      {visual.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full h-10 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full h-10 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Preview Section */}
            {showPreview && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-4">Report Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium mb-2">Completion Overview</h4>
                      <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-500">Bar Chart Preview</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium mb-2">Performance Trends</h4>
                      <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-500">Line Graph Preview</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium mb-2">Task Distribution</h4>
                      <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-500">Pie Chart Preview</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium mb-2">Detailed Statistics</h4>
                      <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-500">Data Table Preview</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              {!reportGenerated ? (
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating || (selectedScope === 'grade' && !selectedGrade) || (selectedScope === 'student' && !selectedStudent)}
                >
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
              ) : (
                <Button 
                  onClick={handleDownloadReport}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default GenerateReportPage; 