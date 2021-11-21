import datetime
from enum import unique
import random
from operator import sub
import re
import numpy as np
import pandas as pd
import json
import os
from flask import Flask, send_from_directory, redirect, request, abort, jsonify, session
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_session import Session
from datetime import date, datetime, timedelta
from uuid import uuid4
from sqlalchemy import func
from sqlalchemy.orm import backref
from sqlalchemy.sql.functions import user
from config import AppConfig
import xlrd
app = Flask(__name__, static_url_path='', static_folder='build')
app.config.from_object(AppConfig)

CORS(app, supports_credentials=True)

server_session = Session(app)
bcrypt = Bcrypt(app)


# initialise the database
db = SQLAlchemy(app)

# create db models


class State(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    districts = db.relationship('District', backref='state', lazy=True)
    population = db.Column(db.Integer)
    sex_ratio = db.Column(db.Integer)

    def __repr__(self) -> str:
        return '<NAME %r>' % self.name


class District(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    population = db.Column(db.Integer)
    sex_ratio = db.Column(db.Integer)
    state_id = db.Column(db.Integer, db.ForeignKey('state.id'), nullable=False)
    users = db.relationship('User', backref='district', lazy=True)
    records = db.relationship('Record', backref='district', lazy=True)

    def __repr__(self) -> str:
        return '<NAME %r>' % self.name


class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    users = db.relationship('User', backref='group', lazy=True)
    records = db.relationship('Record', backref='group', lazy=True)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    phone_number = db.Column(db.String(200), nullable=False)
    records = db.relationship('Record', backref='user', lazy=True)
    user_group = db.Column(db.Integer, db.ForeignKey(
        'group.id'), nullable=False)
    district_id = db.Column(db.Integer, db.ForeignKey(
        'district.id'), nullable=False)


class Target(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    full_description = db.Column(db.String(3000))
    short_description = db.Column(db.String(3000))
    img = db.Column(db.String(200))
    sub_targets = db.relationship('SubTarget', backref='target', lazy=True)


class SubTarget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    target_id = db.Column(db.Integer, db.ForeignKey(
        'target.id'))
    records = db.relationship('Record', backref='sub_target', lazy=True)


class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_added = db.Column(
        db.DateTime, default=date.today, nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'group.id'), nullable=False)
    district_id = db.Column(db.Integer, db.ForeignKey(
        'district.id'), nullable=False)
    sub_target_id = db.Column(db.Integer, db.ForeignKey(
        'sub_target.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=False)
    value = db.Column(db.Integer, nullable=False)


area = "Rajasthan"


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")
    print(session)
    if not user_id:
        return jsonify({"error": "Unauthorised"}), 401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "name": user.name,
        "group": user.user_group
    })


@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    name = request.json["name"]
    district_id = request.json["district_id"]
    phone_number = request.json["phone"]
    user_group = request.json["group"]
    user_exists = User.query.filter_by(email=email).first() is not None
    if user_exists:
        return jsonify({"error": "A user is already registered with this email"}), 409
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(name=name,
                    email=email, password=hashed_password, district_id=district_id, phone_number=phone_number, user_group=user_group)
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id
    return jsonify({
        "id": new_user.id,
        "name": new_user.name,
    })

# client side, server side
# bcrypt


@app.route("/new", methods=["POST"])
def add_new():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorised"}), 401
    user = User.query.filter_by(id=user_id).first()
    sub_target_id = request.json["sub_target_id"]
    value = int(request.json["value"])
    record_exists = db.session.query(Record).filter(
        func.date(Record.date_added) == date.today()).filter(Record.user_id == user_id).filter(Record.sub_target_id == sub_target_id).all()
    if record_exists:
        return jsonify({"message": "Today's record is already added by this user"}), 200
    new_record = Record(
        value=value, sub_target_id=sub_target_id, district_id=user.district_id, group_id=user.user_group, user_id=user.id)
    db.session.add(new_record)
    db.session.commit()
    return jsonify({"message": "Added record successfully"}), 200


@ app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not registered"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id
    print(session["user_id"])
    return jsonify({
        "id": user.id,
        "name": user.name,
    })


@ app.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id")
    return "200"


@ app.route("/groups")
def get_groups():
    all_groups = Group.query.order_by(Group.name)
    return jsonify(
        [{
            "id": group.id,
            "name": group.name,
        } for group in all_groups]
    )


@ app.route("/targets")
def get_targets():
    all_targets = Target.query.order_by(Target.name)
    res = []
    for target in all_targets:
        sub_targets = SubTarget.query.filter_by(target_id=target.id)
        res.append({
            "id": target.id,
            "name": target.name,
            "fullDescription": target.full_description,
            "shortDescription": target.short_description,
            "img": target.img,
            "subTargets": [{"id": item.id, "name": item.name, "targetId": item.target_id} for item in sub_targets]
        })
    return jsonify(res)


@ app.route("/states")
def get_states():
    all_states = State.query.order_by(State.name)
    return jsonify(
        [{
            "id": state.id,
            "name": state.name,
        } for state in all_states]
    )


@app.route("/records/<int:sub_target>")
def read_data(sub_target):
    days = 5
    print(sub_target)
    all_records = Record.query.filter_by(sub_target_id=sub_target)
    all_groups = [item.id for item in Group.query.all()]
    today = date.today()
    res = {}
    for i in range(days):
        this_date_records = all_records.filter(
            func.date(Record.date_added) == today).all()
        res[str(today)] = {}
        print(all_groups)
        for grp_id in all_groups:
            grp = Group.query.filter_by(id=grp_id).first()
            res[str(today)][grp_id] = {}
            res[str(today)][grp_id]["name"] = grp.name
            res[str(today)][grp_id]["districtWise"] = {}
            res[str(today)][grp_id]["overall"] = 0
        for record in this_date_records:
            res[str(today)][record.group_id]["overall"] += record.value
            if record.district_id in res[str(today)][record.group_id]["districtWise"]:
                res[str(
                    today)][record.group_id]["districtWise"][record.district_id] += record.value
            else:
                res[str(
                    today)][record.group_id]["districtWise"][record.district_id] = record.value
        today -= timedelta(days=1)
    print(res)
    return jsonify(res)


@app.route("/districts/<int:state>")
def get_districts(state):
    print(state)
    concerned_districts = District.query.filter_by(state_id=state)
    return jsonify(
        [{
            "id": district.id,
            "name": district.name,
        } for district in concerned_districts]
    )


@app.route("/users/<int:area>")
def get_users(area):
    if(area == 0):
        users = User.query.all()
    else:
        users = User.query.filter_by(district_id=area).all()
    return jsonify([{
        "id": user.id,
        "name": user.name,
        "phone": user.phone_number
    } for user in users])


@app.route("/district/<int:id>")
def get_district(id):
    district = District.query.filter_by(id=id).first()
    state = State.query.filter_by(id=district.state_id).first()
    return jsonify(
        {
            "id": district.id,
            "name": district.name,
            "population": district.population,
            "sexRatio": district.sex_ratio,
            "state": state.name,
        }
    )


@ app.route("/view")
def view_database():
    got = State.query.order_by(State.name)
    return str([st.name for st in got])


@ app.route("/create")
def create_database():
    # district_data = pd.read_excel("All_Districts.xlsx", sheet_name="Sheet1")
    # # f = open("states.txt")
    # # states = f.read().split("\n")
    # # for state_name in states:
    # #     st = State(name=state_name)
    # #     db.session.add(st)
    # #     db.session.commit()

    # f = open('geo.json')
    # data = json.load(f)
    # for item in data["features"]:
    #     dist = District(name=item["properties"]["name"],
    #                     state_id=item["properties"]["state_id"])
    #     db.session.add(dist)
    #     db.session.commit()

    # user_data = pd.read_excel("Book1.xls", sheet_name="Hospitals")
    # for i in range(len(user_data["name"])):
    #     try:
    #         new_user = User(name=user_data["name"][i], email=str(user_data["name"][i]), password=bcrypt.generate_password_hash(
    #             str(user_data["password"][i])), phone_number=str(user_data["phone_number"][i]), user_group=int(user_data["user_group"][i]), district_id=int(user_data["district_id"][i]))
    #         db.session.add(new_user)
    #         db.session.commit()
    #     except:
    #         continue

    d = pd.read_excel("data_presented.xls", sheet_name="Combined")
    for i in range(len(d)):
        idd = int(d["user_id"][i])
        if(idd > 137):
            idd -= 100
        user = User.query.filter_by(id=idd).first()
        if not user:
            continue
        sub_target_id = int(d["sub_target_id"][i])
        time = "2021-11-" + str(d["date_added"][i])[8:10]
        time = datetime.fromisoformat(time)
        value = int(d["value"][i])
        record_exists = db.session.query(Record).filter(
            func.date(Record.date_added) == time).filter(Record.user_id == user.id).filter(Record.sub_target_id == sub_target_id).all()
        if record_exists:
            continue
        new_record = Record(
            value=value, sub_target_id=sub_target_id, district_id=user.district_id, group_id=user.user_group, user_id=user.id, date_added=time)
        db.session.add(new_record)
        db.session.commit()

    return redirect("/view")


@ app.route("/delete")
def delete_database():
    db.session.query(State).delete()
    db.session.query(District).delete()
    db.session.commit()
    return redirect('/view')


if __name__ == '__main__':
    app.run(debug=True)
