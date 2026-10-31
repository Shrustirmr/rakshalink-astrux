# RakshaLink · AstruX

A consent-first health data exchange demo built with Python and Flask.

## Features
- Consent wallet simulation for doctors, labs, and insurers
- FHIR-style access request flow
- Tamper-evident audit log using hash chaining
- Ethical AI gate with clinician sign-off
- Hindi/English language toggle

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Then open:

http://localhost:5000

## Project structure

- `app.py` – Flask server and consent/audit logic
- `templates/index.html` – App UI shell
- `static/style.css` – Styling from the original concept
- `static/script.js` – Interactive behavior and API calls
