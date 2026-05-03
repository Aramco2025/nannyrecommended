import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Sitters from "./pages/Sitters.tsx";
import SitterProfile from "./pages/SitterProfile.tsx";
import Booking from "./pages/Booking.tsx";
import Pricing from "./pages/Pricing.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import SitterSignup from "./pages/SitterSignup.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
