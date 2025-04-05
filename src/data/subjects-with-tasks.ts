
export interface SubjectWithTasks {
  id: string;
  name: string;
  taskCount: number;
  color: string;
}

// Mock data for subjects with tasks
export const subjectsWithTasks: SubjectWithTasks[] = [
  { id: 'math', name: 'Math', taskCount: 3, color: 'from-blue-500 to-blue-700' },
  { id: 'french', name: 'French', taskCount: 1, color: 'from-red-500 to-red-700' },
  { id: 'science', name: 'Science', taskCount: 2, color: 'from-green-500 to-green-700' },
  { id: 'english', name: 'English', taskCount: 0, color: 'from-yellow-500 to-yellow-700' },
  { id: 'social-studies', name: 'Social Studies', taskCount: 1, color: 'from-purple-500 to-purple-700' },
  { id: 'critical-thinking', name: 'Critical Thinking', taskCount: 0, color: 'from-indigo-500 to-indigo-700' },
  { id: 'mindset', name: 'Mindset', taskCount: 0, color: 'from-pink-500 to-pink-700' },
  { id: 'arts', name: 'Arts', taskCount: 0, color: 'from-orange-500 to-orange-700' },
  { id: 'decision-making', name: 'Decision Making', taskCount: 0, color: 'from-teal-500 to-teal-700' },
  { id: 'general-skills', name: 'General Skills', taskCount: 0, color: 'from-cyan-500 to-cyan-700' }
];
