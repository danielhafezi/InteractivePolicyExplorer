# Interactive Policy Explorer

A Next.js application that demonstrates the capabilities of Large Language Models (specifically Google's Gemini Flash 2) in economic policy simulation. This tool allows users to explore how various economic and technological transition policies might impact different socio-economic groups through an intuitive visual interface.

## Features

- **Policy Configuration**: Define and customize economic policies related to green transition, AI/automation, or combined approaches
- **Socio-Economic Group Selection**: Choose from a variety of demographic and economic profiles
- **Gemini-Powered Simulation**: Leverage the capabilities of Google's Gemini Flash 2 model to simulate reactions to policies
- **Interactive Visualization**: See how different groups respond to policy changes with intuitive visuals and narratives

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- A Google AI Studio account with a Gemini API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/interactive-policy-explorer.git
   cd interactive-policy-explorer
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Configuration

You'll need to provide your own Gemini API key from Google AI Studio when running simulations. This key is not stored or shared outside your browser session.

## Project Structure

- `app/` - Next.js application code
  - `components/` - React components for the UI
  - `lib/` - Utility functions and type definitions
  - `api/` - API routes for server-side functionality
- `public/` - Static assets
- `styles/` - Global styles and Tailwind configuration

## Technologies Used

- **Next.js** - React framework for the frontend application
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Google Gemini API** - LLM capabilities for policy simulation
- **D3.js** - Data visualization library

## About This Project

This project was created as a personal exploration of how LLMs can be leveraged for agent-based modeling in economic contexts, particularly for understanding how socio-economic factors and work identity shape political preferences.

## License

This project is open source and available under the [MIT License](LICENSE). 