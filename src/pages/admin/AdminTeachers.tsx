import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  GraduationCap, 
  Search, 
  Filter, 
  UserPlus, 
  Trash2, 
  Edit, 
  UserX, 
  UserCheck,
  Mail,
  School,
  BookOpen,
  Users
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

// Mock data for teachers
const mockTeachers = [
  { 
    id: 1, 
    name: 'John Smith', 
    email: 'john.smith@example.com', 
    school: 'Lincoln Elementary', 
    subjects: ['Mathematics', 'Science'], 
    students: 78, 
    status: 'active', 
    lastLogin: '2 hours ago' 
  },
  { 
    id: 2, 
    name: 'Emma Wilson', 
    email: 'emma.w@example.com', 
    school: 'Washington High', 
    subjects: ['English', 'Literature'], 
    students: 92, 
    status: 'active', 
    lastLogin: '1 day ago' 
  },
  { 
    id: 3, 
    name: 'Michael Rodriguez', 
    email: 'michael.r@example.com', 
    school: 'Jefferson Middle School', 
    subjects: ['Science', 'Technology'], 
    students: 105, 
    status: 'active', 
    lastLogin: '5 hours ago' 
  },
  { 
    id: 4, 
    name: 'Sophia Chen', 
    email: 'sophia.c@example.com', 
    school: 'Lincoln Elementary', 
    subjects: ['Art', 'Music'], 
    students: 63, 
    status: 'inactive', 
    lastLogin: '2 weeks ago' 
  },
  { 
    id: 5, 
    name: 'James Williams', 
    email: 'james.w@example.com', 
    school: 'Washington High', 
    subjects: ['History', 'Social Studies'], 
    students: 87, 
    status: 'active', 
    lastLogin: '3 days ago' 
  },
  { 
    id: 6, 
    name: 'Olivia Martin', 
    email: 'olivia.m@example.com', 
    school: 'Roosevelt Elementary', 
    subjects: ['Mathematics'], 
    students: 0, 
    status: 'pending', 
    lastLogin: 'Never' 
  }
];

// Mock data for schools
const mockSchools = [
  'All Schools',
  'Lincoln Elementary',
  'Washington High',
  'Jefferson Middle School',
  'Roosevelt Elementary'
];

// Mock data for subjects
const mockSubjects = [
  'All Subjects',
  'Mathematics',
  'Science',
  'English',
  'Literature',
  'History',
  'Social Studies',
  'Art',
  'Music',
  'Technology'
];

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

const AdminTeachers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('All Schools');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter teachers based on search term and filters
  const filteredTeachers = mockTeachers.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = schoolFilter === 'All Schools' || teacher.school === schoolFilter;
    const matchesSubject = subjectFilter === 'All Subjects' || teacher.subjects.includes(subjectFilter);
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    
    return matchesSearch && matchesSchool && matchesSubject && matchesStatus;
  });
  
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
              <h1 className="text-2xl font-bold text-gray-800">Teacher Management</h1>
              <p className="text-gray-500">Manage teachers, schools, and class assignments</p>
            </div>
          </div>
          <Button onClick={() => navigate('/admin/teachers/new')} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Teachers</p>
                <p className="text-xl font-bold text-blue-600">{mockTeachers.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-md text-purple-600">
                <School size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Schools</p>
                <p className="text-xl font-bold text-purple-600">{mockSchools.length - 1}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-md text-amber-600">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Subjects Taught</p>
                <p className="text-xl font-bold text-amber-600">{mockSubjects.length - 1}</p>
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
                placeholder="Search teachers..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <School className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="School" />
                </SelectTrigger>
                <SelectContent>
                  {mockSchools.map(school => (
                    <SelectItem key={school} value={school}>{school}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
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
        
        {/* Teachers Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {teacher.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{teacher.school}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map(subject => (
                            <Badge key={subject} variant="outline" className="bg-blue-50">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{teacher.students}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded text-xs font-medium w-fit ${getStatusColor(teacher.status)}`}>
                          {teacher.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/admin/teachers/${teacher.id}`)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {teacher.status === 'active' ? (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                              onClick={() => console.log('Deactivate teacher', teacher.id)}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                              onClick={() => console.log('Activate teacher', teacher.id)}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => console.log('Delete teacher', teacher.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No teachers found matching your filters
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

export default AdminTeachers; 