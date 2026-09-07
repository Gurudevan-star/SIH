import json
from pathlib import Path


DATA_FILE = Path(__file__).parent / "synthetic_data.json"


def load_demo_data():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


if __name__ == "__main__":
    data = load_demo_data()

    print("CryptoTrace Demo Dataset")
    print("------------------------")
    print("Dataset:", data["dataset_type"])
    print("Case:", data["case"]["case_id"])
    print("Transactions:", len(data["transactions"]))

    print(
        "Risk Score:",
        data["risk_assessment"]["risk_score"]
    )

    print(
        "Attribution Confidence:",
        data["attribution"]["confidence"]
    )