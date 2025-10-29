# Code Lens

Code Lens is a tool to visualize and understand codebases. It's composed of two main parts: a web interface and an agent.

- [Web](./web/README.md): The frontend application for visualizing the code.
- [Agent](./agent/README.md): The backend agent that analyzes the code and provides the data for visualization.

## Getting Started

To get started with Code Lens, you'll need to set up both the `agent` and the `web` applications.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Tushar98644/CodeLens.git
    cd code-lens
    ```

2.  **Set up the agent:**
    -   Navigate to the `agent` directory: `cd agent`
    -   Follow the instructions in the [agent's README](./agent/README.md).

3.  **Set up the web application:**
    -   Navigate to the `web` directory: `cd web`
    -   Follow the instructions in the [web's README](./web/README.md).

Once both the agent and the web application are running, you can open your browser to `http://localhost:3000` to start using Code Lens.
