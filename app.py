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
    return render_template("index.html", test="passing a value works")


@app.route("/statecounty")
def statecounty():
    
    # replace reading from a file once MongoDB works
    with open('static/data/aqi_data.json') as f:
        samples = json.load(f)

    
# Output: {'name': 'Bob', 'languages': ['English', 'Fench']}
    #print(samples[zip].info)

    #samples = mongo.db.countylist.find()
    # Uncomment the pollutiondata
    #aqidatas = mongo.db.pollutiondata.find()
    pprint(samples['8103'])
    data = []
    for sample in samples:
        item = {
             "countyinfo": sample.info,
             "datedata": sample.data
        }
 
    data.append(item)
    return jsonify(data)
 


if __name__ == "__main__":
    app.run(debug=True)
