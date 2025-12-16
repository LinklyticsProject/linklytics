# Linkytics

A modern full-stack application built with NestJS and Next.js.

## 🏗️ Project Structure

This is a monorepo containing:

- **`apps/auth-service/`** - NestJS backend service for authentication
- **`apps/web-service/`** - Next.js frontend application

## 🚀 Tech Stack

### Backend (Auth Service)
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Jest** - Testing framework

### Frontend (Web Service)
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v10.19.0 or higher)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linkytics
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## 🏃‍♂️ Development

### Start all services in development mode
```bash
# Start auth service (runs on port 3000)
cd apps/auth-service
pnpm run start:dev

# Start web service (runs on port 3001)
cd apps/web-service
pnpm run dev
```

### Individual service commands

#### Auth Service
```bash
cd apps/auth-service

# Development
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod

# Testing
pnpm run test
pnpm run test:e2e

# Linting
pnpm run lint
```

#### Web Service
```bash
cd apps/web-service

# Development
pnpm run dev

# Production build
pnpm run build
pnpm run start

# Linting
pnpm run lint
```

## 🐳 Docker

### Build and run with Docker

1. **Build the Docker image**
   ```bash
   docker build -t linkytics .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 -p 3001:3001 linkytics
   ```

### Using Docker Compose

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down
```

## 🌐 API Endpoints

### Auth Service (Port 3000)
- `GET /` - Health check
- Additional endpoints will be documented as they're added

### Web Service (Port 3001)
- `GET /` - Home page
- `GET /api/*` - API routes (if any)

## 📁 Project Structure Details

```
linkytics/
├── apps/
│   ├── auth-service/          # NestJS backend
│   │   ├── src/
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   └── package.json
│   └── web-service/           # Next.js frontend
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       ├── public/
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in each service directory as needed:

#### Auth Service (.env)
```env
PORT=3000
NODE_ENV=development
```

#### Web Service (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific service
cd apps/auth-service
pnpm run test

# Run e2e tests
cd apps/auth-service
pnpm run test:e2e
```

## 📦 Building for Production

```bash
# Build all services
pnpm run build

# Build individual services
cd apps/auth-service && pnpm run build
cd apps/web-service && pnpm run build
```

## 🚀 Deployment

### Using Docker
```bash
# Build production image
docker build -t linkytics:latest .

# Run production container
docker run -p 3000:3000 -p 3001:3001 linkytics:latest
```

### Manual Deployment
1. Build all services
2. Set up reverse proxy (nginx) to route traffic)
3. Configure environment variables
4. Start services with PM2 or similar process manager

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Happy coding! 🎉**
