import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { SplashScreen } from "@/components/SplashScreen";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import Builder from "./pages/Builder";
import Dashboard from "./pages/Dashboard";
import Site from "./pages/Site";
import WebsiteRenderer from "./pages/WebsiteRenderer";
import TemplateBuilder from "./pages/admin/TemplateBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <WalletProvider>
          <TooltipProvider>
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            <Toaster />
            <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/site/:subdomain" element={<Site />} />
              <Route path="/preview" element={<WebsiteRenderer />} />
              <Route path="/admin/template-builder" element={<TemplateBuilder />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
