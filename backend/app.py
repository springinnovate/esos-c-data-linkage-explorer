"""Resnet backend app."""

from flask import Flask, jsonify, request
from flask_cors import CORS
import csv

app = Flask(__name__)
CORS(app)

DATASETS_CSV = "connection_matrix.csv"


@app.route("/")
def index():
    return jsonify({"message": "RESNET Backend is running!"})


@app.route("/datasets")
def get_datasets():
    quadrant = request.args.get("quadrant")
    if not quadrant:
        return jsonify({"error": "Please provide a 'quadrant' parameter"}), 400

    datasets = []
    with open(DATASETS_CSV, newline="", encoding="utf-8-sig") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=",")
        for row in reader:
            print(f'{row["quadrant"]} vs {quadrant}')
            if row["quadrant"] == quadrant:
                datasets.append(row)  # Return the entire row as-is
    return jsonify(datasets)


if __name__ == "__main__":
    app.run(debug=True)
