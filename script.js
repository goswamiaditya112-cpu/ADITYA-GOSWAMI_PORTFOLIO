console.log("SCRIPT JS IS LOADED");

// Track stacking order across all open windows
let highestZIndex = 100;

// Reference desktop shortcut container and all portfolio windows
const desktop = document.querySelector("#desktop");
const portfolioWindows = document.querySelectorAll(
  "main > section[id]:not(#welcome):not(#desktop)",
);

// Dragging state tracking
let dragTarget = null;
let startX = 0;
let startY = 0;
let startLeft = 0;
let startTop = 0;

/**
 * Bring a window to the front and make it the active window
 */
function bringToFront(windowElement) {
  if (!windowElement) return;

  highestZIndex += 1;
  windowElement.style.zIndex = highestZIndex;

  portfolioWindows.forEach(function (otherWindow) {
    otherWindow.classList.remove("active-window");
  });

  windowElement.classList.add("active-window");
}

/**
 * When the active window is closed or minimized,
 * activate the topmost remaining open window.
 */
function activateTopRemainingWindow() {
  let topWindow = null;
  let maxZ = -1;

  portfolioWindows.forEach(function (w) {
    if (
      w.classList.contains("window-open") &&
      !w.classList.contains("window-minimized")
    ) {
      const z = parseInt(w.style.zIndex || "100", 10);
      if (z > maxZ) {
        maxZ = z;
        topWindow = w;
      }
    }
  });

  if (topWindow) {
    portfolioWindows.forEach(function (w) {
      w.classList.remove("active-window");
    });
    topWindow.classList.add("active-window");
  }
}

/**
 * Keep window boundaries within the visible browser viewport
 */
function clampWindowToViewport(windowElement) {
  if (!windowElement) return;

  const isMobile = window.innerWidth <= 600;
  const menuBarHeight = isMobile ? 30 : 28;

  // On small mobile screens, if window hasn't been explicitly dragged on mobile,
  // allow responsive CSS media queries to dictate default position and width
  if (isMobile && windowElement.dataset.mobileDragged !== "true") {
    if (!windowElement.classList.contains("window-maximized")) {
      windowElement.style.left = "";
      windowElement.style.top = "";
    }
    return;
  }

  if (!windowElement.style.left && !windowElement.style.top) {
    return;
  }

  const rect = windowElement.getBoundingClientRect();
  const maxLeft = Math.max(0, window.innerWidth - rect.width);
  const maxTop = Math.max(menuBarHeight, window.innerHeight - rect.height);

  const curLeft = parseFloat(windowElement.style.left);
  const curTop = parseFloat(windowElement.style.top);

  if (!isNaN(curLeft)) {
    windowElement.style.left = `${Math.max(0, Math.min(curLeft, maxLeft))}px`;
  }
  if (!isNaN(curTop)) {
    windowElement.style.top = `${Math.max(menuBarHeight, Math.min(curTop, maxTop))}px`;
  }
}

/**
 * Toggle maximize / restore for a window
 */
function toggleMaximize(windowElement) {
  bringToFront(windowElement);

  const titleElem = windowElement.querySelector("h2");
  const windowTitle = titleElem ? titleElem.textContent.trim() : "Window";
  const maximizeButton = windowElement.querySelector(".window-maximize");

  if (windowElement.classList.contains("window-maximized")) {
    // Restore previous geometry
    windowElement.classList.remove("window-maximized");

    if (windowElement.dataset.restoreLeft !== undefined) {
      windowElement.style.left = windowElement.dataset.restoreLeft;
      windowElement.style.top = windowElement.dataset.restoreTop;
      windowElement.style.width = windowElement.dataset.restoreWidth;
      windowElement.style.height = windowElement.dataset.restoreHeight;

      delete windowElement.dataset.restoreLeft;
      delete windowElement.dataset.restoreTop;
      delete windowElement.dataset.restoreWidth;
      delete windowElement.dataset.restoreHeight;
    }

    if (maximizeButton) {
      maximizeButton.setAttribute(
        "aria-label",
        `Maximize ${windowTitle} window`,
      );
      maximizeButton.setAttribute("aria-pressed", "false");
    }

    clampWindowToViewport(windowElement);
  } else {
    // Save current state before maximizing
    windowElement.dataset.restoreLeft = windowElement.style.left || "";
    windowElement.dataset.restoreTop = windowElement.style.top || "";
    windowElement.dataset.restoreWidth = windowElement.style.width || "";
    windowElement.dataset.restoreHeight = windowElement.style.height || "";

    // Clear inline positioning so maximized CSS rules take over cleanly
    windowElement.style.left = "";
    windowElement.style.top = "";
    windowElement.style.width = "";
    windowElement.style.height = "";

    windowElement.classList.add("window-maximized");

    if (maximizeButton) {
      maximizeButton.setAttribute(
        "aria-label",
        `Restore ${windowTitle} window`,
      );
      maximizeButton.setAttribute("aria-pressed", "true");
    }
  }
}

