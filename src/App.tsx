import { Route, Routes } from "react-router-dom";
import { SearchProvider } from "@/hooks/useSearchState";
import { TopNav } from "@/components/domain/TopNav";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/Toaster";
import { HomePage } from "@/pages/HomePage";
import { SkillDetailPage } from "@/pages/SkillDetailPage";
import { DocsPage } from "@/pages/DocsPage";
import { DesignSystemPage } from "@/pages/DesignSystemPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function App() {
  return (
    <SearchProvider>
      <ScrollToTop />
      <TopNav />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/s/:owner/:repo/:skill" element={<SkillDetailPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/ds" element={<DesignSystemPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
      <Toaster />
    </SearchProvider>
  );
}
