import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { LoadingProvider, useLoading } from "./context/LoadingContext.tsx";
import { registerLoadingHandlers } from "./api/axiosInstance.ts";

// Small bridge component: connects the LoadingContext's functions
// to our Axios interceptors, once, when the app mounts.
const LoadingBridge = () => {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    registerLoadingHandlers(startLoading, stopLoading);
  }, [startLoading, stopLoading]);

  return null;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <LoadingBridge />
        <AuthProvider>
          <App />
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
);
