# RCOS Text Attendance Server

This is the server used for RCOS attendance. It allows students to mark their attendance by texting a "day code" which a mentor writes on the board each day. It was designed for use with twilio.

## Setup

1. Create a config.json file using the template at the top of `config.py`
2. Run `python server.py` on your server
3. Log in to Twilio and send GET requests to your `http://<YOUR SERVER URL>/phone`

## Usage

Every day, the admin/super_mentor can text the `secret_word` to get the day code. This day code should be given to all the students via a whiteboard or projector. Students can then text the number. All the responses will be sent to the `form_url` with `form_entry_name` and `form_entry_phone` POST parameters.

## Additional Details

It's possible to use a google documents form as the submission form.

Look for the `<form>` tag inside a google documents form.
