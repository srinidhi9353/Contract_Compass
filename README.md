# Contract Compass

A comprehensive contract management application built with React, TypeScript, and Tailwind CSS.

## Getting Started

To run this application locally, follow these steps:

```sh
# Navigate to the project directory.
cd contract-compass

# Install the necessary dependencies.
npm install

# Start the development server.
npm run dev
```

## Architecture and Design Decisions

### Tech Stack Choice
- **React**: Chosen for its component-based architecture and rich ecosystem
- **TypeScript**: Provides type safety and improves code maintainability
- **Tailwind CSS**: Offers rapid UI development with utility-first approach
- **Shadcn/UI**: Provides accessible, customizable UI components
- **Vite**: Fast build tool and development server
- **Zustand**: Lightweight state management solution
- **React Router**: Handles client-side routing

### Component Architecture
- **Layout Components**: MainLayout, Header, Sidebar for consistent UI structure
- **Feature Components**: ContractTable, BlueprintCanvas, FieldPropertiesPanel
- **Reusable Components**: StatsCard, StatusBadge, Form elements
- **Store Pattern**: Zustand stores for contract and blueprint management

### State Management Approach
- **Zustand Stores**: Used for global state management (contracts, blueprints)
- **React Hooks**: Local component state with useState, useEffect
- **React Context**: For theme and UI state
- **Local Storage**: For persisting user preferences

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── blueprint/      # Blueprint editor components
│   ├── common/         # Shared components
│   ├── contract/       # Contract management components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helper functions
├── pages/              # Route-level components
├── store/              # Zustand stores
├── test/               # Test files
└── types/              # TypeScript type definitions
```

## Assumptions and Limitations

### Assumptions
- All data is stored client-side (localStorage)
- Backend integration would handle authentication and persistence
- User roles and permissions are not implemented
- Offline capability is assumed for demo purposes

### Limitations
- No real backend integration
- No user authentication
- No file upload for documents
- Limited validation on forms
- No real-time collaboration features

## Features

- Contract management dashboard
- Blueprint editor for contract templates
- Responsive design for all devices
- Modern UI with dark/light mode support
- Contract lifecycle management (Created → Approved → Sent → Signed → Locked)
- Status tracking and filtering

## Testing Strategy

The application includes unit tests for critical components and functionality:
- Component rendering tests
- User interaction tests
- State management tests
- Form validation tests

Run tests with: `npm run test`

## Deployment

This application is configured for deployment to GitHub Pages:

1. The repository includes a GitHub Actions workflow (`.github/workflows/gh-pages.yml`) that automatically builds and deploys the app when changes are pushed to the main branch
2. The Vite configuration is set up with the proper base path for GitHub Pages
3. To enable GitHub Pages deployment:
   - Go to your repository Settings > Pages
   - Select "GitHub Actions" as the source

## Copyright

© 2026 Srinidhi - All rights reserved.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Radix UI
- Lucide React

## Contributing

We welcome contributions! Feel free to submit a pull request or open an issue to discuss improvements.
