# Build Vue frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build Go backend
FROM golang:1.22-alpine AS backend-build
RUN apk add --no-cache gcc musl-dev
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 go build -o server .

# Final image
FROM alpine:latest
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=backend-build /app/backend/server ./server
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
RUN mkdir -p uploads
EXPOSE 8080
CMD ["./server"]
