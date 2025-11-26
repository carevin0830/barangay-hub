export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          date: string
          description: string | null
          expected_participants: number | null
          id: string
          location: string
          name: string
          status: string
          time: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          expected_participants?: number | null
          id?: string
          location: string
          name: string
          status?: string
          time: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          expected_participants?: number | null
          id?: string
          location?: string
          name?: string
          status?: string
          time?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      barangay_settings: {
        Row: {
          address: string | null
          barangay_name: string
          contact_number: string | null
          created_at: string | null
          email: string | null
          id: string
          municipality: string
          province: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          barangay_name: string
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          municipality: string
          province: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          barangay_name?: string
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          municipality?: string
          province?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          amount_paid: number | null
          business_type: string | null
          certificate_no: string
          certificate_type: string
          control_number: string | null
          created_at: string
          id: string
          issued_date: string
          purpose: string
          resident_age: number | null
          resident_id: string | null
          resident_name: string
          status: string
          updated_at: string
          valid_until: string | null
          verified_by_kagawad1: string | null
          verified_by_kagawad2: string | null
        }
        Insert: {
          amount_paid?: number | null
          business_type?: string | null
          certificate_no: string
          certificate_type: string
          control_number?: string | null
          created_at?: string
          id?: string
          issued_date?: string
          purpose: string
          resident_age?: number | null
          resident_id?: string | null
          resident_name: string
          status?: string
          updated_at?: string
          valid_until?: string | null
          verified_by_kagawad1?: string | null
          verified_by_kagawad2?: string | null
        }
        Update: {
          amount_paid?: number | null
          business_type?: string | null
          certificate_no?: string
          certificate_type?: string
          control_number?: string | null
          created_at?: string
          id?: string
          issued_date?: string
          purpose?: string
          resident_age?: number | null
          resident_id?: string | null
          resident_name?: string
          status?: string
          updated_at?: string
          valid_until?: string | null
          verified_by_kagawad1?: string | null
          verified_by_kagawad2?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string | null
          has_electricity: boolean | null
          has_water: boolean | null
          house_number: string
          id: string
          latitude: number | null
          longitude: number | null
          purok: string | null
          street_address: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          has_electricity?: boolean | null
          has_water?: boolean | null
          house_number: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          purok?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          has_electricity?: boolean | null
          has_water?: boolean | null
          house_number?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          purok?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      officials: {
        Row: {
          created_at: string
          id: string
          position: string
          resident_id: string
          status: string
          term_end: string | null
          term_start: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          position: string
          resident_id: string
          status?: string
          term_end?: string | null
          term_start: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: string
          resident_id?: string
          status?: string
          term_end?: string | null
          term_start?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "officials_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      ordinances: {
        Row: {
          created_at: string
          date_enacted: string
          description: string
          id: string
          ordinance_number: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_enacted: string
          description: string
          id?: string
          ordinance_number: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_enacted?: string
          description?: string
          id?: string
          ordinance_number?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          location: string
          priority: string
          reported_by: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          description: string
          id?: string
          location: string
          priority: string
          reported_by: string
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          location?: string
          priority?: string
          reported_by?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      residents: {
        Row: {
          age: number
          created_at: string
          full_name: string
          gender: string
          household_id: string | null
          id: string
          purok: string
          special_status: string | null
          status: string
          updated_at: string
        }
        Insert: {
          age: number
          created_at?: string
          full_name: string
          gender: string
          household_id?: string | null
          id?: string
          purok: string
          special_status?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          age?: number
          created_at?: string
          full_name?: string
          gender?: string
          household_id?: string | null
          id?: string
          purok?: string
          special_status?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "residents_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "read_only"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "read_only"],
    },
  },
} as const
