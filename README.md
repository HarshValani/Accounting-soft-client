# Accounting Management Client

A modern, responsive web application for accounting management built with Angular 18.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Account Management**: Create, edit, delete, and manage multiple accounts
- **Transaction Management**: Record and track financial transactions
- **Real-time Balances**: Live balance calculation and display
- **Advanced Filtering**: Filter transactions by date, account, and search terms
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Starting Balance Support**: Initialize accounts with starting balances
- **Data Persistence**: Automatic token storage and session management
- **Error Handling**: Comprehensive error messages and notifications
- **Loading States**: Visual feedback during data operations

## 🛠️ Technology Stack

- **Framework**: Angular 18 (Standalone Components)
- **Language**: TypeScript
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient
- **Forms**: Angular Reactive Forms
- **Styling**: SCSS
- **Build Tool**: Angular CLI

## 📋 Prerequisites

- Node.js (v18 or higher)
- Angular CLI (`npm install -g @angular/cli`)
- A running instance of the Accounting Management API

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Client-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Edit `src/environments/environment.ts` for development:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000'
   };
   ```
   
   Edit `src/environments/environment.prod.ts` for production:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-api-domain.com'
   };
   ```

## 🚦 Running the Application

### Development Mode
```bash
ng serve
```

The application will be available at `http://localhost:4200`

### Production Build
```bash
ng build --configuration production
```

The built files will be in the `dist/` directory.

### Production Server
```bash
ng build --configuration production
# Serve the dist/ directory with your preferred web server
```

## 📁 Project Structure

