import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit, 
  MapPin,
  Users,
  GraduationCap,
  Phone,
  Mail,
  Check,
  X
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
import { Badge } from '@/components/ui/badge';

// Mock data for schools
const mockSchools = [
  { 
    id: 1, 
    name: 'Lincoln Elementary School', 
    address: '123 Education St, Springfield, IL 62701', 
    phone: '(217) 555-1234',
    email: 'admin@lincolnelementary.edu',
    students: 428, 
    teachers: 32,
    type: 'public',
    status: 'active',
    subscription: 'premium'
  },
  { 
    id: 2, 
    name: 'Washington High School', 
    address: '456 Learning Ave, Springfield, IL 62702', 
    phone: '(217) 555-5678',
    email: 'office@washingtonhs.edu',
    students: 876, 
    teachers: 64,
    type: 'public',
    status: 'active',
    subscription: 'premium'
  },
  { 
    id: 3, 
    name: 'Jefferson Middle School', 
    address: '789 Knowledge Blvd, Springfield, IL 62703', 
    phone: '(217) 555-9012',
    email: 'info@jeffersonms.edu',
    students: 542, 
    teachers: 38,
    type: 'public',
    status: 'active',
    subscription: 'standard'
  },
  { 
    id: 4, 
    name: 'Roosevelt Elementary', 
    address: '321 Wisdom Rd, Springfield, IL 62704', 
    phone: '(217) 555-3456',
    email: 'contact@rooseveltelementary.edu',
    students: 356, 
    teachers: 28,
    type: 'public',
    status: 'active',
    subscription: 'standard'
  },
  { 
    id: 5, 
    name: "St. Mary's Academy", 
    address: '555 Faith St, Springfield, IL 62705', 
    phone: '(217) 555-7890',
    email: 'admin@stmarysacademy.edu',
    students: 312, 
    teachers: 26,
    type: 'private',
    status: 'active',
    subscription: 'premium'
  },
  { 
    id: 6, 
    name: 'Springfield Montessori School', 
    address: '777 Discovery Lane, Springfield, IL 62706', 
    phone: '(217) 555-2109',
    email: 'info@springfieldmontessori.edu',
    students: 185, 
    teachers: 18,
    type: 'private',
    status: 'active',
    subscription: 'standard'
  },
  { 
    id: 7, 
    name: 'Oak Ridge Charter School', 
    address: '888 Innovation Way, Springfield, IL 62707', 
    phone: '(217) 555-6543',
    email: 'admin@oakridgecharter.edu',
    students: 264, 
    teachers: 22,
    type: 'charter',
    status: 'pending',
    subscription: 'trial'
  },
  { 
    id: 8, 
    name: 'Central Technical High School', 
    address: '999 Industry Pkwy, Springfield, IL 62708', 
    phone: '(217) 555-8765',
    email: 'office@centraltechnical.edu',
    students: 420, 
    teachers: 36,
    type: 'public',
    status: 'inactive',
    subscription: 'none'
  }
];

// Function to get subscription badge
const getSubscriptionBadge = (subscription: string) => {
  switch (subscription) {
    case 'premium':
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Premium</Badge>;
    case 'standard':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Standard</Badge>;
    case 'trial':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Trial</Badge>;
    case 'none':
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">None</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">{subscription}</Badge>;
  }
};

// Function to get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>;
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">{status}</Badge>;
  }
};

// Function to get school type badge
const getTypeBadge = (type: string) => {
  switch (type) {
    case 'public':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Public</Badge>;
    case 'private':
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Private</Badge>;
    case 'charter':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Charter</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">{type}</Badge>;
  }
};

const AdminSchools = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  
  // Filter schools based on search term and filters
  const filteredSchools = mockSchools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      school.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || school.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || school.status === statusFilter;
    const matchesSubscription = subscriptionFilter === 'all' || school.subscription === subscriptionFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesSubscription;
  });
  
  // Calculate totals for stats
  const totalStudents = mockSchools.reduce((sum, school) => sum + school.students, 0);
  const totalTeachers = mockSchools.reduce((sum, school) => sum + school.teachers, 0);
  const activeSchools = mockSchools.filter(school => school.status === 'active').length;
  
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
              <h1 className="text-2xl font-bold text-gray-800">School Management</h1>
              <p className="text-gray-500">Manage schools, staff, and subscriptions</p>
            </div>
          </div>
          <Button onClick={() => navigate('/admin/schools/new')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Schools</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold text-blue-600">{mockSchools.length}</p>
                  <p className="ml-2 text-xs text-gray-500">{activeSchools} active</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-md text-green-600">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Teachers</p>
                <p className="text-xl font-bold text-green-600">{totalTeachers}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-md text-purple-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="text-xl font-bold text-purple-600">{totalStudents}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Filters */}
        <Card className="p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search schools..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="charter">Charter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
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
              <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscriptions</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
        
        {/* Schools Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{school.name}</p>
                          <div className="flex flex-col text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[250px]">{school.address}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              <span>{school.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(school.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{school.students}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span>{school.teachers}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(school.status)}</TableCell>
                      <TableCell>{getSubscriptionBadge(school.subscription)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/admin/schools/${school.id}`)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {school.status === 'active' ? (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                              onClick={() => console.log('Deactivate school', school.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                              onClick={() => console.log('Activate school', school.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => console.log('Delete school', school.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No schools found matching your filters
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

export default AdminSchools; 