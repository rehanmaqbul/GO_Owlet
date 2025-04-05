
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Upload } from 'lucide-react';

interface UploadStudentsFormProps {
  onUpload: (file: File) => void;
  isSubmitting: boolean;
}

const UploadStudentsForm = ({ onUpload, isSubmitting }: UploadStudentsFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="border rounded-lg shadow-sm p-5 bg-gray-50/80">
        <h4 className="text-sm font-medium mb-3 text-owl-slate-dark">Excel File Format</h4>
        <p className="text-sm text-owl-slate mb-3">Your Excel file should have the following columns:</p>
        <div className="overflow-x-auto bg-white rounded-md border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2.5 px-4 border-b text-left font-medium text-owl-slate-dark">First Name</th>
                <th className="py-2.5 px-4 border-b text-left font-medium text-owl-slate-dark">Last Name</th>
                <th className="py-2.5 px-4 border-b text-left font-medium text-owl-slate-dark">Student ID</th>
                <th className="py-2.5 px-4 border-b text-left font-medium text-owl-slate-dark">Email</th>
                <th className="py-2.5 px-4 border-b text-left font-medium text-owl-slate-dark">Parent Email</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2.5 px-4 text-owl-slate-dark">John</td>
                <td className="py-2.5 px-4 text-owl-slate-dark">Doe</td>
                <td className="py-2.5 px-4 text-owl-slate-dark">S12345</td>
                <td className="py-2.5 px-4 text-owl-slate-dark">john@example.com</td>
                <td className="py-2.5 px-4 text-owl-slate-dark">parent@example.com</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-owl-slate-dark">Jane</td>
                <td className="py-2.5 px-4 text-owl-slate-dark">Smith</td>
                <td className="py-2.5 px-4 text-owl-slate-dark">S12346</td>
                <td className="py-2.5 px-4 text-owl-slate-dark">jane@example.com</td>
                <td className="py-2.5 px-4 text-owl-slate-dark">parent2@example.com</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm">
          <p className="text-owl-slate"><span className="font-medium text-owl-blue">Note:</span> Make sure all columns are properly formatted and student IDs are unique.</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <h4 className="font-medium text-owl-slate-dark mb-3">Upload Your File</h4>
        
        <div className="flex flex-col items-center justify-center w-full">
          <label 
            htmlFor="dropzone-file" 
            className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-white/60 hover:bg-blue-50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center py-6 px-4">
              {!selectedFile ? (
                <>
                  <Upload className="w-10 h-10 mb-3 text-blue-400" />
                  <p className="mb-2 text-base text-owl-slate-dark font-medium">
                    <span className="font-semibold text-blue-500">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-owl-slate">Excel files only (.xlsx, .xls)</p>
                  <p className="text-xs text-owl-slate mt-1">Max file size: 10MB</p>
                </>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-base font-medium text-green-600 mb-1">File selected</p>
                  <p className="text-sm text-owl-slate-dark">{selectedFile.name}</p>
                  <p className="text-xs text-owl-slate mt-2">
                    Click here to choose a different file
                  </p>
                </div>
              )}
            </div>
            <input 
              id="dropzone-file" 
              type="file" 
              className="hidden" 
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      
      <Button 
        onClick={handleUpload} 
        className="w-full h-12 bg-gradient-to-r from-owl-slate to-owl-slate/80 hover:from-owl-slate/90 hover:to-owl-slate/70 transition-all" 
        disabled={isSubmitting || !selectedFile}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center w-full">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading Students...
          </div>
        ) : (
          <>
            <Upload className="h-5 w-5 mr-2" />
            Upload Student List
          </>
        )}
      </Button>
    </div>
  );
};

export default UploadStudentsForm;
