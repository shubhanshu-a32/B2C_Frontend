import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ThemeProvider from "./ThemeProvider";
import useAuthStore from "./store/authStore";

useAuthStore.getState().initAuth();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
    </React.StrictMode>
);