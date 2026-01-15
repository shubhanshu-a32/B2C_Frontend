import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ThemeProvider from "./ThemeProvider";
import useAuthStore from "./store/authStore";
import ErrorBoundary from "./components/ErrorBoundary";

useAuthStore.getState().initAuth();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ErrorBoundary>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </ErrorBoundary>
    </React.StrictMode>
);