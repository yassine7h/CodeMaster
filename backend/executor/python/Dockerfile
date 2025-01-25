FROM python:3.9-slim

WORKDIR /app
COPY script.py /app/script.py
RUN chmod +x /app/script.py
RUN apt-get update && apt-get install -y jq

ENTRYPOINT ["python", "/app/script.py"]