// src/components/Layout.jsx
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`layout ${isDarkMode ? 'dark' : 'light'}`}>
      <nav className="navbar">
        {/* Your navigation content */}
        <ThemeToggle />
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
