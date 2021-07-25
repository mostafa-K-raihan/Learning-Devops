## CIDR

Classless Inter Domain Routing. Its a mechanism for creating ad-hoc networks. Generally IP Addresses is of this structure

> a.b.c.d

where `a`, `b`, `c` and `d` is decimal numbers, ranging 0-255 and referred as octets. In IPv4 there were in total `2^32 - 1` IP Addresses possible in this scheme. In order to divide this huge IP Address space, Class system was introduced. Mainly Class A, B, C were the prevalent ones.

As the device count goes up, it was prominent that, we couldn't possibly accommodate all the devices with this scheme.

Hence, came the CIDR, in this scheme, the IP Address is written like this

> a.b.c.d/x

where x is a number ranging 0-31. This number will determine, what part of the IP Address will be network ID Part, and what part will be the host part.

For example, if we write an IP Address as `10.1.1.0/24`

This means the network part consists of the first 24 bits and the rest 8 bits will be 0.

And this also means that only `2^8 = 256` IP Address is possible for the Hosts to use. 2 IP Addresses are restricted for hosts to use, so in turn it will take only `254` IP Addresses.

## Docker Networking

> $ docker -p 8080:80 -d `container`

What happens when we run this above command?

- Docker creates a bridge network by default and assign an internal IP Address to the container.

- It also adds an entry in the IP Table, it just a map to a port to the given IP Address.

- So, if a packet comes via eth0 of the host machine and with `8080` port as destination port, docker will look up to the IP table and it will find a mapping to route that packet to that IP address assigned by docker.

- Which means the packet will go to the container.

- This is how we can manage communications between the containers.

- We need to know the IP address for the container we need to request.

- We have to craft request via the IP Address and exposed port of that container.

## Homework Assignment

Create two services

- External: will be exposed via a port to the outer world
- Internal: will not be exposed to outer world, but from external service this can be accessed.

## Creating External Service

### Docker file

#### External Service

1. used node 14 alpine version
2. created a work directory in `/usr` called `/usr/src/app`
3. copied the `package.json` and `package-lock.json` to that directory.
4. install the dependencies.
5. copied the rest of the src.
6. expose `8080` port.
7. Run `index.js` via `node index.js`

#### Internal Service

- Same as above except we are exposing `9090` port for internal service.

### Building docker file and creating docker image

assuming we are in the parent directory of external and internal directories.

> cd external
>
> sudo docker build -t external .
>
> cd ..
>
> cd internal
>
> sudo docker build -t internal .

### Running docker container from created images

#### External

> docker run -p 8080:8080 -d external

Here we are binding `8080` of our host machine to the external service. If we exposed different port in the external service's dockerfile then it would be `8080:<exposed port>`

#### Internal

> docker run -d internal

See we did not exposed any host port for the internal service.

Now we need to know, the ip address of the internal service by running

> `docker inspect <container-id-internal>`

This will render a lot of useful properties, but we are interested in IP Address. We can get that by piping and grepping.

> `docker inspect <container-id-internal> | grep IPAddress`

We now need to send a request to this `IP Address:Exposed Port` of internal service from the external service.

Our Internal Services exposed port is `9090` and the inspected IPAddress is `172.17.0.3`

So, we saved this as a variable in `config` and used axios to do a POST request to internal service. Internal service has a post endpoint to capture the request, it will process the request, and send the response to the external service.
The external service will then respond to the outer request with the response value of the internal service.

### High Level

- GET `localhost:8080/api/vi/add/a=3&b=4`
- External service accept the request
- Unpack the query param
- From External: POST `http://172.17.0.3:9090/api/v1/add` with unpacked query params in `req.body` as param `a` and param `b`.
- From Internal: This will compute the add result and send the response with the result.
- From External: Catch the result from Internal and send the response to the outer world.

### Gotchas

- Had to put `http://` before the IP Address, otherwise it did not work. I guess axios needs this to resolve the IP?
