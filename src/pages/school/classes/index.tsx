import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Tables } from '@/lib/supabase/database.types';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { BookOpen, Plus, Search, GraduationCap, Settings, Users, FileText, BarChart, ChevronRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Class extends Tables<'classes'> {
  teacher: {
    name: string;
    email: string;
  };
  subject: {
    name: string;
  };
}

export default function SchoolClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          teacher:teachers(user:users(name, email)),
          subject:subjects(name)
        `)
        .eq('school_id', 'current_school_id'); // This should be replaced with actual school ID

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClasses = classes.filter(class_ =>
    class_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    class_.teacher.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    class_.subject.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        />
        <SidebarNavItem 
          icon={<BookOpen size={18} className="mr-2" />}
          label="Classes"
          onClick={() => navigateTo('/school/classes')}
          active={true}
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
          headerTitle="Classes Management"
          headerSubtitle="Manage your school's classes"
          logoIcon={<BookOpen size={18} />}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-owl-slate-dark">Classes</h1>
              <p className="text-sm text-owl-slate">Manage your school's classes</p>
            </div>
            <Button
              onClick={() => navigateTo('/school/classes/new')}
              className="bg-owl-primary hover:bg-owl-primary-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Classes Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-owl-primary" />
            </div>
          ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((class_) => (
                <Card key={class_.id} className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{class_.name}</h3>
                      <p className="text-sm text-gray-500">{class_.subject.name}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Teacher:</span>
                      <span className="text-gray-700">{class_.teacher.user.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Grade:</span>
                      <span className="text-gray-700">{class_.grade}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Schedule:</span>
                      <span className="text-gray-700">{class_.schedule}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => navigateTo(`/school/classes/${class_.id}`)}
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No classes found</p>
            </div>
          )}
        </DashboardLayout>
      </main>
    </div>
  );
} 