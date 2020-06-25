import os
import sys
import pandas as pd
import pymongo
import json



def import_content(filepath):
    mng_client = pymongo.MongoClient('localhost', 27017)
    mng_db = mng_client['pollution'] 
    collection_name = 'cbsa_aqi' 
    db_cm = mng_db[collection_name]
    cdir = os.path.dirname(os.path.abspath(__file__))
    print(cdir)
    file_res = os.path.join(cdir, filepath)

    data = pd.read_csv(file_res)
    data_json = json.loads(data.to_json(orient='records'))
    db_cm.remove()
    db_cm.insert_many(data_json)

if __name__ == "__main__":
  filepath = './data/daily_aqi_by_cbsa_2020.csv'  
  import_content(filepath)