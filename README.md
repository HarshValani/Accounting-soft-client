# Accounting Management App (Frontend)

A complete, modern Angular frontend application for multi-user **Accounting Management / Cashbook**.

Built with:
- **Angular 19/20** (Standalone Components, Signals, Reactive Forms, SCSS)
- **Indian Rupee (`₹`) Formatting** (e.g. `₹10,000`, `₹1,25,000`, `₹12,50,000`)
- **JWT Authentication Architecture** (Functional `authInterceptor`, `authGuard`, `loginGuard`)
- **Server-Ready REST Architecture** (Designed specifically for Node.js + Express + MongoDB backend)
- **Built-in Mock API Mode** (`environment.useMockApi: true`) allowing immediate full functionality without backend setup.

---

## Quick Start

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm start
# or
npx ng serve
```
Navigate to `http://localhost:4200/`.

---

## Authentication & Multi-User Data Isolation

- **Default Demo Credentials**:
  - Email: `john@example.com`
  - Password: `password123`
- **Data Isolation Rule**:
  - The frontend never sends `userId` in requests (`CreateEntryRequest`, `UpdateEntryRequest`, `CreateAccountRequest`, `getAccounts()`, `getEntries()`).
  - The backend identifies the user directly from the JWT token passed in the header:
    ```http
    Authorization: Bearer <JWT_TOKEN>
    ```

---

## Switching Between Mock & Real Backend

In `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  useMockApi: false // Set to false when your Node.js + Express + MongoDB backend is running!
};
```

When `useMockApi: false`, all calls route through standard Angular `HttpClient` to your Node.js REST endpoints:
- `POST /api/auth/login`
- `GET /api/accounts`
- `GET /api/accounts/balances`
- `POST /api/accounts`
- `PUT /api/accounts/:id`
- `DELETE /api/accounts/:id`
- `GET /api/entries?search=...&fromAccountId=...&toAccountId=...&dateFrom=...&dateTo=...&page=1&pageSize=10&sortBy=entryDate&sortDirection=desc`
- `POST /api/entries`
- `PUT /api/entries/:id`
- `DELETE /api/entries/:id`

---

## Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.interceptor.ts
│   │   │   └── token-storage.service.ts
│   │   ├── services/
│   │   │   └── notification.service.ts
│   │   └── mock/
│   │       ├── mock-data.ts
│   │       └── mock-store.service.ts
│   ├── features/
│   │   ├── auth/
│   │   │   └── login/
│   │   │       ├── login.component.ts
│   │   │       ├── login.component.html
│   │   │       └── login.component.scss
│   │   └── accounting/
│   │       ├── accounting-page/
│   │       │   ├── accounting-page.component.ts
│   │       │   ├── accounting-page.component.html
│   │       │   └── accounting-page.component.scss
│   │       ├── entry-form/
│   │       │   ├── entry-form.component.ts
│   │       │   ├── entry-form.component.html
│   │       │   └── entry-form.component.scss
│   │       ├── account-balances/
│   │       │   ├── account-balances.component.ts
│   │       │   ├── account-balances.component.html
│   │       │   └── account-balances.component.scss
│   │       ├── account-balance-card/
│   │       │   ├── account-balance-card.component.ts
│   │       │   ├── account-balance-card.component.html
│   │       │   └── account-balance-card.component.scss
│   │       ├── entries-table/
│   │       │   ├── entries-table.component.html
│   │       │   ├── entries-table.component.scss
│   │       │   └── entries-table.component.ts
│   │       └── entry-filters/
│   │           ├── entry-filters.component.html
│   │           ├── entry-filters.component.scss
│   │           └── entry-filters.component.ts
│   ├── models/
│   │   ├── account-balance.model.ts
│   │   ├── account.model.ts
│   │   ├── api-error.model.ts
│   │   ├── auth.model.ts
│   │   ├── entry.model.ts
│   │   ├── pagination.model.ts
│   │   └── user.model.ts
│   ├── services/
│   │   ├── account.service.ts
│   │   └── entry.service.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── confirm-dialog/
│   │   │   ├── modal/
│   │   │   └── notification-toast/
│   │   └── pipes/
│   │       ├── custom-date.pipe.ts
│   │       └── inr-currency.pipe.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.ts
│   ├── app.html
│   └── app.scss
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
├── styles.scss
└── index.html
```

---

## Features

1. **Add Entry**:
   - `From Account` & `To Account` selection loaded dynamically.
   - Validation ensuring `From Account != To Account` with error messaging.
   - Positive amount validation, optional note (max 500 chars), date selection.
2. **Account Balances**:
   - High-level summary cards (Total Accounts, Total Money In, Total Money Out, Net Balance).
   - Interactive balance cards for each account (`Balance = Money In - Money Out`).
   - Click card to filter entries belonging to that account (`From Account` OR `To Account`) with clear filter badge.
   - Modal to quickly add new accounts.
3. **All Entries Table**:
   - Debounced search across From Account, To Account, and Note.
   - Multi-field filters (`From Account`, `To Account`, `Date From`, `Date To`, `Clear Filters`).
   - Server-side sorting on `Date` and `Amount`.
   - Server-side pagination with page size picker.
   - Edit entry in modal dialog.
   - Delete entry with custom confirmation dialog.
   - Automatic real-time refresh of balances and tables on create, update, and delete.
4. **Notifications**:
   - Floating toast notification alerts for success, errors, warnings, and info.
