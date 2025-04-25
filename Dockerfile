FROM node:22 
WORKDIR /src
COPY package*.json ./
RUN npm install
# Prisma: generate client for correct target
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build
EXPOSE 3006
CMD ["npm", "start"]
