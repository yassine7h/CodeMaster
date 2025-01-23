FROM amazoncorretto:17
USER root
COPY ../../script.sh /script.sh
RUN yum update -y && yum install -y jq
RUN chmod a+x /script.sh
ENTRYPOINT ["/bin/bash", "/script.sh"]