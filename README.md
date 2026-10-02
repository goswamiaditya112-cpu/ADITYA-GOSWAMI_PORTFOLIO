# Aditya Goswami — macOS-Inspired Desktop Portfolio

An elegant, interactive personal portfolio website designed around the classic macOS desktop experience. Built with pure, modern web standards—no heavy frontend frameworks, build tools, or server-side dependencies.

---

## 🖥️ Overview

This portfolio showcases the background, skills, projects, and education of **Aditya Goswami**, an aspiring Full-Stack Developer. Rather than presenting content as a traditional vertical scroll page, the website behaves like an operating system desktop where each portfolio section opens in its own Finder-style application window.

---

## 🚀 Core Features

- **macOS Desktop Environment**:
  - Translucent frosted-glass top menu bar with a real-time updating 12-hour clock and system date.
  - Desktop folder shortcuts with custom macOS icon styling and active press feedback.
  - Frosted-glass application Dock with smooth micro-interaction hover lifts.
- **Window Management System**:
  - **Open & Restore**: Launch portfolio windows via desktop shortcuts; clicking a shortcut for an already open or minimized window restores and activates it.
  - **Close, Minimize & Maximize**: Authentic traffic-light controls (red, yellow, green) with geometry caching to restore previous window sizes.
  - **Bounded Dragging**: Header-only mouse and touch dragging bounded safely within the browser viewport.
  - **Multi-Window Layering**: Stacking z-index management with active-window highlighting and automatic focus handover upon closing.
- **Responsive Layout**:
  - Fluid adaptations across Desktop (1440px+), Laptop (1024px), Tablet (768px/850px), and Mobile devices (600px and 400px).
  - Touch dragging support on mobile and tablet headers.
- **Accessibility & Standards**:
  - Semantic HTML5 landmarks (`<header role="banner">`, `<nav>`, `<main>`, `<footer role="region">`).
  - Native `<button>` elements for keyboard launcher shortcuts with `:focus-visible` indicators.
  - Window dialog semantics with `aria-labelledby`, `role="region"`, and dynamic `aria-label` updates on controls.
  - Keyboard shortcuts (`Escape` key closes the active window and returns focus to its launcher).
  - Full respect for `@media (prefers-reduced-motion: reduce)`.
- **Zero-Dependency Static Architecture**:
  - Fast load times with zero build steps or npm installations.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup, accessible forms, and document structure.
- **CSS3**: Custom layout, gradients, backdrop blur filters, CSS Grid, Flexbox, and media queries.
- **Vanilla JavaScript**: Pure DOM manipulation, window state management, bounded pointer events, and event handling.

> **Note**: This project intentionally does not use React, Tailwind CSS, Bootstrap, Node.js, Express, databases, authentication, or third-party AI APIs.

---

## 📂 Project Structure

```text
MY PORTFOLIO/
├── index.html        # Standard static entry point for web servers and GitHub Pages
├── 01_mp.html        # Development source entry point (in exact parity with index.html)
├── style.css         # Complete responsive styles, themes, and micro-interactions
├── script.js         # Window management, dragging, accessibility, and live clock
├── assets/           # Wallpaper, profile picture, folder icons, and dock application icons
│   ├── aditya.jpg
│   ├── apple.png
│   ├── battery.png
│   ├── folder.png
│   ├── search.png
│   ├── wallpaper.jpg
│   └── dock/
│       ├── finder.png
│       ├── github.png
│       ├── notes.png
│       ├── safari.png
│       ├── settings.png
│       ├── terminal.png
│       ├── trash.png
│       └── vscode.png
├── .gitignore        # Standard Git ignore rules for OS and editor artifacts
└── README.md         # Project documentation and deployment guide
```

---

## 💻 How to Run Locally

Because this project is built entirely with client-side static web technologies, no build tools or package managers are required.

### Option 1: Direct File Opening
Simply double-click `index.html` (or `01_mp.html`) to open it directly in Google Chrome, Mozilla Firefox, Apple Safari, or Microsoft Edge.

### Option 2: Local Static Server (Recommended)
If you prefer running a local HTTP server:
- **VS Code**: Install the **Live Server** extension, right-click `index.html`, and select **Open with Live Server**.
- **Python**: Run `python -m http.server 8000` in the project folder and navigate to `http://localhost:8000`.
- **Node.js**: Run `npx serve` in the project folder.

---

## 🌐 Static Deployment Guide (GitHub Pages)

This project is completely prepared for instant deployment to GitHub Pages:

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - macOS desktop portfolio"
   ```
2. **Create a GitHub Repository**:
   - Create a new public repository on GitHub (e.g., `portfolio` or `username.github.io`).
   - Link the remote repository:
     ```bash
     git remote add origin https://github.com/<username>/<repo-name>.git
     git branch -M main
     git push -u origin main
     ```
3. **Enable GitHub Pages**:
   - In your GitHub repository, navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select the `main` branch and `/ (root)` folder, then click **Save**.
   - Your portfolio will be live at `https://<username>.github.io/<repo-name>/`.

---

## 📌 Intentional Scope Notes

- **AI Assistant**: Displays an authentic `"AI Assistant — In Progress"` window placeholder. No backend or LLM API is integrated.
- **Contact Form**: Frontend validation and default submit prevention are implemented; no backend email transport service is attached.
- **External Links**: GitHub, LinkedIn, certificates, and project repositories currently feature clean placeholder references ready to be updated with production URLs.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
