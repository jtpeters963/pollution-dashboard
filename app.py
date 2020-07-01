from flask import Flask, render_template, redirect,jsonify
from flask_pymongo import PyMongo
import json

# Needed if we switch to postgres versus mongoDB
#from flask_sqlalchemy import SQLAlchemy
from os import environ
from pprint import pprint

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = environ.get('MONGODB_URI') or "mongodb://27017/pollutiondata"
mongo = PyMongo(app)


# @app.route('clear')
# def clear():
#     collection.remove()
#     return redirect('/')

@app.route("/")
def index():
   # aqi_info = mongo.db.geo_with_nas.find_all()
    # how to tie this to the map logic where the data needs to come from mongoDB
    return render_template("index.html", test="passing a value works")


@app.route("/chloroplethdata")
def chloroplethdata():
    samples = mongo.db.geo_with_nas.find()
 
    pprint(samples)
    
    return jsonify(samples)
 


#ask Mike on how to pass multiple variables to the end point
@app.route("/statecounty/<state>/<county>")
def statecounty(state,county):
    
    # replace reading from a file once MongoDB works
    with open('static/data/geojson_withNAs.json') as f:
        samples = json.load(f)


    #uncomment when mongodb works
    #samples = mongo.db.geo_with_nas.find()
 
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

