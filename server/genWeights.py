# Run this script to view/test the functionality of the application (generate weights for each patient)
# Make sure you first run `pip install -r requirements.txt` to install the dependencies

import psycopg2
import random
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

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
    connection = psycopg2.connect(
        host=os.getenv("PGHOST"),
        database=os.getenv("PGDATABASE"),
        user=os.getenv("PGUSER"),
        password=os.getenv("PGPASSWORD"),
        port=os.getenv("PGPORT")
    )

    cur = connection.cursor()

    genData(cur)

    connection.commit() # Save changes to the database
    # Close the connection to the database
    cur.close()
    connection.close()