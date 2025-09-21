# World Pumps - E-Commerce Platform

A comprehensive e-commerce platform for water pumps and related equipment, built with Next.js 15, TypeScript, and modern web technologies.

## ✨ Features

### 🛒 **E-Commerce Features**

- Product catalog with categories and filtering
- Shopping cart functionality
- Secure checkout process
- PayFast payment integration
- Order management and tracking
- User authentication and profiles

### 👨‍💼 **Admin Panel**

- Complete admin authentication system
- Product management (CRUD operations)
- Order management and tracking
- User management
- Dashboard with analytics
- Image uploads via Cloudinary

### 🔐 **Authentication**

- User authentication with Better Auth
- Admin JWT-based authentication
- Protected routes for both users and admin
- Session management

### 🎨 **Modern UI/UX**

- Responsive design with Tailwind CSS
- Shadcn UI components
- Framer Motion animations
- Image optimization
- Loading states and error handling

## 🛠️ Technology Stack

### **Frontend**

- **Next.js 15.5.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern UI components
- **Framer Motion** - Animations and transitions
- **Zustand** - State management

### **Backend & Database**

- **PostgreSQL** - Primary database (Neon serverless)
- **Drizzle ORM** - Type-safe database operations
- **Better Auth** - User authentication
- **JWT** - Admin authentication
- **Cloudinary** - Image storage and optimization

### **Payments & Email**

- **PayFast** - Payment processing for South Africa
- **Nodemailer** - Email functionality
- **React Email** - Email templates

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Cloudinary account for image uploads

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd world-pumps
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Fill in the required environment variables in `.env.local`:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# JWT Secret for Admin Auth (REQUIRED)
JWT_SECRET="your-secure-jwt-secret-minimum-32-characters"

# Cloudinary for Image Uploads (REQUIRED)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Configuration (REQUIRED)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="no-reply@worldpumps.com"
CONTACT_TO="info@worldpumps.com"

# PayFast (Optional - for payments)
PAYFAST_MODE="sandbox"
PAYFAST_MERCHANT_ID="your-merchant-id"
PAYFAST_MERCHANT_KEY="your-merchant-key"

# Application URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="World Pumps"
```

4. **Set up the database**

```bash
# Run database migrations (if using Drizzle migrations)
npx drizzle-kit push

# Seed the database with initial data
pnpm run db:seed
```

5. **Start the development server**

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin panel routes
│   ├── (user)/            # User-facing routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── client/           # User-facing components
│   └── ui/               # Reusable UI components
├── db/                   # Database configuration
│   ├── schema.ts         # Database schema
│   └── seed.ts           # Seeding functions
├── lib/                  # Utility libraries
├── stores/               # Zustand stores
├── actions/              # Server actions
└── icons/                # Custom icons
```

## 🔑 Default Admin Credentials

After running the seed script:

- **Email**: `superAdmin@worldPumps.hi`
- **Password**: `opentheadminpanel`

⚠️ **Important**: Change these credentials in production!

## 📊 Available Scripts

```bash
# Development
pnpm run dev          # Start development server

# Building
pnpm run build        # Build for production
pnpm run start        # Start production server

# Database
pnpm run db:seed      # Seed database with initial data

# Code Quality
pnpm run lint         # Run ESLint
```

## 🔐 Authentication Systems

### User Authentication (Better Auth)

- Email/password registration and login
- Session management
- Password reset functionality
- Email verification

### Admin Authentication (JWT)

- Secure JWT-based authentication
- Role-based access control (admin, superadmin)
- Protected admin routes
- Session persistence

## 💳 Payment Integration

### PayFast (Primary)

- Secure payment processing for South African market
- Sandbox and production modes
- Automated payment verification
- Order status updates

### Stripe (Alternative)

- International payment processing
- Credit card payments
- Webhook integration

## 📧 Email System

### Automated Emails

- Order confirmations
- Contact form notifications
- User registration confirmations
- Admin notifications

### Email Templates

- Responsive HTML templates with React Email
- Branded email design
- Dynamic content injection

## 🛡️ Security Features

- **Input validation** with Zod schemas
- **SQL injection protection** with Drizzle ORM
- **Authentication middleware** for protected routes
- **CSRF protection** with form tokens
- **Environment variable validation**
- **Secure password hashing** with bcrypt

## 🎨 UI Components

Built with Shadcn UI and includes:

- Form components with validation
- Data tables with sorting/filtering
- Modal dialogs and sheets
- Toast notifications
- Loading states and skeletons
- Responsive navigation

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Progressive Web App features

## 🚀 Deployment

### Environment Setup

1. Set up production database (Neon, Vercel Postgres, etc.)
2. Configure Cloudinary for image storage
3. Set up email service (Gmail, SendGrid, etc.)
4. Configure PayFast merchant account

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- Set `NODE_ENV=production`
- Use secure JWT secrets
- Configure proper CORS origins
- Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Email: support@worldpumps.com

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app with React Native
- [ ] Advanced inventory management
- [ ] Multi-vendor marketplace
- [ ] AI-powered product recommendations
