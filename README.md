# Dev Toolbox

A modern, full-stack developer utility app built with React, Vite, Tailwind CSS, and Express.
Features include a JSON Formatter (with history), Base64 Encoder/Decoder, clipboard copy for all outputs, and a beautiful dark mode toggle.

---

## Features

- **JSON Formatter:** Format and validate JSON with instant feedback.
- **JSON History:** View a history of all formatted JSONs, including the date and time each was processed.
- **Base64 Encoder/Decoder:** Easily encode text to Base64 or decode Base64 to text.
- **Clipboard Copy:** One-click copy for all output fields, including JSON history.
- **Dark Mode:** Toggle between light and dark themes for comfortable coding at any time.

---

## How to Run the App

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd devtool-assignment
```

### 2. Install Dependencies

#### For the frontend:
```sh
npm install
```

#### For the backend:
```sh
cd backend
npm install
cd ..
```

### 3. Start the Backend Server

```sh
cd backend
npm run start
```
The backend will run on [http://localhost:5000](http://localhost:5000).

### 4. Start the Frontend (React + Vite)

In a new terminal, from the project root:

```sh
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173) (or as indicated in your terminal).

---

## Project Structure

```
devtool-assignment/
  backend/         # Express backend (API, SQLite DB)
  src/             # React frontend (components, styles)
  tailwind.config.js
  postcss.config.cjs
  ...
```

---

## Improvements Made

- Improved the UI with Tailwind CSS and a modern, responsive layout.
- Added a dark mode toggle for better accessibility and user comfort.
- Created a JSON History page that shows all previously formatted JSONs, including the exact date and time each was used.
- Added clipboard copy buttons to all output fields, including JSON history, for easy copying.

---

## What I'd Improve With More Time

- Further enhance the UI/UX with animations, better error handling, and accessibility improvements.
- Add user authentication so each user has a private JSON history.
- Add more developer tools (e.g., JWT decoder, UUID generator, etc.).

---