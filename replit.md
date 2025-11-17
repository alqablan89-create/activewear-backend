# Lift Me Up - Women's Activewear E-commerce Platform

## Overview

Lift Me Up is a bilingual (English/Arabic) e-commerce platform for women's activewear. The application features a modern, clean design with white backgrounds and orange accent colors, focusing on premium product presentation and seamless shopping experience across both languages with full RTL support.

The platform includes a customer-facing storefront with product browsing, cart management, and checkout functionality, alongside a comprehensive admin dashboard for managing products, categories, orders, and users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing instead of React Router

**UI Component System**
- Shadcn/ui component library (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom CSS variables for theming supporting light/dark modes
- Design follows premium activewear brand aesthetics (inspired by Lululemon, Alo Yoga)

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- React Context API for:
  - Authentication state (AuthContext)
  - Shopping cart state (CartContext with localStorage persistence)
- Custom hooks pattern for encapsulating business logic

**Internationalization**
- i18next for translation management
- Language detection based on browser settings
- Manual language toggle between English (LTR) and Arabic (RTL)
- RTL layout support through automatic CSS direction switching

**Form Management**
- React Hook Form for performant form handling
- Zod for schema validation via @hookform/resolvers
- Integration with Drizzle schema validators

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- ES Modules (type: "module")
- Custom middleware for request logging and JSON response capture

**Authentication & Session Management**
- Passport.js with Local Strategy for username/password authentication
- Express-session for session management with configurable secrets
- Scrypt for password hashing (Node.js crypto module)
- Role-based access control (admin vs regular users)
- Protected route middleware for admin-only endpoints

**API Design**
- RESTful API endpoints organized by resource type:
  - Public routes: `/api/products`, `/api/categories`
  - Protected routes: `/api/admin/*`
  - Auth routes: `/api/login`, `/api/register`, `/api/logout`
- JSON response format with consistent error handling
- Request validation and sanitization

**File Upload & Storage**
- Google Cloud Storage integration via @google-cloud/storage
- Uppy file uploader (AWS S3 compatible) on the frontend
- Object storage service abstraction layer
- Public object search paths for asset serving
- Replit-specific sidecar endpoint integration for credentials

### Data Layer

**Database**
- PostgreSQL as the primary database (via Neon serverless)
- Drizzle ORM for type-safe database queries and migrations
- Connection pooling with @neondatabase/serverless
- WebSocket support for serverless PostgreSQL connections

**Schema Design**
- **Users**: Authentication, profile data, admin role flag
- **Categories**: Bilingual names (English/Arabic), slugs, display ordering, images
- **Products**: Bilingual product information, pricing, inventory, images (JSONB array), videos, colors/sizes (JSONB arrays), feature flags (isNew, isFeatured, isOnSale)
- **Orders**: Order tracking, status, totals, shipping details
- **Order Items**: Line items with product references, quantities, prices
- **Discount Codes**: Coupon management with validation rules

**Data Relationships**
- Products belong to Categories (foreign key: categoryId)
- Orders have many OrderItems (one-to-many)
- OrderItems reference Products (foreign key: productId)
- Orders belong to Users (foreign key: userId)

### Key Features & Business Logic

**Shopping Cart**
- Client-side cart state with localStorage persistence
- Support for product variants (color, size selection)
- Bundle discount logic (10% off when buying T-shirt + Cap together)
- Cart item quantity management and removal

**Product Management**
- Multi-image upload support for product galleries
- Video URL support for product demonstrations
- Stock quantity tracking
- Sale pricing with compare-at-price display
- Feature flags for merchandising (New, Featured, On Sale)

**Bilingual Content**
- All user-facing text stored in both English and Arabic
- Dynamic content rendering based on selected language
- Slug generation for SEO-friendly URLs

**Admin Dashboard**
- Sales statistics and analytics
- Product CRUD operations
- Category management
- Order processing
- User management
- Discount code administration

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting (connection via DATABASE_URL environment variable)
- **Google Cloud Storage**: Object storage for product images and assets
- **Replit Object Storage**: Alternative storage integration with sidecar endpoint

### Third-Party Libraries

**Core Framework**
- React 18 with TypeScript
- Express.js server framework
- Drizzle ORM for database operations

**UI & Styling**
- Radix UI primitives for accessible components
- Tailwind CSS for utility styling
- Recharts for admin dashboard analytics
- Lucide React for iconography
- Google Fonts: Inter, DM Sans (Latin), Cairo, Tajawal (Arabic)

**Data Management**
- TanStack Query for API state
- i18next for internationalization
- React Hook Form + Zod for form validation

**Authentication**
- Passport.js with express-session
- bcryptjs for legacy password support (though scrypt is preferred)

**File Handling**
- Uppy (Core, Dashboard, React, AWS S3 plugin)
- @google-cloud/storage client

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key (defaults provided for development)
- `PUBLIC_OBJECT_SEARCH_PATHS`: Comma-separated bucket paths for object storage

### Development Tools
- TypeScript for type checking
- ESBuild for production bundling
- Vite plugins: runtime error overlay, Replit-specific development tools
- Drizzle Kit for database migrations