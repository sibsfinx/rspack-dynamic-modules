# Dynamic Module Loading Example

A demonstration project showcasing dynamic module loading in a React TypeScript environment using Rspack.

## Tech Stack

- React 19
- TypeScript 5.4
- Rspack 0.5.9
- Yarn 4.6.0
- Vitest 3.0.5
- Styled Components 6

## Prerequisites

- Node.js (latest LTS version recommended)
- Yarn 4.6.0 or higher

## Quick Start

```bash
# Install all dependencies
make install

# Start development server
make start

# Run all services
make run-all
```

## Available Commands

- `make install` - Install project dependencies
- `make start` - Start development server
- `make build` - Build for production
- `make preview` - Preview production build

## Development

```bash
# Run type checking
yarn typecheck

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with UI
yarn test:ui

# Run tests with coverage
yarn test:coverage
```

## CI/CD

The project uses GitHub Actions for continuous integration. The following checks are run on each PR to `main`:
- Type checking
- Test coverage
- Production build

## Project Structure

```
src/           # Source code
dist/          # Production build output
.github/       # GitHub Actions workflows
```

## License

This project is private and not intended for distribution.

