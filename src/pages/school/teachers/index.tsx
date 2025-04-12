import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, ChevronRight, Loader2 } from 'lucide-react';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { Tables } from '@/lib/supabase/database.types';

interface Teacher {
  id: string;
  school_id: string;
  user_id: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    status: string;
  };
}

export default function SchoolTeachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('school_users')
        .select(`
          *,
          user:users(*)
        `)
        .eq('school_id', 'current_school_id'); // This should be replaced with actual school ID

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
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
          icon={<Users size={18} className="mr-2" />}
          label="Teachers"
          onClick={() => navigateTo('/school/teachers')}
          active={true}
        />
      </SidebarSection>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <DashboardLayout
        sidebarContent={sidebarContent}
        headerTitle="Teachers"
        headerSubtitle="Manage your school's teachers"
        logoIcon={<Users size={18} />}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-owl-slate-dark">Teachers</h1>
          <Button
            onClick={() => navigateTo('/school/teachers/new')}
            className="bg-owl-primary hover:bg-owl-primary-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-owl-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{teacher.user.name}</h3>
                    <p className="text-sm text-gray-500">{teacher.user.email}</p>
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
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => navigateTo(`/school/teachers/${teacher.id}`)}
                >
                  View Details
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </DashboardLayout>
    </div>
  );
} 