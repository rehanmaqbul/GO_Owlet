import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ListChecks, 
  ClipboardCheck, 
  BookOpen, 
  MessageCircle,
  BarChart2, 
  Plus, 
  Users,
  Share,
  Eye,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { ActionCard } from '@/components/ui/ActionCard';
import { ChildDashboardInfo } from '@/components/parent/ChildDashboardInfo';
import { ChildrenCards } from '@/components/parent/ChildrenCards';

// Import mock data
const mockChildren = [
  { id: 'child-1', name: 'Alex', age: 10, grade: '5th Grade', completion: 75 },
  { id: 'child-2', name: 'Sarah', age: 8, grade: '3rd Grade', completion: 60 },
  { id: 'child-3', name: 'Tom', age: 12, grade: '7th Grade', completion: 88 }
];

// Mock data for child dashboard info
const mockChildData = {
  'child-1': {
    tasks: 10,
    completed: 7,
    progress: 75,
    messages: 2,
  },
  'child-2': {
    tasks: 8,
    completed: 4,
    progress: 60,
    messages: 1,
  },
  'child-3': {
    tasks: 12,
    completed: 10,
    progress: 88,
    messages: 3,
  },
};

const ParentDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedChildId, setSelectedChildId] = useState<string>(mockChildren[0]?.id || '');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'parent') {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  if (!user || user.role !== 'parent') return null;

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Create sidebar content
  const sidebarContent = (
    <>
      <SidebarSection title="MY CHILDREN">
        <Button 
          variant="secondary" 
          className="w-full bg-amber-600 hover:bg-amber-700 text-white justify-start"
          onClick={() => navigateTo('/child-management')}
        >
          <Plus size={18} className="mr-2" />
          Manage Children
        </Button>
      </SidebarSection>
      
      <SidebarSection title="QUICK ACCESS">
        <SidebarNavItem 
          icon={<ListChecks size={18} className="mr-2" />}
          label="All Assignments"
          onClick={() => navigateTo('/parent-check-tasks')}
        />
        <SidebarNavItem 
          icon={<BarChart2 size={18} className="mr-2" />}
          label="Progress Reports"
          onClick={() => navigateTo('/parent-progress-reports')}
        />
        <SidebarNavItem 
          icon={<BookOpen size={18} className="mr-2" />}
          label="Learning Resources"
          onClick={() => navigateTo('/parent-resources')}
        />
        <SidebarNavItem 
          icon={<MessageCircle size={18} className="mr-2" />}
          label="Messages"
          onClick={() => navigateTo('/parent-messages')}
        />
      </SidebarSection>
      
      <SidebarSection title="RECENT ACTIVITIES">
        <div className="bg-stone-300/50 rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center text-white">
              <ClipboardCheck size={14} />
            </div>
            <p className="text-sm text-gray-800">Alex completed Math</p>
          </div>
          {/* More activity items would go here */}
        </div>
      </SidebarSection>
    </>
  );

  // Create header content
  const headerContent = (
    <div>
      {/* Your Children section - Moved above Child Progress Dashboard */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Children</h2>
        <ChildrenCards children={mockChildren} onSelectChild={handleSelectChild} />
            </div>
            
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Child Progress Dashboard</h1>
          <p className="text-gray-600">Select a child to view and manage their learning progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedChildId} onValueChange={handleSelectChild}>
            <SelectTrigger className="border-stone-200 bg-stone-50">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {mockChildren.map(child => (
                <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="default" 
            className="flex items-center gap-2 bg-amber-600 text-white hover:bg-amber-700 border-none"
            onClick={() => navigateTo('/child-management')}
          >
            <span>Manage Children</span>
          </Button>
            </div>
          </div>
          
      {/* Child dashboard info */}
      {selectedChildId && (
        <div className="mt-4">
          <ChildDashboardInfo 
            childId={selectedChildId} 
            childData={mockChildData[selectedChildId] || { tasks: 0, completed: 0, progress: 0, messages: 0 }} 
          />
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout
      sidebarContent={sidebarContent}
      headerContent={headerContent}
      logoIcon={<BookOpen size={18} />}
    >
      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          title="Assign Task"
          description="Create new assignments for your child"
          icon={ListChecks}
          buttonText="New Task"
          buttonIcon={<Plus className="h-4 w-4 mr-2" />}
          onClick={() => navigateTo('/parent-assign-task')}
        />
        
        <ActionCard
          title="Check Tasks"
          description="Review completed assignments"
          icon={ClipboardCheck}
          buttonText="View Tasks"
          buttonIcon={<Eye className="h-4 w-4 mr-2" />}
          onClick={() => navigateTo('/parent-check-tasks')}
        />
        
        <ActionCard
          title="Send Resources"
          description="Share learning resources with your child"
          icon={BookOpen}
          buttonText="Send Resources"
          buttonIcon={<Share className="h-4 w-4 mr-2" />}
          onClick={() => navigateTo('/parent-resources')}
        />
        
        <ActionCard
          title="Message"
          description="Send messages to teachers or children"
          icon={MessageCircle}
          buttonText="Send Message"
          buttonIcon={<Send className="h-4 w-4 mr-2" />}
          onClick={() => navigateTo('/parent-messages')}
        />
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
