import { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { SplashScreen } from "@/components/SplashScreen";
import { PageLoader } from "@/components/ui/page-loader";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Eagerly loaded (critical path)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded (non-critical)
const Templates = lazy(() => import("./pages/Templates"));
const Builder = lazy(() => import("./pages/Builder"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Site = lazy(() => import("./pages/Site"));
const WebsiteRenderer = lazy(() => import("./pages/WebsiteRenderer"));
const TemplateBuilder = lazy(() => import("./pages/admin/TemplateBuilder"));

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <WalletProvider>
            <TooltipProvider>
              {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/templates" element={
                      <ErrorBoundary>
                        <Templates />
                      </ErrorBoundary>
                    } />
                    <Route path="/builder" element={
                      <ErrorBoundary>
                        <Builder />
                      </ErrorBoundary>
                    } />
                    <Route path="/dashboard" element={
                      <ErrorBoundary>
                        <Dashboard />
                      </ErrorBoundary>
                    } />
                    <Route path="/site/:subdomain" element={<Site />} />
                    <Route path="/preview" element={<WebsiteRenderer />} />
                    <Route path="/admin/template-builder" element={
                      <ErrorBoundary>
                        <TemplateBuilder />
                      </ErrorBoundary>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </WalletProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
