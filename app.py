from flask import Flask, jsonify, request, render_template
import hashlib
import time

app = Flask(__name__)

PATIENT = "P1"
CATEGORIES = ["Condition", "Observation", "Medication"]
PARTIES = {
    "Doctor": {"name": "Dr. Meera", "icon": "🩺", "categories": {"Condition": 1, "Observation": 1, "Medication": 1}},
    "Lab": {"name": "Sunrise Lab", "icon": "🧪", "categories": {"Observation": 1}},
    "Insurer": {"name": "HealthCo Insurer", "icon": "🏦", "categories": {}},
}
CONSENTS = {}
AUDIT_LOG = []


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def add_audit(who: str, what: str, ok: bool):
    prev = AUDIT_LOG[-1]["hash"] if AUDIT_LOG else "GENESIS"
    entry = {
        "who": who,
        "what": what,
        "ok": bool(ok),
        "prev": prev,
        "t": int(time.time() * 1000),
    }
    entry["hash"] = sha256_hex(f"{entry['prev']}{entry['who']}{entry['what']}{str(entry['ok'])}{entry['t']}")
    AUDIT_LOG.append(entry)


def verify_audit():
    prev = "GENESIS"
    for idx, entry in enumerate(AUDIT_LOG):
        expected = sha256_hex(f"{entry['prev']}{entry['who']}{entry['what']}{str(entry['ok'])}{entry['t']}")
        if entry["prev"] != prev or entry["hash"] != expected:
            return idx
        prev = entry["hash"]
    return -1


if not AUDIT_LOG:
    add_audit("System", "Vault initialised", True)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/audit")
def get_audit():
    return jsonify(AUDIT_LOG)


@app.route("/consent", methods=["POST", "DELETE"])
def consent_route():
    data = request.get_json(silent=True) or {}
    requester = data.get("requester")
    category = data.get("category")
    if requester not in PARTIES or category not in CATEGORIES:
        return jsonify({"ok": False, "error": "Invalid requester or category"}), 400

    key = (requester, category)
    if request.method == "POST":
        CONSENTS[key] = True
        add_audit("Patient", f"grant {requester}/{category}", True)
    else:
        CONSENTS.pop(key, None)
        add_audit("Patient", f"revoke {requester}/{category}", True)
    return jsonify({"ok": True})


@app.route("/access", methods=["POST"])
def access_route():
    data = request.get_json(silent=True) or {}
    requester = data.get("requester")
    category = data.get("category")
    ok = bool(CONSENTS.get((requester, category), False))
    add_audit(requester, category, ok)
    return jsonify({"ok": ok})


@app.route("/audit/verify")
def verify_route():
    tampered_at = verify_audit()
    return jsonify({"intact": tampered_at < 0, "tampered_at": tampered_at if tampered_at >= 0 else None})


@app.route("/demo/tamper", methods=["POST"])
def tamper_route():
    if not AUDIT_LOG:
        return jsonify({"ok": False})
    AUDIT_LOG[0]["ok"] = not AUDIT_LOG[0]["ok"]
    return jsonify({"ok": True})


@app.route("/ai/risk", methods=["POST"])
def ai_risk():
    data = request.get_json(silent=True) or {}
    age = float(data.get("age", 0))
    bmi = float(data.get("bmi", 0))
    sbp = float(data.get("sbp", 0))
    hba1c = float(data.get("hba1c", 0))

    age_score = max(0, (age - 40) / 40) * 25
    bmi_score = max(0, (bmi - 23) / 15) * 25
    bp_score = max(0, (sbp - 110) / 60) * 20
    hba1c_score = max(0, (hba1c - 5.4) / 3.6) * 30
    score = min(99, int(round(age_score + bmi_score + bp_score + hba1c_score)))
    level = "High" if score > 60 else "Moderate" if score > 35 else "Low"

    contributions = {
        "age": round(age_score, 1),
        "bmi": round(bmi_score, 1),
        "bp": round(bp_score, 1),
        "hba1c": round(hba1c_score, 1),
    }
    return jsonify({
        "score": score,
        "level": level,
        "contributions": contributions,
    })


@app.route("/ai/release/<patient>", methods=["POST"])
def release(patient):
    clinician = request.args.get("clinician", "DrMeera")
    add_audit(clinician, "AI result signed off", True)
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)









































































































































































































