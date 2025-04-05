export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      child_submissions: {
        Row: {
          answer_text: string | null
          child_id: number
          file_path: string | null
          id: number
          resource_id: number
          submission_type: Database["public"]["Enums"]["submission_type"]
          submitted_at: string
        }
        Insert: {
          answer_text?: string | null
          child_id: number
          file_path?: string | null
          id?: number
          resource_id: number
          submission_type: Database["public"]["Enums"]["submission_type"]
          submitted_at?: string
        }
        Update: {
          answer_text?: string | null
          child_id?: number
          file_path?: string | null
          id?: number
          resource_id?: number
          submission_type?: Database["public"]["Enums"]["submission_type"]
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_submissions_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculums: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      levels: {
        Row: {
          created_at: string
          curriculum_id: number
          id: number
          level_type: Database["public"]["Enums"]["level_type"]
          level_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          curriculum_id: number
          id?: number
          level_type: Database["public"]["Enums"]["level_type"]
          level_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          curriculum_id?: number
          id?: number
          level_type?: Database["public"]["Enums"]["level_type"]
          level_value?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "levels_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curriculums"
            referencedColumns: ["id"]
          },
        ]
      }
      media_files: {
        Row: {
          created_at: string
          file_path: string
          file_type: Database["public"]["Enums"]["file_type"]
          id: number
          resource_id: number
        }
        Insert: {
          created_at?: string
          file_path: string
          file_type: Database["public"]["Enums"]["file_type"]
          id?: number
          resource_id: number
        }
        Update: {
          created_at?: string
          file_path?: string
          file_type?: Database["public"]["Enums"]["file_type"]
          id?: number
          resource_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "media_files_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          childid: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          parentid: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          childid?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          parentid?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          childid?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          parentid?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      question_attachments: {
        Row: {
          created_at: string
          file_name: string | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          question_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          question_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          question_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_attachments_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_uploads: {
        Row: {
          content_type: string
          created_at: string
          file_name: string
          id: string
          question_count: number | null
          uploaded_by: string | null
        }
        Insert: {
          content_type: string
          created_at?: string
          file_name: string
          id?: string
          question_count?: number | null
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string
          file_name?: string
          id?: string
          question_count?: number | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          answers: Json | null
          audio_url: string | null
          correct_answer: string | null
          created_at: string
          creator_role: string | null
          curriculum_id: string | null
          difficulty: string | null
          explanation: string | null
          id: string
          image_url: string | null
          question_text: string
          question_type: string
          subject: string | null
          tags: string[] | null
          topic: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          answers?: Json | null
          audio_url?: string | null
          correct_answer?: string | null
          created_at?: string
          creator_role?: string | null
          curriculum_id?: string | null
          difficulty?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          question_text: string
          question_type: string
          subject?: string | null
          tags?: string[] | null
          topic?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          answers?: Json | null
          audio_url?: string | null
          correct_answer?: string | null
          created_at?: string
          creator_role?: string | null
          curriculum_id?: string | null
          difficulty?: string | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          question_text?: string
          question_type?: string
          subject?: string | null
          tags?: string[] | null
          topic?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      related_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: number
          options: Json | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          resource_id: number
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: number
          options?: Json | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          resource_id: number
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: number
          options?: Json | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          resource_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "related_questions_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          content: string
          correct_answer: string | null
          created_at: string
          id: number
          options: Json | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          subject_id: number
          updated_at: string
        }
        Insert: {
          content: string
          correct_answer?: string | null
          created_at?: string
          id?: number
          options?: Json | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          subject_id: number
          updated_at?: string
        }
        Update: {
          content?: string
          correct_answer?: string | null
          created_at?: string
          id?: number
          options?: Json | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          subject_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string
          id: number
          level_id: number
          subject_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          level_id: number
          subject_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          level_id?: number
          subject_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_by_id: string | null
          assigned_by_role: string | null
          child_id: string | null
          created_at: string
          curriculum: string | null
          due_date: string | null
          grade: string | null
          id: string
          name: string
          questions: string[] | null
          results: Json | null
          status: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          assigned_by_id?: string | null
          assigned_by_role?: string | null
          child_id?: string | null
          created_at?: string
          curriculum?: string | null
          due_date?: string | null
          grade?: string | null
          id?: string
          name: string
          questions?: string[] | null
          results?: Json | null
          status?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          assigned_by_id?: string | null
          assigned_by_role?: string | null
          child_id?: string | null
          created_at?: string
          curriculum?: string | null
          due_date?: string | null
          grade?: string | null
          id?: string
          name?: string
          questions?: string[] | null
          results?: Json | null
          status?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_or_create_curriculum: {
        Args: {
          curriculum_name: string
        }
        Returns: number
      }
      find_or_create_level: {
        Args: {
          p_curriculum_id: number
          p_level_type: Database["public"]["Enums"]["level_type"]
          p_level_value: string
        }
        Returns: number
      }
      find_or_create_subject: {
        Args: {
          p_level_id: number
          p_subject_name: string
        }
        Returns: number
      }
      get_all_questions: {
        Args: Record<PropertyKey, never>
        Returns: {
          answers: Json | null
          audio_url: string | null
          correct_answer: string | null
          created_at: string
          creator_role: string | null
          curriculum_id: string | null
          difficulty: string | null
          explanation: string | null
          id: string
          image_url: string | null
          question_text: string
          question_type: string
          subject: string | null
          tags: string[] | null
          topic: string | null
          updated_at: string
          video_url: string | null
        }[]
      }
      get_profile_by_id: {
        Args: {
          user_id: string
        }
        Returns: {
          avatar: string | null
          childid: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          parentid: string | null
          role: string | null
          updated_at: string
        }[]
      }
      get_questions_by_ids: {
        Args: {
          p_question_ids: string[]
        }
        Returns: {
          answers: Json | null
          audio_url: string | null
          correct_answer: string | null
          created_at: string
          creator_role: string | null
          curriculum_id: string | null
          difficulty: string | null
          explanation: string | null
          id: string
          image_url: string | null
          question_text: string
          question_type: string
          subject: string | null
          tags: string[] | null
          topic: string | null
          updated_at: string
          video_url: string | null
        }[]
      }
      get_task_by_id: {
        Args: {
          p_task_id: string
        }
        Returns: {
          assigned_by_id: string | null
          assigned_by_role: string | null
          child_id: string | null
          created_at: string
          curriculum: string | null
          due_date: string | null
          grade: string | null
          id: string
          name: string
          questions: string[] | null
          results: Json | null
          status: string | null
          subject: string | null
          updated_at: string
        }[]
      }
    }
    Enums: {
      file_type: "audio"
      level_type: "Grade" | "Age"
      question_type: "MCQ" | "YesNo" | "TrueFalse" | "FillInBlank"
      resource_type:
        | "MCQ"
        | "YesNo"
        | "TrueFalse"
        | "FillInBlank"
        | "QuestionInText"
        | "TextForReading"
        | "AudioForListening"
        | "TextForStory"
        | "ArticleURL"
        | "VideoURL"
      submission_type: "image" | "audio" | "text"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
