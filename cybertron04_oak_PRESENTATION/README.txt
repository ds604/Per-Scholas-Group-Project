make sure mongoDB is running!
admin, pass


run application:
deno run -Ar index.js

tunnel from local machine:
ngrok http http://localhost:8080


###############################################
Login and Signup execution paths:

1) not a registered user - "Message : You are not registered"
2) registered user, wrong password - "Message : Wrong Password"

3) Sign up as already registered user - "Message : User already exists"
4) Sign up as new user - "Message : Successfully registered as a user: Jyothi. Log in to continue.. "

5) registered user, correct password - "Message : Successfully logged in as Jyothi"

If you already have a webtoken cookie, then you have already logged in, so you are sent to Authorized user path.


1) not a registered user - "Message : You are not registered"
2) Sign up as new user - "Message : Successfully registered as a user: Jyothi. Log in to continue.. "
3) Log in that new user, but put in the wrong password
4) Sign up as already registered user - "Message : User already exists"

5) registered user, correct password - "Message : Successfully logged in as Jyothi"