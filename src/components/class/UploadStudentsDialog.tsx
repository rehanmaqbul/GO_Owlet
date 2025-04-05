
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileSpreadsheet } from 'lucide-react';
import UploadStudentsForm from './UploadStudentsForm';

interface UploadStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
  isSubmitting: boolean;
}

const UploadStudentsDialog = ({ 
  open, 
  onOpenChange, 
  onUpload, 
  isSubmitting 
}: UploadStudentsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-white/90 backdrop-blur-md border border-white/50 shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center text-xl text-owl-slate-dark">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-owl-blue" />
            Upload Student List
          </DialogTitle>
          <DialogDescription className="text-owl-slate">
            Upload an Excel file with your student information
          </DialogDescription>
        </DialogHeader>
        
        <UploadStudentsForm
          onUpload={onUpload}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadStudentsDialog;
