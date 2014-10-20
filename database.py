"""
Use this module for any database interaction.
"""

import sqlite3

"""
Create tables to store user data if they don't already exist.
"""
def initTables():
    # Connect to local database file
    conn = sqlite3.connect("phones.db")

    # Create tables if they don't already exist
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS attendance (phone text, name text)")

    # Save changes
    conn.commit()
    c.close()

    # Close connection
    conn.close()

"""
Look for a phone in the database, return a User object or None if
not found.
"""
def getNameFromPhone(phone_hash):
    # Connect to local database file
    conn = sqlite3.connect("phones.db")

    # Try to get number from database
    c = conn.cursor()
    c.execute("SELECT * FROM attendance WHERE phone=?", (phone_hash,))
    user = c.fetchone()
    c.close()

    # Close connection to database
    conn.close()

    if user:
        return User(user[1],user[0])
    else:
        return None

"""
Add phone and name to database
"""
def addPhoneAndName(phone_hash, name):
    # Connect to local database file
    conn = sqlite3.connect("phones.db")

    # Insert phone and name into database
    c = conn.cursor()
    c.execute("INSERT INTO attendance VALUES (?,?)", (phone_hash,name))
    conn.commit()
    c.close()

    # Close connection to database
    conn.close()

"""
User object with two properties...
User.phone_hash
User.name
"""
class User:
    def __init__(self,name,phone_hash):
        self.name = name
        self.phone_hash = phone_hash
