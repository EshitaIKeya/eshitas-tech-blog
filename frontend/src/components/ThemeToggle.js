import { useState, useEffect } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function cycleTheme() {
    const themes = ["light", "dark", "eyecare"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }

  const labels = { light: "Light", dark: "Dark", eyecare: "Eye Care" };

  return (
    <button onClick={cycleTheme} className="theme-btn">
      {labels[theme] || "Light"}
    </button>
  );
}

export default ThemeToggle;
