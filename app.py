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

    if action == "add_tag":
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