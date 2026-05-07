FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["sh", "-c", "export DJANGO_SETTINGS_MODULE=core.settings && python manage.py migrate && daphne -b 0.0.0.0 -p 8000 core.asgi:application"]