FROM node:22-alpine


RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
COPY ../demo-app/package*.json ./

USER node
WORKDIR /home/node/app
COPY --chown=node:node ../demo-app .

RUN npm install
RUN npm run build
