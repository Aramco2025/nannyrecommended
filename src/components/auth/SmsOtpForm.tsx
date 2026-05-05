import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { COMMON_REGIONS, formatAsYouType, toE164 } from "@/lib/auth/phone";
import { logAuthAttempt } from "@/lib/auth/methods";
import { Link } from "react-router-dom";

type Props = {
  onVerified: (e164: string) => void;
};

export function SmsOtpForm({ onVerified }: Props) {
  const [region, setRegion] = useState<typeof COMMON_REGIONS[number]["code"]>("AE");
  const [raw, setRaw] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [phoneE164, setPhoneE164] = useState<string | null>(null);
  const [failedTries, setFailedTries] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  const send = async () => {
    const e164 = toE164(raw, region);
    if (!e164) {
      toast({ title: "Check the number", description: "We accept every country — make sure to include the area code.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("sms-otp-send", { body: { phone: e164 } });
      if (error) throw error;
      setPhoneE164(e164);
      setSent(true);
      setDevCode((data as any)?.dev_code ?? null);
      toast({ title: "Code sent", description: `SMS to ${e164}` });
    } catch (e: any) {
      const msg = e?.message ?? "Couldn't send";
      sessionStorage.setItem("nr_last_auth_error", JSON.stringify({ at: "sms_send", message: msg, phone: e164 }));
      logAuthAttempt({ email_or_phone: e164, method: "sms_otp", success: false, error_code: "send_failed", error_message: msg });
      toast({ title: "Couldn't send code", description: "Try again, or use the rescue route.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const verify = async () => {
    if (!phoneE164 || code.length !== 6) return;
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("sms-otp-verify", { body: { phone: phoneE164, code } });
      if (error || !(data as any)?.ok) throw new Error((data as any)?.error ?? error?.message ?? "verify_failed");
      onVerified(phoneE164);
    } catch (e: any) {
      const next = failedTries + 1;
      setFailedTries(next);
      sessionStorage.setItem("nr_last_auth_error", JSON.stringify({ at: "sms_verify", message: e?.message, phone: phoneE164 }));
      toast({ title: "Wrong code", description: next >= 3 ? "Try email or use /auth/help." : "Re-check the SMS.", variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      {!sent ? (
        <>
          <div className="flex gap-2">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as any)}
              className="rounded-md border border-input bg-background px-2 text-sm"
              aria-label="Country"
            >
              {COMMON_REGIONS.map((r) => (
                <option key={r.code} value={r.code}>{r.dial} · {r.code}</option>
              ))}
            </select>
            <Input
              type="tel"
              value={raw}
              onChange={(e) => setRaw(formatAsYouType(e.target.value, region))}
              placeholder="50 123 4567"
              maxLength={24}
              inputMode="tel"
            />
          </div>
          <p className="text-xs text-slate-grey">
            We accept every country. If your number isn't recognised, <Link to="/auth/help" className="underline">tell us</Link>.
          </p>
          <Button onClick={send} disabled={sending} size="lg" className="w-full bg-pitch-black text-pure-white hover:bg-pitch-black/90">
            {sending ? "Sending…" : "Send code"}
          </Button>
        </>
      ) : (
        <>
          <div>
            <Label className="text-xs text-slate-grey">6-digit code sent to {phoneE164}</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" maxLength={6} inputMode="numeric" />
            {devCode && (
              <p className="mt-1 text-xs text-amber-600">Dev mode code: {devCode}</p>
            )}
          </div>
          <Button onClick={verify} disabled={verifying || code.length !== 6} size="lg" className="w-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
            {verifying ? "Verifying…" : "Verify"}
          </Button>
          <div className="flex items-center justify-between text-xs">
            <button type="button" onClick={() => { setSent(false); setCode(""); setFailedTries(0); }} className="text-slate-grey underline">
              Use a different number
            </button>
            <button type="button" onClick={send} disabled={sending} className="text-slate-grey underline">
              Resend code
            </button>
          </div>
          {failedTries >= 3 && (
            <div className="rounded-lg bg-salmon/10 p-3 text-xs text-salmon-deep">
              Stuck? <Link to="/auth/help" className="font-medium underline">Get human help</Link> — we respond within 30 minutes.
            </div>
          )}
        </>
      )}
    </div>
  );
}
