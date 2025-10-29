# Web

This directory contains the Next.js frontend application for Code Lens. It's responsible for visualizing the codebase and providing the user interface.

## Getting Started

To get the web application running locally, follow these steps:

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Run the development server:**
   ```bash
   bun run dev
   ```

   This will start the development server on [http://localhost:3000](http://localhost:3000).

## Architecture

The web application is built with Next.js and uses the following key technologies:

- **React Flow:** For rendering the interactive graph visualization.
- **Tailwind CSS:** For styling the application.
- **TypeScript:** For type-safe code.
- **TanStack Query:** For data fetching and caching.
- **CopilotKit:** For integrating AI-powered features.

The application is structured as follows:

- `src/app`: Contains the main application pages and layouts.
- `src/components`: Contains reusable UI components.
- `src/features`: Contains the main features of the application, such as the canvas and dashboard.
- `src/hooks`: Contains custom React hooks.
- `src/lib`: Contains utility functions and authentication logic.
- `src/providers`: Contains React context providers.
- `src/utils`: Contains utility functions.