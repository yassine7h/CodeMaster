FROM python:3

# add entrypoint script
USER root
COPY script.sh /
RUN chmod a+x /script.sh

ENTRYPOINT ["/script.sh"]
CMD ["print('No code was parsed')",""]
