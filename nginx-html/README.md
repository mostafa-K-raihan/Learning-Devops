## Purpose

We need to figure out how we can create a docker container with base image
as nginx and serve a static html

## Steps

1. Need to write a docker file which will pull a base image on top of which we will build
   our custom image.

2. Write a html file which will be served by the nginx

### Dockerfile

Dockerfile will be used to create a docker image. The difference between a docker image and a docker container is docker image is like a blueprint, and a container is a running environment built from that blueprint.

`FROM ubuntu`

This command in the dockerfile will pull the latest image of `ubuntu` from the `dockerhub`, if we wish to pull any other version of the `ubuntu` base image, we need to add a version like this

`FROM ubuntu:tag`

`RUN apt update`

`Run` command will run any shell command inside our container. `apt update`
This will update our ubuntu packages distribution. This is necessary before doing any installation.

`RUN apt install nginx -y`

This will install `nginx` web server in our container. `-y` is needed so that the installation can proceed, installation needs some space. `-y` is basically giving a green light to that installation.

`COPY ./index.html /var/www/html`

This command will copy our `./index.html` to the containers path `/var/www/html`.

If we just installed our container from `nginx` base image then the path would be `usr/share/nginx/html`, but since we are using `ubuntu` base image, and inside `ubuntu` we are installing `nginx`, the path will be different.

We can see the path from where `nginx` is serving by going to the container shell

| `docker exec -it {container hash} /bin/bash`

This will open up the interactive terminal of the container.
From there we can go to the `/etc/nginx/sites-enabled`

| `cd /etc/nginx/sites-enabled`

| `ls`

There lies a default configuration file.

inspecting the default file reveals that the root is set to
`root /var/www/html;`
that is why we need to copy our html file to this directory instead of `/usr/share/nginx/html`

## Some other docker commands

`docker build -t {name:tagName} ./`

This will build your Dockerfile and give it a name and a tag name. `-t` will specify the tag name.

`docker run -p {host port: container port} -d --name {container name} {image name}`

This will create and start a container based on the created image from the previous step, you can give a container name of your choice by specifying your container name and `--name` option. `-d` will create the container in detached mode, so that you can do other stuff in the container. It will not block the shell.
`-p` will bind the host port and map with a container port.

`docker ps`

This will show all the running containers

`docker ps -a`

This will show all the running plus inactive container

`docker image ls`

This will show all the images available inside our docker

`docker start {container hash}`

This will start a container

`docker stop {container hash}`

This will stop a container

`docker rm {container hash}`

This will delete a container. You need to stop the container first. If you don't want to do that, then you can run this instead `docker rm -f {container hash}` This will forcefully stop your container and then delete it.

`docker rmi { image hash }`

This will delete your built image.

`docker image ls`

This will show all your images built
