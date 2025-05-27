from flask import Flask, jsonify
import csv

app = Flask(__name__)

DATASETS_CSV = "datasets.csv"


@app.route("/")
def index():
    return jsonify({"message": "RESNET Backend is running!"})


@app.route("/datasets")
def get_datasets():
    datasets = []
    with open(DATASETS_CSV, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            datasets.append({"id": int(row["id"]), "name": row["name"]})
    return jsonify(datasets)


if __name__ == "__main__":
    app.run(debug=True)
