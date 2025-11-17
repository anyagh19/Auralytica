FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m -u 1000 appuser && chown -R appuser /app
USER appuser

EXPOSE 8000

# Let's use the DJANGO_SETTINGS_MODULE to be explicit
CMD ["sh", "-c", "export DJANGO_SETTINGS_MODULE=backend.settings && gunicorn backend.wsgi:application --workers 4 --bind 0.0.0.0:8000"]