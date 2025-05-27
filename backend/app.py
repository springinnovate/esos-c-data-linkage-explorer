from flask import Flask, jsonify
from models import db, Dataset

app = Flask(__name__)

# Configure database (SQLite for simplicity)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


@app.route("/")
def index():
    return jsonify({"message": "RESNET Backend is running!"})


@app.route("/datasets")
def get_datasets():
    datasets = Dataset.query.all()
    return jsonify([{"id": ds.id, "name": ds.name} for ds in datasets])


if __name__ == "__main__":
    app.run(debug=True)
