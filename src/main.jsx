import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ThemeProvider from "./ThemeProvider";
import useAuthStore from "./store/authStore";

useAuthStore.getState().initAuth();
// import useThemeStore from "./store/themeStore";

// if (useThemeStore.getState().theme === "dark") {
//   document.documentElement.classList.add("dark");
// }


// // apply saved theme early
// if (useThemeStore.getState().theme === "dark") document.documentElement.classList.add("dark");
// else document.documentElement.classList.remove("dark");

// // init auth
// useAuthStore.getState().init();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
    </React.StrictMode>
);