# ScholarPay

ScholarPay is a comprehensive school fee management system designed to simplify how schools manage student fees, collect payments in installments, and maintain financial records. It provides schools with an intuitive platform to register students, create flexible fee structures, track payment history, and generate accurate financial reports.

## Features

- **👨‍🎓 Student Management** - Register and manage students with detailed records
- **💳 Installment Payments** - Allow parents to pay school fees in multiple installments
- **📊 Payment Tracking** - Monitor paid, pending, and overdue fees with complete payment history
- **🔒 Secure & Reliable** - Securely store and manage school financial records
- **📱 Admin Dashboard** - Real-time insights and metrics on payments and students
- **🔔 Notifications** - Keep stakeholders informed about payment status

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) - React framework with App Router
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) - High-quality React components
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest) - Server state management
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Type-safe form validation
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Dates**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

## Project Structure

```text
scholarpay/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin dashboard routes (requires authentication)
│   │   ├── dashboard/            # Dashboard overview
│   │   │   └── _resources/       # Dashboard-specific resources
│   │   │       ├── api/          # API calls (get-dashboard-metrics.ts)
│   │   │       └── constants/    # Constants (metrics, fee-status, quick-actions)
│   │   ├── fees/                 # Fee record management
│   │   │   ├── create/           # Create new fee record
│   │   │   └── _resources/
│   │   │       ├── api/          # Fee-related API calls
│   │   │       └── components/   # Fee-specific components
│   │   ├── payments/             # Payment tracking & history
│   │   │   ├── [id]/             # Payment/installment details
│   │   │   └── _resources/
│   │   │       ├── api/          # Payment API calls
│   │   │       └── components/   # Payment-specific components
│   │   ├── students/             # Student management
│   │   │   ├── [id]/             # Student details
│   │   │   └── _resources/
│   │   │       ├── api/          # Student API calls
│   │   │       └── components/   # Student-specific components
│   │   └── notifications/        # Notifications center
│   │       └── _resources/
│   │           └── api/          # Notification API calls
│   ├── (public)/                 # Public routes
│   │   ├── pay/                  # Payment portal
│   │   │   └── [token]/          # Dynamic payment page
│   │   └── layout.tsx            # Public layout
│   ├── login/                    # Authentication
│   │   └── _resources/
│   │       ├── api/              # Login API
│   │       └── schema/           # Login form schema
│   ├── _resources/               # Root-level shared resources
│   │   ├── api/                  # Global API calls (logout, register-school)
│   │   ├── components/           # Shared auth components
│   │   └── schema/               # Shared schemas
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # School registration page
│   └── not-found.tsx             # 404 page
├── components/                   # Reusable components
│   ├── layouts/                  # Layout components (AdminLayout, Sidebar, TopBar)
│   ├── shared/                   # Shared components (DataTable, Pagination, StatusBadge, etc.)
│   └── ui/                       # Base UI components (Button, Input, Select, etc.) - Shadcn
├── lib/                          # Utilities and configuration
│   ├── api/                      # API client setup
│   ├── store/                    # Redux store configuration
│   │   └── slices/               # Redux slices (auth, school, student, ui)
│   └── utils.ts                  # General utilities
├── hooks/                        # Custom React hooks
├── utils/                        # Helper functions (auth, formatting)
├── schemas/                      # Zod validation schemas
├── types/                        # TypeScript type definitions
├── constants/                    # Global constants
├── providers/                    # Context/Provider setup
├── public/                       # Static assets
├── styles/                       # Global styles
└── config files/                 # Next.js, TypeScript, Tailwind configs

```

## \_resources Pattern

The `_resources` folder is a convention used throughout the project to keep route-specific logic organized:

- **`api/`** - API functions specific to that route/feature (e.g., `get-students.ts`, `create-fee-record.ts`)
- **`components/`** - React components used only by that route (e.g., `student-selector.tsx`)
- **`constants/`** - Constants specific to that feature (e.g., fee statuses, metrics)
- **`schema/`** - Zod validation schemas for forms in that route
- **`types/`** - TypeScript types/interfaces for that route

This keeps the codebase modular and makes it easy to find everything related to a specific feature.

## Getting Started

### Prerequisites

- Node.js 18+ (includes npm)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd scholarpay
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables (create a `.env.local` file):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000  # Adjust based on your backend
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The app auto-reloads as you edit files.

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Key Concepts

### Authentication Flow

- School registration on the landing page (`/`)
- Login at `/login`
- Admin dashboard requires authentication via JWT tokens stored in Redux
- Sessions persist across page refreshes using Redux Persist

### Data Fetching

- Uses TanStack React Query for server state management
- API calls defined in `_resources/api/` folders
- Automatic caching, refetching, and error handling

### Form Validation

- All forms use React Hook Form + Zod
- Schemas defined in `_resources/schema/` folders
- Type-safe validation with helpful error messages

### State Management

- **Redux**: Global state (auth, current school, UI preferences)
- **React Query**: Server state (students, payments, fees)
- **Local State**: Component-specific state (UI toggles, form inputs)

## API Integration

The project uses an Axios-based API client (`lib/api/api-client.ts`) that:

- Handles authentication headers automatically
- Manages pagination
- Provides type-safe responses
- Handles error responses consistently

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)

## License

This project is private and confidential.
