FROM python:3.11-slim

WORKDIR /backend

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser /backend
USER appuser

EXPOSE 8000

# Production
CMD ["gunicorn", "backend.wsgi:application", "--workers", "4", "--bind", "0.0.0.0:8000"]