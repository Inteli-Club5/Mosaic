FROM node:20-alpine

WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY src/frontend/package.json ./src/frontend/
COPY src/backend/package.json ./src/backend/

# Install dependencies for frontend
WORKDIR /app/src/frontend
RUN npm install

# Copy frontend source code
COPY src/frontend/ ./

# Build frontend
RUN npm run build

# Install dependencies for backend  
WORKDIR /app/src/backend
RUN npm install

# Copy backend source code
COPY src/backend/ ./

# Expose port
EXPOSE $PORT

# Start backend server
CMD ["npm", "start"] 