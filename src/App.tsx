import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Enterprises from "@/pages/Enterprises";
import Safety from "@/pages/Safety";
import Records from "@/pages/Records";
import Visualization from "@/pages/Visualization";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/enterprises" element={<Layout><Enterprises /></Layout>} />
          <Route path="/safety" element={<Layout><Safety /></Layout>} />
          <Route path="/records" element={<Layout><Records /></Layout>} />
          <Route path="/visualization" element={<Layout><Visualization /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
