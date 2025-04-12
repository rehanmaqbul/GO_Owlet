import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export type BulkUploadType = 'grades' | 'subjects' | 'tasks' | 'submissions' | 'activities';

interface BulkUploadResult {
  success: boolean;
  message: string;
  errors?: any[];
  inserted?: number;
}

export const processCsvFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Filter out any rows where all values are empty or just whitespace
        const filteredData = results.data.filter((row: any) => 
          Object.values(row).some(value => 
            value && value.toString().trim().length > 0
          )
        );
        resolve(filteredData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const bulkUpload = async (
  type: BulkUploadType,
  data: any[],
  options?: { batchSize?: number }
): Promise<BulkUploadResult> => {
  const batchSize = options?.batchSize || 100;
  const errors: any[] = [];
  let inserted = 0;

  try {
    // Process data in batches
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      switch (type) {
        case 'grades':
          const { error: gradesError } = await supabase
            .from('grades')
            .insert(batch);
          if (gradesError) errors.push(gradesError);
          break;

        case 'subjects':
          const { error: subjectsError } = await supabase
            .from('subjects')
            .insert(batch);
          if (subjectsError) errors.push(subjectsError);
          break;

        case 'tasks':
          const { error: tasksError } = await supabase
            .from('tasks')
            .insert(batch);
          if (tasksError) errors.push(tasksError);
          break;

        case 'submissions':
          const { error: submissionsError } = await supabase
            .from('task_submissions')
            .insert(batch);
          if (submissionsError) errors.push(submissionsError);
          break;

        case 'activities':
          const { error: activitiesError } = await supabase
            .from('activity_logs')
            .insert(batch);
          if (activitiesError) errors.push(activitiesError);
          break;
      }

      inserted += batch.length;
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 
        ? `Successfully inserted ${inserted} records`
        : 'Some records failed to insert',
      errors: errors.length > 0 ? errors : undefined,
      inserted
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to process bulk upload',
      errors: [error]
    };
  }
};

// Helper function to validate CSV data before upload
export const validateCsvData = (type: BulkUploadType, data: any[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  switch (type) {
    case 'grades':
      data.forEach((row, index) => {
        // Skip empty rows
        if (!Object.values(row).some(value => value && value.toString().trim().length > 0)) {
          return;
        }
        if (!row.name || !row.name.toString().trim()) {
          errors.push(`Row ${index + 1}: Missing grade name`);
        }
        if (!row.academic_year || !row.academic_year.toString().trim()) {
          errors.push(`Row ${index + 1}: Missing academic year`);
        }
      });
      break;

    case 'subjects':
      data.forEach((row, index) => {
        if (!row.name) errors.push(`Row ${index + 1}: Missing subject name`);
        if (!row.grade_id) errors.push(`Row ${index + 1}: Missing grade ID`);
      });
      break;

    case 'tasks':
      data.forEach((row, index) => {
        if (!row.name) errors.push(`Row ${index + 1}: Missing task name`);
        if (!row.subject_id) errors.push(`Row ${index + 1}: Missing subject ID`);
        if (!row.type) errors.push(`Row ${index + 1}: Missing task type`);
        if (!row.deadline) errors.push(`Row ${index + 1}: Missing deadline`);
      });
      break;

    // Add more validation cases as needed
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Function to get grades for subject template
export const getGradesForTemplate = async () => {
  const { data: grades, error } = await supabase
    .from('grades')
    .select('id, name')
    .order('name');
    
  if (error) throw error;
  return grades;
};

// Function to create subjects template with real grade IDs
export const createSubjectsTemplate = async () => {
  const grades = await getGradesForTemplate();
  if (!grades || grades.length === 0) {
    throw new Error('No grades found. Please upload grades first.');
  }

  // Create template with real grade IDs
  const headers = 'name,grade_id,description';
  const rows = grades.map(grade => 
    `Mathematics for ${grade.name},${grade.id},Mathematics curriculum for ${grade.name}`
  ).join('\n');

  return `${headers}\n${rows}`;
};

// Modified getCsvTemplate to handle subjects specially
export const getCsvTemplate = async (type: BulkUploadType): Promise<string> => {
  switch (type) {
    case 'subjects':
      return await createSubjectsTemplate();
    
    case 'grades':
      return `name,description,academic_year
Grade 1,First grade of primary education,2023-2024
Grade 2,Second grade of primary education,2023-2024
Grade 3,Third grade of primary education,2023-2024`;
    
    case 'tasks':
      return `name,subject_id,type,chapter,lesson,description,deadline,total_marks
Math Quiz 1,subject_uuid_here,quiz,Chapter 1,Lesson 1,Basic arithmetic operations quiz,2024-04-01T14:00:00Z,100
Science Project,subject_uuid_here,project,Chapter 2,Lesson 3,Create a solar system model,2024-04-15T23:59:59Z,150
English Essay,subject_uuid_here,assignment,Chapter 3,Lesson 2,Write an essay on your favorite book,2024-04-10T16:30:00Z,50`;
    
    case 'submissions':
      return `task_id,student_id,status,submission_date,marks_obtained
task_uuid_here,student_uuid_here,submitted,2024-03-15T10:30:00Z,85
task_uuid_here,student_uuid_here,late,2024-03-16T14:20:00Z,75
task_uuid_here,student_uuid_here,pending,2024-03-14T00:00:00Z,`;
    
    case 'activities':
      return `user_id,action_type,entity_type,description
user_uuid_here,create,task,Created new Math Quiz
user_uuid_here,submit,submission,Submitted Science Project
user_uuid_here,grade,submission,Graded English Essay`;
  }
};

// Modified download template function to handle async
export const downloadCsvTemplate = async (type: BulkUploadType) => {
  const template = await getCsvTemplate(type);
  const blob = new Blob([template], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `${type}_template.csv`);
  a.click();
  window.URL.revokeObjectURL(url);
}; 