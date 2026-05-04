# Stage 1: Build
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./

# Configure pnpm to use a flat node_modules structure (hoisted)
# This prevents "module not found" errors with Angular CLI and peer dependencies in Docker
RUN npm install -g pnpm && \
    pnpm config set node-linker hoisted && \
    pnpm install

COPY . .

RUN pnpm build --configuration production

# Stage 2: Serve
FROM nginx:alpine

# Configuración de Nginx para SPA (redirige rutas a index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build-stage
# Path might need adjustment based on angular.json, but usually it's dist/[project]/browser
COPY --from=build-stage /app/dist/client/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
