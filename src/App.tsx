import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import Sitters from "./pages/Sitters.tsx";
import SitterProfile from "./pages/SitterProfile.tsx";
import Booking from "./pages/Booking.tsx";
import Pricing from "./pages/Pricing.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import SitterSignup from "./pages/SitterSignup.tsx";
import Auth from "./pages/Auth.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import Account from "./pages/Account.tsx";
import SitterDashboard from "./pages/SitterDashboard.tsx";
import SitterWallet from "./pages/SitterWallet.tsx";
import CashOut from "./pages/CashOut.tsx";
import SitterPaymentSetup from "./pages/SitterPaymentSetup.tsx";
import SitterSetRate from "./pages/SitterSetRate.tsx";
import AdminPayouts from "./pages/AdminPayouts.tsx";
import TrustSafety from "./pages/TrustSafety.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import FindNanny from "./pages/FindNanny.tsx";
import NannyJobs from "./pages/NannyJobs.tsx";
import Guides from "./pages/Guides.tsx";
import ParentFaqs from "./pages/ParentFaqs.tsx";
import SitterFaqs from "./pages/SitterFaqs.tsx";
import Babysitter from "./pages/Babysitter.tsx";
import NightNanny from "./pages/NightNanny.tsx";
import AfterSchoolNanny from "./pages/AfterSchoolNanny.tsx";
import FullTimeNanny from "./pages/FullTimeNanny.tsx";
import EmergencyChildcare from "./pages/EmergencyChildcare.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sitters" element={<Sitters />} />
            <Route path="/sitters/:id" element={<SitterProfile />} />
            <Route path="/book/:sitterId" element={<Booking />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/sitter/signup" element={<SitterSignup />} />
            <Route path="/sitter/dashboard" element={<SitterDashboard />} />
            <Route path="/sitter/wallet" element={<SitterWallet />} />
            <Route path="/sitter/wallet/cashout" element={<CashOut />} />
            <Route path="/sitter/payment-setup" element={<SitterPaymentSetup />} />
            <Route path="/sitter/set-rate" element={<SitterSetRate />} />
            <Route path="/admin/payouts" element={<AdminPayouts />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/trust-safety" element={<TrustSafety />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/find-nanny" element={<FindNanny />} />
            <Route path="/nanny-jobs" element={<NannyJobs />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/parent-faqs" element={<ParentFaqs />} />
            <Route path="/sitter-faqs" element={<SitterFaqs />} />
            <Route path="/babysitter" element={<Babysitter />} />
            <Route path="/night-nanny" element={<NightNanny />} />
            <Route path="/after-school-nanny" element={<AfterSchoolNanny />} />
            <Route path="/full-time-nanny" element={<FullTimeNanny />} />
            <Route path="/emergency-childcare" element={<EmergencyChildcare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
