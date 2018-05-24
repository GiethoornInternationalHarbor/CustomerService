FROM node:8-alpine AS build

# Create the app directory
WORKDIR /app

# Copy package json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

FROM build as publish
RUN npm run-script build

FROM node:8-alpine AS runtime
WORKDIR /app

COPY --from=publish /app/package*.json ./
COPY --from=publish /app/dist ./dist

# Set the node environment
ENV NODE_ENV=production

RUN npm install --only=production

# Expose the default port
EXPOSE 3000

# set the user
USER node

CMD [ "node" , "dist/index.js" ]
