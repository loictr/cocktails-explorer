# Combined Dockerfile

# Stage 1: Build the frontend
FROM node:18 as build-frontend

WORKDIR /app

COPY front/package*.json ./
RUN npm install
COPY front/ .

# Build the frontend
RUN npm run build

# Stage 2: Build the API
FROM python:3.11-slim as build-api

WORKDIR /app

COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api/ .

# Stage 3: Combine frontend and API
FROM python:3.11-slim

WORKDIR /app

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Remove default Nginx html content
RUN rm -rf /usr/share/nginx/html/*

# Copy the built frontend files to Nginx html directory
COPY --from=build-frontend /app/dist/cocktails-explorer/browser /usr/share/nginx/html

# Copy the API files
COPY --from=build-api /app /app

# Remove default Nginx site configuration
RUN rm /etc/nginx/sites-enabled/default

# Copy your Nginx configuration
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV CHROMADB_PATH=/app/db

# Expose port 80
EXPOSE 80

# Start the API and Nginx
CMD ["sh", "-c", "flask run --host=0.0.0.0 --port=5000 & nginx -g 'daemon off;'"]
