import { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SplashScreen } from "@/components/SplashScreen";
import { PageLoader } from "@/components/ui/page-loader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WalletAuthProvider } from "@/contexts/WalletAuthContext";

// Eagerly loaded (critical path)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded (non-critical)
const Templates = lazy(() => import("./pages/Templates"));
const Builder = lazy(() => import("./pages/Builder"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DomainSettings = lazy(() => import("./pages/DomainSettings"));
const Site = lazy(() => import("./pages/Site"));
const WebsiteRenderer = lazy(() => import("./pages/WebsiteRenderer"));
const TemplateBuilder = lazy(() => import("./pages/admin/TemplateBuilder"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const FAQ = lazy(() => import("./pages/FAQ"));

// Lazy load wallet provider (heavy Solana deps)
const WalletProvider = lazy(() => 
  import("@/components/wallet/WalletProvider").then(mod => ({ default: mod.WalletProvider }))
);

// Configure React Query with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <Suspense fallback={<PageLoader />}>
            <WalletProvider>
              <WalletAuthProvider>
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
                      <Route path="/domains" element={
                        <ErrorBoundary>
                          <DomainSettings />
                        </ErrorBoundary>
                      } />
                      <Route path="/site/:subdomain" element={<Site />} />
                      <Route path="/preview" element={<WebsiteRenderer />} />
                      <Route path="/admin/template-builder" element={
                        <ErrorBoundary>
                          <TemplateBuilder />
                        </ErrorBoundary>
                      } />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
              </WalletAuthProvider>
            </WalletProvider>
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
