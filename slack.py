import requests
import datetime
import config

users = {}

_lastDayLoaded  = -1
def isOutdated():
    global _lastDayLoaded
    return _lastDayLoaded != datetime.date.today().day

def loadUserDictionary():
    global users
    _lastDayLoaded = datetime.date.today().day
    users = {}
    req = requests.get(config.slack_get_users_api)
    member_list = req.json()["members"]

    for member in member_list:
        username = member["name"]
        realname = member["real_name"]
        userid = member["id"]

        users[username] = {
            "fullname": realname,
            "userid": userid
        }
