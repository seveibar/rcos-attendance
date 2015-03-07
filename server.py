import cherrypy
import sqlite3
import hashlib
import datetime
import form
import database
import config

salt = hashlib.md5(config.salt).hexdigest()

# TODO Consolidate hashing methods into separate module
def salty(mentor):
    return hashlib.md5(mentor + salt).hexdigest()

def unsalt(mentor_hash):
    # Look for the mentor's salt
    return filter(lambda x: salty(x) == mentor_hash, list(mentors))[0]

def getDayHash():
    return salty(str(datetime.date.today().month) + "/" + str(datetime.date.today().day))

def hash(phone):
    return hashlib.sha256(phone).hexdigest()

def twilioResponse(string):
    return """
    <Response>
        <Message>""" + string + """</Message>
    </Response>
    """

# Stores numbers that are trying to be initialized w/ names
waitingNums = set()

# Server that receives twilio requests
class PhoneServer(object):
    def index(self, **params):
        return "err"
    index.exposed = True

    """
    URL to receive the twilio requests

    server/phone
    """
    def phone(self, **params):

        if "From" not in params or "Body" not in params:
            return "err"
        sender = params["From"]
        number = hash(params["From"])
        body = params["Body"]
        print "RECIEVED",number,body
        if (number == hash(config.super_phone) and body == config.super_word):
            print "Sending response"
            return twilioResponse(getDayHash()[:4].lower())

        # Check if number sent the current day code
        if body.lower() == getDayHash()[:4].lower():

            # Correct day code

            # Check if users number is in the database
            user = None
            if "@" in sender:
                form.send(sender, sender)
                return twilioResponse("Thanks " + sender +"! Your attendance has been recorded!")
            else:
                user = database.getNameFromPhone(number)
            if user is not None:

                # User is in database
                num,name = user.phone_hash, user.name
                print name,"signed in"

                # Send the user's attendance
                form.send(num,name)
                return twilioResponse("Thanks "+name+"! Your attendance has been recorded!")
            else:
                print "waiting for name for",number

                # Add number to list to wait for response with name
                waitingNums.add(number)
                return twilioResponse("What's your full name?")
        else:

            # Incorrect day code

            # Check if received number that was waiting
            if number in waitingNums:
                print "received number name", number,":", body

                # Add name and phone number to database
                database.addPhoneAndName(number, body)
                waitingNums.remove(number)
                form.send(number,body)
                return twilioResponse("Thanks " + body+ "! Your attendance has been recorded!")
            else:
                print "Received incorrect day code", number, ":", body
                return twilioResponse("Incorrect Day Code!")
    phone.exposed = True

    def slack(self, **params):
        if params["channel_id"] == "G033ULLLB":
            return getDayHash()[:4]
        else:
            return self.phone(From="@" + params["user_name"], Body=params["text"]).split("<Message>")[1].split("</Message>")[0]
    slack.exposed = True

database.initTables()
cherrypy.config.update({
    'server.socket_port': config.port,
    'server.socket_host': config.host
})
cherrypy.quickstart(PhoneServer())
