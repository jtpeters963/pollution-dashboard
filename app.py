from flask import Flask, render_template, redirect
import pymongo

app = Flask(__name__)

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.pollution_db

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()