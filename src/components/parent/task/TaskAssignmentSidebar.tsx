import React from 'react';
import { Button } from '@/components/ui/button';
import TaskFilters from '@/components/task/TaskFilters';
import { TaskType, Curriculum } from '@/lib/types';

interface TaskAssignmentSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCurriculum: Curriculum | '';
  setSelectedCurriculum: (curriculum: Curriculum | '') => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  taskName: string;
  setTaskName: (name: string) => void;
  selectedQuestions: string[];
  taskType: TaskType;
  setTaskType: (type: TaskType) => void;
  handleReset: () => void;
  selectedChild: string;
  setSelectedChild: (childId: string) => void;
  handleSendTask: () => void;
  isLoading: boolean;
}

const TaskAssignmentSidebar = ({
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
  handleReset,
  selectedChild,
  setSelectedChild,
  handleSendTask,
  isLoading
}: TaskAssignmentSidebarProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <TaskFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCurriculum={selectedCurriculum}
        setSelectedCurriculum={setSelectedCurriculum}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        taskName={taskName}
        setTaskName={setTaskName}
        taskType={taskType}
        setTaskType={setTaskType}
        selectedQuestions={selectedQuestions}
        handleReset={handleReset}
      />
      
      {/* Task Name Input */}
      <div className="mt-6">
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-2">
          Task Name
        </label>
        <input
          id="taskName"
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter task name"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <Button 
          onClick={handleSendTask}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          disabled={isLoading || !selectedChild || selectedQuestions.length === 0 || !taskName}
        >
          {isLoading ? 'Processing...' : 'Assign Task'}
        </Button>
        
        <Button 
          onClick={handleReset}
          variant="outline"
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
      
      {/* Selected Questions Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Selected Questions</h3>
        <div className="text-2xl font-bold text-indigo-600">
          {selectedQuestions.length}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {selectedQuestions.length === 0 
            ? 'No questions selected yet' 
            : selectedQuestions.length === 1 
              ? '1 question selected' 
              : `${selectedQuestions.length} questions selected`}
        </p>
      </div>
    </div>
  );
};

export default TaskAssignmentSidebar;
