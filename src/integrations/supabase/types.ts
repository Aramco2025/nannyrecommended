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
      area_waitlist: {
        Row: {
          area: string
          email: string | null
          full_name: string | null
          id: string
          notes: string | null
          phone: string | null
          requested_at: string
          user_id: string | null
        }
        Insert: {
          area: string
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          requested_at?: string
          user_id?: string | null
        }
        Update: {
          area?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          requested_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      auth_attempts: {
        Row: {
          created_at: string
          email_or_phone: string | null
          error_code: string | null
          error_message: string | null
          id: string
          ip_hint: string | null
          method: string
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email_or_phone?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          ip_hint?: string | null
          method: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email_or_phone?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          ip_hint?: string | null
          method?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
          cancel_fee_aed: number | null
          cancel_reason: string | null
          cancelled_at: string | null
          cancelled_by_role: string | null
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
          refund_aed: number | null
          released_at: string | null
          sitter_id: string
          sitter_payout_aed: number
          start_at: string
          started_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subtotal_aed: number
          taxi_cover_aed: number
          taxi_requested: boolean
          total_aed: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          cancel_fee_aed?: number | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by_role?: string | null
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
          refund_aed?: number | null
          released_at?: string | null
          sitter_id: string
          sitter_payout_aed: number
          start_at: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_aed: number
          taxi_cover_aed?: number
          taxi_requested?: boolean
          total_aed: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          cancel_fee_aed?: number | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by_role?: string | null
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
          refund_aed?: number | null
          released_at?: string | null
          sitter_id?: string
          sitter_payout_aed?: number
          start_at?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_aed?: number
          taxi_cover_aed?: number
          taxi_requested?: boolean
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
      charges: {
        Row: {
          amount_minor_units: number
          booking_id: string | null
          created_at: string
          currency: string
          description: string | null
          environment: string
          id: string
          payment_method_brand: string | null
          payment_method_last4: string | null
          receipt_url: string | null
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_minor_units: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          environment?: string
          id?: string
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          receipt_url?: string | null
          status: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_minor_units?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          environment?: string
          id?: string
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          receipt_url?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
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
      disputes: {
        Row: {
          booking_id: string
          created_at: string
          description: string
          evidence_urls: string[]
          id: string
          parent_id: string
          reason: string
          refund_amount_aed: number | null
          resolution_note: string | null
          resolved_at: string | null
          sitter_id: string
          status: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          description: string
          evidence_urls?: string[]
          id?: string
          parent_id: string
          reason: string
          refund_amount_aed?: number | null
          resolution_note?: string | null
          resolved_at?: string | null
          sitter_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          description?: string
          evidence_urls?: string[]
          id?: string
          parent_id?: string
          reason?: string
          refund_amount_aed?: number | null
          resolution_note?: string | null
          resolved_at?: string | null
          sitter_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
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
          decision_deadline_at: string | null
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
          decision_deadline_at?: string | null
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
          decision_deadline_at?: string | null
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
      notification_prefs: {
        Row: {
          email_enabled: boolean
          marketing_enabled: boolean
          paused_until: string | null
          push_enabled: boolean
          quiet_hours_end: number | null
          quiet_hours_start: number | null
          sms_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          email_enabled?: boolean
          marketing_enabled?: boolean
          paused_until?: string | null
          push_enabled?: boolean
          quiet_hours_end?: number | null
          quiet_hours_start?: number | null
          sms_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          email_enabled?: boolean
          marketing_enabled?: boolean
          paused_until?: string | null
          push_enabled?: boolean
          quiet_hours_end?: number | null
          quiet_hours_start?: number | null
          sms_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          dedup_key: string | null
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
          dedup_key?: string | null
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
          dedup_key?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string
          environment: string
          exp_month: number | null
          exp_year: number | null
          id: string
          is_default: boolean
          last4: string | null
          stripe_payment_method_id: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          environment?: string
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean
          last4?: string | null
          stripe_payment_method_id: string
          user_id: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          environment?: string
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean
          last4?: string | null
          stripe_payment_method_id?: string
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
          is_family_plus: boolean
          onboarding_completed: boolean
          phone: string | null
          phone_verified: boolean
          region: string | null
          stripe_connect_account_id: string | null
          stripe_connect_onboarded: boolean
          stripe_customer_id: string | null
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
          is_family_plus?: boolean
          onboarding_completed?: boolean
          phone?: string | null
          phone_verified?: boolean
          region?: string | null
          stripe_connect_account_id?: string | null
          stripe_connect_onboarded?: boolean
          stripe_customer_id?: string | null
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
          is_family_plus?: boolean
          onboarding_completed?: boolean
          phone?: string | null
          phone_verified?: boolean
          region?: string | null
          stripe_connect_account_id?: string | null
          stripe_connect_onboarded?: boolean
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recurring_bookings: {
        Row: {
          active: boolean
          address: string | null
          children_ids: string[]
          created_at: string
          day_of_week: number
          hours: number
          id: string
          next_occurrence: string | null
          notes: string | null
          parent_id: string
          sitter_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          children_ids?: string[]
          created_at?: string
          day_of_week: number
          hours: number
          id?: string
          next_occurrence?: string | null
          notes?: string | null
          parent_id: string
          sitter_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          children_ids?: string[]
          created_at?: string
          day_of_week?: number
          hours?: number
          id?: string
          next_occurrence?: string | null
          notes?: string | null
          parent_id?: string
          sitter_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          code: string
          created_at: string
          id: string
          referred_user_id: string
          referrer_id: string
          reward_aed: number
          rewarded_at: string | null
          status: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          referred_user_id: string
          referrer_id: string
          reward_aed?: number
          rewarded_at?: string | null
          status?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          referred_user_id?: string
          referrer_id?: string
          reward_aed?: number
          rewarded_at?: string | null
          status?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount_minor_units: number
          charge_id: string
          created_at: string
          currency: string
          id: string
          reason: string | null
          status: string
          stripe_refund_id: string
        }
        Insert: {
          amount_minor_units: number
          charge_id: string
          created_at?: string
          currency?: string
          id?: string
          reason?: string | null
          status: string
          stripe_refund_id: string
        }
        Update: {
          amount_minor_units?: number
          charge_id?: string
          created_at?: string
          currency?: string
          id?: string
          reason?: string | null
          status?: string
          stripe_refund_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "charges"
            referencedColumns: ["id"]
          },
        ]
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
      saved_searches: {
        Row: {
          alerts_enabled: boolean
          created_at: string
          filters: Json
          id: string
          last_alerted_at: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alerts_enabled?: boolean
          created_at?: string
          filters?: Json
          id?: string
          last_alerted_at?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alerts_enabled?: boolean
          created_at?: string
          filters?: Json
          id?: string
          last_alerted_at?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      sitter_payouts: {
        Row: {
          amount_minor_units: number
          cash_out_request_id: string | null
          created_at: string
          currency: string
          environment: string
          failure_reason: string | null
          id: string
          sitter_id: string
          status: string
          stripe_destination_account: string | null
          stripe_transfer_id: string | null
          updated_at: string
        }
        Insert: {
          amount_minor_units: number
          cash_out_request_id?: string | null
          created_at?: string
          currency?: string
          environment?: string
          failure_reason?: string | null
          id?: string
          sitter_id: string
          status: string
          stripe_destination_account?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_minor_units?: number
          cash_out_request_id?: string | null
          created_at?: string
          currency?: string
          environment?: string
          failure_reason?: string | null
          id?: string
          sitter_id?: string
          status?: string
          stripe_destination_account?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sitter_payouts_cash_out_request_id_fkey"
            columns: ["cash_out_request_id"]
            isOneToOne: false
            referencedRelation: "cash_out_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sitters: {
        Row: {
          age_groups: string[]
          area: string | null
          avg_response_minutes: number | null
          bio: string | null
          bookings_completed: number
          comfortable_with_pets: boolean
          cooks: boolean
          created_at: string
          dog_walker: boolean
          drives: boolean
          early_years_qualified: boolean
          evening_surcharge_aed: number
          first_aid_certified: boolean
          full_name: string | null
          has_own_car: boolean
          headline: string | null
          holiday_surcharge_aed: number
          homework_help: boolean
          hourly_rate_aed: number
          id: string
          is_active: boolean
          is_demo: boolean
          languages: string[]
          last_active_at: string | null
          last_minute_surcharge_aed: number
          late_night_surcharge_aed: number
          latitude: number | null
          light_housework: boolean
          live_in_available: boolean
          longitude: number | null
          maternity_nurse: boolean
          monthly_full_time_aed: number | null
          multi_child_surcharge_aed: number
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
          weekend_surcharge_aed: number
          years_experience: number
        }
        Insert: {
          age_groups?: string[]
          area?: string | null
          avg_response_minutes?: number | null
          bio?: string | null
          bookings_completed?: number
          comfortable_with_pets?: boolean
          cooks?: boolean
          created_at?: string
          dog_walker?: boolean
          drives?: boolean
          early_years_qualified?: boolean
          evening_surcharge_aed?: number
          first_aid_certified?: boolean
          full_name?: string | null
          has_own_car?: boolean
          headline?: string | null
          holiday_surcharge_aed?: number
          homework_help?: boolean
          hourly_rate_aed?: number
          id?: string
          is_active?: boolean
          is_demo?: boolean
          languages?: string[]
          last_active_at?: string | null
          last_minute_surcharge_aed?: number
          late_night_surcharge_aed?: number
          latitude?: number | null
          light_housework?: boolean
          live_in_available?: boolean
          longitude?: number | null
          maternity_nurse?: boolean
          monthly_full_time_aed?: number | null
          multi_child_surcharge_aed?: number
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
          weekend_surcharge_aed?: number
          years_experience?: number
        }
        Update: {
          age_groups?: string[]
          area?: string | null
          avg_response_minutes?: number | null
          bio?: string | null
          bookings_completed?: number
          comfortable_with_pets?: boolean
          cooks?: boolean
          created_at?: string
          dog_walker?: boolean
          drives?: boolean
          early_years_qualified?: boolean
          evening_surcharge_aed?: number
          first_aid_certified?: boolean
          full_name?: string | null
          has_own_car?: boolean
          headline?: string | null
          holiday_surcharge_aed?: number
          homework_help?: boolean
          hourly_rate_aed?: number
          id?: string
          is_active?: boolean
          is_demo?: boolean
          languages?: string[]
          last_active_at?: string | null
          last_minute_surcharge_aed?: number
          late_night_surcharge_aed?: number
          latitude?: number | null
          light_housework?: boolean
          live_in_available?: boolean
          longitude?: number | null
          maternity_nurse?: boolean
          monthly_full_time_aed?: number | null
          multi_child_surcharge_aed?: number
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
          weekend_surcharge_aed?: number
          years_experience?: number
        }
        Relationships: []
      }
      sms_otp_codes: {
        Row: {
          attempts: number
          code_hash: string
          created_at: string
          expires_at: string
          id: string
          phone: string
          used: boolean
        }
        Insert: {
          attempts?: number
          code_hash: string
          created_at?: string
          expires_at: string
          id?: string
          phone: string
          used?: boolean
        }
        Update: {
          attempts?: number
          code_hash?: string
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
          used?: boolean
        }
        Relationships: []
      }
      sms_unsubscribes: {
        Row: {
          phone: string
          source: string
          unsubscribed_at: string
        }
        Insert: {
          phone: string
          source?: string
          unsubscribed_at?: string
        }
        Update: {
          phone?: string
          source?: string
          unsubscribed_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          pause_until: string | null
          plan: string
          price_id: string | null
          product_id: string | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          pause_until?: string | null
          plan: string
          price_id?: string | null
          product_id?: string | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          pause_until?: string | null
          plan?: string
          price_id?: string | null
          product_id?: string | null
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          trial_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          body: string
          category: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          debug_info: Json
          id: string
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          body: string
          category: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          debug_info?: Json
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          body?: string
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          debug_info?: Json
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
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
      cancel_booking: {
        Args: { _booking: string; _reason: string }
        Returns: Json
      }
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
      ensure_referral_code: { Args: { _user: string }; Returns: string }
      ensure_wallet: { Args: { _user: string }; Returns: string }
      expire_pending_payment_bookings: { Args: never; Returns: number }
      expire_stale_job_posts: { Args: never; Returns: number }
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      recompute_sitter_response_time: {
        Args: { _sitter_user_id: string }
        Returns: undefined
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
      touch_sitter_activity: { Args: never; Returns: undefined }
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
        | "referral_credit"
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
        "referral_credit",
      ],
    },
  },
} as const
