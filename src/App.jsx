// src/App.jsx
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastContainer } from "react-toastify";
import { GlobalStyles } from './styles/GlobalStyles';
import router from "./router";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AppContent() {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      <GlobalStyles isDarkMode={isDarkMode} />
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-center" 
        theme={isDarkMode ? 'dark' : 'light'}
        autoClose={3000}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

