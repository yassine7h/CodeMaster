FROM amazoncorretto:17

WORKDIR /app
COPY script.sh /app/script.sh
RUN yum update -y && yum install -y jq
RUN chmod +x /app/script.sh

ENTRYPOINT ["/app/script.sh"]