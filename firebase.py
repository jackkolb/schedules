import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("firebase_serviceaccount.json")
firebase_admin.initialize_app(cred)

database = firestore.client().collection("schedulio")

def get_org(org_id):
    organization = database.get().to_dict()[str(org_id)]
    return organization

def add_org(name):
    org_id = len(list(database.get()))
    try:
        database.document(str(org_id)).set({
            "name": name,
            "tags": {},
            "users": {}
        })
        return "true"
    except Exception as e:
        print(e)
        return "false"

def add_tag(org_id, tag_name):
    current_data = database.document(org_id).get()
    tag_id = str(len(current_data.to_dict()["tags"]))
    database.document(org_id).set({"tags": { tag_id: {"name": tag_name, "visible": "true"} }}, merge=True)

def remove_tag(org_id, tag_name):
    

add_tag("0", "Electrical")