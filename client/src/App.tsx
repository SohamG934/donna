import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

// Import pages
import Dashboard from "@/pages/Dashboard";
import PdfChat from "@/pages/PdfChat";
import ArgumentGenerator from "@/pages/ArgumentGenerator";
import LawSearch from "@/pages/LawSearch";
import SavedDocuments from "@/pages/SavedDocuments";
import History from "@/pages/History";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/pdf-chat" component={PdfChat} />
      <Route path="/argument-generator" component={ArgumentGenerator} />
      <Route path="/law-search" component={LawSearch} />
      <Route path="/saved-documents" component={SavedDocuments} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainLayout>
          <Router />
        </MainLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
