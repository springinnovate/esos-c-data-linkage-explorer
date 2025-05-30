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
    query_params = {}
    for key in request.args.keys():
        values = request.args.getlist(key)
        query_params[key.replace("[]", "")] = values
    print(f"query params: {query_params}")
    datasets = []
    with open(DATASETS_CSV, newline="", encoding="utf-8-sig") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=",")
        for row in reader:
            if all(
                row.get(key) in values for key, values in query_params.items()
            ):
                datasets.append(row)
    categories = [
        "🌸 pollination 🐝",
        "🌲 recreation 🚶‍♂️",
        "🌱 nutrient ✨",
        "🌳 carbon ☁️",
        "🏞️ sediment 🪨",
        "🌊 flood ⚠️",
        "🚰 freshwater provision💧",
    ]
    return jsonify({"categories": categories, "datasets": datasets})


if __name__ == "__main__":
    app.run(debug=True)
