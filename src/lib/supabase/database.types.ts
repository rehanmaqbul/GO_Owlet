export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action_type: string
          description: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action_type: string
          description: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action_type?: string
          description?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      analytics: {
        Row: {
          id: string
          date: string
          active_users: number
          page_views: number
          new_users: number
          session_count: number
          avg_session_duration: number
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          active_users?: number
          page_views?: number
          new_users?: number
          session_count?: number
          avg_session_duration?: number
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          active_users?: number
          page_views?: number
          new_users?: number
          session_count?: number
          avg_session_duration?: number
          created_at?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          format: string
          subject_id: string | null
          grade: string | null
          status: string
          content_url: string | null
          thumbnail_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          views_count: number
          rating: number
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: string
          format: string
          subject_id?: string | null
          grade?: string | null
          status?: string
          content_url?: string | null
          thumbnail_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          views_count?: number
          rating?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          format?: string
          subject_id?: string | null
          grade?: string | null
          status?: string
          content_url?: string | null
          thumbnail_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          views_count?: number
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          }
        ]
      }
      content_ratings: {
        Row: {
          id: string
          content_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          content_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_ratings_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      school_users: {
        Row: {
          id: string
          school_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      schools: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          postal_code: string
          country: string
          phone: string | null
          email: string | null
          type: string
          status: string
          subscription: string
          students_count: number
          teachers_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state: string
          postal_code: string
          country?: string
          phone?: string | null
          email?: string | null
          type: string
          status?: string
          subscription?: string
          students_count?: number
          teachers_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string | null
          email?: string | null
          type?: string
          status?: string
          subscription?: string
          students_count?: number
          teachers_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          id: string
          level: string
          message: string
          source: string
          user_id: string | null
          details: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          level: string
          message: string
          source: string
          user_id?: string | null
          details?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          level?: string
          message?: string
          source?: string
          user_id?: string | null
          details?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      task_submissions: {
        Row: {
          id: string
          task_id: string
          student_id: string
          status: string
          submission_date: string | null
          score: number | null
          feedback: string | null
          submission_url: string | null
          graded_by: string | null
          graded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          student_id: string
          status?: string
          submission_date?: string | null
          score?: number | null
          feedback?: string | null
          submission_url?: string | null
          graded_by?: string | null
          graded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          student_id?: string
          status?: string
          submission_date?: string | null
          score?: number | null
          feedback?: string | null
          submission_url?: string | null
          graded_by?: string | null
          graded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          name: string
          description: string | null
          subject_id: string | null
          content_id: string | null
          type: string
          status: string
          assigned_date: string
          deadline: string | null
          created_by: string | null
          grade: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          subject_id?: string | null
          content_id?: string | null
          type: string
          status?: string
          assigned_date?: string
          deadline?: string | null
          created_by?: string | null
          grade?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          subject_id?: string | null
          content_id?: string | null
          type?: string
          status?: string
          assigned_date?: string
          deadline?: string | null
          created_by?: string | null
          grade?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          status: string
          password_hash: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          profile_image_url: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: string
          status?: string
          password_hash?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          profile_image_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          status?: string
          password_hash?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          profile_image_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'] 