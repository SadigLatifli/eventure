import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { routeTree } from "./router";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppInitializer } from "@/components/AppInitializer";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
    {/* React Query Provider */}
    <QueryClientProvider client={queryClient}>
      {/* Auth Provider */}
      <AuthProvider>
        {/* Sonner Toaster for notifications */}
        <AppInitializer />
        <Toaster />
        {/* Router Provider */}
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
  );
}

export default App;
