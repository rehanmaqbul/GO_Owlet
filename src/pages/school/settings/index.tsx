import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { Settings, GraduationCap, Users, BookOpen, FileText, BarChart, Save, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Tables } from '@/lib/supabase/database.types';

interface SchoolSettings extends Tables<'schools'> {
  // Add any additional settings fields here
}

export default function SchoolSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', 'current_school_id') // This should be replaced with actual school ID
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('schools')
        .update(settings)
        .eq('id', settings.id);

      if (error) throw error;
      // Show success message or notification
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

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
          active={true}
        />
      </SidebarSection>
    </>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
        <Navbar />
        <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
          <DashboardLayout
            sidebarContent={sidebarContent}
            headerTitle="Settings"
            headerSubtitle="Manage your school settings"
            logoIcon={<Settings size={18} />}
          >
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-owl-primary" />
            </div>
          </DashboardLayout>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        <DashboardLayout
          sidebarContent={sidebarContent}
          headerTitle="Settings"
          headerSubtitle="Manage your school settings"
          logoIcon={<Settings size={18} />}
        >
          <div className="max-w-2xl mx-auto">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">School Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    value={settings?.name || ''}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings?.address || ''}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, address: e.target.value } : null)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={settings?.city || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, city: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={settings?.state || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, state: e.target.value } : null)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={settings?.postal_code || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, postal_code: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={settings?.country || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, country: e.target.value } : null)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={settings?.phone || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings?.email || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, email: e.target.value } : null)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-owl-primary hover:bg-owl-primary-dark"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        </DashboardLayout>
      </main>
    </div>
  );
} 