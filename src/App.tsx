import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth";
import { AppRouter } from "./routes/AppRouter";
import ViewSubmissionsPage from './pages/ViewSubmissionsPage';
import EditDeadlinePage from './pages/EditDeadlinePage';
import SendReminderPage from './pages/SendReminderPage';

// Add Google Fonts link to the head of the document
const addGoogleFonts = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(link);
  
  // Apply the font to the entire body
  document.body.style.fontFamily = "'Poppins', sans-serif";
};

// Call the function to add the fonts
addGoogleFonts();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRouter />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
