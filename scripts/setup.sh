#!/bin/bash

echo "🚀 Setting up Data Modeling Studio Pro..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Setting up database..."
npx prisma db push

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Open port 3000 to view the application"
echo "  3. Optional: Run 'npx prisma studio' to view the database"
echo ""
echo "🎉 Happy coding!"