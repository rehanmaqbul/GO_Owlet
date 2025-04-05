
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { Curriculum } from '@/lib/types';
import { curriculums } from '@/data/curriculum-data';

interface CreateClassFormProps {
  onSubmit: (formData: { className: string; totalStudents: string; curriculum: Curriculum }) => void;
  isSubmitting: boolean;
}

const CreateClassForm = ({ onSubmit, isSubmitting }: CreateClassFormProps) => {
  const [className, setClassName] = useState('');
  const [totalStudents, setTotalStudents] = useState('');
  const [curriculum, setCurriculum] = useState<Curriculum>('american');
  const [formErrors, setFormErrors] = useState({ className: false });
  
  const validateForm = () => {
    const errors = {
      className: !className.trim()
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit({
      className,
      totalStudents,
      curriculum
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      <div className="space-y-2">
        <Label htmlFor="className" className="text-owl-slate-dark font-medium">
          Class Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="className"
          value={className}
          onChange={(e) => {
            setClassName(e.target.value);
            if (e.target.value.trim()) setFormErrors({...formErrors, className: false});
          }}
          placeholder="e.g., Grade 5 Science"
          className={`h-12 border ${formErrors.className ? 'border-red-400 focus-visible:ring-red-400' : 'border-gray-200'}`}
        />
        {formErrors.className && (
          <p className="text-red-500 text-sm mt-1">Class name is required</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="totalStudents" className="text-owl-slate-dark font-medium">
          Total Students
        </Label>
        <Input
          id="totalStudents"
          type="number"
          value={totalStudents}
          onChange={(e) => setTotalStudents(e.target.value)}
          placeholder="e.g., 25"
          className="h-12 border border-gray-200"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="curriculum" className="text-owl-slate-dark font-medium">
          Curriculum <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={curriculum} 
          onValueChange={(value) => setCurriculum(value as Curriculum)}
        >
          <SelectTrigger id="curriculum" className="h-12 border border-gray-200">
            <SelectValue placeholder="Select a curriculum" />
          </SelectTrigger>
          <SelectContent>
            {curriculums.map((curr) => (
              <SelectItem key={curr.id} value={curr.id}>{curr.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full h-12 mt-2 bg-gradient-to-r from-owl-blue to-owl-blue/80 hover:from-owl-blue/90 hover:to-owl-blue/70 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Class...
            </div>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Create Class
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateClassForm;
