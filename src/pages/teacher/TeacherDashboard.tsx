import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BarChart,
  BookOpen,
  Calendar,
  Settings,
  User,
  FileText,
  ChevronRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { ActionCard } from '@/components/ui/ActionCard';
import { StatsCard } from '@/components/ui/StatsCard';
import Navbar from '@/components/Navbar';

interface Class {
  id: string;
  name: string;
  grade: string;
  subject: string;
  totalStudents: number;
  averageScore: number;
}

interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  averagePerformance: number;
  upcomingTasks: number;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [teacherStats, setTeacherStats] = useState<TeacherStats>({
    totalClasses: 0,
    totalStudents: 0,
    averagePerformance: 0,
    upcomingTasks: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
    fetchTeacherStats();
  }, []);

  const fetchClasses = async () => {
    try {
      // This is a placeholder for actual data fetching
      setClasses([
        {
          id: '1',
          name: 'Mathematics 101',
          grade: 'Grade 5',
          subject: 'Mathematics',
          totalStudents: 25,
          averageScore: 85
        },
        {
          id: '2',
          name: 'Science 101',
          grade: 'Grade 5',
          subject: 'Science',
          totalStudents: 25,
          averageScore: 78
        }
      ]);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchTeacherStats = async () => {
    try {
      // This is a placeholder for actual stats calculation
      setTeacherStats({
        totalClasses: 2,
        totalStudents: 50,
        averagePerformance: 81.5,
        upcomingTasks: 3
      });
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Create sidebar content
  const sidebarContent = (
    <>
      <SidebarSection title="MAIN">
        <SidebarNavItem 
          icon={<BarChart size={18} className="mr-2" />}
          label="Dashboard"
          onClick={() => navigateTo('/teacher-dashboard')}
          active={true}
        />
        <SidebarNavItem 
          icon={<BookOpen size={18} className="mr-2" />}
          label="Classes"
          onClick={() => navigateTo('/teacher/classes')}
        />
        <SidebarNavItem 
          icon={<Users size={18} className="mr-2" />}
          label="Students"
          onClick={() => navigateTo('/teacher/students')}
        />
        <SidebarNavItem 
          icon={<Calendar size={18} className="mr-2" />}
          label="Schedule"
          onClick={() => navigateTo('/teacher/schedule')}
        />
      </SidebarSection>
      
      <SidebarSection title="MANAGEMENT">
        <SidebarNavItem 
          icon={<FileText size={18} className="mr-2" />}
          label="Assignments"
          onClick={() => navigateTo('/teacher/assignments')}
        />
        <SidebarNavItem 
          icon={<Settings size={18} className="mr-2" />}
          label="Settings"
          onClick={() => navigateTo('/teacher/settings')}
        />
      </SidebarSection>
    </>
  );

  const statCards = [
    {
      title: 'Total Classes',
      value: teacherStats.totalClasses.toString(),
      icon: BookOpen,
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Total Students',
      value: teacherStats.totalStudents.toString(),
      icon: Users,
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Average Performance',
      value: `${teacherStats.averagePerformance}%`,
      icon: BarChart,
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Upcoming Tasks',
      value: teacherStats.upcomingTasks.toString(),
      icon: Calendar,
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-owl-slate-dark">Teacher Dashboard</h1>
            <p className="text-sm text-owl-slate">Manage your classes and track student performance</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTeacherStats}
              disabled={isLoading}
              className="border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Stats
            </Button>
          </div>
        </div>

        <DashboardLayout
          sidebarContent={sidebarContent}
          headerTitle="Teacher Overview"
          headerSubtitle="Track your classes and student performance"
          logoIcon={<User size={18} />}
        >
          {/* System Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              ))
            ) : (
              statCards.map((stat) => (
                <StatsCard 
                  key={stat.title}
                  label={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  bgColor={stat.bgColor}
                />
              ))
            )}
          </div>
          
          {/* Quick Actions */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <ActionCard
              title="Manage Classes"
              description="View and manage your classes"
              icon={BookOpen}
              buttonText="Manage Classes"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/teacher/classes')}
            />
            
            <ActionCard
              title="Student Management"
              description="View and manage students"
              icon={Users}
              buttonText="Manage Students"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/teacher/students')}
            />
            
            <ActionCard
              title="Create Assignment"
              description="Create new assignments"
              icon={FileText}
              buttonText="Create Assignment"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/teacher/assignments/new')}
            />
          </div>
          
          {/* Recent Classes */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{classItem.name}</h3>
                    <p className="text-sm text-gray-500">{classItem.grade} - {classItem.subject}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Students:</span>
                    <span className="text-gray-700">{classItem.totalStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Average Score:</span>
                    <span className="text-gray-700">{classItem.averageScore}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DashboardLayout>
      </main>
    </div>
  );
} 