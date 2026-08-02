export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null;
          body: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          image_url: string | null;
          is_published: boolean;
          published_at: string;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author?: string | null;
          body?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          published_at?: string;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: string | null;
          body?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          published_at?: string;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          is_read: boolean;
          message: string;
          name: string;
          phone: string | null;
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          is_read?: boolean;
          message: string;
          name: string;
          phone?: string | null;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          is_read?: boolean;
          message?: string;
          name?: string;
          phone?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      darshan_times: {
        Row: {
          days: number[];
          icon: string;
          id: string;
          is_active: boolean;
          label: string;
          note: string | null;
          sort_order: number;
          time_text: string;
        };
        Insert: {
          days?: number[];
          icon?: string;
          id?: string;
          is_active?: boolean;
          label: string;
          note?: string | null;
          sort_order?: number;
          time_text: string;
        };
        Update: {
          days?: number[];
          icon?: string;
          id?: string;
          is_active?: boolean;
          label?: string;
          note?: string | null;
          sort_order?: number;
          time_text?: string;
        };
        Relationships: [];
      };
      donation_categories: {
        Row: {
          allow_recurring: boolean;
          description: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          slug: string;
          sort_order: number;
          suggested_amounts: number[];
          tab: string;
        };
        Insert: {
          allow_recurring?: boolean;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
          suggested_amounts?: number[];
          tab?: string;
        };
        Update: {
          allow_recurring?: boolean;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          slug?: string;
          sort_order?: number;
          suggested_amounts?: number[];
          tab?: string;
        };
        Relationships: [];
      };
      donations: {
        Row: {
          amount_cents: number;
          category_name: string | null;
          category_slug: string | null;
          created_at: string;
          currency: string;
          dedication: string | null;
          donor_email: string | null;
          donor_name: string | null;
          id: string;
          is_recurring: boolean;
          provider_payment_id: string | null;
          provider_session_id: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          amount_cents: number;
          category_name?: string | null;
          category_slug?: string | null;
          created_at?: string;
          currency?: string;
          dedication?: string | null;
          donor_email?: string | null;
          donor_name?: string | null;
          id?: string;
          is_recurring?: boolean;
          provider_payment_id?: string | null;
          provider_session_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          amount_cents?: number;
          category_name?: string | null;
          category_slug?: string | null;
          created_at?: string;
          currency?: string;
          dedication?: string | null;
          donor_email?: string | null;
          donor_name?: string | null;
          id?: string;
          is_recurring?: boolean;
          provider_payment_id?: string | null;
          provider_session_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          body: string | null;
          created_at: string;
          ends_at: string | null;
          id: string;
          image_url: string | null;
          is_published: boolean;
          location: string | null;
          slug: string;
          starts_at: string | null;
          summary: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          ends_at?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          location?: string | null;
          slug: string;
          starts_at?: string | null;
          summary?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          ends_at?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          location?: string | null;
          slug?: string;
          starts_at?: string | null;
          summary?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gallery_albums: {
        Row: {
          cover_url: string | null;
          created_at: string;
          description: string | null;
          event_date: string | null;
          id: string;
          is_published: boolean;
          slug: string;
          title: string;
        };
        Insert: {
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          event_date?: string | null;
          id?: string;
          is_published?: boolean;
          slug: string;
          title: string;
        };
        Update: {
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          event_date?: string | null;
          id?: string;
          is_published?: boolean;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      gallery_photos: {
        Row: {
          album_id: string;
          caption: string | null;
          id: string;
          image_url: string;
          sort_order: number;
        };
        Insert: {
          album_id: string;
          caption?: string | null;
          id?: string;
          image_url: string;
          sort_order?: number;
        };
        Update: {
          album_id?: string;
          caption?: string | null;
          id?: string;
          image_url?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "gallery_photos_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "gallery_albums";
            referencedColumns: ["id"];
          },
        ];
      };
      hero_slides: {
        Row: {
          caption: string | null;
          created_at: string;
          id: string;
          image_url: string;
          is_active: boolean;
          sort_order: number;
        };
        Insert: {
          caption?: string | null;
          created_at?: string;
          id?: string;
          image_url: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          caption?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      media_items: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          file_url: string | null;
          id: string;
          is_published: boolean;
          media_type: string;
          sort_order: number;
          thumbnail_url: string | null;
          title: string;
          youtube_id: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          file_url?: string | null;
          id?: string;
          is_published?: boolean;
          media_type?: string;
          sort_order?: number;
          thumbnail_url?: string | null;
          title: string;
          youtube_id?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          file_url?: string | null;
          id?: string;
          is_published?: boolean;
          media_type?: string;
          sort_order?: number;
          thumbnail_url?: string | null;
          title?: string;
          youtube_id?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: string | null;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: string | null;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: string | null;
        };
        Relationships: [];
      };
      sponsor_days: {
        Row: {
          created_at: string;
          date: string;
          gujarati_month: string | null;
          gujarati_paksh: string | null;
          gujarati_tithi: string | null;
          id: string;
          utsav: string | null;
          vikram_samvat: string | null;
        };
        Insert: {
          created_at?: string;
          date: string;
          gujarati_month?: string | null;
          gujarati_paksh?: string | null;
          gujarati_tithi?: string | null;
          id?: string;
          utsav?: string | null;
          vikram_samvat?: string | null;
        };
        Update: {
          created_at?: string;
          date?: string;
          gujarati_month?: string | null;
          gujarati_paksh?: string | null;
          gujarati_tithi?: string | null;
          id?: string;
          utsav?: string | null;
          vikram_samvat?: string | null;
        };
        Relationships: [];
      };
      sponsor_entries: {
        Row: {
          category: string;
          day_id: string;
          id: string;
          sort_order: number;
          sponsor_name: string;
        };
        Insert: {
          category: string;
          day_id: string;
          id?: string;
          sort_order?: number;
          sponsor_name: string;
        };
        Update: {
          category?: string;
          day_id?: string;
          id?: string;
          sort_order?: number;
          sponsor_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sponsor_entries_day_id_fkey";
            columns: ["day_id"];
            isOneToOne: false;
            referencedRelation: "sponsor_days";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      app_role: "admin" | "editor" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const;
