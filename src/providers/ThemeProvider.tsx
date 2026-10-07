import {
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  ThemeContext,
} from "../contexts/themeContext";

import type {
  Theme,
} from "../contexts/themeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

const getInitialTheme =
  (): Theme => {
    const storedTheme =
      localStorage.getItem(
        "evently_theme"
      );

    if (
      storedTheme ===
        "light" ||
      storedTheme === "dark"
    ) {
      return storedTheme;
    }

    const prefersDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    return prefersDark
      ? "dark"
      : "light";
  };

function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [
    theme,
    setTheme,
  ] =
    useState<Theme>(
      getInitialTheme
    );

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.toggle(
      "dark",
      theme === "dark"
    );

    root.style.colorScheme = theme;

    localStorage.setItem(
      "evently_theme",
      theme
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme(
      (current) =>
        current === "light"
          ? "dark"
          : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;