```
Client-Project/
├── src/
│   ├── app/
│   │   ├── core/              # Core functionality
│   │   │   └── auth/          # Authentication services
│   │   │       ├── auth.service.ts
│   │   │       └── token-storage.service.ts
│   │   ├── features/         # Feature modules
│   │   │   ├── accounting/    # Accounting feature
│   │   │   │   ├── accounting-page/
│   │   │   │   ├── account-balances/
│   │   │   │   ├── account-balance-card/
│   │   │   │   ├── entry-form/
│   │   │   │   ├── entries-table/
│   │   │   │   └── entry-filters/
│   │   │   └── auth/         # Authentication feature
│   │   │       ├── login/
│   │   │       └── register/
│   │   ├── models/           # Data models
│   │   │   ├── account.model.ts
│   │   │   ├── account-balance.model.ts
│   │   │   ├── auth.model.ts
│   │   │   ├── entry.model.ts
│   │   │   ├── pagination.model.ts
│   │   │   └── user.model.ts
│   │   ├── services/         # API services
│   │   │   ├── account.service.ts
│   │   │   └── entry.service.ts
│   │   ├── shared/           # Shared components
│   │   │   ├── components/
│   │   │   │   ├── confirm-dialog/
│   │   │   │   └── modal/
│   │   │   └── pipes/
│   │   │       ├── custom-date.pipe.ts
│   │   │       └── inr-currency.pipe.ts
│   │   ├── app.config.ts     # App configuration
│   │   ├── app.routes.ts     # App routing
│   │   ├── app.component.ts  # Root component
│   │   └── app.scss          # Global styles
│   ├── environments/         # Environment configurations
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html            # HTML entry point
│   └── styles.scss           # Global styles
├── angular.json              # Angular configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🎨 Key Components

### Authentication Page
- **Login Component**: User login with form validation
- **Register Component**: User registration with validation

### Accounting Page
- **Account Balances Component**: Display account cards with balances
- **Account Balance Card Component**: Individual account card with actions
- **Entry Form Component**: Form to create/edit transactions
- **Entries Table Component**: Paginated table with sorting and filtering
- **Entry Filters Component**: Advanced filtering options

### Shared Components
- **Modal Component**: Reusable modal dialog
- **Confirm Dialog Component**: Confirmation dialog for destructive actions

### Custom Pipes
- **Custom Date Pipe**: Formatted date display
- **INR Currency Pipe**: Indian Rupee formatting

## 🔐 Authentication Flow

1. **Registration**: User creates account with name, username, and password
2. **Login**: User authenticates with credentials
3. **Token Storage**: JWT token stored in localStorage
4. **Auto-Login**: Token checked on app load for persistent sessions
5. **Authorization**: Token sent with API requests
6. **Logout**: Token cleared and user redirected to login

## 💰 Balance Calculation

Account balances are calculated using the formula:

```
Balance = Starting Balance + Money In - Money Out
```

- **Starting Balance**: Initial balance set when creating account
- **Money In**: Sum of amounts received by the account
- **Money Out**: Sum of amounts sent from the account
- **Starting Balance Entries**: Special entries marked and excluded from calculation

## 🎯 Main Features

### Account Management
- Create accounts with optional starting balance
- Edit account names and activation status
- Delete accounts (only if no transactions exist)
- View account balances in real-time
- Filter transactions by account

### Transaction Management
- Create transactions between accounts
- Edit existing transactions
- Delete transactions
- View transaction history with pagination
- Sort by date, amount, or creation time
- Search by note or account names
- Filter by date range and accounts

### Starting Balance Feature
- Set starting balance when creating account
- Starting balance appears as special entry in table
- Starting balance entries are highlighted (yellow background)
- Starting balance entries cannot be edited or deleted
- Properly included in balance calculations

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Visual feedback during data operations
- **Error Messages**: Clear error notifications
- **Form Validation**: Real-time validation with error messages
- **Success Notifications**: Confirmation messages for successful operations
- **Account Selection**: Click account cards to filter transactions
- **Pagination**: Efficient handling of large datasets
- **Sorting**: Sort transactions by various fields
- **Filtering**: Advanced filtering options

## 🔧 Configuration

### Environment Variables

Configure API endpoints in environment files:

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

### API Configuration

The application uses the configured `apiUrl` for all HTTP requests. Ensure the API server is running and accessible.

## 🚀 Deployment

### Build for Production

```bash
ng build --configuration production
```

This creates an optimized build in the `dist/` directory.

### Deployment Options

1. **Static Hosting** (Recommended):
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

2. **Traditional Hosting**:
   - Deploy `dist/` directory to any web server
   - Configure server to serve index.html for all routes (SPA routing)

3. **Docker Deployment**:
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN ng build --configuration production
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

### Environment-Specific Builds

```bash
# Development build
ng build

# Production build
ng build --configuration production

# Staging build (if configured)
ng build --configuration staging
```

## 🧪 Testing

The project uses Angular's built-in testing framework.

### Run Unit Tests
```bash
ng test
```

### Run E2E Tests
```bash
ng e2e
```

### Test Coverage
```bash
ng test --code-coverage
```

## 🔒 Security Considerations

- **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
- **HTTPS**: Always use HTTPS in production
- **API Security**: Ensure API has proper CORS and authentication
- **Input Validation**: Client-side validation complements server-side validation
- **Error Handling**: Sensitive information not exposed in error messages

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify API server is running
   - Check `apiUrl` in environment files
   - Ensure CORS is configured on API server

2. **Authentication Issues**
   - Clear localStorage tokens
   - Verify API authentication endpoint
   - Check JWT token expiration

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Update Angular CLI: `ng update`
   - Check TypeScript version compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Use Angular signals for state management
- Follow Angular style guide
- Use standalone components
- Implement proper error handling
- Add loading states for async operations
- Validate forms on both client and server
- Use meaningful variable names
- Add comments for complex logic

## 🎨 Customization

### Styling
- Global styles in `src/styles.scss`
- Component-specific styles in component `.scss` files
- Uses SCSS for advanced styling

### Colors and Themes
- Modify color variables in component SCSS files
- Consider using CSS custom properties for theming

### API Integration
- Modify `apiUrl` in environment files
- Update service files for API changes
- Ensure response interfaces match API responses

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions, please open an issue on the repository.