import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PanelTop, 
  Users, 
  ArrowLeft, 
  UserPlus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  UserX, 
  UserCheck,
  Loader2,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { adminUsersService, User, logActivity } from '@/services/admin/adminService';
import { useAuth } from '@/contexts/auth';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-700';
    case 'teacher':
      return 'bg-blue-100 text-blue-700';
    case 'parent':
      return 'bg-green-100 text-green-700';
    case 'child':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'inactive':
      return 'bg-gray-100 text-gray-700';
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  
  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adminUsersService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user status update
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      setProcessingUser(userId);
      
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      await adminUsersService.updateUser(userId, { status: newStatus });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, status: newStatus } : u
        )
      );
      
      // Log activity
      await logActivity(
        user?.id || null,
        'update',
        `${currentStatus === 'active' ? 'Deactivated' : 'Activated'} user account`,
        'user',
        userId
      );
      
      toast({
        title: 'User updated successfully',
        description: `User has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
        variant: 'default'
      });
    } catch (err) {
      console.error('Error updating user:', err);
      toast({
        title: 'Error updating user',
        description: 'An error occurred while updating the user status.',
        variant: 'destructive'
      });
    } finally {
      setProcessingUser(null);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string, userName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete user ${userName}? This action cannot be undone.`);
    
    if (confirmed) {
      try {
        setProcessingUser(userId);
        
        await adminUsersService.deleteUser(userId);
        
        // Update local state
        setUsers(prevUsers => 
          prevUsers.filter(u => u.id !== userId)
        );
        
        // Log activity
        await logActivity(
          user?.id || null,
          'delete',
          `Deleted user account: ${userName}`,
          'user',
          userId
        );
        
        toast({
          title: 'User deleted successfully',
          description: `User ${userName} has been deleted.`,
          variant: 'default'
        });
      } catch (err) {
        console.error('Error deleting user:', err);
        toast({
          title: 'Error deleting user',
          description: 'An error occurred while deleting the user.',
          variant: 'destructive'
        });
      } finally {
        setProcessingUser(null);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
              <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              <p className="text-gray-500">Manage system users and permissions</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/admin/users/bulk-upload')} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button onClick={() => navigate('/admin/users/new')} className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200 text-red-800">
            <p>{error}</p>
          </Card>
        )}
        
        {/* Filters */}
        <Card className="p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search users..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
        
        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded text-xs font-medium w-fit ${getRoleColor(user.role)}`}>
                          {user.role}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded text-xs font-medium w-fit ${getStatusColor(user.status)}`}>
                          {user.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.last_login 
                          ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true })
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="h-8 w-8"
                            disabled={processingUser === user.id}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              disabled={processingUser === user.id}
                            >
                              {processingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              disabled={processingUser === user.id}
                            >
                              {processingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            disabled={processingUser === user.id}
                          >
                            {processingUser === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No users found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers; 