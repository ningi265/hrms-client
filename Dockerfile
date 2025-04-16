# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Use a more reliable npm registry and configure retries
RUN npm config set registry https://registry.npmmirror.com/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies with retry logic
RUN for i in 1 2 3 4 5; do \
      npm install --legacy-peer-deps && \
      npm install react-scripts --save && break || \
      (echo "Attempt $i failed, retrying in 5 seconds..." && sleep 5); \
    done

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app using Caddy
FROM caddy:alpine

# Copy build output to Caddy's web root
COPY --from=builder /app/build /usr/share/caddy

# Optional: Custom Caddyfile for advanced routing (spa fallback, etc.)
COPY Caddyfile /etc/caddy/Caddyfile