// -------------------------------------------------------------
// 1. DESKTOP SHORTCUT LAUNCHER (DESKTOP FOLDERS ONLY)
// -------------------------------------------------------------
if (desktop) {
  desktop.addEventListener("click", function (event) {
    const trigger = event.target.closest("[data-window]");
    if (!trigger) return;

    event.preventDefault();

    const windowId = trigger.dataset.window;
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    // Restore if minimized
    windowElement.classList.remove("window-minimized");

    // Open window if not already open
    if (!windowElement.classList.contains("window-open")) {
      windowElement.classList.add("window-open");
    }

    // Ensure it is within visible screen bounds
    clampWindowToViewport(windowElement);

    // Bring to front as active window
    bringToFront(windowElement);

    // Save opener reference for returning keyboard focus when closed
    windowElement.dataset.openedBy = windowId;

    // Place keyboard focus on close button or window
    const closeBtn = windowElement.querySelector(".window-close");
    if (closeBtn) {
      closeBtn.focus();
    } else {
      windowElement.focus();
    }
  });
}

// -------------------------------------------------------------
// 2. WINDOW CONTROLS & INTERACTION SETUP
// -------------------------------------------------------------
portfolioWindows.forEach(function (windowElement) {
  const titleElem = windowElement.querySelector("h2");
  const windowTitle = titleElem ? titleElem.textContent.trim() : "Window";

  // Create traffic-light control buttons if not already present
  if (!windowElement.querySelector(".window-close")) {
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.classList.add("window-close");
    closeButton.setAttribute("aria-label", `Close ${windowTitle} window`);

    const minimizeButton = document.createElement("button");
    minimizeButton.type = "button";
    minimizeButton.classList.add("window-minimize");
    minimizeButton.setAttribute("aria-label", `Minimize ${windowTitle} window`);

    const maximizeButton = document.createElement("button");
    maximizeButton.type = "button";
    maximizeButton.classList.add("window-maximize");
    maximizeButton.setAttribute("aria-label", `Maximize ${windowTitle} window`);
    maximizeButton.setAttribute("aria-pressed", "false");

    windowElement.appendChild(closeButton);
    windowElement.appendChild(minimizeButton);
    windowElement.appendChild(maximizeButton);

    // Red Button: Close
    closeButton.addEventListener("click", function (event) {
      event.stopPropagation();

      windowElement.classList.remove(
        "window-open",
        "active-window",
        "window-maximized",
        "window-minimized",
      );

      // Clean up maximize state
      delete windowElement.dataset.restoreLeft;
      delete windowElement.dataset.restoreTop;
      delete windowElement.dataset.restoreWidth;
      delete windowElement.dataset.restoreHeight;
      delete windowElement.dataset.mobileDragged;

      activateTopRemainingWindow();

      // Return keyboard focus to the launcher button
      const openedById = windowElement.dataset.openedBy;
      if (openedById && desktop) {
        const opener = desktop.querySelector(`[data-window="${openedById}"]`);
        if (opener) {
          opener.focus();
        }
      }
    });

    // Yellow Button: Minimize
    minimizeButton.addEventListener("click", function (event) {
      event.stopPropagation();

      windowElement.classList.remove("active-window");
      windowElement.classList.add("window-minimized");

      activateTopRemainingWindow();

      // Return focus to the desktop shortcut
      const openedById = windowElement.dataset.openedBy;
      if (openedById && desktop) {
        const opener = desktop.querySelector(`[data-window="${openedById}"]`);
        if (opener) {
          opener.focus();
        }
      }
    });

    // Green Button: Maximize / Restore
    maximizeButton.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleMaximize(windowElement);
    });
  }

  // Clicking anywhere inside a window brings it to front
  windowElement.addEventListener("mousedown", function (event) {
    if (
      event.target.closest(".window-close, .window-minimize, .window-maximize")
    ) {
      return;
    }
    bringToFront(windowElement);
  });

  // Mouse drag initiation: only left button on header or top titlebar area
  windowElement.addEventListener("mousedown", function (event) {
    // Only primary (left) button
    if (event.button !== 0) return;

    // Must be an open, non-maximized window
    if (
      !windowElement.classList.contains("window-open") ||
      windowElement.classList.contains("window-maximized")
    ) {
      return;
    }

    // Do not initiate drag from controls or interactive elements
    if (
      event.target.closest(
        ".window-close, .window-minimize, .window-maximize, button, a, input, textarea, select",
      )
    ) {
      return;
    }

    const rect = windowElement.getBoundingClientRect();
    const isTopBar = event.clientY - rect.top <= 38;
    const isHeader = event.target.closest(".window-header") !== null;

    // Only allow dragging from .window-header or the 38px top titlebar
    if (!isHeader && !isTopBar) {
      return;
    }

    event.preventDefault();
    bringToFront(windowElement);

    dragTarget = windowElement;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    // Set concrete pixel coordinates before dragging begins
    windowElement.style.left = `${rect.left}px`;
    windowElement.style.top = `${rect.top}px`;
    windowElement.dataset.dragging = "true";
    if (window.innerWidth <= 600) {
      windowElement.dataset.mobileDragged = "true";
    }
  });

  // Touch drag initiation for mobile / tablet devices
  windowElement.addEventListener(
    "touchstart",
    function (event) {
      if (event.touches.length !== 1) return;

      if (
        !windowElement.classList.contains("window-open") ||
        windowElement.classList.contains("window-maximized")
      ) {
        return;
      }

      if (
        event.target.closest(
          ".window-close, .window-minimize, .window-maximize, button, a, input, textarea, select",
        )
      ) {
        return;
      }

      const touch = event.touches[0];
      const rect = windowElement.getBoundingClientRect();
      const isTopBar = touch.clientY - rect.top <= 38;
      const isHeader = event.target.closest(".window-header") !== null;

      if (!isHeader && !isTopBar) {
        return;
      }

      bringToFront(windowElement);

      dragTarget = windowElement;
      startX = touch.clientX;
      startY = touch.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      windowElement.style.left = `${rect.left}px`;
      windowElement.style.top = `${rect.top}px`;
      windowElement.dataset.dragging = "true";
      if (window.innerWidth <= 600) {
        windowElement.dataset.mobileDragged = "true";
      }
    },
    { passive: true },
  );
});

