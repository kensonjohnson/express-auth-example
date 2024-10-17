#!/bin/bash

echo "Checking for docker..."
if ( which docker > /dev/null 2>&1)
then
  echo "✅ Docker ready"
else
  echo "Docker not installed. Please install for your OS and try again."
  echo "https://docs.docker.com/get-started/get-docker/"
  exit 1
fi

CONTAINER_NAME="express-auth-example-db"

# Check that we are in a state to create a container
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ] 
then
  echo "Docker container express-auth-example-db already exists!"
  echo "Exiting..."
  exit 1
fi

echo "Creating docker container for postgres..."
docker run --name $CONTAINER_NAME -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres > /dev/null 2>&1
echo "✅ Container running"

# Wait until the postgres server is ready
until  docker exec $CONTAINER_NAME pg_isready > /dev/null 2>&1
do
  echo "Waiting for postgres server to start..."
  sleep 1
done

echo "✅ Postgres ready"

echo "Setting up database tables..."
docker cp initialize.sql $CONTAINER_NAME:/initialize.sql > /dev/null 2>&1
docker exec -u postgres $CONTAINER_NAME psql postgres postgres -f /initialize.sql > /dev/null 2>&1
echo "✅ Tables ready"

echo "Preparing .env file..."
cp .env.example .env
echo "✅ .env file ready"

echo "✅ All done!"

