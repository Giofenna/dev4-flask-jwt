from email import message
from flask import Flask, request, jsonify
from flask_bcrypt import generate_password_hash as gph, check_password_hash as cph
from flask_cors import CORS
from flask_jwt_extended import(jwt_required, create_access_token as createtoken, get_jwt_identity as getjwt, JWTManager)
from db import DB
from routes.klanten import create_user

# Create a new Flask application
app = Flask(__name__)
app.debug = True



# Enable cors on the server
CORS(app)

# Register the JWT manager
app.config['JWT_SECRET_KEY'] = '8aMroAYC3NaeTxdsx80g'
jwt = JWTManager(app)
# ============================ Routes ============================
@app.route("/klanten", methods=["POST"])
def create_user():
    args = request.get_json()
    qry = '''INSERT INTO `klanten` (`voornaam`, `tussenvoegsel`, `achternaam`, `email`, `wachtwoord`) VALUES (:voornaam, :tussenvoegsel, :achternaam, :email, :wachtwoord)'''
    args["wachtwoord"] = gph(args["wachtwoord"])
    print(args)
    id = DB.insert(qry,args)
    return {"message" : "success", "id" : id}, 201
@app.route("/auth", methods=["POST"])
def login():
    email = request.json.get("email", None)
    wachtwoord = request.json.get("wachtwoord", None)
    qry = "SELECT * FROM `klanten` WHERE `email` = :email"
    user = DB.one(qry, {'email':email})
    print(wachtwoord)
    if not user or not cph(user["wachtwoord"], wachtwoord):
        return {"message": "invalid credentials"}, 401
    del user["wachtwoord"]
    access_token = createtoken(user)
    return jsonify(access_token = access_token, message = "success"), 200 
# JWT routes
@app.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = getjwt()
    return jsonify(user=user, message="success"), 200


# Start app
if __name__ == '__main__':
    app.run()
# app.add_url_rule("/klanten", None, create_user, methods=["POST"])                 