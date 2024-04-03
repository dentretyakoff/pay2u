FROM node:lts-alpine3.18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
COPY .env /app/
RUN npm run build
CMD cp -r dist result_build