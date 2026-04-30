# Stage 1: Build
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build --configuration production

# Stage 2: Serve
FROM nginx:alpine

# Copy built files from build-stage
COPY --from=build-stage /app/dist/client/browser /usr/share/nginx/html

# Copy custom nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
