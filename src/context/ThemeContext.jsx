import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const lightTheme = {
  bg: "#f5f5f5",
  text: "#222",
  card: "#fff",
  accent: "#f59023",
  sidebar: "#433224",
};

const darkTheme = {
  bg: "#1e1e1e",
  text: "#f1f1f1",
  card: "#2c2c2c",
  accent: "#f59023",
  sidebar: "#2a1e13",
};

export const ThemeProviderCustom = ({ children }) => {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{ dark, toggleTheme, theme: dark ? darkTheme : lightTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
