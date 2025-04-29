#!/bin/bash

# Exit on errors
set -e

# Clean previous build
rm -rf lambda-package lambda.zip
mkdir lambda-package

# Build Docker image
docker build -t lambda-sharp-img .

# Create container and extract files
CONTAINER_ID=$(docker create lambda-sharp-img)
docker cp $CONTAINER_ID:/var/task ./lambda-package
docker rm $CONTAINER_ID

# Create zip package
cd lambda-package
zip -r ../lambda.zip .
cd ..