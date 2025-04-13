/**
 * Final Optimized Theme Toggle JavaScript
 */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Theme constants
  const STORAGE_KEY = "life-on-mars-theme";
  const THEMES = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
  };

  /**
   * Get user's theme preference
   */
  function getThemePreference() {
    return localStorage.getItem(STORAGE_KEY) || THEMES.SYSTEM;
  }

  /**
   * Get actual theme (resolves system preference)
   */
  function getActualTheme() {
    const preference = getThemePreference();

    if (preference === THEMES.SYSTEM) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEMES.DARK : THEMES.LIGHT;
    }

    return preference;
  }

  /**
   * Apply theme to document
   */
  function applyTheme() {
    const actualTheme = getActualTheme();
    document.documentElement.setAttribute("data-theme", actualTheme);

    // Update the toggle button's aria label based on current theme
    const toggleButton = document.querySelector(".theme-toggle-button");
    if (toggleButton) {
      toggleButton.setAttribute(
        "aria-label",
        actualTheme === THEMES.DARK ? "Switch to light mode" : "Switch to dark mode"
      );
      toggleButton.setAttribute("title", actualTheme === THEMES.DARK ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  /**
   * Toggle between light and dark theme
   */
  function toggleTheme() {
    const currentTheme = getActualTheme();
    const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme();
  }

  // Initialize
  applyTheme();

  // Add click handler to toggle button
  const toggleButton = document.querySelector(".theme-toggle-button");

  if (toggleButton) {
    toggleButton.addEventListener("click", toggleTheme);

    // Support keyboard accessibility
    toggleButton.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  // Listen for system preference changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    // Only update if using system preference
    if (getThemePreference() === THEMES.SYSTEM) {
      applyTheme();
    }
  });
});
