from flask import Flask, render_template, redirect,jsonify
from flask_pymongo import PyMongo
import json

# Needed if we switch to postgres versus mongoDB
#from flask_sqlalchemy import SQLAlchemy
from os import environ
from pprint import pprint

app = Flask(__name__)

#uncomment the two lines string below to connect locally to the remote MongoDB
#MONGODB_URI = "mongodb://heroku_16bnqn8r:o3fh2pq4irgciongqifi8kj08d@ds151068.mlab.com:51068/heroku_16bnqn8r"
# app.config["MONGO_URI"] = environ.get('MONGODB_URI') or MONGODB_URI

# Use flask_pymongo to set up mongo connection

app.config["MONGO_URI"] = environ.get('MONGODB_URI')
mongo = PyMongo(app)

@app.route("/")
def index():
   # aqi_info = mongo.db.geo_with_nas.find_all()
    # how to tie this to the map logic where the data needs to come from mongoDB
    return render_template("index.html", test="passing a value works")


@app.route("/aqidata")
def aqidata():
    aqi_datas = mongo.db.geo_with_nas.find()
    # for document in aqi_datas: 
    #     pprint(document)
    features = []
    for aqi_data in aqi_datas:
     
        features.append(aqi_data['features'])
    geojson = {"type":"FeatureCollection",
    "features":features}
    
    return jsonify(geojson)
    

#ask Mike on how to pass multiple variables to the end point
@app.route("/statecounty/<state>/<county>")
def statecounty(state ,county):
    
  
    #uncomment when mongodb works
    samples = mongo.db.geo_with_nas.find()
 
    pprint(samples)
    aqi_data = []
    for sample in samples:
        item = {
             "countyname": sample['features']['properties']['NAME'],
             "aqi_avg": sample['features']['properties'].aqi_avg
        }
 
    aqi_data.append(item)
    return jsonify(aqi_data)


if __name__ == "__main__":
    app.run(debug=True)

