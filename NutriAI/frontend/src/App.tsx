import { ThemeProvider } from "./context";
import AppRoutes from "./routes/AppRoutes";

/** Root application component – wraps all providers and routing. */
function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
