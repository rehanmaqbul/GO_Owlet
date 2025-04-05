
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Filter, Search } from 'lucide-react';
import { Curriculum, Subject } from '@/lib/types';
import { curriculums } from '@/data/curriculum-data';

export type TaskType = 'curriculum' | 'skills';

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCurriculum: Curriculum | '';
  setSelectedCurriculum: (value: Curriculum | '') => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedGrade: string;
  setSelectedGrade: (value: string) => void;
  taskName: string;
  setTaskName: (value: string) => void;
  selectedQuestions: string[];
  taskType: TaskType;
  setTaskType: (value: TaskType) => void;
  handleReset: () => void;
}

const TaskFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCurriculum,
  setSelectedCurriculum,
  selectedSubject,
  setSelectedSubject,
  selectedGrade,
  setSelectedGrade,
  taskName,
  setTaskName,
  selectedQuestions,
  taskType,
  setTaskType,
  handleReset
}: TaskFiltersProps) => {
  const subjectOptions = ['Math', 'Science', 'English', 'French', 'Social Studies', 'Critical Thinking'];
  const gradeOptions = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4 flex items-center text-gray-800">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskName" className="text-gray-800">Name of the task</Label>
            <Input
              id="taskName"
              placeholder="Enter task name..."
              className="mt-1 border-gray-300 text-gray-800 focus:border-blue-400"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="grade" className="text-gray-800">Grade</Label>
            <select
              id="grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="">Select Grade</option>
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="taskType" className="text-gray-800">Select Type of Task (Task Type)</Label>
            <select
              id="taskType"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as TaskType)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="curriculum">a. Curriculum Tasks</option>
              <option value="skills">b. Other Skills Tasks</option>
            </select>
          </div>
          
          {taskType === 'curriculum' && (
            <div>
              <Label htmlFor="curriculum" className="text-gray-800">Curriculum</Label>
              <select
                id="curriculum"
                value={selectedCurriculum}
                onChange={(e) => setSelectedCurriculum(e.target.value as Curriculum | '')}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">Select Curriculum</option>
                {curriculums.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <Label htmlFor="subject" className="text-gray-800">Subject</Label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="">Select Subject</option>
              {subjectOptions.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search questions..."
              className="pl-9 border-gray-300 text-gray-800 focus:border-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100" 
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    
      <div>
        <h2 className="text-lg font-medium mb-4 flex items-center text-gray-800">
          <Check className="mr-2 h-4 w-4" /> Selected Questions
        </h2>
        <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
          <p className="font-medium text-gray-800">
            {selectedQuestions.length} questions selected
          </p>
          {selectedQuestions.length > 0 ? (
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              {selectedQuestions.map((id, index) => (
                <li key={id} className="truncate">
                  • Question {index + 1}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Select questions from the list on the right.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
