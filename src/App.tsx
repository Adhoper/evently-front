import AppRouter from "./routes/AppRouter";
import AuthProvider from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;