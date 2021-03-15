# TODO Add psycopg2 module into the requirements
import psycopg2
import random
from datetime import datetime

def getPatients(cur):
    cur.execute("""
    SELECT user_id FROM users WHERE user_role='Patient';
    """)

    return cur.fetchall()

def genData(cur):
    patients = getPatients(cur)
    dateTimeObj = datetime.now()
    # YYYY-MM-DD hh:mm::ss - postgreSQL timestamp type
    timestamp = dateTimeObj.strftime("%Y-%m-%d %H:%M:%S")
    for patient_id in patients:
        energy = round(random.random(), 4)
        volume = round(random.random(), 4)
    
        cur.execute("""
        INSERT INTO feed (patient_id, volume, energy, timestamp)
        VALUES (%s, %s, %s, %s);
        """, (patient_id, volume, energy, timestamp))

if __name__ == "__main__":
    # TODO Later move this information into database.ini file and add that
    # to .gitignore
    connection = psycopg2.connect(
        host="localhost",
        database="application",
        user="",
        password="",
        port=5432)

    cur = connection.cursor()

    # TODO for now select all the users who are patients and for each one of them
    # generate a random feed.
    genData(cur)

    connection.commit() # Save changes to the database
    # Close the connection to the database
    cur.close()
    connection.close()