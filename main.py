#
# *     BeReady, version nr-05
# *  Copyright (C) 2021  Max Budko
import datetime
import json
import os
from random import randint

from flask import Flask, redirect, url_for, request
from werkzeug.utils import html

import db
MAINSETS = json.load(open('sets.json', 'r'))

app = Flask(__name__, static_folder='static')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 5

try:
    key_f = open('key.key', 'rb')
except:
    key_f = open('key.key', 'wb')
    key = os.urandom(10 ** 32)
    key_f.write(key)
    key_f.close()
finally:
    key = key_f.readlines()
    key_f.close()

app.config['SECRET_KEY'] = key

ABC = """1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"""
TEXTABC = {
    "vowels": "aeyuio",
    "consonants": "dfnlkbnv"
}

TITLE_PLACEHOLDER = ""

db.launch()


def session_gen():
    session = ""
    for _ in range(16):
        session += ABC[randint(0, len(ABC) - 1)]
    return session


def textid_gen():  # * Не проверено
    textid = ""
    for _ in range(randint(5, 7)):
        textid += TEXTABC['consonants'][randint(0, len(
            TEXTABC['consonants']) - 1)] + TEXTABC['vowels'][randint(0, len(TEXTABC['vowels']) - 1)]
    return textid


def nosession():
    session_id = session_gen()
    db.Sessions.add_one(session_id, False)
    return json.dumps({"is_logged_in": False, "login_page": "/static/login.html", "new_session":  session_id}, indent=4)


@app.route('/')
def main_page_load():
    o = open('static/index.html', 'r')
    d = o.read()
    o.close()
    return d


@app.route('/text')
def texts():
    all_texts = db.Texts.get_all()
    dict_data = {
        "texts": [{
            "id": text[0],
            "title": text[2],
        } for text in all_texts]
    }
    return json.dumps(dict_data)


@app.route('/text/<id>')
def text_get(id):
    name = db.Texts.get_one(id)
    names = {"title": f"/static/title_{name[1]}.html",
             "text": f"/static/text_{name[1]}.html", "js": f"/static/{name[1]}.js"}
    return json.dumps(names, indent=4)


@app.route('/app', methods=['POST'])
def admin_application():
    reqst = request.form.get("json")
    print(reqst)
    requestdata = dict(eval(reqst))
    print(requestdata)
    if requestdata['session'] == "-NoSession-":
        return nosession()
    else:
        session = requestdata['session']
        if db.Sessions.is_exists_session(session):
            if db.Sessions.is_validated_session(session):
                return json.dumps({"is_logged_in": True, "app_page": "/static/app.html"}, indent=4)
            else:
                return json.dumps({"is_logged_in": False, "login_page": "/static/login.html"}, indent=4)
        else:
            return json.dumps({"error": "invalid_session"})


@app.route('/internal/login', methods=['POST'])
def login_application():
    requestdata = dict(eval(request.form.get("json")))
    print(requestdata)
    if requestdata['session'] == "-NoSession-":
        return nosession()
    else:
        session = requestdata['session']
        if db.Sessions.is_exists_session(session):
            if db.Sessions.is_validated_session(session):
                return json.dumps({'is_logged_in': True, 'app_page': '/static/app.html'})
            else:
                if requestdata['psswrd'] == MAINSETS['security']['password']:
                    db.Sessions.validate_session(requestdata['session'])
                    return json.dumps({'is_logged_in': True, 'app_page': '/static/app.html'})
                else:
                    return json.dumps({'problem': 'login_failed', 'reason': 'psswrd-incorrect'})
        else:
            return json.dumps({'problem': 'invalid_session'})


@app.route('/internal/addtext', methods=["POST"])
def text_add_application():
    requestdata = dict(eval(request.form.get("json")))

    if requestdata['session'] == "-NoSession-":
        return nosession()
    session = requestdata['session']
    if db.Sessions.is_exists_session(session):
        if db.Sessions.is_validated_session(session):
            name = requestdata['text_name']
            title = requestdata['text']['title'] if requestdata['text']['title'] != "" else TITLE_PLACEHOLDER
            text = requestdata['text']['text']
            js = requestdata['text']['js'] if requestdata['text']['js'] != "" else None
            # * TODO: Доделать сохранение в файл и отправку запроса на БД.
            # * Не проверено
            textnames = textid_gen()
            f_title = open(f'static/title_{textnames}.html', 'w+')
            f_text = open(f'static/text_{textnames}.html', 'w+')
            f_js = open(f'static/{textnames}.js', 'w+')
            print(js)
            f_title.writelines(title)
            f_text.writelines(text)
            f_js.writelines(js if js != None else '')
            db.Texts.add_one(textnames, name)
            return {"status": "scs"}
        else:
            return json.dumps({'is_logged_in': False, 'login_page': '/static/login.html'})
    else:
        return json.dumps({"problem": "invalid_session"})


if __name__ == "__main__":
    app.run()
