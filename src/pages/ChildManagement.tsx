import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Pencil, User, ArrowLeft, Trash2, UserCheck, UserCog, Cake, School, KeyRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ChildData {
  id: string;
  name: string;
  age: number;
  grade: string;
  username: string;
  password: string; // In a real app, passwords would not be stored like this
  picture?: string;
}

const mockChildren: ChildData[] = [
  { id: 'child-1', name: 'Alex Smith', age: 10, grade: 'Grade 5', username: 'alex_s', password: 'password123' },
  { id: 'child-2', name: 'Jamie Johnson', age: 8, grade: 'Grade 3', username: 'jamie_j', password: 'password456' },
];

const ChildManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [children, setChildren] = useState<ChildData[]>(mockChildren);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildData | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    username: '',
    password: '',
    confirmPassword: '',
    picture: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddChild = () => {
    // Reset form data
    setFormData({
      name: '',
      age: '',
      grade: '',
      username: '',
      password: '',
      confirmPassword: '',
      picture: ''
    });
    setShowAddForm(true);
    setEditingChild(null);
  };
  
  const handleEditChild = (child: ChildData) => {
    setFormData({
      name: child.name,
      age: child.age.toString(),
      grade: child.grade,
      username: child.username,
      password: child.password,
      confirmPassword: child.password,
      picture: child.picture || ''
    });
    setEditingChild(child);
    setShowAddForm(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.age || !formData.grade || !formData.username || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure the passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    // Create or update child data
    if (editingChild) {
      // Update existing child
      setChildren(prev => prev.map(child => 
        child.id === editingChild.id ? 
          {
            ...child,
            name: formData.name,
            age: parseInt(formData.age),
            grade: formData.grade,
            username: formData.username,
            password: formData.password,
            picture: formData.picture
          } : child
      ));
      
      toast({
        title: "Child updated",
        description: `${formData.name}'s information has been updated.`,
      });
    } else {
      // Add new child
      const newChild: ChildData = {
        id: `child-${Date.now()}`,
        name: formData.name,
        age: parseInt(formData.age),
        grade: formData.grade,
        username: formData.username,
        password: formData.password,
        picture: formData.picture
      };
      
      setChildren(prev => [...prev, newChild]);
      
      toast({
        title: "Child added",
        description: `${formData.name} has been added successfully.`,
      });
    }
    
    // Reset form and state
    setShowAddForm(false);
    setEditingChild(null);
  };

  const handleReturnToDashboard = () => {
    navigate('/parent-dashboard');
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleReturnToDashboard}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-3xl font-bold text-white">Children Management</h1>
                </div>
                <p className="text-white/90 mt-2 ml-10">
                  Manage your children's profiles and accounts
                </p>
              </div>
              <Button 
                onClick={handleAddChild}
                className="bg-amber-600 text-white hover:bg-amber-700 shadow-md font-medium transition-all duration-200 transform hover:scale-105"
              >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Child
            </Button>
          </div>
          
            {/* Decorative elements */}
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute left-1/2 top-1/3 w-8 h-8 bg-white/10 rounded-full"></div>
          </motion.div>
          
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
          {showAddForm ? (
              <motion.div variants={item}>
                <Card className="border-none shadow-md overflow-hidden">
                  <CardHeader className="pb-2 bg-gradient-to-r from-amber-300 to-amber-400">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      {editingChild ? <UserCog className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                      {editingChild ? 'Edit Child Profile' : 'Add New Child'}
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      {editingChild ? 'Update child information' : 'Enter child information to create a new profile'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Child's Name *</Label>
                            <div className="mt-1 relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                                placeholder="Enter child's full name"
                                className="pl-10"
                        required
                      />
                            </div>
                    </div>
                    
                          <div>
                            <Label htmlFor="age" className="text-sm font-medium text-gray-700">Child's Age *</Label>
                            <div className="mt-1 relative">
                              <Cake className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="1"
                        max="18"
                        placeholder="Enter child's age"
                                className="pl-10"
                        required
                      />
                            </div>
                    </div>
                    
                          <div>
                            <Label htmlFor="grade" className="text-sm font-medium text-gray-700">Child's Grade *</Label>
                            <div className="mt-1 relative">
                              <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="grade"
                        name="grade"
                                className="w-full border rounded-md shadow-sm py-2 pl-10 pr-3 focus:ring-amber-500 focus:border-amber-500"
                        value={formData.grade}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Grade</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={`Grade ${i + 1}`}>
                            Grade {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                          </div>
                    </div>
                    
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="username" className="text-sm font-medium text-gray-700">Child's Username *</Label>
                            <div className="mt-1 relative">
                              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                                placeholder="Create a username"
                                className="pl-10"
                        required
                      />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-1">This will be used for login</p>
                    </div>
                    
                          <div>
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Child's Password *</Label>
                            <div className="mt-1 relative">
                              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                                placeholder="Create a password"
                                className="pl-10"
                        required
                      />
                            </div>
                    </div>
                    
                          <div>
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Re-enter Password *</Label>
                            <div className="mt-1 relative">
                              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                                className="pl-10"
                        required
                      />
                            </div>
                          </div>
                    </div>
                  </div>
                  
                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowAddForm(false)}
                          className="border-amber-200 text-amber-600 hover:bg-amber-50"
                        >
                      Cancel
                    </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                        >
                      {editingChild ? 'Update Child' : 'Add Child'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
              </motion.div>
          ) : children.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-white rounded-xl shadow-sm"
              >
                <div className="bg-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-amber-500" />
                </div>
                <h2 className="text-xl font-medium mb-2 text-gray-800">No Children Added Yet</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Add your first child to manage their tasks and activities in the Owlet learning platform
                </p>
                <Button 
                  onClick={handleAddChild} 
                  className="bg-amber-600 text-white hover:bg-amber-700 shadow-md font-medium transition-all duration-200 transform hover:scale-105"
                >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Child
              </Button>
              </motion.div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {children.map((child) => (
                  <motion.div 
                    key={child.id} 
                    variants={item}
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Card className="border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4">
                        <div className="flex justify-between">
                          <Avatar className="h-16 w-16 border-2 border-white">
                            <AvatarFallback className="bg-white text-amber-600 text-xl">
                          {child.name.substring(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex space-x-2">
                        <Button
                              variant="ghost"
                          size="icon"
                          onClick={() => handleEditChild(child)}
                              className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-bold text-lg text-owl-slate-dark">{child.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-500 hover:bg-amber-200">
                            {child.grade}
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                            {child.age} years
                          </Badge>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                          <div className="flex justify-between items-center mb-2">
                            <span className="flex items-center gap-2">
                              <UserCheck className="h-3.5 w-3.5 text-gray-400" />
                              Username:
                            </span>
                            <span className="font-medium text-gray-700">{child.username}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <KeyRound className="h-3.5 w-3.5 text-gray-400" />
                              Password:
                            </span>
                            <span className="font-medium text-gray-700">••••••••</span>
                          </div>
                        </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-owl-slate">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          © {new Date().getFullYear()} Guardian Owlet. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
};

export default ChildManagement;
