export const AUTH_METHODS = [
  "apple",
  "google",
  "facebook",
  "email_password",
  "email_magic_link",
  "sms_otp",
  "support_recovery",
] as const;
export type AuthMethod = (typeof AUTH_METHODS)[number];

import { supabase } from "@/integrations/supabase/client";

export async function logAuthAttempt(opts: {
  email_or_phone?: string | null;
  method: AuthMethod | string;
  success: boolean;
  error_code?: string;
  error_message?: string;
}) {
  try {
    await supabase.from("auth_attempts" as any).insert({
      email_or_phone: opts.email_or_phone ?? null,
      method: opts.method,
      success: opts.success,
      error_code: opts.error_code ?? null,
      error_message: opts.error_message ?? null,
      user_agent: navigator.userAgent,
    });
  } catch {
    // never block auth on logging failures
  }
}
