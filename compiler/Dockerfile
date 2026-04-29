FROM node:22-alpine

RUN apk add --no-cache g++ make openjdk21-jdk python3 py3-pip bash

ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk
ENV PATH="$JAVA_HOME/bin:$PATH"

WORKDIR /app

EXPOSE 3001

COPY . .

CMD ["node","compiler.js"]





