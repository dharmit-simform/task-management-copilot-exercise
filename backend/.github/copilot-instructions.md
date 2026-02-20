# Copilot Instructions for Backend

## Build, Test, and Development Commands

### Development
```bash
npm run dev        # Start development server with hot reload (via nodemon)
npm run build      # Compile TypeScript to JavaScript
npm start          # Run production build (requires build first)
```

### Testing
Currently no test suite is configured. Tests should be added following patterns from `.github/skills/testing-pattern/SKILL.md`.

### Verification
```bash
curl http://localhost:3000/health   # Verify server is running
```

## Architecture Overview

### Core Structure
This is a **Node.js + Express + TypeScript** backend following a layered architecture:

```
src/
├── server.ts           # Entry point - loads env and starts server
├── app.ts              # Express app configuration - middleware and routes
├── controllers/        # Request handlers (HTTP layer)
├── routes/             # API route definitions
├── middleware/         # Custom middleware (errorHandler, etc.)
└── models/             # Data models and interfaces (empty - for implementation)
```

### Request Flow
1. **Routes** (`routes/*.routes.ts`) - Define endpoints and map to controllers
2. **Controllers** (`controllers/*.controller.ts`) - Handle HTTP requests/responses
3. **Service Layer** (to be implemented) - Business logic, framework-agnostic
4. **Repository Layer** (to be implemented) - Data access (uses in-memory storage, no database)

### Key Files
- `server.ts` - Entry point, loads environment variables via `dotenv`
- `app.ts` - Express configuration, registers routes and error handler
- `middleware/errorHandler.ts` - Centralized error handling with `CustomError` interface

### Error Handling
- Use `CustomError` interface with optional `statusCode` property
- Error handler middleware catches all errors and returns consistent JSON response
- Error handler is registered **last** in middleware chain

### Environment Configuration
- Uses `.env` file for configuration (PORT=3000 by default)
- `.env.example` provides template
- Environment variables loaded via `dotenv` in `server.ts`

## Key Conventions

### TypeScript Configuration
- **Strict mode enabled** - All strict checks are on (noImplicitAny, strictNullChecks, etc.)
- Target: ES2020, CommonJS modules
- Output: `dist/` directory
- Source: `src/` directory

### File Organization
- **Route files**: `*.routes.ts` in `routes/` directory
  - Import and use Router from express
  - Export default router instance
  - Example: `health.routes.ts`
- **Controller files**: `*.controller.ts` in `controllers/` directory
  - Export named functions that match Request/Response signature
  - Return void, set response directly
  - Example: `health.controller.ts`
- **Middleware files**: `*.ts` in `middleware/` directory
  - Follow Express middleware signature
  - Example: `errorHandler.ts`

### Code Style (from .github/skills)
- **Early return pattern**: Use early returns over nested conditions
- **Arrow functions**: Prefer arrow functions over function declarations
- **Keep functions small**: Under 50 lines when possible
- **Keep files focused**: Under 200 lines when possible
- **Avoid generic names**: Don't use `utils`, `helpers`, `common`, `shared`
  - Use domain-specific names instead: `OrderCalculator`, `UserAuthenticator`, etc.
- **Library-first approach**: Search for existing npm libraries before writing custom code

### Architecture Principles (from .github/skills)
- **Separation of concerns**: 
  - Keep business logic out of controllers
  - Controllers only handle HTTP specifics
  - Database/data access in separate layer
- **Clean Architecture & DDD**:
  - Follow domain-driven design principles
  - Use ubiquitous language
  - Keep business logic framework-independent
- **No deep nesting**: Maximum 3 levels
- **Proper error handling**: Use typed catch blocks

### Testing Patterns (from .github/skills)
When adding tests:
- Follow **Test-Driven Development (TDD)**: Write failing test first
- Use **factory pattern**: Create `getMockX(overrides?: Partial<X>)` functions
- **Test behavior, not implementation**: Focus on public APIs
- **Descriptive test names**: Describe the behavior being tested
- Organize with `describe` blocks (Rendering, User interactions, Edge cases)
- Use Jest (when configured) with `beforeEach(() => jest.clearAllMocks())`

### Node.js Best Practices (from .github/skills)
- **Never use sync methods** in production (e.g., `fs.readFileSync`)
- **Validate at boundaries**: Request body, params, external data
- **Security checklist**: Input validation, parameterized queries, rate limiting, CORS, security headers
- **Status codes**: 400 (bad input), 401 (no auth), 403 (no permission), 404 (not found), 422 (validation), 500 (server error)
- **Async patterns**: Use `async/await` for sequential, `Promise.all` for parallel operations
- **Framework selection**: Express chosen for this project (mature, stable, maximum ecosystem)

### Development Context
This is an **evaluation test project** for AI-assisted development:
- **Backend-only candidates**: Implement task management API with in-memory storage
- **Full-stack candidates**: This backend serves an Angular frontend
- **No database required**: Use in-memory data structures
- **CORS**: May need to be enabled for frontend integration

### Adding New Features
When adding new endpoints:
1. Create route file in `routes/` (e.g., `tasks.routes.ts`)
2. Create controller file in `controllers/` (e.g., `tasks.controller.ts`)
3. Register route in `app.ts`
4. Add model/interface in `models/` if needed
5. Follow RESTful conventions
6. Implement validation at controller/route level
7. Use error handler for consistent error responses

### Module System
- Using **CommonJS** (require/module.exports via TypeScript compilation)
- Import syntax: ES6 imports in TypeScript source
- Compiled to CommonJS in `dist/` directory
