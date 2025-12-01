# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Install MongoDB shell for debugging (optional)
RUN apk add --no-cache mongodb-tools

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Create necessary directories
RUN mkdir -p data backups

# Expose port (if your app becomes a web server)
EXPOSE 3000

# Default command (CLI application)
CMD ["node", "main.js"]
