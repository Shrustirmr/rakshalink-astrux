var state = {
  log: [],
  bad: -1,
  patient: 'P1',
  language: 'en'
};

const parties = {
  Doctor: { n: 'Dr. Meera', i: '🩺', c: { Condition: 1, Observation: 1, Medication: 1 } },
  Lab: { n: 'Sunrise Lab', i: '🧪', c: { Observation: 1 } },
  Insurer: { n: 'HealthCo Insurer', i: '🏦', c: {} }
};
const categories = ['Condition', 'Observation', 'Medication'];

const T = {
  en: {
    h1: 'Your health data. Your rules.',
    sub: "One consent-first exchange where records travel, access is provable and AI needs a doctor's approval.",
    s1: 'records unified',
    s2: 'active consents',
    s3: 'audit blocks',
    c1: '🔐 Consent wallet',
    c1s: 'Flip a switch. Access changes instantly and is logged.',
    c2: '⚡ Request simulator',
    c2s: 'Fire a request and watch it travel through the exchange.',
    c3: '⛓️ Tamper-evident audit chain',
    c3s: 'Every event is hash-linked to the one before it.',
    vb: 'Verify integrity',
    tb: 'Tamper with block 1',
    c4: '🧠 Ethical-AI gate',
    c4s: 'Diabetes risk demo. Bias-checked, explained, released only with clinician sign-off.',
    ab: 'Run model'
  },
  hi: {
    h1: 'आपका स्वास्थ्य डेटा। आपके नियम।',
    sub: 'एक सहमति-आधारित प्रणाली जहाँ रिकॉर्ड साथ चलते हैं, पहुँच प्रमाणित है और AI को डॉक्टर की मंज़ूरी चाहिए।',
    s1: 'रिकॉर्ड एकीकृत',
    s2: 'सक्रिय सहमतियाँ',
    s3: 'ऑडिट ब्लॉक',
    c1: '🔐 सहमति वॉलेट',
    c1s: 'स्विच दबाएँ। पहुँच तुरंत बदलती है और दर्ज होती है।',
    c2: '⚡ अनुरोध सिम्युलेटर',
    c2s: 'अनुरोध भेजें और उसे सिस्टम में चलते देखें।',
    c3: '⛓️ छेड़छाड़-प्रमाण ऑडिट चेन',
    c3s: 'हर घटना पिछली घटना से हैश-जुड़ी है।',
    vb: 'अखंडता जाँचें',
    tb: 'ब्लॉक 1 से छेड़छाड़ करें',
    c4: '🧠 नैतिक AI गेट',
    c4s: 'मधुमेह जोखिम डेमो। पक्षपात-जाँच, व्याख्या और डॉक्टर की मंज़ूरी के बाद ही जारी।',
    ab: 'मॉडल चलाएँ'
  }
};

function lang() {
  state.language = state.language === 'en' ? 'hi' : 'en';
  document.getElementById('lb').textContent = state.language === 'en' ? 'हिंदी' : 'English';
  document.querySelectorAll('[data-i]').forEach((e) => {
    const key = e.dataset.i;
    if (T[state.language][key]) {
      e.textContent = T[state.language][key];
    }
  });
}

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = 'sh';
  setTimeout(() => { el.className = ''; }, 2600);
}

async function api(method, url, body) {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  return response;
}

function countTo(id, value) {
  const el = document.getElementById(id);
  const start = +el.textContent || 0;
  let current = 0;
  const interval = setInterval(() => {
    current += 1;
    el.textContent = Math.round(start + (value - start) * (current / 12));
    if (current >= 12) clearInterval(interval);
  }, 30);
}

function drawWallet() {
  const wallet = document.getElementById('cw');
  wallet.innerHTML = Object.keys(parties).map((k) => {
    return `
      <div class="row">
        <span style="font-size:20px">${parties[k].i}</span>
        <span class="nm">${parties[k].n}</span>
        ${categories.map((c) => `<span class="cat">${c}</span>`).join('')}
      </div>
      <div class="row">
        ${categories.map((c) => `
          <span style="flex:1;display:flex;gap:6px;align-items:center;font-size:11px">
            <button class="sw ${(parties[k].c[c] ? 'on' : '')}" onclick="toggleConsent('${k}', '${c}')"></button>
            ${c.slice(0, 4)}
          </span>
        `).join('')}
      </div>
    `;
  }).join('');
}

function drawRequests() {
  const reqs = document.getElementById('rq');
  reqs.innerHTML = Object.keys(parties).map((k) => {
    return categories.map((c) => {
      return `<button class="bt" onclick="access('${k}', '${c}')">${parties[k].i} ${k} → ${c.slice(0, 4)}</button>`;
    }).join('');
  }).join('<br>');
}

function drawAudit() {
  const chain = document.getElementById('ch');
  chain.innerHTML = state.log.map((e, i) => {
    const badClass = (i >= state.bad && state.bad >= 0) ? 'bad ' : '';
    const noClass = e.ok ? '' : 'no';
    return `<div class="bk ${badClass}${noClass}"><b>#${i + 1}</b> ${e.who}<br>${e.what}<br>${e.ok ? '✔ granted' : '✘ denied'}<code>${e.hash.slice(0, 14)}…</code></div>`;
  }).join('');
  chain.scrollLeft = chain.scrollWidth;
}

function renderFlow() {
  const nodes = ['🏥|Sources', '🔄|FHIR', '🛂|Consent', '🗄️|Vault', '🧠|AI gate', '📱|Apps'];
  document.getElementById('fl').innerHTML = nodes.map((x, i) => {
    const [icon, label] = x.split('|');
    return `<div class="nd" id="f${i}"><i>${icon}</i>${label}</div>${i < 5 ? '<div class="ln"></div>' : ''}`;
  }).join('');
}

