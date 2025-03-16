# Interactive Policy Explorer (IPE)

The Interactive Policy Explorer is a web-based application that democratizes economic policy understanding by allowing users to explore and visualize the potential impacts of various policies across different socio-economic groups. Using LLM-powered agent-based modeling, the tool simulates how policies related to AI adoption and green economic transitions affect political polarization, work identity, and socioeconomic outcomes.

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

- Policy input interface for configuring various policy scenarios
- Socioeconomic population modeling with diverse agent profiles
- LLM-powered agent simulation using Gemini Flash 2
- Interactive visualization dashboard for policy impact analysis
- Explainability features for transparent simulation results

## Project Structure

```
/src
  /components   # Reusable UI components
  /pages        # Application pages/routes
  /services     # API and external service integrations
  /models       # Data models and types
  /utils        # Utility functions
  /hooks        # Custom React hooks
  /styles       # Global styles and theme
  /assets       # Static assets
/public         # Public static files
```

## Technologies

- React with TypeScript
- Material UI for components
- D3.js for data visualization
- Zustand for state management
- Vite for build tooling

## License

MIT
