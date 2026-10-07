import AppRouter from "./routes/AppRouter";
import AuthProvider from "./providers/AuthProvider";
import ThemeProvider from "./providers/ThemeProvider";
import AppToaster from "./components/ui/AppToaster";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />

        <AppToaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;