document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Theme constants
  const STORAGE_KEY = "life-on-mars-theme";
  const THEMES = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
  };

  // Accessibility announcements
  const ANNOUNCEMENTS = {
    LIGHT: "Switched to light mode",
    DARK: "Switched to dark mode",
    SYSTEM_LIGHT: "Following system preference: light mode",
    SYSTEM_DARK: "Following system preference: dark mode",
  };

  /**
   * Create screen reader only announcement element
   */
  function createAnnouncementElement() {
    const element = document.createElement("div");
    element.setAttribute("aria-live", "polite");
    element.setAttribute("aria-atomic", "true");
    element.className = "sr-only theme-announcement";
    element.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    document.body.appendChild(element);
    return element;
  }

  /**
   * Announce theme change to screen readers
   */
  function announceThemeChange(theme, isSystemChange = false) {
    let message;

    if (isSystemChange) {
      message = theme === THEMES.DARK ? ANNOUNCEMENTS.SYSTEM_DARK : ANNOUNCEMENTS.SYSTEM_LIGHT;
    } else {
      message = theme === THEMES.DARK ? ANNOUNCEMENTS.DARK : ANNOUNCEMENTS.LIGHT;
    }

    // Remove any existing announcements
    const existingAnnouncement = document.querySelector(".theme-announcement");
    if (existingAnnouncement) {
      existingAnnouncement.remove();
    }

    // Create new announcement
    const announcement = createAnnouncementElement();
    announcement.textContent = message;

    // Remove after announcement is made
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.remove();
      }
    }, 2000);
  }

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
   * Update toggle button accessibility attributes
   */
  function updateToggleAccessibility(currentTheme) {
    const toggleButton = document.querySelector(".theme-toggle-button");
    if (!toggleButton) return;

    const isCurrentlyDark = currentTheme === THEMES.DARK;
    const actionText = isCurrentlyDark ? "Switch to light mode" : "Switch to dark mode";
    const stateText = isCurrentlyDark ? "Dark mode is active" : "Light mode is active";

    // Update button attributes
    toggleButton.setAttribute("aria-label", `${actionText}. ${stateText}`);
    toggleButton.setAttribute("title", actionText);

    // Add pressed state for better accessibility
    toggleButton.setAttribute("aria-pressed", isCurrentlyDark.toString());

    // Update data attribute for CSS targeting
    toggleButton.setAttribute("data-theme-state", currentTheme);

    // Add role if not present
    if (!toggleButton.getAttribute("role")) {
      toggleButton.setAttribute("role", "switch");
    }

    // Ensure button has proper focus management
    if (!toggleButton.hasAttribute("tabindex")) {
      toggleButton.setAttribute("tabindex", "0");
    }
  }

  /**
   * Apply theme to document with enhanced feedback
   */
  function applyTheme(announceChange = false, isSystemChange = false) {
    const actualTheme = getActualTheme();
    const previousTheme = document.documentElement.getAttribute("data-theme");

    // Apply theme
    document.documentElement.setAttribute("data-theme", actualTheme);

    // Update accessibility
    updateToggleAccessibility(actualTheme);

    // Announce change if requested and theme actually changed
    if (announceChange && previousTheme !== actualTheme) {
      announceThemeChange(actualTheme, isSystemChange);
    }

    // Dispatch custom event for other scripts to listen to
    document.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: {
          theme: actualTheme,
          previousTheme: previousTheme,
          preference: getThemePreference(),
          isSystemChange: isSystemChange,
        },
      })
    );

    // Store theme in session for consistency across page loads
    sessionStorage.setItem("current-theme", actualTheme);
  }

  /**
   * Toggle between light and dark theme with enhanced UX
   */
  function toggleTheme(event) {
    // Prevent default if called from keyboard event
    if (event) {
      event.preventDefault();
    }

    const currentTheme = getActualTheme();
    const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

    // Store preference
    localStorage.setItem(STORAGE_KEY, newTheme);

    // Apply theme with announcement
    applyTheme(true, false);

    // Add temporary visual feedback
    const button = document.querySelector(".theme-toggle-button");
    if (button) {
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "";
      }, 150);
    }
  }

  /**
   * Enhanced keyboard event handler
   */
  function handleKeyboardToggle(event) {
    // Support both Enter and Space for activation
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme(event);
    }
    // Add escape key to close any potential dropdown states
    else if (event.key === "Escape") {
      event.target.blur();
    }
  }

  /**
   * Handle system theme preference changes
   */
  function handleSystemThemeChange(mediaQuery) {
    // Only update if user is following system preference
    if (getThemePreference() === THEMES.SYSTEM) {
      applyTheme(true, true);
    }
  }

  /**
   * Initialize theme toggle with enhanced accessibility
   */
  function initializeThemeToggle() {
    const toggleButton = document.querySelector(".theme-toggle-button");

    if (!toggleButton) {
      console.warn("Theme toggle button not found");
      return;
    }

    // Apply initial theme without announcement
    applyTheme(false, false);

    // Add enhanced event listeners
    toggleButton.addEventListener("click", toggleTheme);
    toggleButton.addEventListener("keydown", handleKeyboardToggle);

    // Add focus management
    toggleButton.addEventListener("focus", function () {
      this.setAttribute("data-focused", "true");
    });

    toggleButton.addEventListener("blur", function () {
      this.removeAttribute("data-focused");
    });

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    // Add visible focus indicators if not present
    if (!document.querySelector("#theme-toggle-focus-styles")) {
      const style = document.createElement("style");
      style.id = "theme-toggle-focus-styles";
      style.textContent = `
        .theme-toggle-button[data-focused="true"] {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
        
        .theme-toggle-button:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .theme-toggle-button {
            transition: none !important;
          }
          .theme-toggle-icon-sun,
          .theme-toggle-icon-moon {
            transition: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    console.log("Enhanced theme toggle initialized successfully");
  }

  /**
   * Add public API for external access
   */
  window.LifeOnMarsTheme = {
    getCurrentTheme: getActualTheme,
    getThemePreference: getThemePreference,
    setTheme: function (theme) {
      if (Object.values(THEMES).includes(theme)) {
        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(true, false);
      }
    },
    toggleTheme: toggleTheme,
  };

  // Initialize when DOM is ready
  initializeThemeToggle();

  // Handle page visibility changes to sync theme
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      // Re-sync theme when page becomes visible
      applyTheme(false, false);
    }
  });
});
