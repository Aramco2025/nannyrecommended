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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          sitter_id: string
          specific_date: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          sitter_id: string
          specific_date?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          sitter_id?: string
          specific_date?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "sitters"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          address: string | null
          children_ids: string[]
          created_at: string
          end_at: string
          ended_at: string | null
          escrow_held: boolean
          hourly_rate_aed: number
          hours: number
          id: string
          notes: string | null
          paid_at: string | null
          parent_id: string
          parking: string | null
          payment_method_ref: string | null
          pets: Json
          platform_fee_aed: number
          released_at: string | null
          sitter_id: string
          sitter_payout_aed: number
          start_at: string
          started_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          stripe_session_id: string | null
          subtotal_aed: number
          total_aed: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          children_ids?: string[]
          created_at?: string
          end_at: string
          ended_at?: string | null
          escrow_held?: boolean
          hourly_rate_aed: number
          hours: number
          id?: string
          notes?: string | null
          paid_at?: string | null
          parent_id: string
          parking?: string | null
          payment_method_ref?: string | null
          pets?: Json
          platform_fee_aed: number
          released_at?: string | null
          sitter_id: string
          sitter_payout_aed: number
          start_at: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          subtotal_aed: number
          total_aed: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          children_ids?: string[]
          created_at?: string
          end_at?: string
          ended_at?: string | null
          escrow_held?: boolean
          hourly_rate_aed?: number
          hours?: number
          id?: string
          notes?: string | null
          paid_at?: string | null
          parent_id?: string
          parking?: string | null
          payment_method_ref?: string | null
          pets?: Json
          platform_fee_aed?: number
          released_at?: string | null
          sitter_id?: string
          sitter_payout_aed?: number
          start_at?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_session_id?: string | null
          subtotal_aed?: number
          total_aed?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "sitters"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_out_requests: {
        Row: {
          admin_notes: string | null
          airtime_operator: string | null
          airtime_phone: string | null
          amount_minor_units: number
          bank_account_holder: string | null
          bank_iban: string | null
          completed_at: string | null
          currency: string
          exchange_house: string | null
          id: string
          method: Database["public"]["Enums"]["cash_out_method"]
          pickup_location_id: string | null
          pickup_reference: string | null
          processed_at: string | null
          requested_at: string
          sitter_id: string
          status: Database["public"]["Enums"]["cash_out_status"]
          voucher_provider: string | null
        }
        Insert: {
          admin_notes?: string | null
          airtime_operator?: string | null
          airtime_phone?: string | null
          amount_minor_units: number
          bank_account_holder?: string | null
          bank_iban?: string | null
          completed_at?: string | null
          currency?: string
          exchange_house?: string | null
          id?: string
          method: Database["public"]["Enums"]["cash_out_method"]
          pickup_location_id?: string | null
          pickup_reference?: string | null
          processed_at?: string | null
          requested_at?: string
          sitter_id: string
          status?: Database["public"]["Enums"]["cash_out_status"]
          voucher_provider?: string | null
        }
        Update: {
          admin_notes?: string | null
          airtime_operator?: string | null
          airtime_phone?: string | null
          amount_minor_units?: number
          bank_account_holder?: string | null
          bank_iban?: string | null
          completed_at?: string | null
          currency?: string
          exchange_house?: string | null
          id?: string
          method?: Database["public"]["Enums"]["cash_out_method"]
          pickup_location_id?: string | null
          pickup_reference?: string | null
          processed_at?: string | null
          requested_at?: string
          sitter_id?: string
          status?: Database["public"]["Enums"]["cash_out_status"]
          voucher_provider?: string | null
        }
        Relationships: []
      }
      children: {
        Row: {
          created_at: string
          dob: string | null
          id: string
          name: string
          notes: string | null
          parent_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dob?: string | null
          id?: string
          name: string
          notes?: string | null
          parent_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dob?: string | null
          id?: string
          name?: string
          notes?: string | null
          parent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      favourites: {
        Row: {
          created_at: string
          id: string
          parent_id: string
          sitter_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_id: string
          sitter_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_id?: string
          sitter_id?: string
        }
        Relationships: []
      }
      friend_connections: {
        Row: {
          created_at: string
          id: string
          recipient_id: string
          requester_id: string
          status: Database["public"]["Enums"]["friend_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipient_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["friend_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          recipient_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["friend_status"]
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          created_at: string
          id: string
          job_post_id: string
          message: string | null
          sitter_user_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_post_id: string
          message?: string | null
          sitter_user_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_post_id?: string
          message?: string | null
          sitter_user_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posts: {
        Row: {
          area: string | null
          children_ids: string[]
          created_at: string
          end_at: string
          hourly_rate_aed: number
          id: string
          notes: string | null
          parent_id: string
          parking: string | null
          pets: Json
          start_at: string
          status: Database["public"]["Enums"]["job_status"]
          type: Database["public"]["Enums"]["job_type"]
          updated_at: string
        }
        Insert: {
          area?: string | null
          children_ids?: string[]
          created_at?: string
          end_at: string
          hourly_rate_aed: number
          id?: string
          notes?: string | null
          parent_id: string
          parking?: string | null
          pets?: Json
          start_at: string
          status?: Database["public"]["Enums"]["job_status"]
          type: Database["public"]["Enums"]["job_type"]
          updated_at?: string
        }
        Update: {
          area?: string | null
          children_ids?: string[]
          created_at?: string
          end_at?: string
          hourly_rate_aed?: number
          id?: string
          notes?: string | null
          parent_id?: string
          parking?: string | null
          pets?: Json
          start_at?: string
          status?: Database["public"]["Enums"]["job_status"]
          type?: Database["public"]["Enums"]["job_type"]
          updated_at?: string
        }
        Relationships: []
      }
      loyalty: {
        Row: {
          completed_bookings: number
          parent_id: string
          tier: Database["public"]["Enums"]["loyalty_tier"]
          updated_at: string
        }
        Insert: {
          completed_bookings?: number
          parent_id: string
          tier?: Database["public"]["Enums"]["loyalty_tier"]
          updated_at?: string
        }
        Update: {
          completed_bookings?: number
          parent_id?: string
          tier?: Database["public"]["Enums"]["loyalty_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          booking_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          body: string
          booking_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          body?: string
          booking_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pickup_locations: {
        Row: {
          active: boolean
          address: string
          branch_name: string
          created_at: string
          emirate: string | null
          hours: string | null
          id: string
          latitude: number | null
          longitude: number | null
          provider: string
        }
        Insert: {
          active?: boolean
          address: string
          branch_name: string
          created_at?: string
          emirate?: string | null
          hours?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          provider: string
        }
        Update: {
          active?: boolean
          address?: string
          branch_name?: string
          created_at?: string
          emirate?: string | null
          hours?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          provider?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_role: Database["public"]["Enums"]["app_role"] | null
          address_line: string | null
          avatar_url: string | null
          care_needs: string[]
          created_at: string
          full_name: string | null
          id: string
          onboarding_completed: boolean
          phone: string | null
          phone_verified: boolean
          region: string | null
          updated_at: string
        }
        Insert: {
          active_role?: Database["public"]["Enums"]["app_role"] | null
          address_line?: string | null
          avatar_url?: string | null
          care_needs?: string[]
          created_at?: string
          full_name?: string | null
          id: string
          onboarding_completed?: boolean
          phone?: string | null
          phone_verified?: boolean
          region?: string | null
          updated_at?: string
        }
        Update: {
          active_role?: Database["public"]["Enums"]["app_role"] | null
          address_line?: string | null
          avatar_url?: string | null
          care_needs?: string[]
          created_at?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          phone?: string | null
          phone_verified?: boolean
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          parent_id: string
          rating: number
          sitter_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          parent_id: string
          rating: number
          sitter_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          parent_id?: string
          rating?: number
          sitter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "sitters"
            referencedColumns: ["id"]
          },
        ]
      }
      sitter_applications: {
        Row: {
          bio: string | null
          created_at: string
          eligibility: Json
          experience: Json
          id: string
          id_doc_url: string | null
          qualifications: Json
          references_data: Json
          sitter_user_id: string
          status: string
          submitted_at: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          eligibility?: Json
          experience?: Json
          id?: string
          id_doc_url?: string | null
          qualifications?: Json
          references_data?: Json
          sitter_user_id: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          eligibility?: Json
          experience?: Json
          id?: string
          id_doc_url?: string | null
          qualifications?: Json
          references_data?: Json
          sitter_user_id?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      sitter_notification_prefs: {
        Row: {
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          muted: boolean
          radius_km: number
          sitter_user_id: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_type: Database["public"]["Enums"]["job_type"]
          muted?: boolean
          radius_km?: number
          sitter_user_id: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          muted?: boolean
          radius_km?: number
          sitter_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sitters: {
        Row: {
          age_groups: string[]
          area: string | null
          bio: string | null
          bookings_completed: number
          comfortable_with_pets: boolean
          cooks: boolean
          created_at: string
          dog_walker: boolean
          drives: boolean
          early_years_qualified: boolean
          first_aid_certified: boolean
          full_name: string | null
          has_own_car: boolean
          headline: string | null
          homework_help: boolean
          hourly_rate_aed: number
          id: string
          is_active: boolean
          is_demo: boolean
          languages: string[]
          latitude: number | null
          light_housework: boolean
          live_in_available: boolean
          longitude: number | null
          maternity_nurse: boolean
          monthly_full_time_aed: number | null
          multiples_experience: boolean
          network_badge: Database["public"]["Enums"]["network_badge"]
          newborn_experience: boolean
          night_nanny: boolean
          non_smoker: boolean
          one_off_available: boolean
          open_to_babysitting: boolean
          open_to_full_time: boolean
          overnight_available: boolean
          pet_boarding: boolean
          pet_sitter: boolean
          photos: string[]
          police_cleared: boolean
          preferred_payout_method:
            | Database["public"]["Enums"]["cash_out_method"]
            | null
          rate_last_updated: string
          rating: number
          regular_available: boolean
          school_pickup: boolean
          sen_experience: boolean
          swims: boolean
          teaching_qualified: boolean
          tier: string | null
          updated_at: string
          user_id: string | null
          verified: boolean
          video_intro_url: string | null
          years_experience: number
        }
        Insert: {
          age_groups?: string[]
          area?: string | null
          bio?: string | null
          bookings_completed?: number
          comfortable_with_pets?: boolean
          cooks?: boolean
          created_at?: string
          dog_walker?: boolean
          drives?: boolean
          early_years_qualified?: boolean
          first_aid_certified?: boolean
          full_name?: string | null
          has_own_car?: boolean
          headline?: string | null
          homework_help?: boolean
          hourly_rate_aed?: number
          id?: string
          is_active?: boolean
          is_demo?: boolean
          languages?: string[]
          latitude?: number | null
          light_housework?: boolean
          live_in_available?: boolean
          longitude?: number | null
          maternity_nurse?: boolean
          monthly_full_time_aed?: number | null
          multiples_experience?: boolean
          network_badge?: Database["public"]["Enums"]["network_badge"]
          newborn_experience?: boolean
          night_nanny?: boolean
          non_smoker?: boolean
          one_off_available?: boolean
          open_to_babysitting?: boolean
          open_to_full_time?: boolean
          overnight_available?: boolean
          pet_boarding?: boolean
          pet_sitter?: boolean
          photos?: string[]
          police_cleared?: boolean
          preferred_payout_method?:
            | Database["public"]["Enums"]["cash_out_method"]
            | null
          rate_last_updated?: string
          rating?: number
          regular_available?: boolean
          school_pickup?: boolean
          sen_experience?: boolean
          swims?: boolean
          teaching_qualified?: boolean
          tier?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean
          video_intro_url?: string | null
          years_experience?: number
        }
        Update: {
          age_groups?: string[]
          area?: string | null
          bio?: string | null
          bookings_completed?: number
          comfortable_with_pets?: boolean
          cooks?: boolean
          created_at?: string
          dog_walker?: boolean
          drives?: boolean
          early_years_qualified?: boolean
          first_aid_certified?: boolean
          full_name?: string | null
          has_own_car?: boolean
          headline?: string | null
          homework_help?: boolean
          hourly_rate_aed?: number
          id?: string
          is_active?: boolean
          is_demo?: boolean
          languages?: string[]
          latitude?: number | null
          light_housework?: boolean
          live_in_available?: boolean
          longitude?: number | null
          maternity_nurse?: boolean
          monthly_full_time_aed?: number | null
          multiples_experience?: boolean
          network_badge?: Database["public"]["Enums"]["network_badge"]
          newborn_experience?: boolean
          night_nanny?: boolean
          non_smoker?: boolean
          one_off_available?: boolean
          open_to_babysitting?: boolean
          open_to_full_time?: boolean
          overnight_available?: boolean
          pet_boarding?: boolean
          pet_sitter?: boolean
          photos?: string[]
          police_cleared?: boolean
          preferred_payout_method?:
            | Database["public"]["Enums"]["cash_out_method"]
            | null
          rate_last_updated?: string
          rating?: number
          regular_available?: boolean
          school_pickup?: boolean
          sen_experience?: boolean
          swims?: boolean
          teaching_qualified?: boolean
          tier?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean
          video_intro_url?: string | null
          years_experience?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount_minor_units: number
          created_at: string
          currency: string
          description: string | null
          id: string
          related_booking_id: string | null
          related_cash_out_id: string | null
          status: Database["public"]["Enums"]["wallet_tx_status"]
          type: Database["public"]["Enums"]["wallet_tx_type"]
          wallet_id: string
        }
        Insert: {
          amount_minor_units: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          related_booking_id?: string | null
          related_cash_out_id?: string | null
          status?: Database["public"]["Enums"]["wallet_tx_status"]
          type: Database["public"]["Enums"]["wallet_tx_type"]
          wallet_id: string
        }
        Update: {
          amount_minor_units?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          related_booking_id?: string | null
          related_cash_out_id?: string | null
          status?: Database["public"]["Enums"]["wallet_tx_status"]
          type?: Database["public"]["Enums"]["wallet_tx_type"]
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance_minor_units: number
          created_at: string
          currency: string
          id: string
          pending_minor_units: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_minor_units?: number
          created_at?: string
          currency?: string
          id?: string
          pending_minor_units?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_minor_units?: number
          created_at?: string
          currency?: string
          id?: string
          pending_minor_units?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_booking_escrow: { Args: { _booking: string }; Returns: undefined }
      create_instant_booking: {
        Args: {
          _address?: string
          _hours: number
          _notes?: string
          _sitter_id: string
          _start_at: string
        }
        Returns: string
      }
      ensure_wallet: { Args: { _user: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      release_booking_escrow: { Args: { _booking: string }; Returns: undefined }
      request_cash_out: {
        Args: {
          _airtime_operator?: string
          _airtime_phone?: string
          _amount: number
          _bank_account_holder?: string
          _bank_iban?: string
          _exchange_house?: string
          _method: Database["public"]["Enums"]["cash_out_method"]
          _pickup_location_id?: string
          _voucher_provider?: string
        }
        Returns: string
      }
      sitter_friend_trust_count: {
        Args: { _sitter: string; _viewer: string }
        Returns: number
      }
      tier_from_hourly_rate: { Args: { rate: number }; Returns: string }
      wallet_credit: {
        Args: {
          _amount: number
          _booking?: string
          _description: string
          _type: Database["public"]["Enums"]["wallet_tx_type"]
          _user: string
        }
        Returns: string
      }
      wallet_debit: {
        Args: {
          _amount: number
          _cash_out?: string
          _description: string
          _type: Database["public"]["Enums"]["wallet_tx_type"]
          _user: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "parent" | "sitter" | "admin"
      application_status: "pending" | "accepted" | "declined" | "withdrawn"
      booking_status:
        | "pending_payment"
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "declined"
      cash_out_method:
        | "exchange_house_pickup"
        | "bank_transfer"
        | "voucher"
        | "airtime"
      cash_out_status:
        | "requested"
        | "processing"
        | "ready_for_pickup"
        | "completed"
        | "cancelled"
        | "failed"
      friend_status: "pending" | "accepted"
      job_status: "open" | "filled" | "cancelled"
      job_type: "one_off" | "repeat" | "permanent"
      loyalty_tier: "bronze" | "silver" | "gold" | "platinum"
      network_badge: "none" | "trusted" | "premium" | "elite"
      wallet_tx_status: "pending" | "completed" | "failed" | "cancelled"
      wallet_tx_type:
        | "top_up"
        | "booking_payment_in"
        | "booking_payment_out"
        | "platform_fee"
        | "cash_out_request"
        | "cash_out_completed"
        | "cash_out_cancelled"
        | "refund"
        | "bonus"
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
      app_role: ["parent", "sitter", "admin"],
      application_status: ["pending", "accepted", "declined", "withdrawn"],
      booking_status: [
        "pending_payment",
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "declined",
      ],
      cash_out_method: [
        "exchange_house_pickup",
        "bank_transfer",
        "voucher",
        "airtime",
      ],
      cash_out_status: [
        "requested",
        "processing",
        "ready_for_pickup",
        "completed",
        "cancelled",
        "failed",
      ],
      friend_status: ["pending", "accepted"],
      job_status: ["open", "filled", "cancelled"],
      job_type: ["one_off", "repeat", "permanent"],
      loyalty_tier: ["bronze", "silver", "gold", "platinum"],
      network_badge: ["none", "trusted", "premium", "elite"],
      wallet_tx_status: ["pending", "completed", "failed", "cancelled"],
      wallet_tx_type: [
        "top_up",
        "booking_payment_in",
        "booking_payment_out",
        "platform_fee",
        "cash_out_request",
        "cash_out_completed",
        "cash_out_cancelled",
        "refund",
        "bonus",
      ],
    },
  },
} as const
