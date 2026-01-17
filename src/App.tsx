import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { NameModal } from "./components/common/NameModal";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Contracts from "./pages/Contracts";
import ContractDetail from "./pages/ContractDetail";
import NewContract from "./pages/NewContract";
import Blueprints from "./pages/Blueprints";
import BlueprintEditor from "./pages/BlueprintEditor";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle the root redirect based on user status
function RedirectToApp() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedName = localStorage.getItem('contractCompassUserName');
    if (savedName) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const savedName = localStorage.getItem('contractCompassUserName');
  
  // If user hasn't provided name yet, show landing page
  if (!savedName) {
    return <LandingPage />;
  }
  
  // Otherwise, we're redirecting, so return nothing or a loading indicator
  return null;
}

// Wrapper component for handling navigation
function AppContent() {
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already provided their name
    const savedName = localStorage.getItem('contractCompassUserName');
    if (!savedName) {
      setShowNameModal(true);
    } else {
      setUserName(savedName);
    }
  }, []);

  const handleSaveName = (name: string) => {
    localStorage.setItem('contractCompassUserName', name);
    setUserName(name);
    setShowNameModal(false);
    navigate('/dashboard'); // Navigate to dashboard after saving name
  };

  return (
    <>
      <NameModal 
        isOpen={showNameModal} 
        onClose={() => {}} 
        onSave={handleSaveName} 
      />
      <Routes>
        <Route path="/" element={<RedirectToApp />} />
        <Route path="/dashboard" element={<Dashboard userName={userName} />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/contracts/new" element={<NewContract />} />
        <Route path="/contracts/:id" element={<ContractDetail />} />
        <Route path="/blueprints" element={<Blueprints />} />
        <Route path="/blueprints/:id" element={<BlueprintEditor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
