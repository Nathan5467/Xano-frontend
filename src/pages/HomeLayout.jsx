// src/pages/HomeLayout.jsx
import { Outlet } from 'react-router-dom';
//import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#1a1a1a'};
  transition: all 0.3s ease;
`;

const Navbar = styled.nav`
  padding: 1rem;
  background: ${props => props.isDarkMode ? '#2d2d2d' : '#f8f9fa'};
  border-bottom: 1px solid ${props => props.isDarkMode ? '#404040' : '#dee2e6'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MainContent = styled.main`
  padding: 2rem;
`;

const HomeLayout = () => {
  const { isDarkMode } = useTheme();

  return (
    <LayoutContainer isDarkMode={isDarkMode}>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default HomeLayout;
