# Use Node.js 16 (matching your server)
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy all application files
COPY . .

# The application doesn't have package.json, so we'll run directly with node
# No need for npm install since there are no dependencies

# Set the entry point to run the CLI application
CMD ["node", "main.js"]