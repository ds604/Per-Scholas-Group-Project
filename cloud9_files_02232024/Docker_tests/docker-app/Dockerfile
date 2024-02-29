# FROM alpine
FROM frolvlad/alpine-glibc:alpine-3.11_glibc-2.31


# RUN echo 'Hello Stanger!'
# CMD ["echo", "hello world!"]

# RUN apk update && apk add curl
# ENTRYPOINT ["curl"]
# CMD [ "curl", "https://api.chucknorris.io/jokes/random" ]

RUN apk update && apk add curl
RUN curl -fsSL https://deno.land/install.sh | sh && mv /root/.deno/bin/deno /bin/deno

WORKDIR /app
EXPOSE 8080

ENTRYPOINT ["deno"]
#CMD ["run", "--allow-net", "https://examples.deno.land/hello-world.ts"]
CMD ["run", "-Ar", "--unstable", "basicServer.js"]