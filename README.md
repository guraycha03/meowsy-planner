# 🐱 Meowsy Planner: A Mindful Productivity App

**Meowsy Planner** is a high-fidelity, artisan organization web application built for university students who value both aesthetic beauty and functional clarity. It reimagines the digital "planner" as a tactile, slow-living experience—blending professional UX principles with a dreamy, scrapbook-inspired interface.

---

## ✨ Signature Features

### 🎨 The Artistic Note Engine
Our note-taking system isn't just a list—it's a collection of **9 unique, hand-crafted card variants**. Each note style features specific CSS-driven designs:
* **Washi Tape & Stickers:** Tactile headers and interactive digital stickers.
* **Physical Textures:** Designs including **Lined Paper (Hole Punched)**, **Graph Coffee**, **Stitched Borders**, and **Clipped Photos**.
* **Professional Typography:** Integrated with `Patrick Hand` for that authentic, handwritten journal feel.

### 🎠 Interactive Sticker System
Using `react-draggable`, users can personalize their notes by dragging and dropping decorative elements (Cats, Flowers, Moons) from the **Meowsy Sticker Panel**.
* **Responsive Persistence:** Stickers use percentage-based positioning ($x\%, y\%$) to ensure they remain perfectly placed whether viewed on a desktop or a mobile phone.

### 📅 Intentional Calendar & Agenda
* **Visual Rhythm:** A modern, minimal calendar grid with pulsing event indicators.
* **Focus View:** A dedicated agenda panel that filters plans for the selected day, providing a clutter-free view of your schedule.
* **Smooth Interactivity:** Backdrop-blurred modals and high-index layering for a premium feel.

### ✅ Smart Progress Tracking
* **Real-time Sync:** An event-driven architecture ensures that checking off a task on the checklist page instantly updates the progress rings on the dashboard.

---

## 📱 Professional UX/UI Standards

As a university project focused on **Front-End Excellence**, the following principles were strictly followed:
* **Mobile-First Design:** Fully responsive layouts that adapt to any screen size without losing the "scrapbook" aesthetic.
* **Tactile Feedback:** Every button and card utilizes `active:scale-95` and `hover:scale-105` to simulate a physical, bouncy response.
* **Consistency:** Shared Headers and Footers across all modules for a unified brand identity.
* **Scannability:** Information hierarchy is maintained through bold typography and clear visual separation (using Horizontal Rules and Blockquotes).

---

## 🛠️ Technical Stack

### Core Frameworks
* **Next.js 15 (App Router):** Modern React framework for optimized routing.
* **Tailwind CSS 4.0:** Advanced utility-first styling.
* **Lucide React:** Consistent, lightweight iconography.

### Specialized Libraries
* `react-draggable`: Powers the interactive sticker drag-and-drop system.
* `react-calendar`: Modified for custom "Slow Living" styling.
* `uuid`: Ensures unique identification for notes, stickers, and events.
* `LocalStorage`: Provides 100% private, client-side data persistence.

---

## 🚀 Getting Started

1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/yourusername/meowsy-planner.git](https://github.com/yourusername/meowsy-planner.git)
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
4.  **View the App:**
    Navigate to `http://localhost:3000` to experience the planner.

---

## 📐 Implementation Architecture

* **Global Context:** `NotificationContext` and `AuthContext` manage application state without "prop drilling."
* **Responsive Calculations:** The note-taking area uses a "Virtual Paper" logic, calculating the `scrollHeight` of textareas to expand the container dynamically.
* **Z-Index Strategy:**
    * `z-[1000]`: Navigation / Headers
    * `z-[110]`: Interaction Modals
    * `z-[100]`: Floating Sticker Panel
    * `z-[10]`: Draggable Stickers

---

## 🌿 Final Notes
Meowsy Planner is more than a tool; it is an experiment in **Artistic Frontend Engineering**. It prioritizes the "joy of use" as much as the utility of the task itself.

**Created by:** [Your Name/University Student]
**Primary Focus:** UI/UX Development & Creative Frontend