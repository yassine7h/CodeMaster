FROM python:3.9-slim

WORKDIR /app
COPY script.py /app/script.py
RUN chmod +x /app/script.py


ENTRYPOINT ["python", "/app/script.py"]