
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GraduationCap } from 'lucide-react';
import CreateClassForm from './CreateClassForm';
import { Curriculum } from '@/lib/types';

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: { className: string; totalStudents: string; curriculum: Curriculum }) => void;
  isSubmitting: boolean;
}

const CreateClassDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting 
}: CreateClassDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md border border-white/50 shadow-lg">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center text-xl text-owl-slate-dark">
            <GraduationCap className="h-5 w-5 mr-2 text-owl-blue" />
            Create New Class
          </DialogTitle>
          <DialogDescription className="text-owl-slate">
            Enter the details for your new class
          </DialogDescription>
        </DialogHeader>
        
        <CreateClassForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassDialog;
