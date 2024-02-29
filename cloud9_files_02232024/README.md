// start mongo container
docker start mongo-example

// start application
deno run -Ar --unstable index.js



// build and run chuck norris from Dockerfile
docker build -t chucknorris .
docker run -d -p 8080:8080 -v ${PWD}:/app chucknorris




Delete a container: docker container rm c1ebc100c7f8
List all containers: docker ps -a


Get docker image: docker pull mongo:latest

Create container from mongo image: 
docker run -d -p 27017:27017 --name=mongo-example mongo:latest

Start mongo shell: docker exec -it mongo-example mongosh

disk usage: df -h
clear docker folder: sudo rm -rf /var/lib/docker/
claim space from docker: docker volume prune

stop container: docker stop 
docker remove container: docker rm 0b53107a1dd7


top 50 largest files:
du -ha /home | sort -n -r | head -n 50