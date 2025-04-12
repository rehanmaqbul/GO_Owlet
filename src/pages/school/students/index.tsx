import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Tables } from '@/lib/supabase/database.types';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { User, Plus, Search, GraduationCap, Settings, Users, BookOpen, FileText, BarChart, ChevronRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Student extends Tables<'users'> {
  grade?: string;
  parent_email?: string;
}

export default function SchoolStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('school_users')
        .select(`
          *,
          user:users(*)
        `)
        .eq('school_id', 'current_school_id'); // This should be replaced with actual school ID

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const sidebarContent = (
    <>
      <SidebarSection title="MAIN">
        <SidebarNavItem 
          icon={<BarChart size={18} className="mr-2" />}
          label="Dashboard"
          onClick={() => navigateTo('/school')}
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
          active={true}
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        <DashboardLayout
          sidebarContent={sidebarContent}
          headerTitle="Students Management"
          headerSubtitle="Manage your school's students"
          logoIcon={<Users size={18} />}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-owl-slate-dark">Students</h1>
              <p className="text-sm text-owl-slate">Manage your school's students</p>
            </div>
            <Button
              onClick={() => navigateTo('/school/students/new')}
              className="bg-owl-primary hover:bg-owl-primary-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Students Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-owl-primary" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-gray-500">Grade {student.grade || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${
                        student.status === 'active' ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-700">{student.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Parent Email:</span>
                      <span className="text-gray-700">{student.parent_email || 'N/A'}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => navigateTo(`/school/students/${student.id}`)}
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </DashboardLayout>
      </main>
    </div>
  );
} 