FROM node:20-alpine

WORKDIR /app

# Accept build arguments
ARG APP_VERSION
ARG API_URL

# Set environment variables
ENV VITE_APP_VERSION=$APP_VERSION
ENV VITE_API_URL=$API_URL

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

CMD [ "npm", "run", "preview" ]
