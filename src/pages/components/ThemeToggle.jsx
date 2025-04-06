// src/components/ThemeToggle.jsx
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import styled from 'styled-components';

const ToggleButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  position: relative;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isDarkMode ? '#fff' : '#1a1a1a'};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  }

  svg {
    font-size: 1.2rem;
  }
`;

export const ThemeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <ToggleButton
      isDarkMode={isDarkMode}
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label="Toggle theme"
    >
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </ToggleButton>
  );
};

