import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { Curriculum, Subject } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Plus, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  GraduationCap,
  Check
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { curriculums } from '@/data/curriculum-data';

// Mock skills subjects - similar to those in CreateTask.tsx
const skillsSubjects = [
  { id: 'critical_thinking', name: 'Critical Thinking', curriculum: false },
  { id: 'decision_making_skills', name: 'Decision Making Skills', curriculum: false },
  { id: 'general_skills', name: 'General Skills', curriculum: false },
  { id: 'learning_from_reading', name: 'Learning from Reading', curriculum: false },
  { id: 'open_book_test', name: 'Open Book Test', curriculum: false },
  { id: 'mindset', name: 'Mindset', curriculum: false }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const CreateClass = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [gradeName, setGradeName] = useState('');
  const [primaryCurriculum, setPrimaryCurriculum] = useState<string>('');
  const [wantAdditionalCurriculums, setWantAdditionalCurriculums] = useState<'yes' | 'no'>('no');
  const [additionalCurriculums, setAdditionalCurriculums] = useState<string[]>([]);
  const [wantSkills, setWantSkills] = useState<'yes' | 'no'>('no');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only teachers should access this page
    if (user?.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStudentFile(e.target.files[0]);
    }
  };

  const handleDownloadFormat = () => {
    // In a real app, this would download an actual Excel template
    toast({
      title: "Format downloaded",
      description: "Student data template has been downloaded to your device.",
    });
  };

  const handleCurriculumChange = (curriculumId: string) => {
    if (additionalCurriculums.includes(curriculumId)) {
      setAdditionalCurriculums(additionalCurriculums.filter(id => id !== curriculumId));
    } else {
      if (additionalCurriculums.length < 2) {
        setAdditionalCurriculums([...additionalCurriculums, curriculumId]);
      } else {
        toast({
          title: "Maximum reached",
          description: "You can select a maximum of 2 additional curriculums.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSkillChange = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!gradeName) {
      toast({
        title: "Missing information",
        description: "Please enter a grade name.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!primaryCurriculum) {
      toast({
        title: "Missing information",
        description: "Please select a primary curriculum.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!studentFile) {
      toast({
        title: "Missing file",
        description: "Please upload the student details file.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Mock class creation
    setTimeout(() => {
      const newClassId = `class-${Date.now()}`;
      
      // Store class data in localStorage as a simple mock persistence
      const classData = {
        id: newClassId,
        name: gradeName,
        primaryCurriculum,
        additionalCurriculums: wantAdditionalCurriculums === 'yes' ? additionalCurriculums : [],
        skills: wantSkills === 'yes' ? selectedSkills : [],
        studentFileName: studentFile?.name,
        createdAt: new Date().toISOString(),
        teacherId: user?.id
      };
      
      // Get existing classes or initialize empty array
      const existingClasses = JSON.parse(localStorage.getItem('classes') || '[]');
      existingClasses.push(classData);
      localStorage.setItem('classes', JSON.stringify(existingClasses));
      
      toast({
        title: "Class created successfully",
        description: `Your class "${gradeName}" has been created with ${studentFile?.name} student details.`,
      });
      
      setIsSubmitting(false);
      navigate(`/classes/${newClassId}`);
    }, 1500);
  };
  
  const handleGoBack = () => {
    navigate('/teacher-dashboard');
  };

  if (!user || user.role !== 'teacher') return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-5xl mx-auto">
        <motion.div 
          className="space-y-8" 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
          <Button 
            variant="ghost" 
              className="flex items-center text-owl-slate hover:text-owl-slate-dark mb-4"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-owl-slate-dark">Class Management</h1>
              <p className="text-owl-slate mt-2">
                Create new classes and manage student enrollments
            </p>
          </div>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              size="lg" 
              className="flex-1 h-16 bg-indigo-600 hover:bg-indigo-700 shadow-md"
              onClick={() => document.getElementById('class-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Class with Students
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1 h-16 border-indigo-300 text-indigo-700 hover:bg-indigo-50 shadow-sm"
              onClick={handleDownloadFormat}
            >
              <Download className="h-5 w-5 mr-2" />
              Download the Format for Students
            </Button>
          </motion.div>
          
          {/* Class Creation Form */}
          <motion.div variants={itemVariants}>
            <form id="class-form" onSubmit={handleSubmit} className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Create New Class</CardTitle>
                  <CardDescription>Enter the details for your new class and upload student information</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Grade Name */}
                  <div className="space-y-2">
                    <Label htmlFor="gradeName">1. Grade Name</Label>
                    <Input
                      id="gradeName"
                      placeholder="e.g., Grade-III Section A"
                      value={gradeName}
                      onChange={(e) => setGradeName(e.target.value)}
            />
          </div>
                  
                  {/* Primary Curriculum */}
                  <div className="space-y-2">
                    <Label htmlFor="curriculum">2. Curriculum of the grade</Label>
                    <Select value={primaryCurriculum} onValueChange={setPrimaryCurriculum}>
                      <SelectTrigger id="curriculum" className="w-full">
                        <SelectValue placeholder="Select primary curriculum" />
                      </SelectTrigger>
                      <SelectContent>
                        {curriculums.map(curriculum => (
                          <SelectItem key={curriculum.id} value={curriculum.id}>
                            {curriculum.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Additional Curriculums */}
                  <div className="space-y-3">
                    <Label>3. Do you want to add more curriculums for more learning?</Label>
                    <RadioGroup value={wantAdditionalCurriculums} onValueChange={(value: 'yes' | 'no') => setWantAdditionalCurriculums(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="additional-yes" />
                        <Label htmlFor="additional-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="additional-no" />
                        <Label htmlFor="additional-no">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {wantAdditionalCurriculums === 'yes' && (
                      <div className="pt-3 pl-6 border-l-2 border-indigo-100">
                        <Label className="mb-2 block text-sm">4. Select additional curriculums (max 2)</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {curriculums
                            .filter(c => c.id !== primaryCurriculum)
                            .map(curriculum => (
                              <div key={curriculum.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`curriculum-${curriculum.id}`} 
                                  checked={additionalCurriculums.includes(curriculum.id)}
                                  onCheckedChange={() => handleCurriculumChange(curriculum.id)}
                                  disabled={!additionalCurriculums.includes(curriculum.id) && additionalCurriculums.length >= 2}
                                />
                                <Label htmlFor={`curriculum-${curriculum.id}`} className="text-sm">
                                  {curriculum.name}
                                </Label>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Skills */}
                  <div className="space-y-3">
                    <Label>{wantAdditionalCurriculums === 'yes' ? '5' : '4'}. Do you want to add other skills for giving students tasks?</Label>
                    <RadioGroup value={wantSkills} onValueChange={(value: 'yes' | 'no') => setWantSkills(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="skills-yes" />
                        <Label htmlFor="skills-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="skills-no" />
                        <Label htmlFor="skills-no">No</Label>
                      </div>
                    </RadioGroup>
                    
                    {wantSkills === 'yes' && (
                      <div className="pt-3 pl-6 border-l-2 border-indigo-100">
                        <Label className="mb-2 block text-sm">{wantAdditionalCurriculums === 'yes' ? '6' : '5'}. Select skills</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {skillsSubjects.map(skill => (
                            <div key={skill.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`skill-${skill.id}`} 
                                checked={selectedSkills.includes(skill.id)}
                                onCheckedChange={() => handleSkillChange(skill.id)}
                              />
                              <Label htmlFor={`skill-${skill.id}`} className="text-sm">
                                {skill.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Students */}
                  <div className="space-y-3">
                    <Label htmlFor="upload">{wantSkills === 'yes' ? (wantAdditionalCurriculums === 'yes' ? '7' : '6') : (wantAdditionalCurriculums === 'yes' ? '6' : '5')}. Upload the student details in the format given in "Download Format"</Label>
                    <div className="grid gap-2">
                      <Label 
                        htmlFor="student-file" 
                        className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 text-center">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 text-center">
                            Excel or CSV files only
                          </p>
                        </div>
                        <Input 
                          id="student-file" 
                          type="file" 
                          accept=".xlsx,.xls,.csv" 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                      </Label>
                      
                      {studentFile && (
                        <div className="flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md">
                          <div className="flex items-center space-x-2">
                            <FileSpreadsheet className="h-5 w-5" />
                            <span className="text-sm font-medium">{studentFile.name}</span>
                          </div>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => setStudentFile(null)}
                          >
                            ✕
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateClass;
