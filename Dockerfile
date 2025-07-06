FROM node:20-alpine

WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY src/frontend/package.json ./src/frontend/
COPY src/backend/package.json ./src/backend/

# Install frontend dependencies
WORKDIR /app/src/frontend
RUN npm install

# Go back to root and copy the entire project structure
WORKDIR /app
COPY . .

# Build frontend (now with access to blockchain directory)
WORKDIR /app/src/frontend
RUN npm run build

# Install backend dependencies  
WORKDIR /app/src/backend
RUN npm install

# Expose port
EXPOSE $PORT

# Start backend server
CMD ["npm", "start"] 