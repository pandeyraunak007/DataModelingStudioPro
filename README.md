# Data Modeling Studio Pro

A modern, full-stack data modeling application built with Next.js 14, TypeScript, and PostgreSQL. Create, manage, and compare database models with an intuitive drag-and-drop interface.

## 🚀 Features

### Core Functionality
- **Visual Data Modeling**: Interactive drag-and-drop canvas for creating entities and relationships
- **Complete Compare**: Advanced model comparison with conflict detection and resolution
- **Professional UI**: Modern interface built with Tailwind CSS and Radix UI components
- **Real-time Updates**: Live collaboration and instant feedback

### Technical Features
- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better developer experience
- **PostgreSQL** with Prisma ORM for robust data management
- **NextAuth.js** for secure authentication
- **Responsive Design** that works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.17 or later
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd data-modeling-fullstack
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/datamodeling"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 4. Set Up the Database
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Usage Guide

### Getting Started
1. **Landing Page**: Overview of features and quick access to main functions
2. **Diagram View**: Create and edit data models with drag-and-drop interface
3. **Compare View**: Compare different versions of your models

### Creating Your First Model
1. Click "Start Modeling" from the homepage
2. Select the "Entity" tool from the left sidebar
3. Click on the canvas to create your first entity
4. Use the properties panel to customize entity details
5. Create relationships between entities using the relationship tool

### Comparing Models
1. Click "Compare Models" from the homepage
2. Select source and target models from the dropdown
3. Review the comparison results and resolve conflicts
4. Export the final merged model

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # Basic UI components (buttons, cards, etc.)
│   ├── diagram/          # Diagram-related components
│   └── compare/          # Model comparison components
├── lib/                   # Utility functions
└── prisma/               # Database schema and migrations
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

### Database Management
The application uses Prisma ORM for database management. Key models include:
- **User**: Authentication and user management
- **Project**: Container for data models
- **Entity**: Database tables/entities
- **Attribute**: Entity columns/fields
- **Relationship**: Connections between entities

### Adding New Features
1. Create components in the appropriate directory
2. Update database schema in `prisma/schema.prisma` if needed
3. Add API routes in `src/app/api/` for backend functionality
4. Update types in TypeScript files

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically with each push

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start the application: `npm start`

## 🔒 Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret for NextAuth.js

Optional (for OAuth):
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Database management with [Prisma](https://www.prisma.io/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

If you have any questions or need help getting started:
1. Check the documentation above
2. Look through existing issues on GitHub
3. Create a new issue if you can't find a solution

---

**Happy modeling!** 🎯