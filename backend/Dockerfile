FROM node:18 


WORKDIR /

COPY package*.json .
COPY tsconfig.json tsconfig.json

COPY . .

RUN npm install

CMD ["npm","run","dev"]