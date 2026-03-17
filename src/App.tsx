import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AboutPage from "./pages/AboutPage";
import NewsPage from "./pages/NewsPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AmenagementFoncierPage from "./pages/services/AmenagementFoncierPage";
import AmenagementForestierPage from "./pages/services/AmenagementForestierPage";
import BtpPage from "./pages/services/BtpPage";
import TopographiePage from "./pages/services/TopographiePage";
import GeomatiquePage from "./pages/services/GeomatiquePage";
import InformatiquePage from "./pages/services/InformatiquePage";
import AuthPage from "./pages/AuthPage";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import ArticlesListPage from "./pages/admin/ArticlesListPage";
import ArticleEditorPage from "./pages/admin/ArticleEditorPage";
import ProjectsListPage from "./pages/admin/ProjectsListPage";
import ProjectEditorPage from "./pages/admin/ProjectEditorPage";
import SlidesListPage from "./pages/admin/SlidesListPage";
import SlideEditorPage from "./pages/admin/SlideEditorPage";
import TestimonialsListPage from "./pages/admin/TestimonialsListPage";
import TestimonialEditorPage from "./pages/admin/TestimonialEditorPage";
import SettingsPage from "./pages/admin/SettingsPage";

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
            <Route path="/services/amenagement-foncier" element={<AmenagementFoncierPage />} />
            <Route path="/services/amenagement-forestier" element={<AmenagementForestierPage />} />
            <Route path="/services/btp" element={<BtpPage />} />
            <Route path="/services/topographie" element={<TopographiePage />} />
            <Route path="/services/geomatique" element={<GeomatiquePage />} />
            <Route path="/services/informatique" element={<InformatiquePage />} />
            <Route path="/projets" element={<ProjectsPage />} />
            <Route path="/projets/:id" element={<ProjectDetailPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/actualites" element={<NewsPage />} />
            <Route path="/actualites/:id" element={<ArticleDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="slides" element={<SlidesListPage />} />
              <Route path="slides/:id" element={<SlideEditorPage />} />
              <Route path="articles" element={<ArticlesListPage />} />
              <Route path="articles/:id" element={<ArticleEditorPage />} />
              <Route path="projects" element={<ProjectsListPage />} />
              <Route path="projects/:id" element={<ProjectEditorPage />} />
              <Route path="testimonials" element={<TestimonialsListPage />} />
              <Route path="testimonials/:id" element={<TestimonialEditorPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