// -------------------------------------------------------------
// 3. GLOBAL DRAG MOVEMENT & RELEASE HANDLERS
// -------------------------------------------------------------
document.addEventListener("mousemove", function (event) {
  if (!dragTarget) return;

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;

  const windowWidth = dragTarget.offsetWidth;
  const windowHeight = dragTarget.offsetHeight;

  const menuBarHeight = window.innerWidth <= 600 ? 30 : 28;
  const maxLeft = Math.max(0, window.innerWidth - windowWidth);
  const maxTop = Math.max(menuBarHeight, window.innerHeight - windowHeight);

  const newLeft = Math.max(0, Math.min(startLeft + deltaX, maxLeft));
  const newTop = Math.max(menuBarHeight, Math.min(startTop + deltaY, maxTop));

  dragTarget.style.left = `${newLeft}px`;
  dragTarget.style.top = `${newTop}px`;
});

document.addEventListener(
  "touchmove",
  function (event) {
    if (!dragTarget || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    const windowWidth = dragTarget.offsetWidth;
    const windowHeight = dragTarget.offsetHeight;

    const menuBarHeight = window.innerWidth <= 600 ? 30 : 28;
    const maxLeft = Math.max(0, window.innerWidth - windowWidth);
    const maxTop = Math.max(menuBarHeight, window.innerHeight - windowHeight);

    const newLeft = Math.max(0, Math.min(startLeft + deltaX, maxLeft));
    const newTop = Math.max(menuBarHeight, Math.min(startTop + deltaY, maxTop));

    dragTarget.style.left = `${newLeft}px`;
    dragTarget.style.top = `${newTop}px`;
  },
  { passive: true },
);

function stopDragging() {
  if (dragTarget) {
    dragTarget.dataset.dragging = "false";
    dragTarget = null;
  }
}

document.addEventListener("mouseup", stopDragging);
document.addEventListener("touchend", stopDragging);
document.addEventListener("touchcancel", stopDragging);
window.addEventListener("blur", stopDragging);
document.addEventListener("mouseleave", stopDragging);

// Adjust open window positions when browser viewport is resized
window.addEventListener("resize", function () {
  portfolioWindows.forEach(function (windowElement) {
    if (
      windowElement.classList.contains("window-open") &&
      !windowElement.classList.contains("window-maximized")
    ) {
      clampWindowToViewport(windowElement);
    }
  });
});

// -------------------------------------------------------------
// 4. KEYBOARD SHORTCUTS & ACCESSIBILITY LISTENERS
// -------------------------------------------------------------
document.addEventListener("keydown", function (event) {
  // Pressing Escape closes the currently active window
  if (event.key === "Escape") {
    const activeWin = document.querySelector("main > section.active-window");
    if (activeWin && activeWin.classList.contains("window-open")) {
      const closeBtn = activeWin.querySelector(".window-close");
      if (closeBtn) {
        closeBtn.click();
      }
    }
  }
});

// -------------------------------------------------------------
// 5. CONTACT FORM PREVENT DEFAULT RELOAD
// -------------------------------------------------------------
const contactForm = document.querySelector("#contact form");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });
}

// -------------------------------------------------------------
// 6. MAC MENU BAR LIVE CLOCK & DATE
// -------------------------------------------------------------
function updateMenuBarClock() {
  const clockElement = document.getElementById("clock");
  const dateElement = document.getElementById("menu-date");

  const now = new Date();

  if (clockElement) {
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
  }

  if (dateElement) {
    const options = { weekday: "short", month: "short", day: "numeric" };
    dateElement.textContent = now.toLocaleDateString("en-US", options);
  }
}

updateMenuBarClock();
setInterval(updateMenuBarClock, 1000);

// -------------------------------------------------------------
// 7. PREVENT DEFAULT ON DECORATIVE HASH & MENU LINKS
// -------------------------------------------------------------
document.addEventListener("click", function (event) {
  const link = event.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  // Prevent page scroll jumps for placeholder hash links and menu bar items
  if (
    href === "#" ||
    (href && href.startsWith("#") && link.getAttribute("role") === "menuitem")
  ) {
    event.preventDefault();
  }
});
