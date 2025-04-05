import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Lock,
  User,
  Key,
  AlertTriangle,
  Clock,
  Eye,
  RefreshCw,
  FileText,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Mock recent login attempts
const recentLogins = [
  { id: 1, user: 'admin@example.com', time: '2023-07-15 14:32:45', status: 'success', ip: '192.168.1.105', location: 'New York, US' },
  { id: 2, user: 'admin@example.com', time: '2023-07-14 09:15:22', status: 'success', ip: '192.168.1.105', location: 'New York, US' },
  { id: 3, user: 'teacher@example.com', time: '2023-07-13 16:45:12', status: 'failed', ip: '82.114.32.177', location: 'Unknown' },
  { id: 4, user: 'admin@example.com', time: '2023-07-12 11:22:36', status: 'success', ip: '192.168.1.108', location: 'New York, US' },
  { id: 5, user: 'unknown', time: '2023-07-12 03:18:51', status: 'failed', ip: '45.227.163.49', location: 'Beijing, CN' }
];

// Security settings component
const AdminSecurity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Security settings state
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiry: 90
  });
  
  const [loginSettings, setLoginSettings] = useState({
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 60,
    enableMFA: true,
    allowRememberMe: true
  });
  
  const [accessControl, setAccessControl] = useState({
    allowExternalAccess: true,
    restrictIpAccess: false,
    allowedIpRanges: '',
    enableRoleBasedAccess: true,
    enforceStrongAPIAuth: true
  });
  
  // Handle save settings
  const saveSettings = () => {
    toast({
      title: "Security settings saved",
      description: "Your changes have been applied successfully.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin-dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Security Settings</h1>
              <p className="text-gray-500">Manage system security and access controls</p>
            </div>
          </div>
          <Button variant="default" className="gap-2" onClick={saveSettings}>
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
        
        <Tabs defaultValue="password" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password Policy
            </TabsTrigger>
            <TabsTrigger value="login" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Login Security
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Access Control
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Security Audit
            </TabsTrigger>
          </TabsList>
          
          {/* Password Policy Tab */}
          <TabsContent value="password">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Password Requirements</h2>
              <div className="space-y-6">
                <div>
                  <Label>Minimum Password Length</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input 
                      type="number" 
                      value={passwordPolicy.minLength} 
                      onChange={(e) => setPasswordPolicy({...passwordPolicy, minLength: parseInt(e.target.value) || 8})} 
                      className="w-20"
                      min={6}
                      max={16}
                    />
                    <p className="text-sm text-gray-500">characters (6-16)</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Uppercase Letters</Label>
                      <p className="text-sm text-gray-500">At least one uppercase letter</p>
                    </div>
                    <Switch 
                      checked={passwordPolicy.requireUppercase} 
                      onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireUppercase: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Lowercase Letters</Label>
                      <p className="text-sm text-gray-500">At least one lowercase letter</p>
                    </div>
                    <Switch 
                      checked={passwordPolicy.requireLowercase} 
                      onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireLowercase: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Numbers</Label>
                      <p className="text-sm text-gray-500">At least one numeric character</p>
                    </div>
                    <Switch 
                      checked={passwordPolicy.requireNumbers} 
                      onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireNumbers: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Special Characters</Label>
                      <p className="text-sm text-gray-500">At least one special character</p>
                    </div>
                    <Switch 
                      checked={passwordPolicy.requireSpecialChars} 
                      onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireSpecialChars: checked})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Password Expiration</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input 
                      type="number" 
                      value={passwordPolicy.passwordExpiry} 
                      onChange={(e) => setPasswordPolicy({...passwordPolicy, passwordExpiry: parseInt(e.target.value) || 90})} 
                      className="w-20"
                      min={0}
                      max={365}
                    />
                    <p className="text-sm text-gray-500">days (0 for never expire)</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Login Security Tab */}
          <TabsContent value="login">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Login Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <Label>Maximum Login Attempts</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input 
                      type="number" 
                      value={loginSettings.maxLoginAttempts} 
                      onChange={(e) => setLoginSettings({...loginSettings, maxLoginAttempts: parseInt(e.target.value) || 5})} 
                      className="w-20"
                      min={3}
                      max={10}
                    />
                    <p className="text-sm text-gray-500">attempts before lockout</p>
                  </div>
                </div>
                
                <div>
                  <Label>Account Lockout Duration</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input 
                      type="number" 
                      value={loginSettings.lockoutDuration} 
                      onChange={(e) => setLoginSettings({...loginSettings, lockoutDuration: parseInt(e.target.value) || 30})} 
                      className="w-20"
                      min={5}
                    />
                    <p className="text-sm text-gray-500">minutes</p>
                  </div>
                </div>
                
                <div>
                  <Label>Session Timeout</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input 
                      type="number" 
                      value={loginSettings.sessionTimeout} 
                      onChange={(e) => setLoginSettings({...loginSettings, sessionTimeout: parseInt(e.target.value) || 60})} 
                      className="w-20"
                      min={5}
                    />
                    <p className="text-sm text-gray-500">minutes of inactivity</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Multi-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require MFA for admin accounts</p>
                    </div>
                    <Switch 
                      checked={loginSettings.enableMFA} 
                      onCheckedChange={(checked) => setLoginSettings({...loginSettings, enableMFA: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow "Remember Me" Option</Label>
                      <p className="text-sm text-gray-500">Extended session for trusted devices</p>
                    </div>
                    <Switch 
                      checked={loginSettings.allowRememberMe} 
                      onCheckedChange={(checked) => setLoginSettings({...loginSettings, allowRememberMe: checked})}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Access Control Tab */}
          <TabsContent value="access">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Access Control Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow External Access</Label>
                      <p className="text-sm text-gray-500">Enable access from outside the local network</p>
                    </div>
                    <Switch 
                      checked={accessControl.allowExternalAccess} 
                      onCheckedChange={(checked) => setAccessControl({...accessControl, allowExternalAccess: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Restrict IP Access</Label>
                      <p className="text-sm text-gray-500">Only allow connections from specific IPs</p>
                    </div>
                    <Switch 
                      checked={accessControl.restrictIpAccess} 
                      onCheckedChange={(checked) => setAccessControl({...accessControl, restrictIpAccess: checked})}
                    />
                  </div>
                </div>
                
                {accessControl.restrictIpAccess && (
                  <div>
                    <Label>Allowed IP Ranges</Label>
                    <Input 
                      placeholder="e.g. 192.168.1.0/24, 10.0.0.1" 
                      value={accessControl.allowedIpRanges} 
                      onChange={(e) => setAccessControl({...accessControl, allowedIpRanges: e.target.value})} 
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter IP addresses or CIDR notation, separated by commas</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Role-Based Access Control</Label>
                      <p className="text-sm text-gray-500">Restrict access based on user roles</p>
                    </div>
                    <Switch 
                      checked={accessControl.enableRoleBasedAccess} 
                      onCheckedChange={(checked) => setAccessControl({...accessControl, enableRoleBasedAccess: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enforce Strong API Authentication</Label>
                      <p className="text-sm text-gray-500">Require token-based auth for all API calls</p>
                    </div>
                    <Switch 
                      checked={accessControl.enforceStrongAPIAuth} 
                      onCheckedChange={(checked) => setAccessControl({...accessControl, enforceStrongAPIAuth: checked})}
                    />
                  </div>
                </div>
                
                <div>
                  <Button variant="outline" className="gap-2">
                    <Shield className="h-4 w-4" />
                    Configure Role Permissions
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Security Audit Tab */}
          <TabsContent value="audit">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Login Activity</h2>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-slate-50 p-3 text-sm font-medium">
                    <div>User</div>
                    <div>Time</div>
                    <div>Status</div>
                    <div>IP Address</div>
                    <div>Location</div>
                  </div>
                  <div className="divide-y">
                    {recentLogins.map((login) => (
                      <div key={login.id} className="grid grid-cols-5 p-3 text-sm">
                        <div className="font-medium">{login.user}</div>
                        <div className="text-gray-600">{login.time}</div>
                        <div>
                          {login.status === 'success' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Failed
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs">{login.ip}</div>
                        <div>{login.location}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    View Full Login History
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Security Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start gap-2">
                    <Key className="h-4 w-4" />
                    Reset All API Keys
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Force Password Reset for All Users
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Lock All Admin Accounts
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Security Audit Report
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSecurity; 