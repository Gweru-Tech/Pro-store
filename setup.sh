#!/bin/bash

# NtandoStore v7 Setup Script
# This script helps you set up the complete NtandoStore v7 platform

echo "🚀 Welcome to NtandoStore v7 Setup"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16.0.0 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to 16.0.0 or higher."
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm detected"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB 4.4 or higher."
    echo "   Visit: https://www.mongodb.com/"
    echo ""
    echo "   After installation, make sure MongoDB is running:"
    echo "   sudo systemctl start mongod  # Linux"
    echo "   brew services start mongodb-community  # macOS"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MongoDB detected"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating environment configuration..."
    cp .env.example .env
    
    # Generate random secrets
    SESSION_SECRET=$(openssl rand -hex 32)
    JWT_SECRET=$(openssl rand -hex 32)
    
    # Update .env with random secrets
    sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    
    echo "✅ Environment configuration created"
    echo "   📁 File: .env"
    echo "   🔐 Random secrets generated for security"
else
    echo "✅ Environment configuration already exists"
fi

# Create upload directories
echo ""
echo "📁 Creating upload directories..."
mkdir -p public/uploads/{courses,services,music,ads,courses/thumbnails}
chmod 755 public/uploads

echo "✅ Upload directories created"

# Initialize database
echo ""
echo "🗄️  Initializing database..."
node database/init.js

if [ $? -ne 0 ]; then
    echo "⚠️  Database initialization failed. You may need to start MongoDB first."
    echo "   Run 'node database/init.js' manually after starting MongoDB."
else
    echo "✅ Database initialized successfully"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "   1. Make sure MongoDB is running"
echo "   2. Start the server: npm start"
echo "   3. Visit your website: http://localhost:3000"
echo "   4. Access admin panel: http://localhost:3000/admin"
echo ""
echo "🔑 Admin Login:"
echo "   Username: Ntando"
echo "   Password: Ntando"
echo ""
echo "📚 Useful Commands:"
echo "   npm start           - Start production server"
echo "   npm run dev         - Start development server"
echo "   node database/init.js - Reinitialize database"
echo ""
echo "📖 Documentation: README.md"
echo "🌐 Support: admin@ntandostore.com"
echo ""
echo "🚀 Starting server in 3 seconds..."
sleep 3

# Start the server
npm start