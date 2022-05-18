from email import message
from flask import Flask, request, jsonify
from flask_bcrypt import generate_password_hash as gph, check_password_hash as cph
from flask_cors import CORS
from flask_jwt_extended import(jwt_required, create_access_token as createtoken, get_jwt_identity as getjwt, JWTManager)
from db import DB
def create_user():
    args = request.get_json()
    qry = '''INSERT INTO `klanten` (`voornaam`, `tussenvoegsel`, `achternaam`, `email`, `wachtwoord`) VALUES (:voornaam, :tussenvoegsel, :achternaam, :email, :wachtwoord)'''
    args["wachtwoord"] = gph(args["wachtwoord"])
    print(args)
    id = DB.insert(qry,args)
    return {"message" : "success", "id" : id}, 201