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
    query_params = request.args.to_dict()
    if not query_params:
        return (
            jsonify({"error": "Please provide at least one query parameter"}),
            400,
        )
    print(f"query params: {query_params}")
    datasets = []
    with open(DATASETS_CSV, newline="", encoding="utf-8-sig") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=",")
        for row in reader:
            if all(
                row.get(key) == value for key, value in query_params.items()
            ):
                datasets.append(row)

    return jsonify(datasets)


if __name__ == "__main__":
    app.run(debug=True)
