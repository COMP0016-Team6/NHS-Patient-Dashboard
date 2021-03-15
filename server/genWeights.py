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
    timestamp = dateTimeObj.strftime("%m-%d %H:%M:%S")
    for patient_id in patients:
        for year in range(2009, 2022):
            weight = random.randrange(60, 70)
        
            cur.execute("""
            INSERT INTO weights (patient_id, weight, timestamp)
            VALUES (%s, %s, %s);
            """, (patient_id, weight, f"{str(year) +'-'+ timestamp}"))

if __name__ == "__main__":
    # TODO Later move this information into database.ini file and add that
    # to .gitignore
    connection = psycopg2.connect(
        host="localhost",
        database="application",
        user="daulet",
        password="Barcateam1",
        port=5432)

    cur = connection.cursor()

    genData(cur)

    connection.commit() # Save changes to the database
    # Close the connection to the database
    cur.close()
    connection.close()