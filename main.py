from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from firebase import firebase
import firebase_util 

app = Flask(__name__)
cors = CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/org", methods=["GET"])
def get_org():
    org_id = request.args.get("id")
    print(org_id)
    return render_template("scheduler.html", org_id=org_id, user_id=1)

@app.route("/org_data", methods=["GET"])
def get_org_data():
    org_id = request.args.get("id")
    body = jsonify(firebase_util.get_org(org_id))
    return body

@app.route("/update", methods=["POST"])
def update():
    if "id" in request.form.keys():
        org_id = request.form["id"]
        print("org_id" + org_id)
    action = request.form["action"]
    print(str(request.form.keys()))

    if action == "add_org":
        name = request.form["name"]
        firebase_util.add_org(name)

    if action == "change_org_name":
        name = request.form["name"]
        firebase_util.update_org_name(org_id, name)

    if action == "add_tag":
        tag = request.form["tag"]
        firebase_util.add_tag(org_id, tag_name)

    if action == "change_tag":
        tag_id = request.form["tag"]
        name = request.form["name"]
        firebase_util.update_tag_name(org_id, tag_id, name)

    if action == "remove_tag":
        tag = request.form["tag"]
        firebase_util.remove_tag(org_id, tag_name)

    if action == "add_user":
        name = request.form["name"]
        password = request.form["password"]
        tags = request.form["tags"]
        if tags == None:
            tags = []
        firebase_util.add_user(org_id, name, password, tags)

    if action == "remove_user":
        user_id = request.form["user_id"]
        firebase_util.remove_user(org_id, user_id)

    if action == "update_user_name":
        user_id = request.form["user_id"]
        name = request.form["name"]
        firebase_util.update_user_name(org_id, user_id, name)

    if action == "update_user_tags":
        user_id = request.form["user_id"]
        tags = request.form["tags"]
        if tags == None:
            tags = []
        firebase_util.update_user_tags(org_id, user_id, tags)

    if action == "update_user_schedule":
        user_id = request.form["user_id"]
        schedule = request.form["schedule"]
        firebase_util.update_schedule(org_id, user_id, schedule)

    return "success"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
