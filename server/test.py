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
    timestamp = dateTimeObj.strftime("%H:%M:%S")
    for patient_id in patients:
        for year in range(2010, 2022):
            for month in range(1, 6):
                for day in range(1, 6):
                    energy = round(random.random(), 4)
                    volume = round(random.random(), 4)

                    cur.execute("""
                    INSERT INTO feed (patient_id, volume, energy, timestamp)
                    VALUES (%s, %s, %s, %s);
                    """, (patient_id, volume, energy, f"{str(year)+'-'+str(month)+'-'+str(day) +'- '+timestamp}"))
        

def genTreatment(cur):
    patients = getPatients(cur)
    dateTimeObj = datetime.now()
    # YYYY-MM-DD hh:mm::ss - postgreSQL timestamp type
    timestamp = dateTimeObj.strftime("%H:%M:%S")
    for patient_id in patients:
        for year in range(2010, 2022, 3):
            target_volume = round(random.random(), 4)
            target_energy = round(random.random(), 4)
            cur.execute("""
            INSERT INTO treatments (patient_id, description, target_feed_volume, target_feed_energy, modified_time)
            VALUES (%s, 'test', %s, %s, %s);
            """, (patient_id, target_volume, target_energy, f"{str(year)+'-01-01'+' '+timestamp}"))
        

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

    # TODO for now select all the users who are patients and for each one of them
    # generate a random feed.
    genData(cur)
    genTreatment(cur)

    connection.commit() # Save changes to the database
    # Close the connection to the database
    cur.close()
    connection.close()