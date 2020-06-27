from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo

from pprint import pprint

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
# app.config["MONGO_URI"] = "mongodb://localhost:27017/mars"
# mongo = PyMongo(app)


# @app.route('clear')
# def clear():
#     collection.remove()
#     return redirect('/')

@app.route("/")
def index():
    return render_template("index.html", test="passing a value works")


@app.route("/county")
def county():
    return "county name"
   


if __name__ == "__main__":
    app.run(debug=True)
