import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Save,
  Bell,
  Mail,
  Trash2,
  UserCog,
  Globe,
  Database,
  Smartphone,
  CloudUpload,
  FileArchive,
  Clock,
  Shield,
  Sparkles,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Settings section
const SettingsSection = ({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  children: React.ReactNode 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-md">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="pl-10">
        {children}
      </div>
    </div>
  );
};

// Form group
const FormGroup = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  return (
    <div className="space-y-4">
      {title && <h4 className="text-md font-medium">{title}</h4>}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // State for different settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'EduTrack',
    siteDescription: 'Educational tracking and learning platform for schools, teachers, parents, and students.',
    timezone: 'America/Chicago',
    language: 'en-US',
    maintenanceMode: false
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    systemNotifications: true,
    marketingEmails: false,
    dailyDigest: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiration: 90,
    sessionTimeout: 30,
    allowMultipleSessions: false
  });
  
  const [contentSettings, setContentSettings] = useState({
    contentModeration: true,
    autoPublish: false,
    defaultGradeLevel: '5',
    maxFileSize: 50
  });
  
  // Handle save settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved successfully",
        description: "Your system settings have been updated.",
        variant: "success",
      });
      
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin-dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
            <p className="text-gray-500">Configure application settings and preferences</p>
          </div>
        </div>
        
        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="p-6">
              <SettingsSection 
                icon={Globe}
                title="General Settings"
                description="Basic system configuration and settings"
              >
                <FormGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormLabel>Site Name</FormLabel>
                      <Input 
                        value={generalSettings.siteName}
                        onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      />
                      <p className="text-xs text-gray-500">The name of your application</p>
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>Timezone</FormLabel>
                      <Select 
                        value={generalSettings.timezone}
                        onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Default timezone for the application</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <FormLabel>Site Description</FormLabel>
                    <Textarea 
                      value={generalSettings.siteDescription}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                      className="resize-none h-20"
                    />
                    <p className="text-xs text-gray-500">Brief description of your application</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <FormLabel>Language</FormLabel>
                      <Select 
                        value={generalSettings.language}
                        onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="es-ES">Spanish</SelectItem>
                          <SelectItem value="fr-FR">French</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Default language for the application</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Maintenance Mode</FormLabel>
                        <p className="text-xs text-gray-500">Set the system to maintenance mode</p>
                      </div>
                      <Switch 
                        checked={generalSettings.maintenanceMode}
                        onCheckedChange={(checked) => setGeneralSettings({...generalSettings, maintenanceMode: checked})}
                      />
                    </div>
                  </div>
                </FormGroup>
              </SettingsSection>
              
              <Separator className="my-8" />
              
              <SettingsSection
                icon={Database}
                title="Data Management"
                description="Configure data storage and backup settings"
              >
                <FormGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormLabel>Automatic Backups</FormLabel>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">How often to back up system data</p>
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>Data Retention (days)</FormLabel>
                      <Input type="number" defaultValue="90" min="1" />
                      <p className="text-xs text-gray-500">How long to keep backups</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <FormLabel>Enable Auto-Cleanup</FormLabel>
                      <p className="text-xs text-gray-500">Automatically remove old data</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </FormGroup>
              </SettingsSection>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <SettingsSection 
                icon={Bell}
                title="Notification Settings"
                description="Configure system notifications and alerts"
              >
                <FormGroup title="System Notifications">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>System Notifications</FormLabel>
                        <p className="text-xs text-gray-500">In-app notifications for system events</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.systemNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemNotifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Email Notifications</FormLabel>
                        <p className="text-xs text-gray-500">Send important notifications via email</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Daily Digest</FormLabel>
                        <p className="text-xs text-gray-500">Send daily summary of activities</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.dailyDigest}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailyDigest: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Marketing Emails</FormLabel>
                        <p className="text-xs text-gray-500">Send product updates and marketing information</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
                      />
                    </div>
                  </div>
                </FormGroup>
                
                <FormGroup title="Email Configuration" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormLabel>SMTP Server</FormLabel>
                      <Input defaultValue="smtp.example.com" />
                      <p className="text-xs text-gray-500">Outgoing mail server</p>
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>SMTP Port</FormLabel>
                      <Input defaultValue="587" type="number" />
                      <p className="text-xs text-gray-500">Server port number</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <FormLabel>Username</FormLabel>
                      <Input defaultValue="notifications@edutrack.com" />
                      <p className="text-xs text-gray-500">SMTP username</p>
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>Password</FormLabel>
                      <Input type="password" defaultValue="••••••••••••••••" />
                      <p className="text-xs text-gray-500">SMTP password</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <FormLabel>From Email</FormLabel>
                    <Input defaultValue="no-reply@edutrack.com" />
                    <p className="text-xs text-gray-500">Email address notifications will come from</p>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => toast({
                        title: "Test email sent",
                        description: "Check your inbox for the test message.",
                        variant: "success",
                      })}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Test Email
                    </Button>
                  </div>
                </FormGroup>
              </SettingsSection>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <SettingsSection 
                icon={Shield}
                title="Security Settings"
                description="Manage security and access controls"
              >
                <FormGroup title="Authentication">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Two-Factor Authentication</FormLabel>
                        <p className="text-xs text-gray-500">Require 2FA for admin accounts</p>
                      </div>
                      <Switch 
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Allow Multiple Sessions</FormLabel>
                        <p className="text-xs text-gray-500">Allow users to be logged in on multiple devices</p>
                      </div>
                      <Switch 
                        checked={securitySettings.allowMultipleSessions}
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, allowMultipleSessions: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <FormLabel>Password Expiration (days)</FormLabel>
                      <Input 
                        type="number" 
                        value={securitySettings.passwordExpiration}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiration: Number(e.target.value)})}
                        min="0"
                      />
                      <p className="text-xs text-gray-500">0 = never expire</p>
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>Session Timeout (minutes)</FormLabel>
                      <Input 
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: Number(e.target.value)})}
                        min="5"
                      />
                      <p className="text-xs text-gray-500">Logout after inactivity</p>
                    </div>
                  </div>
                </FormGroup>
                
                <FormGroup title="API Settings" className="mt-6">
                  <div className="space-y-2">
                    <FormLabel>API Access</FormLabel>
                    <Select defaultValue="restricted">
                      <SelectTrigger>
                        <SelectValue placeholder="Select API access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disabled">Disabled</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                        <SelectItem value="full">Full Access</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Control API access level</p>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Manage API Keys
                    </Button>
                  </div>
                </FormGroup>
              </SettingsSection>
            </Card>
          </TabsContent>
          
          {/* Content Settings */}
          <TabsContent value="content" className="space-y-6">
            <Card className="p-6">
              <SettingsSection 
                icon={FileArchive}
                title="Content Settings"
                description="Configure content and upload settings"
              >
                <FormGroup title="Content Management">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Content Moderation</FormLabel>
                        <p className="text-xs text-gray-500">Require approval for new content</p>
                      </div>
                      <Switch 
                        checked={contentSettings.contentModeration}
                        onCheckedChange={(checked) => setContentSettings({...contentSettings, contentModeration: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Auto-Publish</FormLabel>
                        <p className="text-xs text-gray-500">Automatically publish approved content</p>
                      </div>
                      <Switch 
                        checked={contentSettings.autoPublish}
                        onCheckedChange={(checked) => setContentSettings({...contentSettings, autoPublish: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <FormLabel>Default Grade Level</FormLabel>
                      <Select 
                        value={contentSettings.defaultGradeLevel}
                        onValueChange={(value) => setContentSettings({...contentSettings, defaultGradeLevel: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="K">Kindergarten</SelectItem>
                          <SelectItem value="1">Grade 1</SelectItem>
                          <SelectItem value="2">Grade 2</SelectItem>
                          <SelectItem value="3">Grade 3</SelectItem>
                          <SelectItem value="4">Grade 4</SelectItem>
                          <SelectItem value="5">Grade 5</SelectItem>
                          <SelectItem value="6">Grade 6</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Default grade for new content</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <FormLabel>Max File Size (MB)</FormLabel>
                        <span className="text-sm font-medium">{contentSettings.maxFileSize} MB</span>
                      </div>
                      <Slider 
                        value={[contentSettings.maxFileSize]} 
                        min={1} 
                        max={100} 
                        step={1}
                        onValueChange={(value) => setContentSettings({...contentSettings, maxFileSize: value[0]})}
                      />
                      <p className="text-xs text-gray-500">Maximum file upload size</p>
                    </div>
                  </div>
                </FormGroup>
                
                <FormGroup title="Allowed File Types" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-jpg" defaultChecked className="rounded text-blue-600" />
                      <label htmlFor="file-jpg" className="text-sm">JPG/JPEG</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-png" defaultChecked className="rounded text-blue-600" />
                      <label htmlFor="file-png" className="text-sm">PNG</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-gif" defaultChecked className="rounded text-blue-600" />
                      <label htmlFor="file-gif" className="text-sm">GIF</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-pdf" defaultChecked className="rounded text-blue-600" />
                      <label htmlFor="file-pdf" className="text-sm">PDF</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-doc" defaultChecked className="rounded text-blue-600" />
                      <label htmlFor="file-doc" className="text-sm">DOC/DOCX</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-xls" defaultChecked className="rounded text-blue-600" />
                      <label htmlFor="file-xls" className="text-sm">XLS/XLSX</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-ppt" defaultChecked className="rounded text-blue-600" />
                      <label htmlFor="file-ppt" className="text-sm">PPT/PPTX</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-mp4" defaultChecked className="rounded text-blue-600" />
                      <label htmlFor="file-mp4" className="text-sm">MP4</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-mp3" defaultChecked className="rounded text-blue-600" />
                      <label htmlFor="file-mp3" className="text-sm">MP3</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="file-zip" className="rounded text-blue-600" />
                      <label htmlFor="file-zip" className="text-sm">ZIP</label>
                    </div>
                  </div>
                </FormGroup>
              </SettingsSection>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSaveSettings}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Settings className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 