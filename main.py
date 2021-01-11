import datetime
import json
import os
from random import randint

from flask import Flask, redirect, session, url_for, request
from werkzeug.utils import html

import db

app = Flask(__name__, static_folder='static')

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
    "consonants":"dfnlkbnv"
}

TITLE_PLACEHOLDER = ""

def session_gen():
    session = ""
    for _ in range(16):
        session += ABC[randint(0, len(ABC))]
    return session

def textid_gen(): # * Не проверено
    textid = ""
    for _ in range(randint(5, 7)):
        textid += TEXTABC['consonants'][randint(0, len(TEXTABC['consonants']))] + TEXTABC['vowels'][randint(0, len(TEXTABC['vowels']))]
    return textid 

@app.route('/')
def main_page_load():
    # o = open('index.html','r')
    # d = open.readlines()
    # o.close()
    # return d
    return

@app.route('/text')
def texts():
    # TODO Сделать страницу с текстами
    pass

@app.route('/text/<id>')
def text_get(id):
    name = db.Texts.get_one(id)
    names = { "title": f"/static/title_{name}.html", "text": f"/static/text_{name}.html", "js": f"/static/{name}.js"}
    return json.dumps(names, indent=4)

@app.route('/app')
def admin_application():
    requestdata = request.text
    requestdata = json.loads(requestdata)
    if requestdata['session'] is "-NoSession-":
        session_id = session_gen()
        db.Sessions.add_one(session_id, False)
        return json.dumps({"is_logged_in": False, "login_page": "/static/login.html", "new_session":  session_id}, indent=4)
    else:
        requestdata = request.text
        requestdata = json.loads(requestdata)
        if db.Sessions.is_exists_session(session):
            if db.Sessions.is_validated_session(session):
                return json.dumps({"is_logged_in": True, "app_page": "/static/app.html"}, indent=4)
            else:
                return json.dumps({"is_logged_in": False, "login_page": "/static/login.html"}, indent=4)
        else:
            return json.dumps({"error": "invalid_session"})

@app.route('/internal/addtext', methods=["POST"])
def text_add_application():
    requestdata = request.get_json()
    requestdata = json.loads(requestdata)
    if requestdata['session'] is "-NoSession-":
        session_id = session_gen()
        db.Sessions.add_one(session_id, False)
        return json.dumps({"status":"lg-req", "is_logged_in": False, "login_page": "/static/login.html"})
    if db.Sessions.is_exists_sessions(session):
        if db.Session.is_validated_session(session):
            name = requestdata['text_name']
            title = requestdata['text']['title'] if requestdata['text']['title'] != "" else TITLE_PLACEHOLDER
            text = requestdata['text']['text']
            js = requestdata['text']['js'] if requestdata['text']['js'] != "" else None
            # TODO: Доделать сохранение в файл и отправку запроса на БД.
            # ! В процессе, лучше не запускать =)
            textnames = textid_gen()
            f = open(f'static/title_{textnames}.html', 'w+'), open(f'static/text_{textnames}.html', 'w+'), open(f'static/{textnames}.js', 'w+')
            for i, elem in range(3), [title, text, js]:
                f[i].writelines(elem)
                f.close()
            del f
            db.Text.add_one(textnames, name)
            return {"status": "scs"}
            



        else:
            return json.dumps({'is_logged_in': False, 'login_page': '/static/login.html'})
    else:
        return json.dumps({"error": "invalid_session"})

            
            




if __name__ == "__main__":
    app.run()
    