async function flowStep(ok) {
  for (let i = 0; i < 6; i += 1) {
    const el = document.getElementById('f' + i);
    if (!ok && i === 2) {
      el.className = 'nd no';
      await new Promise((r) => setTimeout(r, 900));
      el.className = 'nd';
      return;
    }
    el.className = 'nd on';
    await new Promise((r) => setTimeout(r, 320));
    el.className = 'nd';
  }
}

async function toggleConsent(k, c) {
  const on = !parties[k].c[c];
  parties[k].c[c] = on ? 1 : 0;
  const method = on ? 'POST' : 'DELETE';
  await api(method, '/consent', { patient: state.patient, requester: k, category: c });
  toast(`${on ? '✔ Consent granted: ' : '🚫 Consent revoked: '}${parties[k].n} / ${c}`);
  await sync();
}

async function access(k, c) {
  const ok = !!parties[k].c[c];
  await flowStep(ok);
  const response = await api('POST', '/access', { patient: state.patient, requester: k, category: c });
  const data = await response.json();
  const allowed = !!data.ok;
  document.getElementById('ro').innerHTML = allowed
    ? `<span class="ok">✔ ${parties[k].n} received ${c} (FHIR R4). Logged.</span>`
    : `<span style="color:var(--rd)">✘ Blocked: no active consent for ${c}. Logged.</span>`;
  toast(allowed ? 'Access granted' : 'Access denied by consent engine');
  await sync();
}

async function ver() {
  const response = await fetch('/audit/verify');
  const data = await response.json();
  const index = data.tampered_at === null ? -1 : data.tampered_at;
  state.bad = index;
  drawAudit();
  document.getElementById('vr').innerHTML = index < 0
    ? `<p class="ok">✔ Chain intact: ${state.log.length} blocks verified.</p>`
    : `<p style="color:var(--rd)">⚠ Tampering detected at block ${index + 1}. Everything after it is untrusted.</p>`;
  toast(index < 0 ? 'Chain verified ✔' : 'Tampering detected ⚠');
}

async function tam() {
  if (!state.log.length) return toast('Make a request first');
  await api('POST', '/demo/tamper');
  await sync();
  toast('Block 1 altered. Now click Verify.');
}

async function ai() {
  const age = +document.getElementById('a').value;
  const bmi = +document.getElementById('bm').value;
  const bp = +document.getElementById('bp').value;
  const gl = +document.getElementById('gl').value;

  const response = await api('POST', '/ai/risk', {
    patient: state.patient,
    age,
    bmi,
    sbp: bp,
    hba1c: gl
  });
  const result = await response.json();
  const series = [
    ['Age', result.contributions.age],
    ['BMI', result.contributions.bmi],
    ['BP', result.contributions.bp],
    ['HbA1c', result.contributions.hba1c]
  ];

  const color = result.score > 60 ? '#B3261E' : result.score > 35 ? '#D4AF37' : '#0B6B4B';
  document.getElementById('ao').innerHTML = `
    <div class="gz">
      <svg viewBox="0 0 180 110">
        <path d="M10 95 A80 80 0 0 1 170 95" stroke="#E4DBB8"/>
        <path id="gp" d="M10 95 A80 80 0 0 1 170 95" stroke="${color}" stroke-dasharray="252" stroke-dashoffset="252" style="transition:stroke-dashoffset 1.2s"/>
      </svg>
      <div style="font-size:34px;font-weight:800;color:${color}">${result.score} · ${result.level}</div>
    </div>
    ${series.map(([label, value]) => `
      <div class="row">
        <span style="width:70px;font-size:12px">${label}</span>
        <div class="bar"><i style="width:0" data-w="${Math.min(100, value * 3.5)}"></i></div>
      </div>
    `).join('')}
    <p class="ok">✔ Fairness: sex/caste/religion/location are not inputs; swap test unchanged.</p>
    <p class="ok">✔ Data minimised: 4 consented fields only.</p>
    <button class="bt go" onclick="signoff()">👩‍⚕️ Clinician sign-off &amp; release</button>
  `;

  setTimeout(() => {
    document.getElementById('gp').style.strokeDashoffset = 252 * (1 - result.score / 100);
    document.querySelectorAll('.bar i').forEach((el) => {
      el.style.width = `${el.dataset.w}%`;
    });
  }, 50);
}

async function signoff() {
  await api('POST', `/ai/release/${state.patient}?clinician=DrMeera`);
  toast('✔ Released with clinician sign-off');
  await sync();
}

async function sync() {
  state.log = await (await fetch('/audit')).json();
  const consentCount = Object.keys(parties).reduce((total, key) => {
    return total + Object.keys(parties[key].c).filter((cat) => parties[key].c[cat]).length;
  }, 0);
  countTo('#n1', 4);
  countTo('#n2', consentCount);
  countTo('#n3', state.log.length);
  drawWallet();
  drawRequests();
  drawAudit();
}

(function init() {
  renderFlow();
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  const points = [];

  function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  resizeCanvas();
  window.onresize = resizeCanvas;

  for (let i = 0; i < 60; i += 1) {
    points.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: Math.random() - 0.5, vy: Math.random() - 0.5 });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach((a, k) => {
      a.x = (a.x + a.vx + canvas.width) % canvas.width;
      a.y = (a.y + a.vy + canvas.height) % canvas.height;
      ctx.fillStyle = '#6B7B2F';
      ctx.fillRect(a.x, a.y, 2, 2);
      for (let j = k + 1; j < points.length; j += 1) {
        const b = points[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(212,175,55,${(1 - d / 130) * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }
  animate();

  sync();
})();












































