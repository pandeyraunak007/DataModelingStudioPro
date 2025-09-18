# 🚀 GitHub Codespaces Setup Guide

This repository is configured for GitHub Codespaces with automatic PostgreSQL database setup.

## 📋 Prerequisites

- GitHub account
- Access to GitHub Codespaces (free tier available)

## 🚀 Quick Start

### 1. Create Codespace
1. Go to your GitHub repository
2. Click the green "Code" button
3. Select "Codespaces" tab
4. Click "Create codespace on main"

### 2. Automatic Setup
The Codespace will automatically:
- ✅ Install Node.js 20
- ✅ Install all npm dependencies
- ✅ Set up PostgreSQL database
- ✅ Configure VS Code extensions
- ✅ Forward necessary ports (3000, 5432)

### 3. Manual Setup (if needed)
If automatic setup doesn't work, run:
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 4. Start Development
```bash
npm run dev
```

### 5. View Your App
- Click on the "Ports" tab in VS Code
- Open port 3000 to view your application
- Your app will be live at the provided URL

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio (database viewer)

# Code Quality
npm run lint         # Run ESLint
```

## 🗄️ Database

- **Type**: PostgreSQL
- **Host**: localhost:5432
- **Database**: datamodeling
- **Username**: postgres
- **Password**: postgres

The database is automatically configured and ready to use.

## 🔧 Features Available

### ✅ Working Features
- **Landing Page**: Professional homepage with feature showcase
- **Diagram View**: Interactive entity creation and editing
- **Compare View**: 3-step model comparison workflow
- **Database**: Full PostgreSQL setup with Prisma ORM
- **Authentication**: NextAuth.js ready for OAuth providers

### 🚀 Ready for Development
- **Type Safety**: Full TypeScript configuration
- **Styling**: Tailwind CSS with custom components
- **Database ORM**: Prisma with auto-generated client
- **Development Tools**: ESLint, Prettier, Git

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 app directory
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── diagram/          # Diagram functionality
│   └── compare/          # Model comparison
├── lib/                   # Utilities
└── prisma/               # Database schema
```

## 🎯 Getting Started with Development

1. **Explore the Landing Page**: Navigate to your forwarded port 3000
2. **Try Diagram View**: Click "Start Modeling" and create entities
3. **Test Compare Feature**: Click "Compare Models" and try the workflow
4. **Check Database**: Run `npm run db:studio` to view data
5. **Make Changes**: Edit components and see live updates

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically with each push

### Other Platforms
- **Netlify**: For static deployment
- **Railway**: For full-stack with database
- **Heroku**: Traditional cloud platform

## 🤝 Collaboration

- **Live Share**: Use VS Code Live Share for real-time collaboration
- **Multiple Codespaces**: Each team member can have their own environment
- **Branch-based**: Create new Codespaces for different features

## 🆘 Troubleshooting

### Port Issues
- Ensure ports 3000 and 5432 are forwarded
- Check the "Ports" tab in VS Code

### Database Connection
- Verify DATABASE_URL in .env.local
- Run `npx prisma db push` to reset schema

### Dependencies
- Delete node_modules and run `npm install`
- Clear npm cache: `npm cache clean --force`

## 🎉 Success!

Once everything is running, you'll have a professional, full-stack data modeling application ready for development and deployment!

Happy coding! 🚀