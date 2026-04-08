# Too Guild To Go
# code from https://medium.com/@moinahmedbgbn/a-basic-login-system-with-python-746a64dc88d6

import hashlib

def signup():
     email = input("Enter email address: ")
     pwd = input("Enter password: ")
     conf_pwd = input("Confirm password: ")
     if conf_pwd == pwd:
         enc = conf_pwd.encode()
         hash1 = hashlib.md5(enc).hexdigest()
         with open("credentials.txt", "w") as f:
             f.write(email + "\n")
             f.write(hash1)
         f.close()
         print("You have registered successfully!")
     else:
         print("Password is not same as above! \n")


def login():
     email = input("Enter email: ")
     pwd = input("Enter password: ")
     auth = pwd.encode()
     auth_hash = hashlib.md5(auth).hexdigest()
     with open("credentials.txt", "r") as f:
         stored_email, stored_pwd = f.read().split("\n")
     f.close()
     if email == stored_email and auth_hash == stored_pwd:
         print("Logged in Successfully!")
     else:
         print("Login failed! \n")


while 1:
    print("********** Login System **********")
    print("1.Signup")
    print("2.Login")
    print("3.Exit")
    ch = int(input("Enter your choice: "))
    if ch == 1:
        signup()
    elif ch == 2:
        login()
    elif ch == 3:
        break
    else:
        print("Wrong Choice!")


# Here's what claude suggested for using JavaScript

from flask import Flask, request, jsonify
import hashlib

app = Flask(__name__)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    pwd = data['password']
    hash1 = hashlib.md5(pwd.encode()).hexdigest()
    with open("credentials.txt", "w") as f:
        f.write(email + "\n" + hash1)
    return jsonify({"message": "Registered successfully!"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    auth_hash = hashlib.md5(data['password'].encode()).hexdigest()
    with open("credentials.txt", "r") as f:
        stored_email, stored_pwd = f.read().split("\n")
    if email == stored_email and auth_hash == stored_pwd:
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

app.run(port=5000)
