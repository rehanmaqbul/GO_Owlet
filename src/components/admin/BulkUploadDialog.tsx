import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload } from 'lucide-react';
import { BulkUploadType, bulkUpload, downloadCsvTemplate, processCsvFile, validateCsvData } from '@/lib/supabase/bulkUpload';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkUploadDialog({ open, onOpenChange }: BulkUploadDialogProps) {
  const [uploadType, setUploadType] = useState<BulkUploadType>('grades');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
      setValidationErrors([]);
    }
  };

  const downloadTemplate = async () => {
    try {
      await downloadCsvTemplate(uploadType);
    } catch (error) {
      console.error('Error downloading template:', error);
      // Add toast notification for error
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to download template'
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);
    setValidationErrors([]);

    try {
      // Process CSV file
      const data = await processCsvFile(file);

      // Validate data
      const validation = validateCsvData(uploadType, data);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setIsUploading(false);
        return;
      }

      // Upload data
      const result = await bulkUpload(uploadType, data);
      setUploadResult({
        success: result.success,
        message: result.message
      });

      if (result.success) {
        setFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Failed to process file'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Data</DialogTitle>
          <DialogDescription>
            Upload data in bulk using CSV files. Download the template for the correct format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Data Type</Label>
            <Select
              value={uploadType}
              onValueChange={(value) => {
                setUploadType(value as BulkUploadType);
                setFile(null);
                setUploadResult(null);
                setValidationErrors([]);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grades">Grades</SelectItem>
                <SelectItem value="subjects">Subjects</SelectItem>
                <SelectItem value="tasks">Tasks</SelectItem>
                <SelectItem value="submissions">Submissions</SelectItem>
                <SelectItem value="activities">Activities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>CSV File</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={downloadTemplate}
                title="Download Template"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {uploadResult && (
            <Alert variant={uploadResult.success ? 'default' : 'destructive'}>
              <AlertDescription>{uploadResult.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              {isUploading ? (
                'Uploading...'
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 