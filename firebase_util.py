import firebase_admin
from firebase_admin import credentials, firestore
import os, os.path


if os.path.isfile('firebase_serviceaccount.json'):
    print("authenticating from JSON file")
    firebase_admin.initialize_app(firebase_admin.credentials.Certificate("firebase_serviceaccount.json"))
else:
    print ("authenticating from environment variables")
    firebase_admin.initialize_app(firebase_admin.credentials.Certificate({
        "type": "service_account",
        "project_id": "schedulioucr",
        "private_key_id": os.environ["FIREBASEID"],
        "private_key": os.environ["FIREBASEKEY"].replace("\\n", "\n"),
        "client_email": "firebase-adminsdk-k5ndh@schedulioucr.iam.gserviceaccount.com",
        "client_id": os.environ["CLIENTID"],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k5ndh%40schedulioucr.iam.gserviceaccount.com"
    })
    )

database = firestore.client().collection("schedulio")

# returns as a JSON the organization data; tested - Jack
def get_org(org_id):
    organization = database.document(org_id).get().to_dict()
    return organization

# adds an organization; tested - Jack
def add_org(name):
    org_id = len(list(database.get()))
    try:
        database.document(str(org_id)).set({
            "name": name,
            "tags": {},
            "users": {}
        })
        return org_id
    except Exception as e:
        print(e)
        return "false"

# tested - Jack
def change_org_name(org_id, org_name):
    database.document(str(org_id)).set({"name": org_name}, merge=True)

# tested - Jack
def update_schedule(org_id, user_id, schedule):
    database.document(str(org_id)).set({"users": {user_id: {"schedule": str(schedule)}}}, merge=True)

# tested - Jack
def add_tag(org_id, tag_name):
    current_data = database.document(org_id).get()
    tag_id = str(len(current_data.to_dict()["tags"]))
    data = {"tags": { tag_id: {"name": tag_name, "visible": "true" } } }
    database.document(str(org_id)).set(data, merge=True)

# tested - Jack
def remove_tag(org_id, tag_id):
    current_data = database.document(org_id).get()
    tag_name = current_data.to_dict()["tags"][str(tag_id)]["name"]
    database.document(str(org_id)).set({"tags": { tag_id: {"name": tag_name, "visible": "false"} }}, merge=True)

# tested - Jack
def change_tag(org_id, tag_id, tag_name):
    database.document(str(org_id)).set({"tags": { tag_id: {"name": tag_name, "visible": "true"} }}, merge=True)

# tested - Jack
def add_user(org_id, name, password, tags=[], image_url=""):
    current_data = database.document(org_id).get()
    user_id = str(len(current_data.to_dict()["users"]))
    data = {
        "users": {
            user_id: {
                "name": name,
                "password": password,
                "tags": tags,
                "image_url": image_url,
                "deleted": "false"
            }
        }
    }
    database.document(str(org_id)).set(data, merge=True)

# tested - Jack
def remove_user(org_id, user_id):
    data = {"users": {user_id: {"deleted": "true"}}}
    database.document(str(org_id)).set(data, merge=True)

# tested - Jack
def update_user_tags(org_id, user_id, tags):
    data = {"users": {user_id: {"tags": list(tags)}}}
    database.document(str(org_id)).set(data, merge=True)

# tested - Jack
def update_user_name(org_id, user_id, name):
    data = { "users": { user_id: { "name": name }}}
    database.document(str(org_id)).set(data, merge=True)
