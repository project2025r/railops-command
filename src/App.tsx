import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Transcripts from "./pages/Transcripts";
import Reports from "./pages/Reports";
import UploadStatistics from "./pages/UploadStatistics";
import CreateDivision from "./pages/admin/CreateDivision";
import CreateUser from "./pages/admin/CreateUser";
import ManageUsers from "./pages/admin/ManageUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transcripts" element={<Transcripts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/upload-statistics" element={<UploadStatistics />} />
          <Route path="/admin/create-division" element={<CreateDivision />} />
          <Route path="/admin/create-user" element={<CreateUser />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
