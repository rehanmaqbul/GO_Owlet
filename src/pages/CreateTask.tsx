import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { LearningPlanGenerator } from '@/components/teacher/LearningPlanGenerator';

// Mock data for the learning plan generator
const mockGrades = [
  { id: '1', name: 'Grade 1' },
  { id: '2', name: 'Grade 2' },
  { id: '3', name: 'Grade 3' },
  { id: '4', name: 'Grade 4' },
  { id: '5', name: 'Grade 5' },
];

const mockSubjects = [
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'Science' },
  { id: '3', name: 'English' },
  { id: '4', name: 'History' },
  { id: '5', name: 'Geography' },
];

const mockChapters: Record<string, string[]> = {
  'Mathematics': ['Numbers', 'Algebra', 'Geometry', 'Statistics'],
  'Science': ['Physics', 'Chemistry', 'Biology', 'Astronomy'],
  'English': ['Grammar', 'Literature', 'Writing', 'Speaking'],
  'History': ['Ancient', 'Medieval', 'Modern', 'Contemporary'],
  'Geography': ['Physical', 'Human', 'Economic', 'Political'],
};

const mockLessons: Record<string, Record<string, string[]>> = {
  'Mathematics': {
    'Numbers': ['Addition', 'Subtraction', 'Multiplication', 'Division'],
    'Algebra': ['Variables', 'Equations', 'Inequalities', 'Functions'],
    'Geometry': ['Shapes', 'Angles', 'Area', 'Volume'],
    'Statistics': ['Data', 'Graphs', 'Probability', 'Mean'],
  },
  'Science': {
    'Physics': ['Forces', 'Energy', 'Motion', 'Waves'],
    'Chemistry': ['Atoms', 'Elements', 'Compounds', 'Reactions'],
    'Biology': ['Cells', 'Genetics', 'Ecosystems', 'Evolution'],
    'Astronomy': ['Planets', 'Stars', 'Galaxies', 'Universe'],
  },
  'English': {
    'Grammar': ['Nouns', 'Verbs', 'Adjectives', 'Adverbs'],
    'Literature': ['Poetry', 'Prose', 'Drama', 'Novels'],
    'Writing': ['Essays', 'Stories', 'Reports', 'Letters'],
    'Speaking': ['Pronunciation', 'Conversation', 'Presentation', 'Debate'],
  },
  'History': {
    'Ancient': ['Egypt', 'Greece', 'Rome', 'China'],
    'Medieval': ['Feudalism', 'Crusades', 'Renaissance', 'Reformation'],
    'Modern': ['Industrial', 'World Wars', 'Cold War', 'Globalization'],
    'Contemporary': ['Technology', 'Environment', 'Politics', 'Society'],
  },
  'Geography': {
    'Physical': ['Landforms', 'Climate', 'Oceans', 'Mountains'],
    'Human': ['Population', 'Culture', 'Cities', 'Migration'],
    'Economic': ['Resources', 'Trade', 'Development', 'Globalization'],
    'Political': ['Borders', 'Governments', 'Conflicts', 'Cooperation'],
  },
};

export default function CreateTask() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'teacher')) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'teacher') {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Learning Plan</h1>
      <LearningPlanGenerator
        grades={mockGrades}
        subjects={mockSubjects}
        chapters={mockChapters}
        lessons={mockLessons}
      />
    </div>
  );
}
