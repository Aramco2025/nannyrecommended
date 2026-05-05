import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageCircle, ShieldCheck, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PrioritySupportBadge } from "@/components/payments/FamilyPlusGates";

const CATEGORIES = [
  { value: "booking", label: "Booking issue" },
  { value: "payment", label: "Payment or refund" },
  { value: "safety", label: "Safety concern", priority: "p1" as const },
  { value: "account", label: "Account or sign-in" },
  { value: "sitter", label: "Sitter application" },
  { value: "feedback", label: "Feedback or suggestion" },
  { value: "other", label: "Something else" },
];

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState<string>("other");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const subject = String(data.get("subject") || "");
    const body = String(data.get("message") || "");
    const cat = CATEGORIES.find(c => c.value === category);
    setSubmitting(true);
    const { data: sess } = await supabase.auth.getUser();
    const { error } = await supabase.from("support_tickets").insert({
      user_id: sess.user?.id ?? null,
      contact_email: email,
      category,
      priority: cat?.priority ?? "p2",
      subject: subject || `[${cat?.label}] from ${name}`,
      body: `From: ${name} <${email}>\n\n${body}`,
      debug_info: { source: "contact_form", url: window.location.href },
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't send", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Message sent", description: "Our team will reply within one working day." });
    form.reset();
    setCategory("other");
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        <section className="bg-cream">
          <div className="container py-16 text-center md:py-20">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Contact us</span>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
              We're here, <span className="italic text-salmon">7 days a week</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
              Real humans answer every message. Whether you're a parent, a sitter or just curious — let's talk.
            </p>
            <div className="mt-4 flex justify-center"><PrioritySupportBadge /></div>
          </div>
        </section>

        <section className="container pb-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Contact methods */}
            <div className="space-y-4">
              {[
                { icon: Mail, title: "Email support", desc: "hello@nannyrecommended.com", sub: "Replies within 1 working day" },
                { icon: ShieldCheck, title: "Safety concerns", desc: "safety@nannyrecommended.com", sub: "Urgent issues — replies in hours" },
                { icon: MessageCircle, title: "In-app chat", desc: "Open the app and tap Help", sub: "Fastest way for booking issues" },
                { icon: Clock, title: "Hours", desc: "9am – 9pm GST", sub: "Sunday to Saturday" },
              ].map(m => (
                <div key={m.title} className="flex gap-4 rounded-2xl bg-pure-white p-5 shadow-card">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-salmon-soft text-salmon-deep">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-pitch-black">{m.title}</h3>
                    <p className="mt-0.5 text-sm font-medium text-pitch-black">{m.desc}</p>
                    <p className="mt-0.5 text-xs text-slate-grey">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="rounded-3xl bg-pure-white p-7 shadow-card md:p-10">
              <h2 className="font-display text-2xl font-bold text-pitch-black">Send us a message</h2>
              <p className="mt-1 text-sm text-slate-grey">We typically reply within one working day.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Your name</Label>
                  <Input id="name" name="name" required placeholder="Jane Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="category">Topic</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" required placeholder="How can we help?" />
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required rows={5} placeholder="Tell us a bit more..." />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="mt-6 rounded-full bg-pitch-black px-8 text-pure-white hover:bg-pitch-black/90"
              >
                {submitting ? "Sending..." : "Send message"}
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
