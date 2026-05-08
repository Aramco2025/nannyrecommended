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
import SitterJobs from "./pages/SitterJobs.tsx";
import SitterAvailability from "./pages/SitterAvailability.tsx";
import SitterNotifications from "./pages/SitterNotifications.tsx";
import Messages from "./pages/Messages.tsx";
import MessageThread from "./pages/MessageThread.tsx";
import PostJob from "./pages/PostJob.tsx";
import PostJobStart from "./pages/PostJobStart.tsx";
import Favourites from "./pages/Favourites.tsx";
import Friends from "./pages/Friends.tsx";
import JobApplicants from "./pages/JobApplicants.tsx";
import OnboardingWelcome from "./pages/onboarding/Welcome.tsx";
import OnboardingRegion from "./pages/onboarding/RegionPicker.tsx";
import OnboardingRole from "./pages/onboarding/RolePicker.tsx";
import OnboardingPhone from "./pages/onboarding/PhoneVerify.tsx";
import OnboardingPermissions from "./pages/onboarding/Permissions.tsx";
import ParentNeeds from "./pages/onboarding/parent/Needs.tsx";
import ParentFamily from "./pages/onboarding/parent/Family.tsx";
import ParentAddress from "./pages/onboarding/parent/Address.tsx";
import ParentConnect from "./pages/onboarding/parent/Connect.tsx";
import ParentDone from "./pages/onboarding/parent/Done.tsx";
import SitterEligibility from "./pages/sitter/apply/Eligibility.tsx";
import SitterExperience from "./pages/sitter/apply/Experience.tsx";
import SitterQualifications from "./pages/sitter/apply/Qualifications.tsx";
import SitterIdUpload from "./pages/sitter/apply/IdUpload.tsx";
import SitterReferences from "./pages/sitter/apply/References.tsx";
import SitterBio from "./pages/sitter/apply/Bio.tsx";
import SitterReview from "./pages/sitter/apply/Review.tsx";
import SitterPending from "./pages/sitter/apply/Pending.tsx";
import BookingDetail from "./pages/BookingDetail.tsx";
import Notifications from "./pages/Notifications.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import AdminBookings from "./pages/AdminBookings.tsx";
import AdminDisputes from "./pages/AdminDisputes.tsx";
import AuthHelp from "./pages/AuthHelp.tsx";
import NotificationPreferences from "./pages/NotificationPreferences.tsx";
import NotFound from "./pages/NotFound.tsx";
import DeleteAccount from "./pages/account/DeleteAccount.tsx";
import Privacy_ from "./pages/account/Privacy.tsx";
import VerifyEmail from "./pages/VerifyEmail.tsx";
import AuthCallback from "./pages/AuthCallback.tsx";
import BookingLive from "./pages/BookingLive.tsx";
import BookingReview from "./pages/BookingReview.tsx";
import BookingDispute from "./pages/BookingDispute.tsx";
import JobPosted from "./pages/parent/JobPosted.tsx";
import SitterJobDetail from "./pages/sitter/JobDetail.tsx";
import SitterApplications from "./pages/sitter/Applications.tsx";
import SitterRequests from "./pages/sitter/Requests.tsx";
import ParentHome from "./pages/parent/Home.tsx";
import ParentBookings from "./pages/parent/Bookings.tsx";
import ParentFamilyPage from "./pages/parent/Family.tsx";
import SitterReviewsAll from "./pages/sitter/ReviewsAll.tsx";
import Education from "./pages/sitter/Education.tsx";
import EducationArticle from "./pages/sitter/EducationArticle.tsx";
import BookingReturn from "./pages/checkout/BookingReturn.tsx";
import SubscriptionReturn from "./pages/checkout/SubscriptionReturn.tsx";
import Referrals from "./pages/Referrals.tsx";
import { OfflineBanner } from "./components/OfflineBanner.tsx";
import Status from "./pages/Status.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <OfflineBanner />
          <Routes>
            <Route path="/status" element={<Status />} />
            <Route path="/" element={<Index />} />
            <Route path="/sitters" element={<Sitters />} />
            <Route path="/sitters/:id" element={<SitterProfile />} />
            <Route path="/sitters/:id/reviews" element={<SitterReviewsAll />} />
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
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/account/delete" element={<DeleteAccount />} />
            <Route path="/account/privacy" element={<Privacy_ />} />
            <Route path="/auth/help" element={<AuthHelp />} />
            <Route path="/account" element={<Account />} />
            <Route path="/referrals" element={<Referrals />} />
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
            <Route path="/sitter/jobs" element={<SitterJobs />} />
            <Route path="/sitter/jobs/:id" element={<SitterJobDetail />} />
            <Route path="/sitter/applications" element={<SitterApplications />} />
            <Route path="/sitter/requests" element={<SitterRequests />} />
            <Route path="/sitter/education" element={<Education />} />
            <Route path="/sitter/education/:slug" element={<EducationArticle />} />
            <Route path="/sitter/availability" element={<SitterAvailability />} />
            <Route path="/sitter/notifications" element={<SitterNotifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:bookingId" element={<MessageThread />} />
            <Route path="/parent/post-job/start" element={<PostJobStart />} />
            <Route path="/parent/post-job" element={<PostJob />} />
            <Route path="/parent/home" element={<ParentHome />} />
            <Route path="/parent/bookings" element={<ParentBookings />} />
            <Route path="/parent/family" element={<ParentFamilyPage />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/parent/jobs/:jobId/applicants" element={<JobApplicants />} />
            <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
            <Route path="/onboarding/region" element={<OnboardingRegion />} />
            <Route path="/onboarding/role" element={<OnboardingRole />} />
            <Route path="/onboarding/phone" element={<OnboardingPhone />} />
            <Route path="/onboarding/permissions" element={<OnboardingPermissions />} />
            <Route path="/onboarding/parent/needs" element={<ParentNeeds />} />
            <Route path="/onboarding/parent/family" element={<ParentFamily />} />
            <Route path="/onboarding/parent/address" element={<ParentAddress />} />
            <Route path="/onboarding/parent/connect" element={<ParentConnect />} />
            <Route path="/onboarding/parent/done" element={<ParentDone />} />
            <Route path="/sitter/apply/eligibility" element={<SitterEligibility />} />
            <Route path="/sitter/apply/experience" element={<SitterExperience />} />
            <Route path="/sitter/apply/qualifications" element={<SitterQualifications />} />
            <Route path="/sitter/apply/id" element={<SitterIdUpload />} />
            <Route path="/sitter/apply/references" element={<SitterReferences />} />
            <Route path="/sitter/apply/bio" element={<SitterBio />} />
            <Route path="/sitter/apply/review" element={<SitterReview />} />
            <Route path="/sitter/apply/pending" element={<SitterPending />} />
            <Route path="/bookings/:id" element={<BookingDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/account/notifications" element={<NotificationPreferences />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/disputes" element={<AdminDisputes />} />
            <Route path="/checkout/booking-return" element={<BookingReturn />} />
            <Route path="/checkout/subscription-return" element={<SubscriptionReturn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
