# Accounting Management Client

Angular 18 frontend for accounting management.

## 🚀 Quick Start

```bash
npm install
# Configure API in src/environments/environment.ts
ng serve
```

## 🛠️ Tech Stack

- Angular 18 (Standalone Components)
- TypeScript
- Angular Signals
- SCSS

## 🔧 Configuration

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com'
};
```

## 🚦 Scripts

```bash
ng serve           # Development server
ng build            # Production build
ng test             # Run tests
ng e2e              # E2E tests
```

## ✨ Features

- User authentication (JWT)
- Account management with starting balances
- Transaction tracking
- Real-time balance calculation
- Advanced filtering and sorting
- Responsive design

## 📁 Structure

```
src/app/
├── core/              # Auth services
├── features/          # Feature modules
│   ├── accounting/    # Main accounting UI
│   └── auth/          # Login/register
├── models/            # Data models
├── services/          # API services
└── shared/            # Shared components
```

## 🎨 Key Components

- **Account Balances**: Account cards with balance display
- **Entry Form**: Create/edit transactions
- **Entries Table**: Paginated, filterable table
- **Entry Filters**: Advanced filtering options

## 💰 Balance Formula

```
Balance = Starting Balance + Money In - Money Out
```

## 🚀 Deployment

```bash
ng build --configuration production
# Deploy dist/ directory to static hosting
```

## 📄 License

ISC