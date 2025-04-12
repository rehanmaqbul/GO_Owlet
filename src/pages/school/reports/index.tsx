import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, ChevronRight, Loader2 } from 'lucide-react';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';

interface Report {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function SchoolReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('school_id', 'current_school_id'); // This should be replaced with actual school ID

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
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
          icon={<FileText size={18} className="mr-2" />}
          label="Reports"
          onClick={() => navigateTo('/school/reports')}
          active={true}
        />
      </SidebarSection>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <DashboardLayout
        sidebarContent={sidebarContent}
        headerTitle="Reports"
        headerSubtitle="View and manage school reports"
        logoIcon={<FileText size={18} />}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-owl-slate-dark">Reports</h1>
          <Button
            onClick={() => navigateTo('/school/reports/new')}
            className="bg-owl-primary hover:bg-owl-primary-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-owl-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">{report.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${
                      report.status === 'active' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => navigateTo(`/school/reports/${report.id}`)}
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