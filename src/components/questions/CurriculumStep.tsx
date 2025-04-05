
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Curriculum } from '@/lib/types';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { curriculums, grades, ageGroups } from '@/data/curriculum-data';

interface CurriculumStepProps {
  selectedCurriculum: Curriculum | '';
  selectedGrade: string;
  selectedAge: string;
  setSelectedCurriculum: (curriculum: Curriculum) => void;
  setSelectedGrade: (grade: string) => void;
  setSelectedAge: (age: string) => void;
  onNext: () => void;
}

export const CurriculumStep = ({
  selectedCurriculum,
  selectedGrade,
  selectedAge,
  setSelectedCurriculum,
  setSelectedGrade,
  setSelectedAge,
  onNext
}: CurriculumStepProps) => {
  const { toast } = useToast();
  
  const handleCurriculumSelect = (value: string) => {
    console.log('Selected curriculum:', value);
    setSelectedCurriculum(value as Curriculum);
  };
  
  const handleGradeSelect = (value: string) => {
    console.log('Selected grade:', value);
    setSelectedGrade(value);
  };
  
  const handleAgeSelect = (value: string) => {
    console.log('Selected age:', value);
    setSelectedAge(value);
  };
  
  const handleProceedToSubject = () => {
    if (!selectedCurriculum) {
      toast({
        title: "Please select a curriculum",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedGrade) {
      toast({
        title: "Please select a grade",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedAge) {
      toast({
        title: "Please select an age group",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Proceeding with:', {
      curriculum: selectedCurriculum,
      grade: selectedGrade,
      age: selectedAge
    });
    
    onNext();
  };

  return (
    <motion.div {...fadeIn}>
      <Card className="shadow-subtle backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle>Select Curriculum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="curriculum" className="text-[#403E43]">Curriculum</Label>
            <Select onValueChange={handleCurriculumSelect} value={selectedCurriculum}>
              <SelectTrigger id="curriculum" className="bg-white/30 backdrop-blur-md border-white/20 text-[#403E43]">
                <SelectValue placeholder="Select a curriculum" />
              </SelectTrigger>
              <SelectContent className="bg-[#e8d5c4]/80 backdrop-blur-md border-white/20">
                {curriculums.map(curriculum => (
                  <SelectItem key={curriculum.id} value={curriculum.id}>
                    {curriculum.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="grade" className="text-[#403E43]">Grade</Label>
            <Select onValueChange={handleGradeSelect} value={selectedGrade}>
              <SelectTrigger id="grade" className="bg-white/30 backdrop-blur-md border-white/20 text-[#403E43]">
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent className="bg-[#e8d5c4]/80 backdrop-blur-md border-white/20">
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="age" className="text-[#403E43]">Age Group</Label>
            <Select onValueChange={handleAgeSelect} value={selectedAge}>
              <SelectTrigger id="age" className="bg-white/30 backdrop-blur-md border-white/20 text-[#403E43]">
                <SelectValue placeholder="Select an age group" />
              </SelectTrigger>
              <SelectContent className="bg-[#e8d5c4]/80 backdrop-blur-md border-white/20">
                {ageGroups.map(age => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleProceedToSubject} className="mt-2 bg-[#e8d5c4] hover:bg-[#dcc7b7] text-[#403E43] border border-white/20 rounded-xl">
            Continue
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
