import json
import psycopg2
from datetime import date
import init_cmd

MAINSETS = json.load(open("sets.json", 'r'))

conn = psycopg2.connect(host=MAINSETS['database']['host'], port=MAINSETS['database']['port'],
                        dbname=MAINSETS['database']['dbname'], user=MAINSETS['database']['user'],
                        password=MAINSETS['database']['password'])
cursor = conn.cursor()


def cmt():
    conn.commit()


def rlb():
    conn.rollback()


def launch():
    cursor.execute(init_cmd.texts_table)
    cursor.execute(init_cmd.sessions_table)


class Texts:
    def get_all() -> list:
        cursor.execute("""SELECT * FROM texts""")
        return cursor.fetchall()

    def get_one(id: int) -> list:
        cursor.execute("""SELECT * FROM texts WHERE id = %s""", (id,))
        return cursor.fetchone()

    def add_one(filename: int, title: str) -> None:
        cursor.execute("""INSERT INTO texts (filesname, text_title) VALUES (%s, %s)""",
                       (filename, title))
        cmt()
        pass


class Sessions:
    def add_one(session_id: str, is_logged_in: bool) -> list:
        cursor.execute(f"INSERT INTO sessions VALUES ('%s', '%s', '%s')" % (
            session_id, date.today(), 't' if is_logged_in else 'f'))
        cmt()
        pass

    def get_all() -> list:
        cursor.execute("""SELECT * FROM sessions""")
        return cursor.fetchall()

    def get_one(session: str) -> list:
        cursor.execute(
            f"""SELECT * FROM sessions WHERE session_id = '{session}'""")
        return cursor.fetchone()

    def is_validated_session(session: str) -> bool:
        cursor.execute(
            f"""SELECT logged_in FROM sessions WHERE session_id = '{session}' """)
        return cursor.fetchone()[0]

    def is_exists_session(session: str) -> bool:
        print(type(session))
        cursor.execute(
            f"""SELECT logged_in FROM sessions WHERE session_id = '{session}' """) if session != "" and session != None else None
        x = cursor.fetchone()
        return bool(len(x) if x != None else False)

    def validate_session(session: str) -> None:
        cursor.execute(
            f"""DELETE FROM sessions WHERE session_id = '{session}'""", (session,))
        cmt()
        cursor.execute(
            f"""INSERT INTO sessions VALUES ('{session}', '{date.today()}', 't')""")
        cmt()
        pass

    def del_all() -> None:
        cursor.execute("""DELETE * FROM sessions""")
        cmt()
        pass
