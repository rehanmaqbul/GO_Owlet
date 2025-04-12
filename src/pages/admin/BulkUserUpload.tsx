import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth';
import { logActivity } from '@/services/admin/adminService';
import Papa from 'papaparse';
import { Input } from '@/components/ui/input';

const BulkUserUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: { row: number; email: string; error: string }[];
  } | null>(null);

  // CSV template headers
  const csvTemplate = 'name,email,role,status\n';
  const sampleData = [
    'John Doe,john.doe@example.com,teacher,active',
    'Jane Smith,jane.smith@example.com,parent,active',
    'Admin User,admin@example.com,admin,active',
    'Student Name,student@example.com,child,pending'
  ].join('\n');

  const downloadTemplate = () => {
    const csvContent = csvTemplate + sampleData;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a CSV file to upload',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');

        // Validate headers
        const requiredHeaders = ['name', 'email', 'role', 'status'];
        const hasAllHeaders = requiredHeaders.every(header => 
          headers.map(h => h.trim().toLowerCase()).includes(header)
        );

        if (!hasAllHeaders) {
          throw new Error('CSV file is missing required columns. Please use the template provided.');
        }

        // Process each line (skip header)
        const users = lines.slice(1)
          .filter(line => line.trim()) // Skip empty lines
          .map(line => {
            const values = line.split(',');
            return {
              name: values[0].trim(),
              email: values[1].trim(),
              role: values[2].trim().toLowerCase(),
              status: values[3]?.trim().toLowerCase() || 'pending'
            };
          });

        // Validate each user
        users.forEach((user, index) => {
          if (!user.name || !user.email || !user.role) {
            throw new Error(`Row ${index + 2}: Missing required fields`);
          }
          if (!['admin', 'teacher', 'parent', 'child'].includes(user.role)) {
            throw new Error(`Row ${index + 2}: Invalid role "${user.role}"`);
          }
          if (!['active', 'inactive', 'pending'].includes(user.status)) {
            user.status = 'pending'; // Default to pending if invalid
          }
        });

        // Insert users in batches
        const batchSize = 50;
        for (let i = 0; i < users.length; i += batchSize) {
          const batch = users.slice(i, i + batchSize);
          const { error } = await supabase
            .from('users')
            .insert(batch);

          if (error) throw error;
        }

        toast({
          title: 'Success',
          description: `Successfully uploaded ${users.length} users`,
        });

        navigate('/admin/users');
      };

      reader.readAsText(file);
    } catch (error: any) {
      console.error('Error uploading users:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload users',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/admin/users')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Bulk User Upload</h1>
      </div>

      <Card className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Download the CSV template below</li>
              <li>Fill in the user details following the template format</li>
              <li>Upload the completed CSV file</li>
              <li>Required columns: name, email, role, status</li>
              <li>Valid roles: admin, teacher, parent, child</li>
              <li>Valid status: active, inactive, pending (defaults to pending)</li>
            </ol>
          </div>

          <div>
            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Upload Users</h2>
            <div className="space-y-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full"
              />
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Users
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BulkUserUpload; 