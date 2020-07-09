from flask import Flask, render_template, redirect,jsonify
from flask_pymongo import PyMongo
import json

# Needed if we switch to postgres versus mongoDB
#from flask_sqlalchemy import SQLAlchemy
from os import environ
from pprint import pprint

app = Flask(__name__)

#uncomment the two lines string below to connect locally to the remote MongoDB
MONGODB_URI = "mongodb://heroku_16bnqn8r:o3fh2pq4irgciongqifi8kj08d@ds151068.mlab.com:51068/heroku_16bnqn8r"
app.config["MONGO_URI"] = environ.get('MONGODB_URI') or MONGODB_URI

# Use flask_pymongo to set up mongo connection

#app.config["MONGO_URI"] = environ.get('MONGODB_URI')
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
    

# @app.route("/statecounty/<state>/<county>")
@app.route("/statecounty/")
# def statecounty(state ,county):
def statecounty():
    with open('DataLoad/data/counties.json') as f:
        data = json.load(f)
    
    statecounties = []
    for state in data:
        for county in data[state]:
            item = { "county":county + ", " + state}
            statecounties.append(item)
        
    return jsonify(statecounties)

@app.route("/plotstatecounty/<state>/<county>")
def plotstatecounty(state ,county):
# @app.route("/plotstatecounty/")
# def plotstatecounty():
   
    myquery = { "countyinfo.State": state,"countyinfo.County": county }
    
    samples = mongo.db.aqidata.find(myquery)
       
    # for document in samples: 
    #    pprint(document)
    features = []
    for sample in samples:
        item = {'county': sample['countyinfo']['County'],'state': sample['countyinfo']['State'],'date':sample['date']}
        features.append(item)
        
    return jsonify(features)

@app.route("/ozone")
def ozone():
    
    samples = mongo.db.trying.find_one() 
    # print(samples)
    # features = []
    # for sample in samples:
    #     item = {'county': sample['info']['County'],'state': sample['info']['State']}
    #     features.append(item)
        
    return jsonify(samples["5101"])
    


if __name__ == "__main__":
    app.run(debug=True)

