import { Toaster } from "sonner";

import AppRouter from "./routes/AppRouter";
import AuthProvider from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <AppRouter />

      <Toaster
        position="top-right"
        richColors
        closeButton
      />
    </AuthProvider>
  );
}

export default App;