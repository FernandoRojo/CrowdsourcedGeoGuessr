FROM node:12.16-alpine as build

WORKDIR /usr/src/app/client
RUN npm --version

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve 

CMD [ "serve", "-l", "80", "-s", "/usr/src/app/client/build" ]