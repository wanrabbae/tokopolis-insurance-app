FROM node:14.21-alpine3.16 as build-stage

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install
RUN npm run build

EXPOSE 3002

# start the app
CMD [ "npm", "start" ]