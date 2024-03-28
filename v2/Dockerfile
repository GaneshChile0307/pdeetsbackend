FROM node:18.20-alpine

WORKDIR /app

COPY ./package.json ./

RUN npm install
RUN apk update && apk add bash

COPY ./ ./

CMD ["npm", "run", "start-dev"]