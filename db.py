# import json
# import psycopg2
# import time
# import init_cmd

# conn = psycopg2.connect()
# cursor = conn.cursor()


# def cmt():
#     cursor.commit()

# def rlb():
#     cursor.rollback()

# def launch():
#     cursor.execute(init_cmd.texts_table)
#     cursor.execute(init_cmd.sessions_table)

# class Texts:
#     def get_all() -> list:
#         cursor.execute("""SELECT * FROM texts""")
#         return cursor.fetchall()

#     def get_one(id: int) -> list:
#         cursor.execute("""SELECT * FROM texts WHERE id = %s""", (id,))
#         return cursor.fetchone()

#     def add_one(filename: int, title: str) -> None:
#         cursor.execute("""INSERT INTO texts (filesname, text_title) VALUES (%s, %s)""", (filename, title))
#         cmt()
#         pass

# class Sessions:
#     def get_all() -> list:
#         cursor.execute("""SELECT * FROM sessions""")
#         return cursor.fetchall()

#     def get_one(session: str) -> list:
#         cursor.execute("""SELECT * FROM sessions WHERE session_id = ?""", (session,))
#         return cursor.fetchone()

#     def is_validated_session(session: str) -> bool:
#         cursor.execute("""SELECT logged_in FROM sessions WHERE session_id = ?""", (session,))
#         return cursor.fetchone()[0]

#     def is_exists_sessions(session: str) -> bool:
#         cursor.execute("""SELECT logged_in FROM sessions WHERE session_id = ?""", (session,))
#         return bool(len(cursor.fetchone()))

#     def validate_session(session: str, date) -> None:
#         cursor.execute("""DELETE FROM sessions WHERE session_id = ?""", (session,))
#         cmt()
#         cursor.execute("""INSERT INTO sessions VALUES (?, ?, 't')""", (session, date))
#         cmt()
    
#     def del_all() -> None:
#         cursor.execute("""DELETE * FROM sessions""")
#         cmt()
#         pass

