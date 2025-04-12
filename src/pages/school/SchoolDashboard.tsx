import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BarChart,
  BookOpen,
  GraduationCap,
  Settings,
  Building2,
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
import { Tables } from '@/lib/supabase/database.types';

interface Teacher extends Tables<'teachers'> {
  user: {
    name: string;
    email: string;
    status: string;
  };
  grade: string;
  subject: string;
}

interface SchoolStats {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  averagePerformance: number;
}

export default function SchoolDashboard() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schoolStats, setSchoolStats] = useState<SchoolStats>({
    totalTeachers: 0,
    totalStudents: 0,
    totalClasses: 0,
    averagePerformance: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
    fetchSchoolStats();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          user:users(*)
        `)
        .eq('school_id', 'current_school_id'); // This should be replaced with actual school ID

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchSchoolStats = async () => {
    try {
      // This is a placeholder for actual stats calculation
      setSchoolStats({
        totalTeachers: 10,
        totalStudents: 200,
        totalClasses: 15,
        averagePerformance: 85
      });
    } catch (error) {
      console.error('Error fetching school stats:', error);
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
          onClick={() => navigateTo('/school-dashboard')}
          active={true}
        />
        <SidebarNavItem 
          icon={<GraduationCap size={18} className="mr-2" />}
          label="Teachers"
          onClick={() => navigateTo('/school/teachers')}
        />
        <SidebarNavItem 
          icon={<Users size={18} className="mr-2" />}
          label="Students"
          onClick={() => navigateTo('/school/students')}
        />
        <SidebarNavItem 
          icon={<BookOpen size={18} className="mr-2" />}
          label="Classes"
          onClick={() => navigateTo('/school/classes')}
        />
      </SidebarSection>
      
      <SidebarSection title="MANAGEMENT">
        <SidebarNavItem 
          icon={<FileText size={18} className="mr-2" />}
          label="Reports"
          onClick={() => navigateTo('/school/reports')}
        />
        <SidebarNavItem 
          icon={<Settings size={18} className="mr-2" />}
          label="Settings"
          onClick={() => navigateTo('/school/settings')}
        />
      </SidebarSection>
    </>
  );

  const statCards = [
    {
      title: 'Total Teachers',
      value: schoolStats.totalTeachers.toString(),
      icon: GraduationCap,
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Total Students',
      value: schoolStats.totalStudents.toString(),
      icon: Users,
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Total Classes',
      value: schoolStats.totalClasses.toString(),
      icon: BookOpen,
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Average Performance',
      value: `${schoolStats.averagePerformance}%`,
      icon: BarChart,
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
            <h1 className="text-2xl font-bold text-owl-slate-dark">School Dashboard</h1>
            <p className="text-sm text-owl-slate">Manage your school and track performance</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSchoolStats}
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
          headerTitle="School Overview"
          headerSubtitle="Track school performance and manage resources"
          logoIcon={<Building2 size={18} />}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <ActionCard
              title="Manage Teachers"
              description="Add and manage teachers"
              icon={GraduationCap}
              buttonText="Manage Teachers"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/school/teachers')}
            />
            
            <ActionCard
              title="Manage Students"
              description="Add and manage students"
              icon={Users}
              buttonText="Manage Students"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/school/students')}
            />
            
            <ActionCard
              title="Class Management"
              description="Manage classes and schedules"
              icon={BookOpen}
              buttonText="Manage Classes"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/school/classes')}
            />
            
            <ActionCard
              title="Performance Reports"
              description="View detailed performance reports"
              icon={BarChart}
              buttonText="View Reports"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/school/reports')}
            />
          </div>
          
          {/* Recent Teachers */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Teachers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.slice(0, 6).map((teacher) => (
              <Card key={teacher.id} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{teacher.user.name}</h3>
                    <p className="text-sm text-gray-500">{teacher.grade} - {teacher.subject}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${
                      teacher.user.status === 'active' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {teacher.user.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-700">{teacher.user.email}</span>
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