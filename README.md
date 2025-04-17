# PulsePlay

A sports-centric streaming platform targeting cost-conscious families and middle-class households in North America.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons/UI**: Lucide React
- **Development Tools**: ESLint, TypeScript strict mode

## Project Structure

```
/src
  /app                  # Next.js App Router structure
    /api                # Backend API routes
    /(auth)             # Authentication pages (login, signup)
    /(dashboard)        # Protected routes requiring authentication
    /(marketing)        # Public marketing/landing pages
  /components           # Reusable UI components
    /ui                 # Basic UI elements
    /features           # Feature-specific components
    /layouts            # Layout components
  /lib                  # Utility functions and shared logic
    /utils              # Helper functions
    /constants          # Application constants
  /services             # API service wrappers
  /types                # TypeScript type definitions
  /hooks                # Custom React hooks
  /styles               # Global styles
```

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
``` 