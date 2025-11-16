# backend/mcp_server/__init__.py
import os
import django

# Set up Django environment when mcp_server is imported
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
