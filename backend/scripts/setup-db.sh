#!/bin/bash

# Cymbiose AI Backend - Database Setup Script
# This script sets up the development and test databases

set -e

echo "🔧 Setting up Cymbiose AI databases..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5433}
DB_USER=${DB_USER:-postgres}
DEV_DB_NAME="cymbiose_dev"
TEST_DB_NAME="cymbiose_test"

echo -e "${BLUE}Database Configuration:${NC}"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Dev DB: $DEV_DB_NAME"
echo "  Test DB: $TEST_DB_NAME"
echo ""

# Function to create database if it doesn't exist
create_db_if_not_exists() {
    local db_name=$1
    echo -e "${YELLOW}Checking if database '$db_name' exists...${NC}"
    
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $db_name; then
        echo -e "${GREEN}✓ Database '$db_name' already exists${NC}"
    else
        echo -e "${YELLOW}Creating database '$db_name'...${NC}"
        createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $db_name
        echo -e "${GREEN}✓ Database '$db_name' created successfully${NC}"
    fi
}

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
if pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
    echo -e "${GREEN}✓ PostgreSQL is running and accepting connections${NC}"
else
    echo -e "${RED}❌ Cannot connect to PostgreSQL at $DB_HOST:$DB_PORT${NC}"
    echo "Please ensure PostgreSQL is running and accessible."
    exit 1
fi

# Create databases
create_db_if_not_exists $DEV_DB_NAME
create_db_if_not_exists $TEST_DB_NAME

# Set up environment file
echo -e "${YELLOW}Setting up environment file...${NC}"
if [ ! -f .env ]; then
    cp env.example .env
    echo -e "${GREEN}✓ Created .env file from template${NC}"
    echo -e "${BLUE}Please review and update .env file with your configuration${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Generate Prisma client
echo -e "${YELLOW}Generating Prisma client...${NC}"
npm run db:generate
echo -e "${GREEN}✓ Prisma client generated${NC}"

# Push schema to development database
echo -e "${YELLOW}Pushing schema to development database...${NC}"
npm run db:push
echo -e "${GREEN}✓ Schema pushed to development database${NC}"

# Seed development database
echo -e "${YELLOW}Seeding development database with mock data...${NC}"
npm run db:seed
echo -e "${GREEN}✓ Development database seeded successfully${NC}"

echo ""
echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review the .env file and update if necessary"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Visit http://localhost:3001/health to check if the API is running"
echo "  4. Use 'npm run db:studio' to open Prisma Studio and view your data"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  npm run dev          - Start development server"
echo "  npm run db:studio    - Open database GUI"
echo "  npm run db:seed      - Re-seed database"
echo "  npm run db:reset     - Reset and re-migrate database"
