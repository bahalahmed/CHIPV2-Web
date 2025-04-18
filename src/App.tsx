import AppRoutes from "./routes";
import { ThemeProvider } from "@/components/theme-provider"



function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <div className="min-h-screen">
      <AppRoutes />
    </div>
        </ThemeProvider>

  );
}

export default App;
