# Energy Management Portal

## Overview

This is a full-stack energy management portal built for ONS Energy to manage client sites, utility bills, and energy analytics. The application provides a comprehensive dashboard for tracking electricity, gas, and water utilities across multiple client sites, with features for bill validation, site management, and consumption analytics.

The system is designed as a client management tool that allows energy consultants to monitor and validate utility bills, track site registrations, and analyze consumption patterns across their portfolio of managed properties.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with shadcn/ui components for styling and design system
- **TanStack Query** for server state management and API caching
- **Chart.js with React** for data visualization and analytics charts

### Backend Architecture
- **Express.js** server with TypeScript
- **Session-based authentication** using Replit's OpenID Connect integration
- **PostgreSQL** database with Neon serverless hosting
- **Drizzle ORM** for type-safe database operations and migrations
- **RESTful API** design with structured route handling

### Database Design
The schema supports multi-utility management with these core entities:
- **Users**: Client management staff with session-based authentication
- **Sites**: Properties with utility connections (MPAN/MPRN/SPID identifiers)
- **Bills**: Utility invoices with validation status and amount tracking
- **Solar/Smart Meter Installations**: Equipment tracking for renewable energy
- **Half-Hourly Data**: Time-series consumption data for detailed analytics
- **Documents**: File attachments for bills and site documentation

Key design decisions include using string IDs with UUID generation, decimal precision for financial amounts, and flexible utility type handling (electricity/gas/water).

### Authentication & Authorization
- **Replit Auth integration** with OpenID Connect protocol
- **PostgreSQL session storage** using connect-pg-simple
- **Route-level protection** with middleware-based authentication checks
- **User profile management** with automatic user creation on first login

### State Management
- **Server state**: TanStack Query handles API caching, background updates, and error handling
- **Client state**: React hooks for local component state
- **Form state**: React Hook Form with Zod validation schemas
- **UI state**: Local state for modals, filters, and dashboard tabs

## External Dependencies

### Database & Hosting
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit**: Development environment and deployment platform

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI Components & Styling
- **shadcn/ui**: Pre-built React components with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Chart.js**: Data visualization library for consumption and analytics charts

### Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **Drizzle Kit**: Database migration and schema management
- **Vite**: Fast development server with hot module replacement
- **ESBuild**: Production bundling for the Express server