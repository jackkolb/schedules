from flask import flask, render_template
from firebase import firebase

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/update", methods=["POST"])
def update():
    organization_id = request.form["organization"]
    action = request.form["action"]
    if action == "change_organization_name":
        name = request.form["name"]
        # do something to change name

    if action == "add_tag":# app.py
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/getmsg/', methods=['GET'])
def respond():
    # Retrieve the name from url parameter
    name = request.args.get("name", None)

    # For debugging
    print(f"got name {name}")

    response = {}

    # Check if user sent a name at all
    if not name:
        response["ERROR"] = "no name found, please send a name."
    # Check if the user entered a number not a name
    elif str(name).isdigit():
        response["ERROR"] = "name can't be numeric."
    # Now the user entered a valid name
    else:
        response["MESSAGE"] = f"Welcome {name} to our awesome platform!!"

    # Return the response in json format
    return jsonify(response)

@app.route('/post/', methods=['POST'])
def post_something():
    param = request.form.get('name')
    print(param)
    # You can add the test cases you made in the previous function, but in our case here you are just testing the POST functionality
    if param:
        return jsonify({
            "Message": f"Welcome {name} to our awesome platform!!",
            # Add this option to distinct the POST request
            "METHOD" : "POST"
        })
    else:
        return jsonify({
            "ERROR": "no name found, please send a name."
        })

# A welcome message to test our server
@app.route('/')
def index():
    return "<h1>Welcome to our server !!</h1>"

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
        tag = request.form["tag"]
        # do something to add tag

    if action == "remove_tag":
        tag = request.form["tag"]
        # do something to remove tag

    if action == "add_user":
        name = request.form["name"]
        password = request.form["password"]
        tags = request.form["tags"]
        # do something to add user

    if action == "remove_user":
        user_id = request.form["user_id"]
        # do something to remove user


app.run()
