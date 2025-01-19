FROM python:3

USER root

COPY ../../script.sh /script.sh

#COPY script.sh /
RUN chmod a+x /script.sh

ENTRYPOINT ["/bin/bash", "/script.sh"]
CMD ["print('No code was parsed')",""]