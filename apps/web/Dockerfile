FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY . .

# Set production environment
ENV NODE_ENV=production

# Build the application (this will auto-run webhook setup)
RUN npm run build:production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
