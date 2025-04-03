// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --bg-primary: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    --bg-secondary: ${props => props.isDarkMode ? '#2d2d2d' : '#f8f9fa'};
    --text-primary: ${props => props.isDarkMode ? '#ffffff' : '#1a1a1a'};
    --text-secondary: ${props => props.isDarkMode ? '#b3b3b3' : '#6c757d'};
    --border-color: ${props => props.isDarkMode ? '#404040' : '#dee2e6'};
    --accent-color: #0d6efd;
  }

  body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: all 0.3s ease;
  }

  .card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
  }

  .modal-content {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  .form-control {
    background-color: var(--bg-secondary);
    border-color: var(--border-color);
    color: var(--text-primary);
  }

  .table {
    color: var(--text-primary);
  }
`;
