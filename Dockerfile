FROM node:argon
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . /app
EXPOSE 3000
CMD ["yarn", "start"]