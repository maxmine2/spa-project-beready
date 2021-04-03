import db
# db.cursor.execute("""DROP TABLE texts""")
# db.cursor.execute("""DROP TABLE sessions""")
db.cmt()
db.cursor.execute("""DELETE FROM texts""")
db.cmt()