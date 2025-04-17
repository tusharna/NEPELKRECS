FROM node:22 
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3006
CMD ["npm", "start"]
