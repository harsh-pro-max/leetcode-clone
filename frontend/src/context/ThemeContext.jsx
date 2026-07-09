import { createContext, useContext, useState, useEffect } from 'react';

// ✅ Available themes list (DaisyUI themes)
const THEMES = ['dark', 'light', 'cupcake', 'night', 'valentine', 'forest'];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ✅ Theme change function (for dropdown/buttons)
  const changeTheme = (newTheme) => {
    if (THEMES.includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  // ✅ Toggle between dark/light (quick toggle)
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, changeTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}