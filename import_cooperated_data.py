import csv
import psycopg2
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
import os
import re

load_dotenv()

db_params = {
    'dbname': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USERNAME'),
    'password': os.getenv('DATABASE_PASSWORD'),
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT')
}

conn = psycopg2.connect(**db_params)
cur = conn.cursor()

csv_file_path = 'data.csv'

data = pd.read_csv(csv_file_path)

def clean_data(row):
    row['CPF'] = re.sub(r'\D', '', row['CPF'])
    row['TEL_CEL'] = re.sub(r'\D', '', row['TEL_CEL'])
    row['NOME'] = row['NOME'].title()
    row['EMAIL'] = row['EMAIL'].lower()
    return row

data = data.apply(clean_data, axis=1)

def insert_data(row):
    insert_query = """
        INSERT INTO cooperated (email, "firstName", "lastName", phone, document, "createdAt", "updatedAt", "deletedAt")
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (email) DO NOTHING;
    """
    name_parts = row['NOME'].split(' ', 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ''

    cur.execute(insert_query, (
        row['EMAIL'],
        first_name,
        last_name,
        row['TEL_CEL'],
        row['CPF'],
        datetime.now(),
        datetime.now(),
        None           
    ))

for index, row in data.iterrows():
    insert_data(row)

conn.commit()

cur.close()
conn.close()
