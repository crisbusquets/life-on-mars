// Set initial theme to prevent flash
(function () {
  const STORAGE_KEY = "life-on-mars-theme";
  const preference = localStorage.getItem(STORAGE_KEY) || "system";

  // Apply light or dark theme based on preference or system
  let theme = preference;
  if (preference === "system") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Set theme attribute
  document.documentElement.setAttribute("data-theme", theme);
})();
