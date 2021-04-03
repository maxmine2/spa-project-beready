import json
import psycopg2
from datetime import date
import init_cmd

MAINSETS = json.load(open("sets.json", 'r'))

conn = psycopg2.connect(host=MAINSETS['database']['host'], port=MAINSETS['database']['port'],
                            dbname=MAINSETS['database']['dbname'], user=MAINSETS['database']['user'],
                            password=MAINSETS['database']['password'])
cursor = conn.cursor()

cursor.execute("SELECT * FROM information_schema.columns WHERE TABLE_NAME = 'texts'")

print(json.dumps(dict(eval('{"data":' + f"{cursor.fetchall()}" + '}')), indent=4))