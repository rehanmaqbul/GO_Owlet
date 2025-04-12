export interface Database {
  public: {
    Tables: {
      grades: {
        Row: {
          id: string
          name: string
          description?: string
          academic_year: string
          created_at?: string
        }
        Insert: {
          name: string
          description?: string
          academic_year: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          grade_id: string
          description?: string
          created_at?: string
        }
        Insert: {
          name: string
          grade_id: string
          description?: string
        }
      }
      tasks: {
        Row: {
          id: string
          name: string
          subject_id: string
          type: string
          chapter?: string
          lesson?: string
          description?: string
          deadline: string
          total_marks: number
          created_at?: string
        }
        Insert: {
          name: string
          subject_id: string
          type: string
          chapter?: string
          lesson?: string
          description?: string
          deadline: string
          total_marks: number
        }
      }
      task_submissions: {
        Row: {
          id: string
          task_id: string
          student_id: string
          status: string
          submission_date: string
          marks_obtained?: number
          created_at?: string
        }
        Insert: {
          task_id: string
          student_id: string
          status: string
          submission_date: string
          marks_obtained?: number
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          action_type: string
          entity_type: string
          description: string
          created_at?: string
        }
        Insert: {
          user_id: string
          action_type: string
          entity_type: string
          description: string
        }
      }
    }
  }
} 