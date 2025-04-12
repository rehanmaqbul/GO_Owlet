import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tables } from '@/lib/supabase/database.types';

interface TeacherFormData {
  name: string;
  email: string;
  school_id: string;
  subject_specialization: string[];
  years_of_experience: number;
  education_level: string;
  certifications: string[];
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
  </div>
);

const NewTeacherForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [schools, setSchools] = useState<Tables<'schools'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    school_id: '',
    subject_specialization: [],
    years_of_experience: 0,
    education_level: '',
    certifications: []
  });

  // Education level options
  const educationLevels = [
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Teaching Certificate",
    "Other"
  ];

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: 'Error',
        description: 'Failed to load schools. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.school_id) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      // First create the user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          name: formData.name,
          email: formData.email,
          role: 'teacher',
          status: 'pending'
        })
        .select()
        .single();

      if (userError) throw userError;

      // Then create the teacher record
      const { error: teacherError } = await supabase
        .from('teachers')
        .insert({
          id: userData.id,
          school_id: formData.school_id,
          subject_specialization: formData.subject_specialization,
          years_of_experience: formData.years_of_experience || 0,
          education_level: formData.education_level || null,
          certifications: formData.certifications || []
        });

      if (teacherError) throw teacherError;

      // Create school_users association
      const { error: associationError } = await supabase
        .from('school_users')
        .insert({
          school_id: formData.school_id,
          user_id: userData.id
        });

      if (associationError) throw associationError;

      toast({
        title: 'Success',
        description: 'Teacher added successfully.',
      });

      navigate('/admin/teachers');
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add teacher. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectSpecializationChange = (value: string) => {
    const subjects = value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      subject_specialization: subjects
    }));
  };

  const handleCertificationsChange = (value: string) => {
    const certs = value.split(',').map(c => c.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      certifications: certs
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/admin/teachers')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Teacher</h1>
      </div>

      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter teacher's full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter teacher's email"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="school">School *</Label>
            <Select
              value={formData.school_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, school_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subjects">Subject Specializations (comma-separated)</Label>
            <Input
              id="subjects"
              value={formData.subject_specialization.join(', ')}
              onChange={(e) => handleSubjectSpecializationChange(e.target.value)}
              placeholder="Math, Science, English"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.years_of_experience}
                onChange={(e) => setFormData(prev => ({ ...prev, years_of_experience: parseInt(e.target.value) || 0 }))}
                placeholder="Enter years of experience"
              />
            </div>

            <div>
              <Label htmlFor="education">Education Level</Label>
              <Select
                value={formData.education_level}
                onValueChange={(value) => setFormData(prev => ({ ...prev, education_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="certifications">Certifications (comma-separated)</Label>
            <Input
              id="certifications"
              value={formData.certifications.join(', ')}
              onChange={(e) => handleCertificationsChange(e.target.value)}
              placeholder="Teaching License, Special Education Cert, etc."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/teachers')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Teacher'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default function NewTeacher() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NewTeacherForm />
    </Suspense>
  );
} 