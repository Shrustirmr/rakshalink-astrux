# RakshaLink · AstruX

RakshaLink is a consent-first health data exchange demo designed around the idea that patient records should move only when explicit access permissions exist, and that AI-generated health insights require clinical sign-off before release.

## Demo summary

This project simulates:
- a patient consent wallet
- requester access controls for doctors, labs, and insurers
- FHIR-style access requests
- an audit trail using hash-linked blocks
- an ethical AI diabetes-risk model with clinician approval gates
- Hindi/English UI switching

## Live demo behavior

1. Open the app in the browser.
2. Toggle consent for a party (Doctor, Lab, Insurer).
3. Trigger a data access request.
4. Watch the system either allow or deny access based on consent.
5. Verify the tamper-evident audit chain.
6. Run the AI risk model and release only after clinician sign-off.

## Run locally

Requirements:
- Python 3.10+
- pip

Commands:

```bash
cd rakshalink-astrux
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Then open:

```text
http://localhost:5000
```

## Project structure

```text
rakshalink-astrux/
├── app.py
├── requirements.txt
├── README.md
├── static/
│   ├── script.js
│   └── style.css
├── templates/
│   └── index.html
├── .gitignore
└── .venv/
```

## Notes

- The app is a demo/prototype and uses in-memory state.
- The audit chain is intentionally simple but demonstrates how hash chaining works for tamper evidence.
- The AI risk model is illustrative and not a clinical decision system.

## Quick start screenshot / flow

```text
Browser UI -> Consent wallet -> Access request -> Audit validation -> AI gate -> Clinician sign-off
```

If you want, I can also add a second version with a more polished dashboard or a FastAPI-based backend version.
