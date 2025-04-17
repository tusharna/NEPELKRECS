FROM Node:22 
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3006
CMD ["npm", "start"]
