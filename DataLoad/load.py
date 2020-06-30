import os
import sys
import pandas as pd
import pymongo
import json

conn = 'mongodb://test_admin:mongodb2@ds151068.mlab.com:51068/heroku_16bnqn8r?retryWrites=false'
# mng_client = pymongo.MongoClient('localhost', 27017)
mng_client = pymongo.MongoClient(conn)
mng_db = mng_client['heroku_16bnqn8r']

def import_csv_content(filepath):
     
    collection_name = 'cbsa_aqi' 
    db_cm = mng_db[collection_name]
    cdir = os.path.dirname(os.path.abspath(__file__))
    print(cdir)
    file_res = os.path.join(cdir, filepath)

    data = pd.read_csv(file_res)
    data_json = json.loads(data.to_json(orient='records'))
    db_cm.remove()
    db_cm.insert_many(data_json)

def import_json_content(filepath,col_name):
     
 
    db_cm = mng_db[col_name]
    cdir = os.path.dirname(os.path.abspath(__file__))
    print(cdir)
    file_res = os.path.join(cdir, filepath)

    samples = pd.read_json(file_res)
    data = pd.DataFrame()
    for sample in samples:
        item = {
             "fips": sample,
             "countyinfo": samples[sample].info,
             "datedata": samples[sample]['data']
        }
        data = data.append(item, ignore_index=True)

    #print(data)

    data_json = json.loads(data.to_json(orient='records'))
    db_cm.remove()
    db_cm.insert_many(data_json)

if __name__ == "__main__":
    filepath = './data/daily_aqi_by_cbsa_2020.csv'  
    import_csv_content(filepath)

    #Load JSON Data from Lavanya and Jonathan
    json_path = '../static/data/aqi_data.json'
    import_json_content(json_path,'pollutiondata')

