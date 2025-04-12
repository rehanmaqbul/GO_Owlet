import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
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
import AddSchoolForm from './AddSchoolForm';

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
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('email', user.email)
          .single();
        
        if (userData) {
          setUserRole(userData.role);
          console.log('Current user role:', userData.role);
        }
      }
    };
    
    checkUserRole();
  }, []);
  
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schools</h1>
        </div>
        
      <AddSchoolForm />

      {/* Rest of the schools list/table component */}
    </div>
  );
};

export default AdminSchools; 