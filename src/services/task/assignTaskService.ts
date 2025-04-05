
import { supabase } from '@/integrations/supabase/client';
import { TaskType, Curriculum } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface AssignTaskProps {
  taskName: string;
  childId: string;
  userId: string;
  subject: string;
  curriculum: Curriculum | string;
  grade?: string;
  questions: string[];
  taskType: TaskType;
  dueDate?: Date;
}

export async function assignTask({
  taskName,
  childId,
  userId,
  subject,
  curriculum,
  grade,
  questions,
  taskType,
  dueDate
}: AssignTaskProps) {
  try {
    console.log('Assigning task with data:', {
      name: taskName,
      child_id: childId,
      assigned_by_id: userId,
      assigned_by_role: 'parent',
      subject,
      curriculum,
      grade,
      questions,
      task_type: taskType,
      due_date: dueDate ? dueDate.toISOString() : null
    });
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        name: taskName,
        child_id: childId,
        assigned_by_id: userId,
        assigned_by_role: 'parent',
        subject,
        curriculum,
        grade,
        questions,
        task_type: taskType,
        due_date: dueDate ? dueDate.toISOString() : null,
        status: 'pending'
      })
      .select();
      
    if (error) {
      console.error('Error assigning task:', error);
      throw error;
    }
    
    console.log('Task assigned successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in assignTask:', error);
    toast({
      title: "Error assigning task",
      description: "There was a problem assigning the task. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

export async function getTasksByChildId(childId: string) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getTasksByChildId:', error);
    throw error;
  }
}

export async function getTaskById(taskId: string) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
      
    if (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getTaskById:', error);
    throw error;
  }
}

export async function updateTaskStatus(taskId: string, status: string, results?: any) {
  try {
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (results) {
      updates.results = results;
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select();
      
    if (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateTaskStatus:', error);
    throw error;
  }
}
