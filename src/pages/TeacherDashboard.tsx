import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ListChecks, 
  ClipboardCheck, 
  BookOpen, 
  MessageCircle,
  BarChart2, 
  Plus, 
  Users,
  CalendarDays,
  GraduationCap,
  FileText,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { ActionCard } from '@/components/ui/ActionCard';
import { StatsCard } from '@/components/ui/StatsCard';

// Import mock data
const mockClasses = [
  { id: 'class-1', name: 'Grade 5 - Mathematics', students: 25, completion: 72 },
  { id: 'class-2', name: 'Grade 4 - Science', students: 22, completion: 65 },
  { id: 'class-3', name: 'Grade 3 - English', students: 20, completion: 80 }
];

// Mock data for class dashboard info
const mockClassData = {
  'class-1': {
    tasks: 12,
    completed: 8,
    progress: 72,
    messages: 5,
  },
  'class-2': {
    tasks: 10,
    completed: 6,
    progress: 65,
    messages: 3,
  },
  'class-3': {
    tasks: 15,
    completed: 12,
    progress: 80,
    messages: 2,
  },
};

// Dashboard info component for classes
const ClassDashboardInfo = ({ classId, classData }) => {
  const stats = [
    {
      label: 'Tasks',
      value: classData.tasks,
      icon: ListChecks,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100'
    },
    {
      label: 'Completed',
      value: classData.completed,
      icon: ClipboardCheck,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100'
    },
    {
      label: 'Progress',
      value: `${classData.progress}%`,
      icon: BarChart2,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      showProgress: true,
      progressValue: classData.progress
    },
    {
      label: 'Messages',
      value: classData.messages,
      icon: MessageCircle,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatsCard 
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          bgColor={stat.bgColor}
          showProgress={stat.showProgress}
          progressValue={stat.progressValue}
        />
      ))}
    </div>
  );
};

const TeacherDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedClassId, setSelectedClassId] = useState<string>(mockClasses[0]?.id || '');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'teacher') {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  if (!user || user.role !== 'teacher') return null;

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Create sidebar content
  const sidebarContent = (
    <>
      <SidebarSection title="MY CLASSES">
        <Button 
          variant="secondary" 
          className="w-full bg-amber-600 hover:bg-amber-700 text-white justify-start"
          onClick={() => navigateTo('/create-class')}
        >
          <Plus size={18} className="mr-2" />
          Create Class
        </Button>
      </SidebarSection>
      
      <SidebarSection title="QUICK ACCESS">
        <SidebarNavItem 
          icon={<ListChecks size={18} className="mr-2" />}
          label="All Assignments"
          onClick={() => navigateTo('/assignments')}
        />
        <SidebarNavItem 
          icon={<GraduationCap size={18} className="mr-2" />}
          label="Manage Classes"
          onClick={() => navigateTo('/create-class')}
        />
        <SidebarNavItem 
          icon={<Users size={18} className="mr-2" />}
          label="Students"
          onClick={() => navigateTo('/students')}
        />
        <SidebarNavItem 
          icon={<CalendarDays size={18} className="mr-2" />}
          label="Schedule"
          onClick={() => navigateTo('/calendar')}
        />
        <SidebarNavItem 
          icon={<BookOpen size={18} className="mr-2" />}
          label="Resources"
          onClick={() => navigateTo('/resources')}
        />
        <SidebarNavItem 
          icon={<MessageCircle size={18} className="mr-2" />}
          label="Messages"
          onClick={() => navigateTo('/messages')}
        />
      </SidebarSection>
      
      <SidebarSection title="REPORTS">
        <SidebarNavItem 
          icon={<FileText size={18} className="mr-2" />}
          label="Generate Reports"
          onClick={() => navigateTo('/create-report')}
        />
        <SidebarNavItem 
          icon={<Settings size={18} className="mr-2" />}
          label="Class Settings"
          onClick={() => navigateTo('/settings')}
        />
      </SidebarSection>
    </>
  );

  // Create header content
  const headerContent = (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Class Dashboard</h1>
          <p className="text-gray-600">Select a class to view and manage assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedClassId} onValueChange={handleSelectClass}>
            <SelectTrigger className="border-stone-200 bg-stone-50">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {mockClasses.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="default" 
            className="flex items-center gap-2 bg-amber-600 text-white hover:bg-amber-700 border-none"
            onClick={() => navigateTo('/create-class')}
          >
            <span>Manage Classes</span>
          </Button>
        </div>
      </div>
      
      {/* Class dashboard info */}
      {selectedClassId && (
        <div className="mt-4">
          <ClassDashboardInfo 
            classId={selectedClassId} 
            classData={mockClassData[selectedClassId] || { tasks: 0, completed: 0, progress: 0, messages: 0 }} 
          />
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout
      sidebarContent={sidebarContent}
      headerContent={headerContent}
      logoIcon={<GraduationCap size={18} />}
    >
      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          title="Create Task"
          description="Create new assignments for students"
          icon={ListChecks}
          buttonText="New Task"
          buttonIcon={<Plus className="h-4 w-4 mr-2" />}
          onClick={() => navigateTo('/create-task')}
        />
        
        <ActionCard
          title="Manage Classes"
          description="Create or manage classes and students"
          icon={GraduationCap}
          buttonText="Manage"
          buttonIcon={<Users className="h-4 w-4 mr-2" />}
          onClick={() => navigateTo('/create-class')}
        />
        
        <ActionCard
          title="Grade Tasks"
          description="Review and grade student submissions"
          icon={ClipboardCheck}
          buttonText="Grade Assignments"
          buttonIcon={<ClipboardCheck className="h-4 w-4 mr-2" />}
          onClick={() => navigateTo('/grade-assignments')}
        />
        
        <ActionCard
          title="Students"
          description="Manage students in your class"
          icon={Users}
          buttonText="Manage Students"
          buttonIcon={<Users className="h-4 w-4 mr-2" />}
          onClick={() => navigateTo('/manage-students')}
        />
        
        <ActionCard
          title="Schedule"
          description="Plan and schedule tasks for your class"
          icon={CalendarDays}
          buttonText="Schedule Tasks"
          buttonIcon={<CalendarDays className="h-4 w-4 mr-2" />}
          onClick={() => navigateTo('/schedule-tasks')}
        />
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
