## **Load Balancer**

The term `Load Balancing` refers to efficiently distributing incoming traffic across a group of servers.

Modern high traffic websites usually have millions of concurrent requests from different users and serve appropriate text, video, image etc in very reliably. The more requests comes, it is essential to add more servers to `serve` those additional requests so that the performance does not degrade.

A `Load Balancer` acts as traffic police sitting in front of all the servers you need, and redirect the traffic to different servers in a manner that -

- maximizes speed & capacity utilization
- ensures that no one server is overworked

A Load Balancer is effectively performs following functions

- Distribute client requests
- Ensure high availability & reliability only to servers that are `online`
- Provides the flexibility to add/remove servers as demand dictates

## **Load Balancing Algorithms**

- Round Robin
  - Requests are distributed across the group of servers sequentially
- Least Connections
  - A new request is sent to the server with the fewest current connections to clients. The relative computing capacity of each server is factored into determining which one has the least connections
- Least Time
  - Sends requests to the server selected by a formula that combines the fastest response time and fewest active connections
- Hash
  - Distributes requests based on a key you define, such as the client IP address or the request URL
- IP Hash
  - The IP address of the client is used to determine which server receives the request
- Random with Two Choices
  - Picks two servers at random and sends the request to the
    one that is selected by then applying the Least Connections algorithm

## **Layer 4 Load Balancer**

Layer 4 Load Balancing uses information defined at transport layer aka Layer 4 as the basis for deciding how to distribute client requests, mainly depends on source & destination IP Addresses and ports, recorded in packet headers.

They don't consider the content of the packet. for ex. path based routing is **NOT** possible in Layer 4 Load Balancer as this requires inspecting the packet content.

### **Process**

> LB receives a packet with (src: client, dest: LB)
>
> performs NAT on the packet
>
> > changing dest IP to one of the internal server from its own, so the packet now (src: client, dest: ✅ server, ❌ ~~LB~~)
>
> internal server gets the packet/request, performs some action, and sends a response with packet (src: server, dest: client)
>
> > LB changes the src now (src: ✅ LB, ❌~~server~~, dest: client)
>
> sometimes ports also get changed in this manner.

## **Homework**

Design a system with load balancing inside docker on a single server. Nginx layer 4 load balancing with 3 containers.

## **Process**

- create two directory one is for app and another is for nginx which will act as a Load Balancer.

- For app
  - exposed `8080` internal port
  - build
    > sudo docker build -t devops-4/app:latest .`
  - run app as first container in `5000` port
    > docker run --name first_container -d -p 5000:8080 devops-4/app:latest`
  - run same app as second container in `5005` port
    > docker run --name second_container -d -p 5005:8080 devops-4/app:latest
- For Load Balancer
  - create a `default.conf` file which will include routing rules as upstream
  - build
    > sudo docker build -t devops-4/proxy:latest .`
  - run Load Balancer in `8080` port
    > docker run --name proxy -d -p 8080:8080 devops-4/proxy:latest
- Inspect the logs

  > docker logs -ft first_container
  >
  > docker logs -ft second_container

- Hit `localhost:8080`, notice at one time `first_container` gets the request, next time `second_container` gets the request as in round-robin fashion.

Open Q

1. I don't know why I have to put to make it work `172.17.0.1` as server, it is a gateway address, i initially tried app containers' IP addresses, like `172.17.0.2` and `172.17.0.1`, but that didn't work.

2. Something funky is going on with nginx configuration. I only managed to make it work by removing the default conf in `/etc/nginx/conf.d/default.conf` and replace that file with same name but mine own config. Don't know why.
