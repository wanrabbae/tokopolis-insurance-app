FROM golang:1.18.4 AS builder

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN go mod tidy
RUN go build main.go

# start the app
CMD [ "./main" ]