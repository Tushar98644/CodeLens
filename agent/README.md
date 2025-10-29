# Agent

This directory contains the backend agent for Code Lens. It's responsible for analyzing the codebase and providing the data for visualization to the frontend.

## Getting Started

To get the agent running locally, follow these steps:

1.  **Install dependencies:**

    ```bash
    bun install
    ```

2.  **Set up environment variables:**
    -   Create a `.env` file by copying the `.env.example`:
        ```bash
        cp .env.example .env
        ```
    -   Update the `.env` file with your credentials.

3.  **Run the agent:**

    ```bash
    bun run dev
    ```

    This will start the agent on port 8123.

## Architecture

The agent is built with TypeScript and uses the following key technologies:

- **LangChain/LangGraph:** For creating the agentic RAG pipeline.
- **CopilotKit:** For integrating AI-powered features.
- **Zod:** For schema validation.
