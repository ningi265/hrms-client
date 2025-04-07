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
RUN for i in {1..5}; do \
      npm install --legacy-peer-deps && break || \
      (echo "Attempt $i failed, retrying in 5 seconds..." && sleep 5); \
    done

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginxinc/nginx-unprivileged:alpine

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Set permissions and start Nginx
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]