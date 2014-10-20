import requests
import threading
import config

# NOT A PUBLIC METHOD
def _do_request(phone,name):
    name_field = config.form_entry_name
    phone_field =  config.form_entry_phone
    action = config.form_url
    data = {}
    data[name_field] = name
    data[phone_field] = phone
    headers = {}
    requests.post(action, data=data, headers=headers)

"""
Public method for sending a request to a form w/ post variables
"""
def send(phone,name):
    thread = threading.Thread(target=_do_request, args=(phone,name))
    thread.start()
