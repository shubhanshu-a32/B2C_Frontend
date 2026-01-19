import { LocationProvider } from './context/LocationContext';
import AppRouter from "./router/AppRouter";
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
        <LocationProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: { background: "#22c55e", color: "white" }, //green
              },
              error: {
                style: { background: "#ef4444", color: "white" }, //red
              },
              loading: {
                style: { background: "#3b82f6", color: "white" } //blue
              }
            }
            }
          />
        </LocationProvider>
      </div>
    </>
  );
}