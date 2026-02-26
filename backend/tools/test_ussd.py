from django.test import Client
import json
from urllib.parse import urlencode

c = Client()

def do_post(data, content_type=None):
    if content_type:
        r = c.post('/ussd/', data=data, content_type=content_type)
    else:
        r = c.post('/ussd/', data=data)
    print('---')
    print('DATA:', data)
    print('CONTENT_TYPE:', content_type)
    print('STATUS:', r.status_code)
    print('RESPONSE:', r.content.decode('utf-8'))

print('Test 1: form-encoded initial (empty text)')
do_post({'sessionId':'1','serviceCode':'*384*135477#','phoneNumber':'254700000000','text':''})

print('\nTest 2: form-encoded choose 1')
do_post({'sessionId':'1','serviceCode':'*384*135477#','phoneNumber':'254700000000','text':'1'})

print('\nTest 3: form-encoded choose 2 (get sub-menu)')
do_post({'sessionId':'1','serviceCode':'*384*135477#','phoneNumber':'254700000000','text':'2'})

print('\nTest 4: form-encoded choose 2 then Plumbing')
do_post({'sessionId':'1','serviceCode':'*384*135477#','phoneNumber':'254700000000','text':'2*1'})

print('\nTest 5: JSON payload (empty text)')
json_body = json.dumps({'sessionId':'1','serviceCode':'*384*135477#','phoneNumber':'254700000000','text':''})
do_post(json_body, content_type='application/json')

print('\nTest 6: raw urlencoded body (simulate raw body)')
raw = urlencode({'sessionId':'1','serviceCode':'*384*135477#','phoneNumber':'254700000000','text':''})
do_post(raw, content_type='application/x-www-form-urlencoded')
