"""
When this module is imported, the config.json file (local to
this directory) is loaded and parsed for configuration values.

The structure of the config.json file should look like this...

{
    "port":80,
    "host":"123.234.345.567",
    "form_url": "<url to submit post variables>",
    "form_entry_name": "<post variable name for name>",
    "form_entry_phone" : "<post variable name for phone number>",
    "super_phone" : "<admin phone number>",
    "super_word" : "<admin secret phrase>",
    "salt": <salt string for hashes>
}
"""


import json

try:
    config = json.loads(open("config.json").read())
except:
    config = {}

port = None
host = None

super_phone = None
super_word = None

form_url = None
form_entry_name = None
form_entry_phone = None
salt = None

if "form_url" in config and \
    "form_entry_name" in config and \
    "form_entry_phone" in config:
    form_url = config["form_url"]
    form_entry_name = config["form_entry_name"]
    form_entry_phone = config["form_entry_phone"]
else:
    print "Missing form values in config.json!"
    print "Form submission disabled!"

if "super_phone" in config and "super_word" in config:
    super_phone = config["super_phone"]
    super_word = config["super_word"]
else:
    super_phone = ""
    super_word = ""

if "port" in config and "host" in config:
    port = config["port"]
    host = config["host"]
else:
    print "config.json missing some values or not created?"
    port = 8080
    host = "127.0.0.1"

if "salt" in config:
    salt = config["salt"]
else:
    salt = "defaultsalt"

if "slack_get_users_api" in config:
    slack_get_users_api = config["slack_get_users_api"]
else:
    slack_get_users_api = ""
