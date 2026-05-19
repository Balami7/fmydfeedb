# Backend Setup Guide

This document outlines the backend infrastructure that has been set up for your Next.js application.

## What's Been Configured

### 1. Database (Prisma + Supabase PostgreSQL)
- **ORM**: Prisma Client
- **Database**: Supabase PostgreSQL (cloud-hosted)
- **Schema**: Comprehensive database schema with tables for:
  - Users (admin accounts)
  - Products
  - Gallery
  - Services
  - Registrations
  - Survey Responses
  - Orders & Order Items

### 2. Authentication
- **JWT-based**: Token generation and verification
- **Password hashing**: bcryptjs for secure password storage
- **Protected routes**: Admin endpoints require valid JWT token

### 3. API Endpoints
All endpoints are ready to use:

#### Authentication
- `POST /api/admin/login` - Login with email/password, returns JWT token

#### Products (CRUD)
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create product (admin only, with image upload)
- `PUT /api/products` - Update product (admin only)
- `DELETE /api/products?id=...` - Delete product (admin only)

#### Gallery (CRUD)
- `GET /api/gallery` - Fetch all gallery items
- `POST /api/gallery` - Upload gallery image (admin only)
- `DELETE /api/gallery?id=...` - Delete gallery item (admin only)

#### Services (CRUD)
- `GET /api/services` - Fetch all services
- `POST /api/services` - Create service (admin only, with image upload)
- `PUT /api/services` - Update service (admin only)
- `DELETE /api/services?id=...` - Delete service (admin only)

#### Registrations
- `POST /api/registration` - Submit visitor registration form
- `GET /api/registration` - Fetch all registrations (admin only)

#### Surveys
- `POST /api/survey` - Submit survey response
- `GET /api/survey` - Fetch all survey responses (admin only)

#### Orders
- `POST /api/orders` - Create order (with payment proof upload)
- `GET /api/orders` - Fetch all orders

#### Admin Dashboard
- `GET /api/admin/dashboard` - Fetch all dashboard data (admin only)
- `POST /api/admin/dashboard` - Export data as CSV (admin only)

### 4. File Upload
- **Storage**: Local filesystem in `public/uploads/`
- **Supported**: Images only (jpg, png, gif, webp)
- **Size limit**: 5MB per file
- **Directories**:
  - `public/uploads/products/` - Product images
  - `public/uploads/gallery/` - Gallery images
  - `public/uploads/services/` - Service images
  - `public/uploads/payments/` - Payment proof documents

### 5. Input Validation
- **Zod**: Schema validation for all inputs
- **Error handling**: Proper HTTP status codes and error messages

## Supabase Setup

### Getting Your Supabase Database URL

1. **Sign Up / Log In**
   - Go to [supabase.com](https://supabase.com)
   - Create a new account or log in

2. **Create a New Project**
   - Click "New Project" in your dashboard
   - Enter a project name
   - Create a secure database password
   - Choose your region (closest to your users)
   - Click "Create new project" and wait for it to initialize

3. **Get Your Database Connection String**
   - In your Supabase dashboard, go to **Project Settings** (gear icon)
   - Click on the **Database** tab
   - Under "Connection string", select **URI** from the dropdown
   - Copy the full connection string (it looks like: `postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`)

4. **Get Your Password**
   - The password you set during project creation is needed
   - You can also reset it in Project Settings → Database → Reset password

5. **Update Your .env.local**
   Replace the `DATABASE_URL` in your `.env.local` file:
   ```env
   DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?schema=public"
   ```

   **Important:** Make sure to replace `[password]` with your actual database password and keep the `?schema=public` at the end.

### Supabase Connection String Breakdown
```
postgresql://               # Protocol
postgres.                   # Default user
[project-id]:               # Your project ID
[password]@                 # Your database password
aws-0-[region].pooler.     # Supabase pooler endpoint
supabase.com:6543/          # Host and port
postgres?schema=public      # Database name and schema
```

## Setup Instructions

### 0. Configure Supabase Connection (Required First Step!)
Before running any setup commands:
1. Follow the steps in the **Supabase Setup** section above
2. Update your `.env.local` with the PostgreSQL connection string
3. Make sure the connection string has `?schema=public` at the end

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed database with admin user
npx ts-node prisma/seed.ts
```

Or alternatively, use:
```bash
npm run setup:db
```

### 3. Environment Variables
The `.env.local` file has been created with default values. **Update with your Supabase credentials:**

```env
# Supabase PostgreSQL Connection String (required!)
# Get this from: Supabase Dashboard → Project Settings → Database → Connection String (URI)
DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?schema=public"

# JWT secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# API configuration
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/FMYDHUB"

# File upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=5242880
```

**⚠️ Critical Steps:**
1. Copy your DATABASE_URL from Supabase Project Settings
2. Replace `[project-id]`, `[password]`, and `[region]` with your actual values
3. Keep the `?schema=public` at the end
4. Save `.env.local` before running any setup commands
5. **Never commit `.env.local` to version control**

### 4. Start Development Server
```bash
npm run dev
```

The server will be available at `http://localhost:3000/FMYDHUB`

## Default Admin User

After running the seed script, use these credentials to log in:

- **Email**: admin@example.com
- **Password**: admin123

⚠️ **IMPORTANT**: Change this password in production!

## API Authentication

For protected endpoints, include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/FMYDHUB/api/admin/dashboard
```

## Database Schema

### Users
```
- id (primary key)
- email (unique)
- password (hashed)
- role ("admin" or "user")
- createdAt, updatedAt
```

### Products
```
- id, name, description, price, quantity
- image (optional file path)
- createdAt, updatedAt
```

### Gallery
```
- id, title, image
- createdAt, updatedAt
```

### Services
```
- id, name, description, image (optional)
- createdAt, updatedAt
```

### Registrations
```
- id, name, email, phone
- age, occupation, state, lga, address, gender (optional)
- createdAt, updatedAt
```

### SurveyResponse
```
- id, registrationId (optional)
- awareness, priorities, challenges, inclusion, accessibility (optional)
- createdAt, updatedAt
```

### Orders
```
- id, customerName, email, phone
- deliveryZone, deliveryFee, paymentProof (optional)
- status ("pending", "completed", "cancelled")
- createdAt, updatedAt
- items (relationship to OrderItems)
```

### OrderItems
```
- id, orderId, productId, quantity, price
```

## Troubleshooting

### Supabase Connection Issues
**Error: "failed to connect to the database"**
- Verify `DATABASE_URL` in `.env.local` is correct
- Check that the URL includes your database password
- Ensure the URL ends with `?schema=public`
- Test connection in Supabase dashboard under SQL Editor

**Error: "password authentication failed"**
- Your database password is incorrect
- Reset password in Supabase: Project Settings → Database → Reset Password
- Update `.env.local` with the new password

**Error: "project not found"**
- Your project ID in the connection string is wrong
- Copy the connection string again from Supabase Dashboard

### Prisma Errors

### Prisma client not generated
```bash
npx prisma generate
```

### Migrations failed
```bash
# If migrations are stuck, reset Supabase schema
npx prisma migrate reset --force
# This will apply all migrations from scratch to your Supabase database
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## Next Steps

1. **Update admin password** after first login
2. **Change JWT secret** in `.env.local` for production
3. **Set up HTTPS** for file uploads and authentication
4. **Configure Supabase backups** in Project Settings
5. **Implement email notifications** (optional)
6. **Add rate limiting** for public endpoints
7. **Enable RLS (Row Level Security)** for sensitive tables (optional)
8. **Set up logging and monitoring**

## Support

For more information, visit:
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT Documentation](https://jwt.io/)
