
import { Class, Task, User } from '@/lib/types';

// Mock data
export const mockClass: Class = {
  id: 'class-1',
  name: 'Grade 5 Science',
  teacherId: 'teacher-1',
  curriculum: 'american',
  studentIds: ['child-1', 'child-2', 'child-3'],
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
};

export const mockStudents: User[] = [
  {
    id: 'child-1',
    email: 'student1@example.com',
    name: 'Alex Johnson',
    role: 'child',
    parentId: 'parent-1'
  },
  {
    id: 'child-2',
    email: 'student2@example.com',
    name: 'Taylor Smith',
    role: 'child',
    parentId: 'parent-2'
  },
  {
    id: 'child-3',
    email: 'student3@example.com',
    name: 'Jordan Brown',
    role: 'child',
    parentId: 'parent-3'
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Math Practice',
    childId: 'class-1', // Assigned to entire class
    assignedById: 'teacher-1',
    assignedByRole: 'teacher',
    subject: 'math',
    curriculum: 'american',
    questions: ['q-1', 'q-2', 'q-3'],
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];
