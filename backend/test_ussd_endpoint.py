#!/usr/bin/env python
"""Test script to verify USSD endpoint is working"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'renti.settings')
sys.path.insert(0, '/home/frank/renti/backend')
django.setup()

from django.test import Client
from django.conf import settings

client = Client()

# Test with the service code from sandbox
test_data = {
    'sessionId': 'test-session-123',
    'serviceCode': settings.AFRICAS_TALKING_SERVICE_CODE or '*384*135477#',
    'phoneNumber': '+254707274525',
    'text': '',
}

print(f"Testing USSD endpoint...")
print(f"Expected service code: {settings.AFRICAS_TALKING_SERVICE_CODE}")
print(f"Test data: {test_data}")

response = client.get('/ussd', test_data)
print(f"Response status: {response.status_code}")
print(f"Response content: {response.content.decode()}")
